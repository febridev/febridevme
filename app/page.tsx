import Header from './components/Header';
import GitHubSection from './components/GitHubSection';
import LinkedInSection from './components/LinkedInSection';
import MediumSection from './components/MediumSection';
import Footer from './components/Footer';

export const metadata = {
  title: 'Portfolio - GitHub, LinkedIn & Medium',
  description: 'Showcase your GitHub repositories, LinkedIn posts, and Medium articles in one place',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Welcome to My Portfolio
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore my work across GitHub, LinkedIn, and Medium. All your professional content in one place.
            </p>
          </div>
        </section>

        {/* GitHub Section */}
        <GitHubSection />

        {/* LinkedIn Section */}
        <LinkedInSection />

        {/* Medium Section */}
        <MediumSection />
      </main>
      <Footer />
    </div>
  );
}
