import { getNormativaById } from "@/lib/data/normativas";
import CreateEditForm from "@/app/ui/normativas/create-edit";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { notFound } from "next/navigation";

interface EditNormativaPageProps {
  params: Promise<{ id: string }>;
}

export default async function NormativaEditPage({ params }: EditNormativaPageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    notFound();
  }

  // Obtener los datos de la normativa
  const normativa = await getNormativaById(id);

  if (!normativa) {
    notFound();
  }

  return (
    <main>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/icalidad/normativa">Normativas</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <CreateEditForm normativa={normativa} />
    </main>
  );
}