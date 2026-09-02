'use server';

import { signIn, loginWithBackendAPI } from '@/auth';
import { redirect } from 'next/navigation';
import { decryptPassword } from '@/lib/utils/security';

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
      throw new Error('Error de seguridad al procesar la contraseña');
    }
  }

  // Validar credenciales con el backend .NET
  const authResult = await loginWithBackendAPI(username, password);

  if (!authResult.success) {
    const errorMessage = authResult.message || 'Error de autenticación';
    console.error('❌ Error:', errorMessage);
    throw new Error(errorMessage);
  }

  // Crear la sesión en NextAuth con el token JWT
  try {
    await signIn('credentials', {
      username,
      password,
      redirect: false,
    });
  } catch (error) {
    console.error('❌ Error al crear sesión con signIn:', error);
    throw new Error('Error interno al iniciar sesión.');
  }

  redirect('/icalidad/dashboard');
}