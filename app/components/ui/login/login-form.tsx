'use client';

import { useState, useTransition } from 'react';
import { authenticate } from '@/app/login/action';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
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

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(undefined); // Clear previous errors

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        await authenticate(undefined, formData);
        // Si llega aquí, la autenticación fue exitosa (NextAuth maneja la redirección)
      } catch (error: any) {
        //console.log('⚠️Mensaje de error:', error.message);
        setErrorMessage(error.message);
        
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-[350px]">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Iniciar sesión en iCalidad</CardTitle>
          <CardDescription>
            Bienvenido de nuevo. Introduce tus credenciales.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="nombre.usuario"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <Button type="submit" className="w-full" aria-disabled={isPending}>
            {isPending ? 'Validando...' : 'Iniciar Sesión'}
            <ArrowRightIcon className="ml-auto h-5 w-5" />
          </Button>
          {errorMessage && (
            <p className="mt-4 text-sm text-destructive text-center">
              {errorMessage}
            </p>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}