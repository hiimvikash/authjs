"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetSchema } from "@/schemas";
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
import { reset } from "@/actions/reset";


function ResetForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();


  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: ""
    },
  });

  const handleFormSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      const data = await reset(values);

      if (data) {
        setError(data.error);
        setSuccess(data.success);
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Forgot your passowrd ?"
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

            
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button type="submit" className="w-full" disabled={isPending}>
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}

export default ResetForm;
