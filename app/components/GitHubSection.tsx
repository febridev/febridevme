'use client';

import { useEffect, useState } from 'react';
import { GitHubRepo } from '@/app/types';

export default function GitHubSection() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/github?type=latest&limit=5');
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
  }, []);

  return (
    <section id="projects" className="w-full py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-slate-900 tracking-tight text-3xl font-bold leading-tight">Latest Projects</h2>
          <p className="text-slate-500 mt-2">A selection of my recent open source contributions and experiments.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-bold">
            All
          </button>
          <button className="px-4 py-2 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 text-sm font-medium transition-colors">
            React
          </button>
          <button className="px-4 py-2 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 text-sm font-medium transition-colors">
            Node.js
          </button>
        </div>
      </div>

      {loading && <div className="text-center text-slate-500">Loading repositories...</div>}

      {error && <div className="text-center text-red-500">Error: {error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Featured Large Card */}
          {repos[0] && (
            <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="absolute top-4 right-4 z-10">
                <div className="flex gap-2">
                  <span className="bg-black/50 backdrop-blur text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">star</span> {repos[0].stargazers_count}
                  </span>
                </div>
              </div>
              <div
                className="h-64 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAi81NOopcJ_n8z6jOrExf6FlKbmgmHXL9tMhgB0Tvl-bgBgiMncod164tUWr7nWZ2P6pm7_Wkh2u2clTG9bySIJpyVS48PRZ4me0GsklzX9rzNJ1cOpIJMExrLvX2rk1J26saq2tXUBb1WVfhPRgOCAxr0gNpPiKPVs9SlNsxKeJ4m9geNjz_mVU3MpvheldnzFWF4l47PQNcPeUCheBFE8Pg33yLCOv_4EiSvU84zdbldapuQBDAeunG91mdI-vYo31uVXIfzqes")`,
                }}
              ></div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded uppercase tracking-wider">
                    Featured
                  </span>
                  <span className="text-xs text-slate-500">• Updated {new Date(repos[0].updated_at).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                  {repos[0].name}
                </h3>
                <p className="text-slate-500 mb-4 line-clamp-2">
                  {repos[0].description || 'No description available'}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex gap-2">
                    {repos[0].language && (
                      <span className="flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        <span className="w-2 h-2 rounded-full bg-[#61DAFB]"></span> {repos[0].language}
                      </span>
                    )}
                  </div>
                  <a
                    href={repos[0].html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-blue-600 font-semibold text-sm flex items-center gap-1"
                  >
                    View Repo <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Grid of smaller cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {repos.slice(1, 5).map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col rounded-xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg text-primary">
                    <span className="material-symbols-outlined">folder_open</span>
                  </div>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">star</span> {repo.stargazers_count}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{repo.name}</h3>
                <p className="text-sm text-slate-500 mb-4 flex-grow line-clamp-2">
                  {repo.description || 'No description available'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {repo.language && (
                    <>
                      <span className="w-3 h-3 rounded-full bg-[#61DAFB]"></span>
                      <span className="text-xs text-slate-600">{repo.language}</span>
                    </>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
