import type { Member } from '../../types';

interface AssigneeAvatarProps {
  member: Member;
  size?: 'sm' | 'md';
}

export function AssigneeAvatar({ member, size = 'sm' }: AssigneeAvatarProps) {
  const sizeClass = size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm';
  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 ring-2 ring-white dark:ring-gray-800`}
      style={{ backgroundColor: member.color }}
      title={member.name}
    >
      {member.initials}
    </div>
  );
}
