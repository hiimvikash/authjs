import {v4 as uuidv4} from "uuid"
import crypto from "crypto"
import { getVerificationTokenByEmail } from "./db/data/verification-token";
import db from "@/lib/db"
import { getResetTokenByEmail } from "./db/data/reset-token";
import { getTwoFactorTokenByEmail } from "./db/data/twofactor-token";

export const generateVerificationToken = async (email : string) =>{
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600*1000);

    const existingToken = await getVerificationTokenByEmail(email);
    if(existingToken){
        await db.verificationToken.delete({
            where : {id : existingToken.id}
        })
    }

    
    const verificationToken = await db.verificationToken.create({
        data : {
            email, token, expires
        }
    })

    return verificationToken;
}

export const generateResetToken = async (email : string) =>{
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600*1000);

    const existingToken = await getResetTokenByEmail(email);
    if(existingToken){
        await db.passwordResetToken.delete({
            where : {id : existingToken.id}
        })
    }

    
    const resetToken = await db.passwordResetToken.create({
        data : {
            email, token, expires
        }
    })

    return resetToken;
}
export const generateTwoFactorToken = async (email : string) =>{
    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + 3600*1000);

    const existingToken = await getTwoFactorTokenByEmail(email);
    if(existingToken){
        await db.twoFactorToken.delete({
            where : {id : existingToken.id}
        })
    }

    
    const twoFToken = await db.twoFactorToken.create({
        data : {
            email, token, expires
        }
    })

    return twoFToken;
}