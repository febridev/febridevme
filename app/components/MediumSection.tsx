'use client';

import { useEffect, useState } from 'react';
import { MediumArticle } from '@/app/types';

export default function MediumSection() {
  const [articles, setArticles] = useState<MediumArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/medium?type=latest&limit=5');
        const data = await response.json();

        if (data.success) {
          setArticles(data.data);
          setError(null);
        } else {
          setError(data.error || 'Failed to fetch articles');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const estimateReadTime = (description: string) => {
    const wordsPerMinute = 200;
    const wordCount = description.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <div className="w-full py-12" id="articles">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight">Recent Articles</h2>
        <a
          href="https://medium.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center text-primary font-bold text-sm hover:underline"
        >
          Read on Medium <span className="material-symbols-outlined text-sm ml-1">open_in_new</span>
        </a>
      </div>

      {loading && <div className="text-center text-slate-500 dark:text-slate-400">Loading articles...</div>}

      {error && <div className="text-center text-red-500 mb-8">Error loading articles: {error}</div>}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((article) => (
            <a
              key={article.id}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block h-full"
            >
              <div className="flex flex-col h-full rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg transition-all duration-300">
                <div
                  className="h-48 w-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAFvZhsnHK_byObuvt_JnrGKrFnSD1NWAc2xEFz6tumUyJoCMhN44xQeg5FKUtWx_-XMqsURjGhRq1vjywBAOlk1_JXVdfstCly2MFiFMyV5hDcl8Ny8__L6q8a6daGYO44fDe6S5Ng_kY3dtc6zrMrmMJAiB4jw-WtQUOW4morfVLl9j7AJ4AvLPkzFTut94HgbhfhPjW26YflCJdlpUT6un4bArrvCILC4E169chifQdL56hi81OJxKF3hOpL6x1dhNVkBISOJd8")`,
                  }}
                ></div>
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Development</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 flex-grow">
                    {article.description}
                  </p>
                  <div className="flex items-center text-xs text-slate-400">
                    <span>{estimateReadTime(article.description)} min read</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(article.pubDate)}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
