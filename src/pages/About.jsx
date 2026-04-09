import React from "react";
import { Link } from "react-router-dom";

const highlights = [
  {
    icon: "workspace_premium",
    title: "Quality First",
    description:
      "Every product is selected for lasting performance, practical design, and everyday reliability.",
  },
  {
    icon: "design_services",
    title: "Purposeful Curation",
    description:
      "We dont focus on essentials that improve focus, comfort, and flow for modern professionals.",
  },
  {
    icon: "favorite",
    title: "Customer-Centered",
    description:
      "From product discovery to delivery, we build an experience that feels clear and dependable.",
  },
];

const milestones = [
  {
    year: "2023",
    title: "The Idea",
    description:
      "Vidara started with one goal: make premium workspace essentials more accessible in one place.",
  },
  {
    year: "2024",
    title: "First Collection",
    description:
      "We launched our opening range focused on refined desk tools and productivity-ready accessories.",
  },
  {
    year: "2025",
    title: "Growing Community",
    description:
      "Thousands of shoppers joined the Vidara circle and helped shape our evolving product line.",
  },
];

const About = () => {
  return (
    <>
      <section className="mx-auto max-w-[1280px] px-6 py-12 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="order-2 flex flex-col gap-8 lg:order-1">
            <div className="flex flex-col gap-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-accent-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-gold">
                <span className="material-symbols-outlined text-xs">bolt</span>
                About Vidara
              </div>

              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                Built for Better Workdays.
              </h1>

              <p className="max-w-[540px] text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Vidara Trade Center is focused on curated workplace essentials
                that blend style, durability, and real-world function. We
                believe the right tools can elevate how you work and how you
                feel every day.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/products"
                className="flex h-14 items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-white transition-transform hover:shadow-lg active:scale-95"
              >
                Explore Products
              </Link>
              <Link
                to="/"
                className="flex h-14 items-center justify-center rounded-xl border-2 border-slate-200 bg-transparent px-8 text-base font-bold text-slate-900 transition-all hover:bg-slate-50 dark:border-slate-800 dark:text-white dark:hover:bg-slate-800"
              >
                Back to Home
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative h-[400px] w-full overflow-hidden rounded-3xl bg-slate-200 dark:bg-slate-800 sm:h-[500px]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1524758870432-af57e54afa26?auto=format&fit=crop&w=1200&q=80")',
                }}
                role="img"
                aria-label="Bright modern workspace with organized desk accessories"
              />
              <div className="absolute bottom-6 right-6 flex items-center gap-4 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-sm dark:bg-slate-900/90">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
                  <span className="material-symbols-outlined">groups</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Community Driven
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Designed from real customer needs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-slate-900/30 lg:py-24">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="mb-12 flex flex-col gap-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              What We Stand For
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Our principles guide every product, partnership, and customer
              experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-transform hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-white">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-12 lg:py-24">
        <div className="mb-12 flex flex-col gap-3">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Our Journey
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Small steps, steady momentum, and a clear commitment to quality.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {milestones.map((milestone) => (
            <div
              key={milestone.year}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/60"
            >
              <p className="text-sm font-bold uppercase tracking-widest text-accent-gold">
                {milestone.year}
              </p>
              <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
                {milestone.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {milestone.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-16 lg:px-12 lg:pb-24">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-16 text-center lg:py-24">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-accent-gold/10 blur-3xl" />

          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6">
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              Let&apos;s Build Your Ideal Workspace
            </h2>
            <p className="text-lg text-slate-300">
              Discover essentials that help you stay focused, organized, and
              confident throughout your day.
            </p>
            <Link
              to="/products"
              className="flex h-14 items-center justify-center rounded-xl bg-accent-gold px-8 text-base font-bold text-white transition-all hover:opacity-90"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
