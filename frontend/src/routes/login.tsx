import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/api/auth.api";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Nexa" },
      {
        name: "description",
        content: "Log in to Nexa to see your feed, friends and profile.",
      },
      { property: "og:title", content: "Log in — Nexa" },
      {
        property: "og:description",
        content: "Log in to Nexa to see your feed and friends.",
      },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  identifier: z.string().trim().min(1, "Email or username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      const result = await login(values);

      signIn(result.user, result.token);

      navigate({ to: "/" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        setLoginError(message ?? "Login failed");
      } else {
        setLoginError("Login failed");
      }
    }
  });

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue to your feed."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Register
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="identifier">Email or username</Label>

          <Input
            id="identifier"
            type="text"
            className="rounded-xl"
            {...form.register("identifier")}
          />

          {form.formState.errors.identifier ? (
            <p className="text-xs text-destructive">{form.formState.errors.identifier.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>

          <Input
            id="password"
            type="password"
            className="rounded-xl"
            {...form.register("password")}
          />

          {form.formState.errors.password ? (
            <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
          ) : null}
        </div>

        {loginError && <p className="text-sm text-destructive">{loginError}</p>}

        <Button
          type="submit"
          className="w-full rounded-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Logging in…" : "Log in"}
        </Button>
      </form>
    </AuthLayout>
  );
}
