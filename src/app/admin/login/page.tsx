"use client";

import { useState } from "react";
import { createClient } from "@/lib/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await createClient().auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Login successful");
      router.push("/admin");
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error(error);
      toast.error(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md rounded-3xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-black">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <FieldGroup className="gap-6">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@ranins.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-2xl"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-2xl"
                />
              </Field>
            </FieldGroup>
            <Button
              type="submit"
              className="w-full rounded-full py-6 text-sm font-black uppercase tracking-wider transition-all hover:scale-[1.02]"
              disabled={loading}
              size="lg"
            >
              {loading ? "Logging in..." : "Login"}
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
