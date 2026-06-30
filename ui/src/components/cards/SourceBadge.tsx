import { sourceBadgeClass } from "../../utils/sources";

interface SourceBadgeProps {
  source: string;
}

/**
 * Reusable source badge component.
 */
export default function SourceBadge({ source }: SourceBadgeProps) {
  return <span className={`source-badge ${sourceBadgeClass(source)}`}>{source}</span>;
}
