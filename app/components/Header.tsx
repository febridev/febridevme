'use client';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-background-light/80 backdrop-blur-md px-10 py-3">
      <div className="flex items-center gap-4">
        <div className="size-8 flex items-center justify-center rounded bg-primary text-white">
          <span className="material-symbols-outlined text-xl">code</span>
        </div>
        <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em]">
          DevPortfolio
        </h2>
      </div>

      <div className="hidden md:flex flex-1 justify-end gap-8">
        <nav className="flex items-center gap-9">
          <a
            href="#home"
            className="text-slate-700 hover:text-primary transition-colors text-sm font-medium leading-normal"
          >
            Home
          </a>
          <a
            href="#projects"
            className="text-slate-700 hover:text-primary transition-colors text-sm font-medium leading-normal"
          >
            Projects
          </a>
          <a
            href="#experience"
            className="text-slate-700 hover:text-primary transition-colors text-sm font-medium leading-normal"
          >
            Experience
          </a>
          <a
            href="#articles"
            className="text-slate-700 hover:text-primary transition-colors text-sm font-medium leading-normal"
          >
            Articles
          </a>
        </nav>
        <button
          className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em]"
        >
          <span className="truncate">Hire Me</span>
        </button>
      </div>

      <div className="md:hidden">
        <button className="text-slate-900">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </header>
  );
}
