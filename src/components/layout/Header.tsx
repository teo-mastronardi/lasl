import { MobileMenu } from '@/components/navigation/MobileMenu';
import { NavBar } from '@/components/navigation/NavBar';
import { Logo } from './Logo';

/** Sticky site header: logo on the left, navigation on the right. */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <NavBar />
        <MobileMenu />
      </div>
    </header>
  );
}
