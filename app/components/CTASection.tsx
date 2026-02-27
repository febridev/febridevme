'use client';

export default function CTASection() {
  return (
    <div className="w-full mt-12 mb-8">
      <div className="relative rounded-2xl bg-slate-900 dark:bg-slate-800 p-8 md:p-12 overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 max-w-xl">
          <h2 className="text-white text-3xl font-bold mb-4">Ready to start a project?</h2>
          <p className="text-slate-300 text-lg">
            I'm currently available for freelance work and open to new opportunities. Let's build something amazing together.
          </p>
        </div>
        <div className="relative z-10 flex gap-4">
          <button className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-colors">
            Contact Me
          </button>
        </div>
      </div>
    </div>
  );
}
