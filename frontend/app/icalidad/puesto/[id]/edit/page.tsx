import { getPuestoById } from "@/lib/data/puestos";
import { getDepartamentosList } from "@/lib/data/departamentos";
import CreateEditForm from "@/app/ui/puestos/create-edit-form";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { notFound } from "next/navigation";

interface EditPuestoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPuestoPage({ params }: EditPuestoPageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    notFound();
  }

  const [puesto, departamentos] = await Promise.all([
    getPuestoById(id),
    getDepartamentosList(),
  ]);

  if (!puesto) {
    notFound();
  }

  return (
    <main>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/icalidad/puesto">Puestos</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <CreateEditForm puesto={puesto} departamentos={departamentos} />
    </main>
  );
}