"use client"

import Header  from "@/components/auth/header";
import {Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import SocialIcon from "@/components/auth/social-icon";
import { BackButton } from "@/components/auth/back-button";

interface CWprops{
    children : React.ReactNode;
    headerLabel : string;
    backButtonLabel : string;
    backButtonHref : string;
    showSocial? : boolean;
}

export const CardWrapper = ({children, headerLabel, backButtonLabel, backButtonHref, showSocial} : CWprops)=>{
    return (
        <Card className="w-[50%] sm:w-[40%] shadow-md">
            <CardHeader>
                <Header label={headerLabel}/>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {
                showSocial && (
                    <CardFooter>
                        <SocialIcon/>
                    </CardFooter>
                )
            }
            <CardFooter>
                <BackButton label={backButtonLabel} href={backButtonHref} />
            </CardFooter>
        </Card>
    )
}