'use client';

const technologies = [
  { name: 'React', icon: 'javascript', color: '#61DAFB' },
  { name: 'TypeScript', icon: 'code', color: '#3178C6' },
  { name: 'Node.js', icon: 'terminal', color: '#339933' },
  { name: 'Go', icon: 'data_object', color: '#00ADD8' },
  { name: 'AWS', icon: 'cloud', color: '#FF9900' },
  { name: 'Tailwind', icon: 'style', color: '#38B2AC' },
];

export default function TechStack() {
  return (
    <div className="w-full py-12 border-y border-slate-200 dark:border-slate-800 my-10 bg-white dark:bg-slate-900/50">
      <p className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">
        Technologies I work with
      </p>
      <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
        {technologies.map((tech) => (
          <div key={tech.name} className="flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-4xl" style={{ color: tech.color }}>
              {tech.icon}
            </span>
            <span className="text-xs font-medium">{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
