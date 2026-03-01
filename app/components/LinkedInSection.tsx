'use client';

interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
  skills: string[];
}

const dummyExperiences: Experience[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechNova Inc.',
    duration: '2021 - Present',
    description:
      'Spearheaded the migration of the legacy dashboard to React 18, improving load times by 40%. Mentored junior developers and established code quality standards using ESLint and Prettier.',
    skills: ['React', 'Redux', 'AWS'],
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'Creative Solutions Ltd.',
    duration: '2019 - 2021',
    description:
      'Developed and maintained multiple client e-commerce sites. Integrated payment gateways (Stripe, PayPal) and built custom CMS solutions using Node.js and MongoDB.',
    skills: ['Node.js', 'MongoDB', 'Vue.js'],
  },
];

export default function LinkedInSection() {
  return (
    <div className="w-full py-12" id="experience-linkedin">
      <h2 className="text-slate-900 tracking-tight text-3xl font-bold leading-tight mb-8">Experience</h2>

      <div className="flex flex-col gap-6">
        {dummyExperiences.map((experience) => (
          <div
            key={experience.id}
            className="flex flex-col md:flex-row gap-4 p-6 rounded-xl bg-white border border-slate-200 shadow-sm"
          >
            <div className="shrink-0">
              <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-400">business</span>
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{experience.title}</h3>
                  <p className="text-slate-600 font-medium">{experience.company}</p>
                </div>
                <span className="text-sm text-slate-500 bg-slate-50 px-3 py-1 rounded-full whitespace-nowrap mt-2 md:mt-0 self-start">
                  {experience.duration}
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{experience.description}</p>
              <div className="flex gap-2 flex-wrap">
                {experience.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
