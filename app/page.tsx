import {Button} from "@/components/ui/button";

import LoginButton from "@/components/auth/login-button";

export default function Home() {
  return (
    <main className="flex h-full bg-slate-100 flex-col items-center justify-center ">
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-semibold text-gray-700 drop-shadow-md">🔐Auth</h1>
        <p>A simple authentication service. </p>
        <div>
          <LoginButton>
            <Button size="lg">Sign in</Button>
          </LoginButton>
        </div>
      </div>
      

    </main>

  );
}
