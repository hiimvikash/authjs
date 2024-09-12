"use client"; 
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { logout } from "@/actions/logout";




const SettingsPage =  ()=>{
    

    const user = useCurrentUser();
    return (
        <div>
            <div className="m-3">
            {JSON.stringify(user)}

            </div>
            <br />
            <br />
                <Button type="submit" className="m-3" onClick={()=>{
                    logout();
                }}>Signout</Button>
           
            
        </div>
    )

}

export default SettingsPage;