   'use server';
    
    import { signIn } from '@/auth';
    import { redirect } from 'next/navigation'; // Importar redirect de next/navigation

    export async function authenticate(
      prevState: string | undefined,
      formData: FormData,
    ): Promise<string | undefined> {
      try {
        await signIn('credentials', formData);
        redirect('/dashboard'); // Esto lanzará un error interno que Next.js maneja
      } catch (error: unknown) {
        // Check for the internal Next.js redirect error using its 'digest' property
        if (error && typeof error === 'object' && 'digest' in error && typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
          throw error; // Re-throw the original error to let Next.js handle the redirect
        }

        let errorMessage: string = 'Ha ocurrido un error inesperado. Por favor, inténtalo más tarde.';

        if (error instanceof Error) {
          // Si el error tiene una causa anidada con nuestro mensaje específico del SP
          if (
            'cause' in error &&
            error.cause &&
            typeof error.cause === 'object' &&
            error.cause !== null &&
            'err' in (error.cause as Record<string, unknown>) &&
            (error.cause as any).err instanceof Error
          ) {
            errorMessage = (error.cause as any).err.message;
          } else if (error.message.includes("CallbackRouteError")) {
            errorMessage = `Credenciales inválidas. Por favor, inténtalo de nuevo.`;
          } else {
            errorMessage = error.message;
          }
        } else if (typeof error === 'object' && error !== null && 'type' in error) {
          const err = error as { type?: unknown };
          if (err.type === 'CredentialsSignin') {
            errorMessage = `Credenciales inválidas. Por favor, inténtalo de nuevo.`;
          } 
        }

        throw new Error(errorMessage);
      }
    }