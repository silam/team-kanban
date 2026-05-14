import type { Priority } from '../../types';
import { PRIORITY_META } from '../../constants';

export function PriorityBadge({ priority }: { priority: Priority }) {
  const meta = PRIORITY_META[priority];
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${meta.classes}`}>
      {meta.label}
    </span>
  );
}
