import { ReactNode } from "react";
import { ShieldCheck, GitBranch, ClipboardCheck } from "lucide-react";
import { BrandLogo } from "@/app/components/BrandLogo";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";
import { APP_NAME, APP_VERSION } from "@/lib/constants";

interface AuthSplitLayoutProps {
  children: ReactNode;
}

const PILLARS = [
  {
    icon: GitBranch,
    title: "Control de Procesos",
    description: "Estandarización y trazabilidad de flujos operacionales.",
  },
  {
    icon: ClipboardCheck,
    title: "Cumplimiento Normativo",
    description: "Gestión centralizada de normativas, requisitos y evidencias.",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad y Auditoría",
    description: "Control de acceso por roles y registro de auditoría.",
  },
];

export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <main className="min-h-screen w-full grid lg:grid-cols-12 bg-background">
      {/* Panel izquierdo: Identidad y propuesta de valor */}
      <section className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-12 xl:p-16 text-white overflow-hidden bg-gradient-to-br from-primary-950 via-secondary-800 to-primary-600">
        <div className="bg-brand-grid pointer-events-none absolute inset-0" aria-hidden="true" />

        <header className="relative z-10">
          <BrandLogo inverted showSubtitle />
        </header>

        <div className="relative z-10 my-auto space-y-8 py-8">
          <div className="space-y-3">
            <h1 className="text-3xl xl:text-4xl font-bold tracking-tight leading-tight text-white">
              Gestión de calidad con precisión y trazabilidad
            </h1>
            <p className="text-base text-white/85 leading-relaxed max-w-md">
              Centraliza procesos, normativas, requisitos y auditorías en una sola plataforma.
            </p>
          </div>

          <ul className="space-y-3 max-w-md">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <li
                  key={pillar.title}
                  className="flex items-start gap-3.5 rounded-xl bg-white/10 p-3.5 ring-1 ring-white/15 backdrop-blur-sm"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-white">{pillar.title}</p>
                    <p className="text-xs text-white/80 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative z-10 text-xs text-white/70">
          Plataforma corporativa de gestión de calidad
        </div>
      </section>

      {/* Panel derecho: Autenticación */}
      <section className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 bg-background">
        <div className="flex items-center justify-between lg:justify-end">
          <div className="lg:hidden">
            <BrandLogo />
          </div>
          <ThemeSwitcher />
        </div>

        <div className="my-auto flex w-full items-center justify-center py-8">
          <div className="w-full max-w-md">{children}</div>
        </div>

        <footer className="text-center text-xs text-text-tertiary tracking-wide">
          © {new Date().getFullYear()} {APP_NAME} ·{" "}
          <span className="font-mono font-medium">{APP_VERSION}</span>
        </footer>
      </section>
    </main>
  );
}
