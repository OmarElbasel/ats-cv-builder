import { Mail, MapPin, Phone, Linkedin, Github, Globe } from 'lucide-react';

interface CVHeaderProps {
  name: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  linkedin: string;
  github: string;
}

export function CVHeader({ name, title, location, phone, email, website, linkedin, github }: CVHeaderProps) {
  return (
    <header className="mb-6 print:mb-1 pb-4 print:pb-0.5 border-b-2 border-gray-900">
      <h1 className="text-gray-900 mb-1 print:mb-0.5 text-center text-3xl">{name}</h1>
      <p className="text-gray-700 mb-3 print:mb-0.5 text-center">{title}</p>
      
      <div className="flex flex-wrap gap-x-4 gap-y-1 print:gap-y-0.5 text-gray-600 justify-center">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Phone className="w-3 h-3" />
          <span className="text-sm">{phone}</span>
        </div>
        <div className="flex items-center gap-1">
          <Mail className="w-3 h-3" />
          <a href={`mailto:${email}`} className="text-sm hover:underline">{email}</a>
        </div>
        <div className="flex items-center gap-1">
          <Globe className="w-3 h-3" />
          <a href={`https://${website}`} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">{website}</a>
        </div>
        <div className="flex items-center gap-1">
          <Linkedin className="w-3 h-3" />
          <a href={`https://${linkedin}`} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">{linkedin}</a>
        </div>
        <div className="flex items-center gap-1">
          <Github className="w-3 h-3" />
          <a href={`https://${github}`} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">{github}</a>
        </div>
      </div>
    </header>
  );
}
