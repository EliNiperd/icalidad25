'use server';

import { signIn } from '@/auth';
import { redirect } from 'next/navigation';
import { decryptPassword } from '@/lib/utils/security';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
): Promise<void> {
  const username = formData.get('username') as string;
  let password = formData.get('password') as string;
  const isEncrypted = formData.get('encrypted') === 'true';

  if (!username || !password) {
    throw new Error('Por favor ingresa tu usuario y contraseña.');
  }

  // Desencriptar la contraseña si viene encriptada
  if (isEncrypted) {
    try {
      password = decryptPassword(password);
    } catch (error) {
      console.error('❌ Error al desencriptar:', error);
      throw new Error('Error de seguridad al procesar la contraseña.');
    }
  }

  // Autenticar mediante NextAuth (llama al backend .NET una única vez en authorize)
  try {
    await signIn('credentials', {
      username,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          throw new Error('Usuario o contraseña incorrectos, o cuenta inactiva.');
        default:
          throw new Error('Error de autenticación con el servidor.');
      }
    }
    // En caso de redirect de Next.js u otro error
    throw error;
  }

  redirect('/icalidad/dashboard');
}