'use client';

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: number;
  date: string;
  image: string;
  link: string;
}

const dummyArticles: Article[] = [
  {
    id: '1',
    title: 'Mastering React Hooks in 2024',
    description: 'A deep dive into advanced hooks patterns and performance optimization techniques for modern React applications.',
    category: 'Development',
    readTime: 5,
    date: 'Oct 12, 2023',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFvZhsnHK_byObuvt_JnrGKrFnSD1NWAc2xEFz6tumUyJoCMhN44xQeg5FKUtWx_-XMqsURjGhRq1vjywBAOlk1_JXVdfstCly2MFiFMyV5hDcl8Ny8__L6q8a6daGYO44fDe6S5Ng_kY3dtc6zrMrmMJAiB4jw-WtQUOW4morfVLl9j7AJ4AvLPkzFTut94HgbhfhPjW26YflCJdlpUT6un4bArrvCILC4E169chifQdL56hi81OJxKF3hOpL6x1dhNVkBISOJd8',
    link: '#',
  },
  {
    id: '2',
    title: 'Why You Need a Design System',
    description: 'Bridging the gap between design and engineering to scale product development efficiently.',
    category: 'Design System',
    readTime: 7,
    date: 'Sep 28, 2023',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb08_vPaOyw611SAc-jc_8WR936xwg5qnILKbE6oar3LFBhwsjuzP8ftgA-g0L16Aa-Yx4pUji9dcRNhlFVQAL73Ea7jDHkFNrS2QCo_llWxUBHc3G53M7wSRsXul0BtNpYzX5HqwzlAQyYonAomXzekAjXIvSri_4CLsWysigY4elTN07Ry9qOvrqJO6mVlPZMbrvmWsuh5PWo509gAfibOu8dixO7Ye-gWrpRhdU7NOBReNFhb1QIK1utdQdM2UjEVARDyNCwTQ',
    link: '#',
  },
  {
    id: '3',
    title: 'From Junior to Senior Dev',
    description: 'Lessons learned and key soft skills required to level up your engineering career.',
    category: 'Career',
    readTime: 10,
    date: 'Aug 15, 2023',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-9-yaRdX7pNmBpbevHZYK_fL215NlrGF736szXTpIdbNR_WBSYhV7EEqmraB5ynOj15jT5QHoJ0nmTs1AuqrhuMSBRDYu-E5MV0c5j2petxqnBkaxWOxtbEhUOEMOEe4TdEWGUe99q_MOmi15baxm9-o3R6JLBsFt-AG-P-BK92isJ6eI3q4foaxmbOW8XHuA4Zi4XLhRRp3MOHQlFueqek5konULwPifc8YBxCvrMY6EAYbl_9Z0E8_UOuRORV2zRh12FPS2UKA',
    link: '#',
  },
];

export default function MediumSection() {
  return (
    <div className="w-full py-12" id="articles">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-slate-900 tracking-tight text-3xl font-bold leading-tight">Recent Articles</h2>
        <a
          href="#"
          className="hidden md:flex items-center text-primary font-bold text-sm hover:underline"
        >
          Read on Medium <span className="material-symbols-outlined text-sm ml-1">open_in_new</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dummyArticles.map((article) => (
          <a key={article.id} href={article.link} className="group block h-full">
            <div className="flex flex-col h-full rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300">
              <div
                className="h-48 w-full bg-cover bg-center"
                style={{
                  backgroundImage: `url("${article.image}")`,
                }}
              ></div>
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                  {article.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-grow">{article.description}</p>
                <div className="flex items-center text-xs text-slate-400">
                  <span>{article.readTime} min read</span>
                  <span className="mx-2">•</span>
                  <span>{article.date}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
