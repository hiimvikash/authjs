"use server";

import * as z from "zod";
import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/lib/db/data/user";
import { generateResetToken } from "@/lib/generatetoken";
import { sendResetMail } from "@/lib/sendmail";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid email !" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { error: "Email not found !" };
  }

  const resetToken = await generateResetToken(email);
  await sendResetMail(resetToken.email, resetToken.token);

  return {success : "Reset email sent."}
};
