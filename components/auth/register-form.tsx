"use client";

import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas";
import * as z from "zod" 

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";

import { CardWrapper } from "@/components/auth/card-wrapper"
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { useRef, useState, useTransition } from "react";
import { register } from "@/actions/register";

function RegisterForm() {
  const[isPending, startTransition] = useTransition();
  const[error, setError] = useState<string | undefined>();
  const[success, setSuccess] = useState<string | undefined>();


  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver : zodResolver(RegisterSchema),
    defaultValues : {
      email : "",
      password : ""
    }
  });

  const handleFormSubmit = (values:z.infer<typeof RegisterSchema>)=>{
    setError("");
    setSuccess("");


    startTransition(async ()=>{
      const data = await register(values);

      setError(data?.error);
      setSuccess(data?.success);
    });
  }


  return (
    <CardWrapper headerLabel="Create an account" backButtonLabel="Already have an account ?" backButtonHref="/auth/login" showSocial>

      <Form {...form}>

        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">

          <div className="space-y-4">
            <FormField 
              control={form.control}
              name="name"
              
              render={({field})=>(

                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" disabled={isPending}  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="email"
              
              render={({field})=>(

                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Johndoe@example.com" type="email" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
              control={form.control}
              name="password"

              render={({field})=>(

                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="X X X X X X" type="password" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormError message={error}/>
          <FormSuccess message={success}/>
          
          <Button type="submit" className="w-full" disabled={isPending}>
              Create an account 
          </Button>
        </form>

      </Form>
      
    </CardWrapper>
  )
}

export default RegisterForm