import { Input } from '@/components/ui/input';

export default function SearchableList({
  items,
  query,
  onQueryChange,
  onSelect,
  onCreate,
  excludeIds,
  selectedId,
  emptyMessage,
  createLabel,
  placeholder = 'Suchen...',
  maxHeight = 'max-h-60',
}) {
  const trimmed = query.trim();

  const filtered = items.filter((item) => {
    if (excludeIds?.has(item.id)) return false;
    return item.name.toLowerCase().includes(trimmed.toLowerCase());
  });

  const exactMatch = items.some((item) => item.name.toLowerCase() === trimmed.toLowerCase());
  const showCreate = onCreate && trimmed.length > 0 && !exactMatch;
  const isEmpty = filtered.length === 0 && !showCreate;

  const label = createLabel ?? 'Eintrag';

  return (
    <>
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        autoFocus
      />
      <div className={`${maxHeight} overflow-y-auto`}>
        {filtered.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted ${
              selectedId === item.id ? 'bg-muted font-medium' : ''
            }`}
          >
            {item.name}
          </button>
        ))}
        {showCreate && (
          <button
            onClick={() => onCreate(trimmed)}
            className="w-full rounded-md px-3 py-2 text-left text-sm text-primary hover:bg-muted"
          >
            + &ldquo;{trimmed}&rdquo; als neuen {label} erstellen
          </button>
        )}
        {isEmpty && emptyMessage && (
          <p className="px-3 py-2 text-sm text-muted-foreground">{emptyMessage}</p>
        )}
      </div>
    </>
  );
}
