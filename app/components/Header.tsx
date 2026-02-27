'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300">
          Portfolio
        </Link>
        <ul className="flex gap-8 items-center">
          <li>
            <Link href="#github" className="text-gray-300 hover:text-blue-400">
              GitHub
            </Link>
          </li>
          <li>
            <Link href="#linkedin" className="text-gray-300 hover:text-blue-400">
              LinkedIn
            </Link>
          </li>
          <li>
            <Link href="#medium" className="text-gray-300 hover:text-blue-400">
              Medium
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
