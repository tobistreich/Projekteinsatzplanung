import { Badge } from '@/components/ui/badge';

export default function AppBadge({ label, variant, colorClass, onRemove, onClick }) {
  return (
    <Badge
      variant={variant}
      className={`${colorClass ?? ''} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {label}
      {onRemove && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="w-0 overflow-hidden group-hover/badge:w-4 transition-[width] duration-200 flex items-center justify-center cursor-pointer shrink-0"
        >
          <svg
            viewBox="0 0 10 10"
            className="size-3 stroke-black stroke-[1.5] fill-none"
            aria-hidden
          >
            <line x1="1" y1="1" x2="9" y2="9" />
            <line x1="9" y1="1" x2="1" y2="9" />
          </svg>
        </span>
      )}
    </Badge>
  );
}
