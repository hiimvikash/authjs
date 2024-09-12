"use client"

import { useSearchParams } from "next/navigation"
import { CardWrapper } from "./card-wrapper"


import {BeatLoader} from "react-spinners"
import { useCallback, useEffect, useState } from "react"
import {  verifymail } from "@/actions/new-verification"
import { FormError } from "./form-error"
import { FormSuccess } from "./form-success"

export const NewVerificationForm = ()=>{
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    
    const onSubmit = useCallback(async ()=>{
        const data = await verifymail(token || "");
        console.log(data);
        
        setError(data?.error);
        setSuccess(data?.success);
        
    }, [])
    useEffect(()=>{
        onSubmit();
    }, [onSubmit])
    


    return (
        <CardWrapper 
            headerLabel="Confirming your verification."
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <div className="w-full flex items-center justify-center">
                { !error && !success && (
                    <BeatLoader/>
                )}

                <FormError message={error}/>
                <FormSuccess message={success}/>
                
            </div>

        </CardWrapper>
    )
}

