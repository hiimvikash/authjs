"use client";
import { useRouter } from "next/navigation";
interface LBprops{
    children : React.ReactNode,
    mode?: "modal" | "redirect",
    asChild?: boolean
}

function LoginButton({children, mode="redirect", asChild} : LBprops) {
    const router = useRouter();

   const onClick = ()=>{
        router.push("/auth/login")
        console.log("Login Button CLicked")
    }


    if(mode === "modal"){
        return (
            <h1>TODO : Modal View</h1>
        )
    }
    
  return (
    <span onClick={onClick}>
        {children}
    </span>
  )
}

export default LoginButton