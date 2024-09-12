"use server";

import { getUserByEmail } from "@/lib/db/data/user";
import { getVerificationTokenByToken } from "@/lib/db/data/verification-token";
import db from "@/lib/db"

export const verifymail = async (token: string) => {
  if(token === "") return { error: "Token does not exist here!" };
  const existingToken = await getVerificationTokenByToken(token);


  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id}
  });
  return { success: "Email verified!" };

};
