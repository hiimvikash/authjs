import db from "@/lib/db";


export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twofConfirmation = await db.twoFactorConfirmation.findUnique({
      where: { userId },
    });
    return twofConfirmation;
  } catch {
    return null;
  }
};