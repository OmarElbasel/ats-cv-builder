import type { Achievement, RoleTag } from '../../profiles/types';

interface ExperienceItemProps {
  title: string;
  company: string;
  location: string;
  date: string;
  achievements: (string | Achievement)[];
  emphasis?: RoleTag;
}

export function ExperienceItem({ title, company, location, date, achievements, emphasis }: ExperienceItemProps) {
  return (
    <div className="mb-4 print:mb-1 last:mb-0">
      <div className="flex justify-between items-start mb-1 print:mb-0">
        <div>
          <p className="text-gray-900">{title}</p>
          <p className="text-gray-700">{company} • {location}</p>
        </div>
        <p className="text-gray-600 text-sm whitespace-nowrap ml-4">{date}</p>
      </div>
      <ul className="list-disc list-outside ml-5 space-y-1 print:space-y-0">
        {achievements.map((achievement, index) => {
          const text = typeof achievement === 'string' ? achievement : achievement.text;
          const tags = typeof achievement === 'string' ? undefined : achievement.tags;
          const highlight = emphasis && tags?.includes(emphasis);
          return (
            <li
              key={index}
              className={
                'text-sm leading-relaxed print:leading-snug ' +
                (highlight ? 'text-gray-900' : 'text-gray-700')
              }
            >
              {text}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
