import Link from 'next/link';
import { APP_NAME } from '@/config/app';

type Props = {
  logoSrc?: string;
  name?: string;
  className?: string;
};

/** Logo y nombre de la app, con link al inicio */
export default function Brand({ logoSrc = '/icons/logo.svg', name = APP_NAME, className = '' }: Props) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-lg font-bold ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG local, no necesita optimización */}
      <img src={logoSrc} alt="" className="size-7" />
      <span className="truncate">{name}</span>
    </Link>
  );
}
