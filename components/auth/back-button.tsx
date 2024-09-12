"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export const BackButton = ({label, href} : {label :string, href : string}) => {
  return (
    <div className="inline-block mx-auto">
      <Button variant="link" size="sm" className="font-normal" asChild>
          <Link href={href}>{label}</Link>
      </Button>
    </div>
  )
}