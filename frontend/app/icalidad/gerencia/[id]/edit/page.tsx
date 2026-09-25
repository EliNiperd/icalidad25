import GerenciaForm from '@/app/ui/gerencias/create-edit-form';
import { getGerenciaById } from '@/lib/data/gerencias';
import { notFound } from 'next/navigation';

interface EditGerenciaPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGerenciaPage({ params }: EditGerenciaPageProps) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (isNaN(id)) {
    notFound();
  }

  const gerencia = await getGerenciaById(id);

  if (!gerencia) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 flex justify-center">Editar Gerencia</h1>
      <GerenciaForm gerencia={gerencia} />
    </div>
  );
}
