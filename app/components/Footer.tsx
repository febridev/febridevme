export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 pt-8 pb-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm px-10">
      <p>© {currentYear} DevPortfolio. All rights reserved.</p>
      <div className="flex gap-6">
        <a href="#" className="hover:text-primary transition-colors">
          Twitter
        </a>
        <a href="#" className="hover:text-primary transition-colors">
          LinkedIn
        </a>
        <a href="#" className="hover:text-primary transition-colors">
          GitHub
        </a>
        <a href="#" className="hover:text-primary transition-colors">
          Medium
        </a>
      </div>
    </footer>
  );
}
