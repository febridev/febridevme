'use client';

export default function LinkedInSection() {
  return (
    <section id="linkedin" className="py-16 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold mb-8 text-center text-blue-400">LinkedIn</h2>

        <div className="bg-gray-700 rounded-lg p-8 text-center border border-gray-600">
          <p className="text-gray-300 mb-4">
            LinkedIn API integration requires proper authentication and approval from LinkedIn.
          </p>
          <p className="text-gray-400 text-sm">
            To enable this feature, you'll need to:
          </p>
          <ul className="text-gray-400 text-sm mt-4 space-y-2">
            <li>✓ Create a LinkedIn Developer Application</li>
            <li>✓ Get API credentials and access token</li>
            <li>✓ Update your environment variables</li>
          </ul>
          <a
            href="https://www.linkedin.com/developers/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            LinkedIn Developer Portal
          </a>
        </div>
      </div>
    </section>
  );
}
