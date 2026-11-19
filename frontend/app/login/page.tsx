import { Suspense } from "react";
import { AuthSplitLayout } from "@/app/components/ui/login/auth-split-layout";
import LoginForm from "@/app/components/ui/login/login-form";

export default function LoginPage() {
  return (
    <AuthSplitLayout>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthSplitLayout>
  );
}
