import { getDepartamentoById } from "@/lib/data/departamentos";
import { getGerenciasList } from "@/lib/data/gerencias";
import CreateEditForm from "@/app/ui/departamentos/create-edit-form";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { notFound } from "next/navigation";

interface EditDepartamentoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDepartamentoPage({ params }: EditDepartamentoPageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    notFound();
  }

  // Obtener los datos del departamento y la lista de gerencias en paralelo
  const [departamento, gerencias] = await Promise.all([
    getDepartamentoById(id),
    getGerenciasList(),
  ]);

  if (!departamento) {
    notFound();
  }

  return (
    <main>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/icalidad/departamento">Departamentos</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <CreateEditForm departamento={departamento} gerencias={gerencias} />
    </main>
  );
}