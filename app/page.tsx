import Header from './components/Header';
import HeroSection from './components/HeroSection';
import TechStack from './components/TechStack';
import GitHubSection from './components/GitHubSection';
import ExperienceSection from './components/ExperienceSection';
import MediumSection from './components/MediumSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

export const metadata = {
  title: 'DevPortfolio - Modern Card Variant',
  description: 'Full-stack developer and content creator specializing in modern web technologies. Transforming ideas into scalable, robust digital solutions.',
};

export default function Home() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light">
      <Header />
      <main className="flex-grow">
        <div className="layout-container flex flex-col items-center">
          <div className="layout-content-container flex flex-col w-full max-w-[1200px] px-4 md:px-10 py-5">
            {/* Hero Section */}
            <HeroSection />

            {/* Tech Stack */}
            <TechStack />

            {/* Latest Projects Section */}
            <GitHubSection />

            {/* Experience Section */}
            <ExperienceSection />

            {/* Articles / Medium Section */}
            <MediumSection />

            {/* CTA Section */}
            <CTASection />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
