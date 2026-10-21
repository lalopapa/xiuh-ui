const SIZES = {
  // Clases completas: Tailwind no detecta clases armadas con plantillas (`loading-${size}`)
  xs: 'loading-xs',
  sm: 'loading-sm',
  md: 'loading-md',
  lg: 'loading-lg',
  xl: 'loading-xl',
} as const;

type Props = {
  message?: string;
  size?: keyof typeof SIZES;
  className?: string;
};

export default function Spinner({ message, size = 'lg', className = '' }: Props) {
  return (
    <div role="status" className={`flex items-center gap-x-2 ${className}`}>
      <span className={`loading loading-spinner ${SIZES[size]}`} />
      {!!message && <span>{message}</span>}
    </div>
  );
}
