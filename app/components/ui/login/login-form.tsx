'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/app/login/action';
import { encryptPassword } from '@/lib/utils/security';
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
import { useState } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Validando...' : 'Iniciar Sesión'}
      <ArrowRightIcon className="ml-auto h-5 w-5" />
    </Button>
  );
}

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useFormState(authenticate, undefined);

  const handleSubmit = async (formData: FormData) => {
    // Obtener la contraseña
    const password = formData.get('password') as string;
    
    // Encriptar la contraseña antes de enviar
    const encryptedPassword = encryptPassword(password);
    
    // Reemplazar la contraseña por la versión encriptada
    formData.set('password', encryptedPassword);
    formData.set('encrypted', 'true'); // Flag para saber que viene encriptada
    
    // Enviar el formData modificado
    return formAction(formData);
  };

  return (
    <form action={handleSubmit} className="w-[350px]">
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
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              autoComplete="current-password"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <SubmitButton />
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