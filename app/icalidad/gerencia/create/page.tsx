import GerenciaForm from '@/app/ui/gerencias/create-edit-form';

export default function CreateGerenciaPage() {
  return (
    <div className="container mx-auto py-10  ">
      <h1 className="text-3xl font-bold mb-6 flex justify-center">Crear Nueva Gerencia</h1>
      <div ><GerenciaForm /></div>
    </div>
  );
}
