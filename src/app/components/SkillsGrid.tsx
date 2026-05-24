import type { RoleTag, SkillRow } from '../../profiles/types';

interface SkillsGridProps {
  skills: SkillRow[];
  emphasis?: RoleTag;
}

export function SkillsGrid({ skills, emphasis }: SkillsGridProps) {
  return (
    <div className="space-y-1 print:space-y-0">
      {skills.map((skill, index) => {
        const highlight = emphasis && skill.tags?.includes(emphasis);
        return (
          <div key={index} className="flex gap-2">
            <span
              className={
                'min-w-[130px] shrink-0 ' + (highlight ? 'text-gray-900' : 'text-gray-900')
              }
            >
              {skill.category}:
            </span>
            <span className={highlight ? 'text-gray-900' : 'text-gray-700'}>{skill.items}</span>
          </div>
        );
      })}
    </div>
  );
}
