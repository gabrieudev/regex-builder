"use client";

import SocialLogin from "@/components/social-login";
import LoginForm from "../components/login-form";
import Link from "next/link";
import { AuthLayout } from "../components/auth-layout";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Faça login na sua conta para continuar"
    >
      <div className="space-y-4">
        <SocialLogin method="signin" />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou continue com
            </span>
          </div>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link
            href="/auth/signup"
            className="text-primary hover:underline font-medium"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
