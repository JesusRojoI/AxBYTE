import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="font-display font-extrabold text-[8rem] leading-none text-peach/40 mb-4">
          404
        </div>
        <h1 className="font-display font-extrabold text-3xl text-ink mb-4">
          Página no encontrada
        </h1>
        <p className="text-ink/60 mb-8">
          La página que buscas no existe o fue movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-white font-semibold rounded-xl hover:bg-peach-dark transition-colors"
        >
          <i className="bi bi-arrow-left" />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}