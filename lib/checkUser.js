import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";
import { ADMIN_EMAILS, AUTO_CREATE_FIRST_ADMIN } from "./admin.config";
import { validateAdminInvite, deleteAdminInvite } from "@/actions/admin";

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
    const email = user.emailAddresses[0].emailAddress;

    if (inviteToken) {
      const invite = await validateAdminInvite(inviteToken, email);
      if (invite) {
        role = "ADMIN";
        await deleteAdminInvite(invite.id);
      }
    }

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
  } catch (error) {
    console.log(error.message);
  }
};
