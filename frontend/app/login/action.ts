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
  const rememberMe = formData.get('rememberMe') === 'true';
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
      rememberMe: rememberMe ? 'true' : 'false',
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

function getBackendBaseUrl(): string {
  return (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5175/api'
  );
}

export async function requestPasswordReset(
  identifier: string,
  resetBaseUrl?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${getBackendBaseUrl()}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, resetBaseUrl }),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message: data?.Message || data?.message || 'No se pudo procesar la solicitud.',
      };
    }

    return {
      success: true,
      message:
        data?.Message ||
        data?.message ||
        'Si el usuario o correo existe y está activo, recibirás instrucciones para restablecer tu contraseña.',
    };
  } catch {
    return {
      success: false,
      message: 'Error de conexión con el servidor. Inténtalo nuevamente.',
    };
  }
}

export async function confirmPasswordReset(
  token: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${getBackendBaseUrl()}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.Success === false || data?.success === false) {
      return {
        success: false,
        message:
          data?.Message ||
          data?.message ||
          'El enlace de recuperación es inválido o ha expirado.',
      };
    }

    return {
      success: true,
      message:
        data?.Message ||
        data?.message ||
        'Tu contraseña ha sido actualizada correctamente.',
    };
  } catch {
    return {
      success: false,
      message: 'Error de conexión con el servidor. Inténtalo nuevamente.',
    };
  }
}