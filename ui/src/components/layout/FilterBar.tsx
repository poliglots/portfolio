interface FilterBarProps {
  children: React.ReactNode;
}

/**
 * Shared filter bar container.
 */
export default function FilterBar({ children }: FilterBarProps) {
  return <div id="filter-bar">{children}</div>;
}
