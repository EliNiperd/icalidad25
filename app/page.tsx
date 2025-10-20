// @ts-ignore: `next/navigation` types may be unavailable in this environment
import { redirect } from 'next/navigation';
   
    export default function RootPage() {
      // La página raíz simplemente redirige a la página de login.
      redirect('/login');
    }