'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  User,
} from 'lucide-react';
import { authenticate } from '@/app/login/action';
import { loginSchema, type LoginSchema } from '@/lib/schemas/login';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function getSafeCallbackUrl(rawUrl: string | null): string {
  if (!rawUrl || !rawUrl.startsWith('/') || rawUrl.startsWith('//')) {
    return '/icalidad/dashboard';
  }
  return rawUrl;
}

export default function LoginForm() {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  const rememberMe = watch('rememberMe');

  const onSubmit = (values: LoginSchema) => {
    setServerError(undefined);

    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('password', values.password);
    formData.append('rememberMe', values.rememberMe ? 'true' : 'false');

    startTransition(async () => {
      try {
        const result = await authenticate(undefined, formData);
        if (!result.success) {
          setServerError(result.error || 'Error al iniciar sesión.');
          return;
        }

        const destination = getSafeCallbackUrl(searchParams.get('callbackUrl'));
        router.push(destination);
        router.refresh();
      } catch (error: any) {
        setServerError(error?.message || 'Error inesperado al iniciar sesión.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card variant="elevated" className="w-full">
        <CardHeader className="space-y-1.5 pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Iniciar sesión
          </CardTitle>
          <CardDescription>
            Bienvenido de nuevo. Introduce tus credenciales.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              type="text"
              placeholder="nombre.usuario"
              autoComplete="username"
              autoFocus
              aria-invalid={!!errors.username}
              startIcon={<User className="size-4" />}
              {...register('username')}
            />
            {errors.username && (
              <p className="text-xs font-medium text-destructive" role="alert">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
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
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs font-medium text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) =>
                  setValue('rememberMe', checked === true)
                }
              />
              <Label
                htmlFor="rememberMe"
                className="text-xs font-medium text-text-secondary cursor-pointer"
              >
                Recordarme en este equipo
              </Label>
            </div>

            <Link
              href="/login/recuperar"
              className="text-xs font-semibold hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
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
                <span>Validando credenciales...</span>
              </>
            ) : (
              <>
                <span>Iniciar sesión</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>

          {serverError && (
            <div
              role="alert"
              aria-live="polite"
              className="flex w-full items-start gap-2.5 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}
