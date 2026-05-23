import { Link } from 'react-router-dom';

interface LogoProps {
  /** Use lighter text + a white logo chip for dark backgrounds (the footer). */
  variant?: 'light' | 'dark';
}

/** LASL wordmark: the league crest plus the league name lockup. */
export function Logo({ variant = 'light' }: LogoProps) {
  const dark = variant === 'dark';
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5"
      aria-label="Leamington Adult Soccer League — home"
    >
      <img
        src="/logo.jpg"
        alt=""
        width={44}
        height={44}
        className={`h-11 w-11 shrink-0 object-contain ${
          dark ? 'rounded-md bg-white p-1' : ''
        }`}
      />
      <span className="leading-tight">
        <span
          className={`block text-sm font-extrabold uppercase tracking-wide ${
            dark ? 'text-white' : 'text-slate-900'
          }`}
        >
          Leamington Adult
        </span>
        <span
          className={`block text-[11px] font-bold uppercase tracking-[0.18em] ${
            dark ? 'text-brand-light' : 'text-brand'
          }`}
        >
          Soccer League
        </span>
      </span>
    </Link>
  );
}
