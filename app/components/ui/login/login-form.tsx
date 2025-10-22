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
    setErrorMessage(undefined);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        await authenticate(undefined, formData);
      } catch (error: any) {
        setErrorMessage(error.message);
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-[350px]">
        <Card className="bg-bg-secondary border border-border-default">
          <CardHeader className="text-center">
            <CardTitle className="text-text-primary">
              Iniciar sesión en iCalidad
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Bienvenido de nuevo. Introduce tus credenciales.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-text-secondary">
                Usuario
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="nombre.usuario"
                required
                className="bg-bg-primary border border-border-default text-text-primary placeholder:text-text-secondary/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-text-secondary">
                Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-bg-primary border border-border-default text-text-primary placeholder:text-text-secondary/50"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col items-center">
            <Button 
              type="submit" 
              className="w-full bg-primary-600 hover:bg-primary-700 text-white" 
              aria-disabled={isPending}
            >
              {isPending ? 'Validando...' : 'Iniciar Sesión'}
              <ArrowRightIcon className="ml-auto h-5 w-5" />
            </Button>
            
            {errorMessage && (
              <p className="mt-4 text-sm bg-error/10 border border-error text-error p-2 rounded-md">
                {errorMessage}
              </p>
            )}
          </CardFooter>
        </Card>
      </form>
    </>
  );
}