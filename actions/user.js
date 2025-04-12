"use server";

import { db } from "@/lib/prisma";
const ADMIN_EMAILS = ["owner@kmr.com", "developer@kmr.com"];

export async function completeOnboarding(formData) {
  const { name, email, phone } = formData;

  try {
    if (!email) { 
      throw new Error("Email is required");
    }

    // Check if the user exists by email
    let user = await db.user.findUnique({ where: { email } });

    // If user exists, update their name and phone
    if (user) {
      await db.user.update({
        where: { email },
        data: {
          name,
          phone
        },
      });

      return {
        success: true,
        message: "User updated",
      };
    }
    
    // If the user does not exist, create a new one
    const isAdminEmail = ADMIN_EMAILS.includes(email);
    await db.user.create({
        data: {
        email,
        name,
        phone,
        role: isAdminEmail ? "ADMIN" : "USER",
        },
    });
    return {
        success: true,
        message: "User created",
    };
  } catch (error) {
    console.error("Error in completeOnboarding:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    }
  }
}