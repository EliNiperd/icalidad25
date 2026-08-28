'use server';

import { signIn } from '@/auth';
import { redirect } from 'next/navigation';
import { decryptPassword } from '@/lib/utils/security';
import { usegetPool, typeParameter } from "@/lib/database/connection";

interface SPAuthResult {
  StatusCode: number;
  Message: string;
  IdEmpleado?: number;
  UserName?: string;
  Correo?: string;
  NombreEmpleado?: string;
  ImageEmpleado?: string | null;
  NombreRol?: string;
  IdRol?: number;
}

async function validateCredentials(username: string, password: string): Promise<SPAuthResult | null> {
  try {
    const pool = await usegetPool("Default");
    const request = await pool.request();
    const typeParam = await typeParameter();

    request.input("p_UserName", typeParam.NVarChar(20), username);
    request.input("p_Password", typeParam.NVarChar(20), password); 

    const result = await request.execute("usp_AuthenticateUser");

    if (result.recordset && result.recordset.length > 0) {
      return result.recordset[0] as SPAuthResult;
    }
    return { StatusCode: 99, Message: "Error: El SP no devolvió resultados." };
  } catch (error) {
    console.error("Failed to validate credentials:", error);
    return { StatusCode: 99, Message: "Error interno del servidor al autenticar." };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
): Promise<void> { // Se cambia el retorno a void, ya que solo lanzará errores o redirigirá
  //console.log('🔵 Action authenticate iniciada');
  
  const username = formData.get('username') as string;
  let password = formData.get('password') as string;
  const isEncrypted = formData.get('encrypted') === 'true';
  
  // Desencriptar la contraseña si viene encriptada
  if (isEncrypted) {
    try {
      password = decryptPassword(password);
      //console.log('🔓 Contraseña desencriptada');
    } catch (error) {
      console.error('❌ Error al desencriptar:', error);
      throw new Error('Error de seguridad al procesar la contraseña');
    }
  }
  
  //console.log('🔵 Username:', username);
  
  // Primero validar con tu SP para obtener mensajes personalizados
  const authResult = await validateCredentials(username, password);
  //console.log('📊 Resultado de DB:', authResult);
  
  if (!authResult || authResult.StatusCode !== 0) {
    const errorMessage = authResult?.Message || 'Error de autenticación';
    console.error('❌ Error:', errorMessage);
    throw new Error(errorMessage); // LANZAR el error
  }
  
  // Si la validación fue exitosa, crear la sesión con NextAuth
  console.log('✅ Credenciales válidas, creando sesión...');
  try {
    await signIn('credentials', {
      username,
      password,
      redirect: false,
    });
  } catch (error) {
    // Capturar errores de signIn, aunque la validación previa debería prevenirlos
    console.error('❌ Error al crear sesión con signIn:', error);
    throw new Error('Error interno al iniciar sesión.');
  }
  
  console.log('✅ Sesión creada, redirigiendo...');
  redirect('/icalidad/dashboard');
}