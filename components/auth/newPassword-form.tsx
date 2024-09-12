"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/schemas";
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



import { FormSuccess } from "./form-success";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/new-password";


function NewPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");


  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: ""
    },
  });

  const handleFormSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      const data = await newPassword(values, token);

      if (data) {
        setError(data.error);
        setSuccess(data.success);
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Enter your new password"
      backButtonLabel="Back to login."
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
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
                  <FormMessage />
                </FormItem>
              )}
            />

            
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button type="submit" className="w-full" disabled={isPending}>
            Reset passowrd
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}

export default NewPasswordForm;
