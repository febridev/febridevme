export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-700 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-400">
          © {currentYear} Portfolio Website. All rights reserved.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Built with Next.js, React, and Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
