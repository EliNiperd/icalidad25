'use client';

import { Suspense, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from 'lucide-react';
import { AuthSplitLayout } from '@/app/components/ui/login/auth-split-layout';
import { confirmPasswordReset } from '@/app/login/action';
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from '@/lib/schemas/login';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';

  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: ResetPasswordSchema) => {
    setFeedback(null);

    startTransition(async () => {
      const result = await confirmPasswordReset(values.token, values.newPassword);
      setFeedback({
        type: result.success ? 'success' : 'error',
        message: result.message,
      });

      if (result.success) {
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card variant="elevated" className="w-full">
        <CardHeader className="space-y-1.5 pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Restablecer contraseña
          </CardTitle>
          <CardDescription>
            Define una nueva contraseña segura para tu cuenta.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <input type="hidden" {...register('token')} />

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva contraseña</Label>
            <Input
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              autoFocus
              aria-invalid={!!errors.newPassword}
              startIcon={<Lock className="size-4" />}
              endAdornment={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                  className="text-text-tertiary hover:text-text-primary"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              }
              {...register('newPassword')}
            />
            {errors.newPassword && (
              <p className="text-xs font-medium text-destructive" role="alert">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Repite tu nueva contraseña"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              startIcon={<Lock className="size-4" />}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-xs font-medium text-destructive" role="alert">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-2">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isPending || !token}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Actualizando...</span>
              </>
            ) : (
              <span>Guardar nueva contraseña</span>
            )}
          </Button>

          {!token && (
            <div
              role="alert"
              className="flex w-full items-start gap-2.5 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>Falta el token de recuperación en la URL.</span>
            </div>
          )}

          {feedback && (
            <div
              role="alert"
              aria-live="polite"
              className={
                feedback.type === 'success'
                  ? 'flex w-full items-start gap-2.5 rounded-lg border border-success/40 bg-success/10 p-3 text-sm text-success'
                  : 'flex w-full items-start gap-2.5 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive'
              }
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
          >
            <ArrowLeft className="size-3.5" />
            Volver al inicio de sesión
          </Link>
        </CardFooter>
      </Card>
    </form>
  );
}

export default function RestablecerContrasenaPage() {
  return (
    <AuthSplitLayout>
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthSplitLayout>
  );
}
