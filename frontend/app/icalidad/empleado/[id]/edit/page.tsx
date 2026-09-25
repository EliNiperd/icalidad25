import { getEmpleadoById } from "@/lib/data/empleados";
import { getPuestosList } from "@/lib/data/puestos";
import { getRolesList } from "@/lib/data/roles";
import CreateEditForm from "@/app/ui/empleados/create-edit";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { notFound } from "next/navigation";

interface EditEmpleadoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEmpleadoPage({ params }: EditEmpleadoPageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    notFound();
  }

  const [empleado, puestos, roles] = await Promise.all([
    getEmpleadoById(id),
    getPuestosList(),
    getRolesList(),
  ]);

  if (!empleado) {
    notFound();
  }

  return (
    <main>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/icalidad/empleado">Empleados</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <CreateEditForm empleado={empleado} puestos={puestos} roles={roles} />
    </main>
  );
}