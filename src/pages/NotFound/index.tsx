import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle({
    title: 'Page Not Found',
    description: 'The page you were looking for could not be found.',
  });

  return (
    <PageContainer className="flex flex-col items-center py-24 text-center">
      <p className="text-6xl font-extrabold text-brand">404</p>
      <h1 className="mt-4 text-2xl font-extrabold text-white">Page not found</h1>
      <p className="mt-2 max-w-md text-neutral-400">
        Sorry, we could not find the page you were looking for. It may have
        moved or no longer exists.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-brand px-6 py-3 font-bold text-white transition-colors hover:bg-brand-dark"
      >
        Back to home
      </Link>
    </PageContainer>
  );
}
