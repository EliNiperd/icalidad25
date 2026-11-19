'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
  Send,
} from 'lucide-react';
import { AuthSplitLayout } from '@/app/components/ui/login/auth-split-layout';
import { requestPasswordReset } from '@/app/login/action';
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
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

export default function RecuperarContrasenaPage() {
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { identifier: '' },
  });

  const onSubmit = (values: ForgotPasswordSchema) => {
    setFeedback(null);
    const resetBaseUrl = `${window.location.origin}/login/restablecer`;

    startTransition(async () => {
      const result = await requestPasswordReset(values.identifier, resetBaseUrl);
      setFeedback({
        type: result.success ? 'success' : 'error',
        message: result.message,
      });
    });
  };

  return (
    <AuthSplitLayout>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card variant="elevated" className="w-full">
          <CardHeader className="space-y-1.5 pb-6">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Recuperar contraseña
            </CardTitle>
            <CardDescription>
              Ingresa tu usuario o correo electrónico para recibir un enlace de restablecimiento.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Usuario o correo electrónico</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="nombre.usuario o correo@empresa.com"
                autoComplete="username"
                autoFocus
                aria-invalid={!!errors.identifier}
                startIcon={<Mail className="size-4" />}
                {...register('identifier')}
              />
              {errors.identifier && (
                <p className="text-xs font-medium text-destructive" role="alert">
                  {errors.identifier.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Enviando instrucciones...</span>
                </>
              ) : (
                <>
                  <span>Enviar enlace de recuperación</span>
                  <Send className="size-4" />
                </>
              )}
            </Button>

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
    </AuthSplitLayout>
  );
}
