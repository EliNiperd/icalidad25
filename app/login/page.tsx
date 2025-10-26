import LoginForm from "@/app/components/ui/login/login-form";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen bg-bg-secondary">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      
      <div className="relative mx-auto flex max-w-md flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex flex-col rounded-lg bg-primary-500 p-3">
          <div className="w-32 md:w-36 flex items-center justify-center">
            {/* <img src="/next.svg" alt="Logo" className="h-full w-auto" /> */}
            <span className="text-white font-bold">Logo oficial</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-primary-600 bg-primary-500 p-3 border-b-2 border-secondary-500">Iniciar Sesión - background</h2>
        
        <LoginForm />
      </div>
    </main>
  );
}