import db from "@/lib/db";


export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twofToken = await db.twoFactorToken.findUnique({
      where: { token },
    });
    return twofToken;
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twofToken = await db.twoFactorToken.findFirst({
      where: { email },
    });
    return twofToken;
  } catch {
    return null;
  }
}