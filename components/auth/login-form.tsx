"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/auth/form-error";
import { useState, useTransition } from "react";
import { login } from "@/actions/login";

import { useSearchParams } from "next/navigation";
import { FormSuccess } from "./form-success";
import Link from "next/link";

function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [showTwoFA, setShowTwoFA] = useState(false);
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider."
      : "";

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleFormSubmit = (values: z.infer<typeof LoginSchema>) => {
    console.log("I work")
    setError("");
    startTransition(async () => {
      const data = await login(values);

      if (data) {
        setError(data.error);
        setSuccess(data.success);
        if (data.twoFactor) setShowTwoFA(true);
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account ?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            {showTwoFA && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="0 0 0 0 0 0"
                        type="text"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) } 
            
            {!showTwoFA && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Johndoe@example.com"
                          type="email"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="X X X X X X"
                          type="password"
                          disabled={isPending}
                        />
                      </FormControl>
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                      >
                        <Link href="/auth/reset">Forgot password?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <FormError message={error || urlError} />
          <FormSuccess message={success} />

          <Button type="submit" className="w-full" disabled={isPending}>
            {showTwoFA ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}

export default LoginForm;
