'use client';

export default function HeroSection() {
  return (
    <div>
      <div className="flex flex-col-reverse gap-6 py-10 md:gap-8 md:flex-row md:items-center">
        {/* Left Content */}
        <div className="flex flex-col gap-6 md:gap-8 flex-1">
          <div className="flex flex-col gap-4 text-left">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-primary/10 px-3 py-1 text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">Open to work</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-slate-900 text-4xl font-black leading-tight tracking-[-0.033em] sm:text-5xl lg:text-6xl">
              Building the future, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                one commit at a time.
              </span>
            </h1>

            {/* Subheading */}
            <h2 className="text-slate-500 text-lg font-normal leading-relaxed max-w-xl">
              Full-stack developer and content creator specializing in modern web technologies. Transforming ideas into scalable,
              robust digital solutions.
            </h2>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="flex min-w-[120px] cursor-pointer items-center justify-center gap-2 rounded-lg h-12 px-6 bg-slate-900 text-white text-base font-bold transition-transform active:scale-95 hover:shadow-lg">
              <span>View Github</span>
              <span className="material-symbols-outlined text-lg">open_in_new</span>
            </button>
            <button className="flex min-w-[120px] cursor-pointer items-center justify-center gap-2 rounded-lg h-12 px-6 bg-slate-200 text-slate-900 text-base font-bold transition-transform active:scale-95 hover:bg-slate-300">
              <span>Read Articles</span>
              <span className="material-symbols-outlined text-lg">article</span>
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900">50+</span>
              <span className="text-sm text-slate-500">Projects Completed</span>
            </div>
            <div className="h-auto w-px bg-slate-200"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900">5k+</span>
              <span className="text-sm text-slate-500">Contributions</span>
            </div>
            <div className="h-auto w-px bg-slate-200"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900">10+</span>
              <span className="text-sm text-slate-500">Articles</span>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full flex-1 flex justify-center md:justify-end">
          <div className="relative w-full max-w-[500px] aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10"></div>
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCUxuez6rxBoc5WlG-AqeWPX-Q8tT1gwdCAYc-kSGkBf-qi7LU98bhMPZ-lw2LRQUwnONN8lPDnLdhZn90MJvIfYse4ZDdM8_rs7qi0OU6HP3GmaLlo-N6v_2cxBV1X-zUns--z84jfUkg75Tq3cCqhkSqmwixRNuwMuzxOYeuCDmYU4utpCoYI-7FzLUg1iq4zZl-IkW2k98ejK0dCb9Dxi0qdmN-LdyPhWByYIzgA39MMORYgPx4POMIVtVL37OFxMyFC_wyrNjk")',
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
