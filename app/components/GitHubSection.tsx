'use client';

import { useEffect, useState } from 'react';
import { GitHubRepo } from '@/app/types';

export default function GitHubSection() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<'latest' | 'top'>('latest');

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/github?type=${type}&limit=10`);
        const data = await response.json();

        if (data.success) {
          setRepos(data.data);
          setError(null);
        } else {
          setError(data.error || 'Failed to fetch repositories');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch repositories');
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [type]);

  return (
    <section id="github" className="py-16 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold mb-8 text-center text-blue-400">GitHub Repositories</h2>

        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => setType('latest')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              type === 'latest'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => setType('top')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              type === 'top'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Top (Stars)
          </button>
        </div>

        {loading && <div className="text-center text-gray-400">Loading repositories...</div>}

        {error && <div className="text-center text-red-500">Error: {error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors border border-gray-600 hover:border-blue-400"
              >
                <h3 className="text-xl font-bold text-blue-400 mb-2">{repo.name}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{repo.description || 'No description'}</p>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>
                    {repo.language && (
                      <span className="inline-block px-3 py-1 bg-gray-600 rounded-full mr-2">
                        {repo.language}
                      </span>
                    )}
                  </span>
                  <span>⭐ {repo.stargazers_count}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
