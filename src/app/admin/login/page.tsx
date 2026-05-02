"use client";

import { useTransition } from "react";
import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();

  const handleAction = async (formData: FormData) => {
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Login successful");
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md rounded-3xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-black">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleAction} className="flex flex-col gap-6">
            <FieldGroup className="gap-6">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@ranins.com"
                  required
                  className="rounded-2xl"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="rounded-2xl"
                />
              </Field>
            </FieldGroup>
            <Button
              type="submit"
              className="w-full rounded-full py-6 text-sm font-black uppercase tracking-wider transition-all hover:scale-[1.02]"
              disabled={isPending}
              size="lg"
            >
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">Ranins Admin Dashboard</p>
        </CardFooter>
      </Card>
    </div>
  );
}

