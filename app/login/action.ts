  'use server';
    
    import { signIn } from '@/auth';
    import { redirect } from 'next/navigation'; // Importar redirect de next/navigation

    export async function authenticate(
      prevState: string | undefined,
      formData: FormData,
    ): Promise<string | undefined> {
      try {
        await signIn('credentials', formData);
        return prevState;
      } catch (error: unknown) {

        // CORRECTED LOGIC HERE: Check for Next.js redirect error using its 'digest' property
        if (error && typeof error === 'object' && 'digest' in error && typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
          throw error; // Re-throw the original error to let Next.js handle the redirect
        }

        let errorMessage: string = 'Ha ocurrido un error inesperado. Por favor, inténtalo más tarde.';

        if (error instanceof Error) {
         
          // Si el error tiene una causa anidada con nuestro mensaje específico del SP
          if (error.cause && typeof error.cause === 'object' && 'err' in error.cause && error.cause.err instanceof Error) {
            errorMessage = error.cause.err.message;
          } else if (error.message.includes("CallbackRouteError")) {
            errorMessage = `Credenciales inválidas. Por favor, inténtalo de nuevo.`;
          }
        } else if (typeof error === 'object' && error !== null && 'type' in error) {
          const err = error as { type?: unknown };
          if (err.type === 'CredentialsSignin') {
            errorMessage = `Credenciales inválidas. Por favor, inténtalo de nuevo.`;
          }
        }

        throw new Error(errorMessage);
      } finally {
        redirect('/dashboard');
      }

    }