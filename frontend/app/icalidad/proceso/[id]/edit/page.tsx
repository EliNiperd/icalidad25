import { getProcesoById } from "@/lib/data/procesos";
import { getEmpleadosList } from "@/lib/data/empleados";
import CreateEditForm from "@/app/ui/procesos/create-edit-form";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { notFound } from "next/navigation";

interface EditProcesoProps {
  params: Promise<{ id: string }>;
}

export default async function EditProceso({ params }: EditProcesoProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    notFound();
  }

  const [proceso, empleados] = await Promise.all([
    getProcesoById(id),
    getEmpleadosList(),
  ]);

  if (!proceso) {
    notFound();
  }

  return (
    <>
      <main>
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/icalidad/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/icalidad/proceso">Procesos</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <CreateEditForm proceso={proceso} empleados={empleados} />
      </main>
    </>
  );
}