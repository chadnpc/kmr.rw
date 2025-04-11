import { prisma } from '../lib/prisma';
import crypto from 'crypto';

export async function createAdminInvite(email) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const invite = await prisma.adminInvite.create({
    data: {
      email,
      token,
      expiresAt
    }
  });

  return {
    inviteLink: `${process.env.NEXTAUTH_URL}/register?token=${token}`,
    expiresAt: invite.expiresAt
  };
}

export async function validateAdminInvite(token, email) {
  return await prisma.adminInvite.findFirst({
    where: {
      token,
      email,
      expiresAt: { gt: new Date() }
    }
  });
}

export async function deleteAdminInvite(id) {
  return await prisma.adminInvite.delete({
    where: { id }
  });
}

export async function listAdminInvites() {
  return await prisma.adminInvite.findMany({
    orderBy: { createdAt: 'desc' }
  });
}
