import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Member } from '../../types';
import { AssigneeAvatar } from '../tasks/AssigneeAvatar';

interface MemberManagerProps {
  members: Member[];
  onAdd: (name: string) => void;
  onRemove: (memberId: string) => void;
}

export function MemberManager({ members, onAdd, onRemove }: MemberManagerProps) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const name = input.trim();
    if (!name) return;
    onAdd(name);
    setInput('');
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Team members</p>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
          placeholder="Member name"
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm text-gray-700 dark:text-gray-200 transition-colors flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
      {members.length > 0 && (
        <div className="flex flex-col gap-1 mt-1">
          {members.map(m => (
            <div key={m.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 group">
              <AssigneeAvatar member={m} size="sm" />
              <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{m.name}</span>
              <button
                type="button"
                onClick={() => onRemove(m.id)}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-gray-400 hover:text-red-500 transition-all"
                aria-label={`Remove ${m.name}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
