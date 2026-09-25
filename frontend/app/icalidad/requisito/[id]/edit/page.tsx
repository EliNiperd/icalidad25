import { getRequisitoById } from "@/lib/data/requisitos";
import { getNormativasList } from "@/lib/data/normativas";
import CreateEditForm from "@/app/ui/requisitos/create-edit-form";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { notFound } from "next/navigation";

interface EditRequisitoProps {
  params: Promise<{ id: string }>;
}

export default async function EditRequisito({ params }: EditRequisitoProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    notFound();
  }

  const [requisito, normativas] = await Promise.all([
    getRequisitoById(id),
    getNormativasList(),
  ]);

  if (!requisito) {
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
              <BreadcrumbLink href="/icalidad/requisito">Requisitos</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <CreateEditForm requisito={requisito} normativas={normativas} />
      </main>
    </>
  );
}