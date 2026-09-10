'use server';

import { signIn } from '@/auth';
import { decryptPassword } from '@/lib/utils/security';
import { AuthError } from 'next-auth';

export interface AuthenticateResult {
  success: boolean;
  error?: string;
}

export async function authenticate(
  prevState: any,
  formData: FormData
): Promise<AuthenticateResult> {
  const username = formData.get('username') as string;
  let password = formData.get('password') as string;
  const isEncrypted = formData.get('encrypted') === 'true';

  if (!username || !password) {
    return {
      success: false,
      error: 'Por favor ingresa tu usuario y contraseña.',
    };
  }

  // Desencriptar la contraseña si viene encriptada
  if (isEncrypted) {
    try {
      password = decryptPassword(password);
    } catch (error) {
      console.error('❌ Error al desencriptar contraseña:', error);
      return {
        success: false,
        error: 'Error de seguridad al procesar la contraseña.',
      };
    }
  }

  // Autenticar mediante NextAuth
  try {
    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            success: false,
            error: 'Usuario o contraseña incorrectos, o cuenta inactiva.',
          };
        default:
          return {
            success: false,
            error: 'Error al comunicarse con el servicio de autenticación.',
          };
      }
    }

    console.error('❌ Error inesperado en login:', error);
    return {
      success: false,
      error: 'Error de conexión con el backend. Verifica que la API esté disponible.',
    };
  }
}