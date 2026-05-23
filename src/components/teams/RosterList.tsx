import type { RosterPlayer } from '@/types/league';

interface RosterListProps {
  players: RosterPlayer[];
}

function Tag({ children, tone }: { children: string; tone: 'brand' | 'muted' }) {
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
        tone === 'brand'
          ? 'bg-brand/15 text-brand-light'
          : 'bg-white/10 text-neutral-400'
      }`}
    >
      {children}
    </span>
  );
}

/** Team roster — captain and keeper are tagged. Shows a placeholder when empty. */
export function RosterList({ players }: RosterListProps) {
  if (players.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-line bg-surface p-4 text-sm text-neutral-500">
        Roster details coming soon.
      </p>
    );
  }

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {players.map((player, index) => (
        <li
          key={`${player.player}-${index}`}
          className="flex items-center justify-between gap-2 rounded-lg border border-line bg-surface px-3 py-2.5"
        >
          <span className="min-w-0 truncate font-medium text-neutral-100">
            {player.player}
          </span>
          <span className="flex shrink-0 gap-1.5">
            {player.isCaptain && <Tag tone="brand">Captain</Tag>}
            {player.isKeeper && <Tag tone="muted">Keeper</Tag>}
          </span>
        </li>
      ))}
    </ul>
  );
}
