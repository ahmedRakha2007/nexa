import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register as registerUser } from "@/lib/api/auth.api";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account — Nexa" },
      {
        name: "description",
        content: "Join Nexa: share posts, add friends and build your profile.",
      },
      { property: "og:title", content: "Create your account — Nexa" },
      { property: "og:description", content: "Join Nexa and start sharing with your friends." },
    ],
  }),
  component: RegisterPage,
});

const schema = z
  .object({
    display_name: z.string().min(2, "At least 2 characters"),
    username: z
      .string()
      .min(3, "At least 3 characters")
      .regex(/^[a-z0-9_.]+$/, "Lowercase letters, numbers, underscores and dots only"),
    email: z.string().email("Enter a valid email"),
    birth_date: z.string().min(1, "Birth date is required"),
    password: z.string().min(6, "At least 6 characters"),
    confirm_password: z.string(),
  })
  .refine((v) => v.password === v.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type FormValues = z.infer<typeof schema>;

const fields: { name: keyof FormValues; label: string; type?: string }[] = [
  { name: "display_name", label: "Display name" },
  { name: "username", label: "Username" },
  { name: "email", label: "Email", type: "email" },
  { name: "birth_date", label: "Birth date", type: "date" },
  { name: "password", label: "Password", type: "password" },
  { name: "confirm_password", label: "Confirm password", type: "password" },
];

function RegisterPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      display_name: "",
      username: "",
      email: "",
      birth_date: "",
      password: "",
      confirm_password: "",
    },
  });

  const submit = form.handleSubmit(async (values) => {
    const { confirm_password, ...registerData } = values;

    const result = await registerUser(registerData);

    signIn(result.user, result.token);
    navigate({ to: "/" });
  });

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It takes less than a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              type={field.type ?? "text"}
              className="rounded-xl"
              {...form.register(field.name)}
            />
            {form.formState.errors[field.name] ? (
              <p className="text-xs text-destructive">
                {form.formState.errors[field.name]?.message}
              </p>
            ) : null}
          </div>
        ))}

        <Button
          type="submit"
          className="w-full rounded-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Creating account…" : "Register"}
        </Button>
      </form>
    </AuthLayout>
  );
}
