import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";
import { validateAdminInvite, deleteAdminInvite } from "@/actions/admin";

// Hardcoded admin emails of: developers, managers and owners.
const ADMIN_EMAILS = [
  'owner@kmr.com',
  'developer@kmr.com'
];

export const checkUser = async (inviteToken) => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;

    let role = "USER";
    const email = user.emailAddresses[0].emailAddress.toLowerCase();
    // First admin will be created automatically if no admins exist
    const adminCount = await db.user.count({
      where: {
        role: "ADMIN"
      }
    })
    if (adminCount === 0 || ADMIN_EMAILS.includes(email)) {
      role = "ADMIN";
    }

    if (role !== "ADMIN" && inviteToken) {
      const invite = await validateAdminInvite(inviteToken, email);
      if (invite) {
        role = "ADMIN";
        await deleteAdminInvite(invite.id);
      }
    } 

    // Check if user exists by email before creating
    let existingUserByEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      // If user exists by email, update their Clerk ID and return
      // Optionally update other fields like name, imageUrl if needed
      existingUserByEmail = await db.user.update({
        where: { email },
        data: {
          clerkUserId: user.id,
          name: name || existingUserByEmail.name, // Keep existing name if new one is null/empty
          imageUrl: user.imageUrl || existingUserByEmail.imageUrl, // Keep existing image if new one is null/empty
          // Role might need specific logic depending on your requirements
          // For now, let's keep the existing role unless explicitly determined otherwise
          // role: role,
        },
      });
      return existingUserByEmail;
    } else {
      // If user doesn't exist by email either, create a new user
      const newUser = await db.user.create({
        data: {
          clerkUserId: user.id,
          name,
          imageUrl: user.imageUrl,
          email,
          role,
        },
      });
      return newUser;
    }
  } catch (error) {
    console.log(error.message);
  }
};
