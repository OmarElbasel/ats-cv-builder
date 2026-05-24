import type { RoleTag } from '../../profiles/types';

interface ProjectItemProps {
  name: string;
  url: string;
  description: string;
  technologies: string;
  tags?: RoleTag[];
  emphasis?: RoleTag;
}

export function ProjectItem({ name, url, description, technologies, tags, emphasis }: ProjectItemProps) {
  const highlight = Boolean(emphasis && tags?.includes(emphasis));
  return (
    <div className="mb-3 print:mb-1 last:mb-0">
      <div className="flex items-baseline gap-2 mb-1 print:mb-0">
        <p className="text-gray-900">{name}</p>
        {url && <>
          <span className="text-gray-500">•</span>
          <a href={`https://${url}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 text-sm hover:underline">
            {url}
          </a>
        </>}
      </div>
      <p className={(highlight ? 'text-gray-900' : 'text-gray-700') + ' text-sm leading-relaxed print:leading-snug mb-1 print:mb-0'}>{description}</p>
      <p className="text-gray-600 text-sm">
        <span className="text-gray-700">Technologies:</span> {technologies}
      </p>
    </div>
  );
}
