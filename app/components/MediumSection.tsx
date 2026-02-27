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
        const response = await fetch('/api/medium?type=latest&limit=10');
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
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section id="medium" className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold mb-8 text-center text-blue-400">Latest Medium Articles</h2>

        {loading && <div className="text-center text-gray-400">Loading articles...</div>}

        {error && <div className="text-center text-red-500">Error: {error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <a
                key={article.id}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 hover:border-blue-400"
              >
                {article.thumbnail && (
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <h3 className="text-xl font-bold text-blue-400 mb-2 line-clamp-2">{article.title}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{article.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{article.author}</span>
                  <span>{formatDate(article.pubDate)}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
