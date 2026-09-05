"use client";

import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const searchHref = searchTerm.trim()
    ? `/services?q=${encodeURIComponent(searchTerm.trim())}`
    : "/services";

  return (
    <main className="pb-16">
      <section className="border-b border-slate-200 bg-gradient-to-br from-brand-50 via-white to-slate-50">
        <div className="container-shell grid gap-12 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">LocalPro</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
              Find trusted local professionals for any job.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Discover services, compare local providers, read real reviews, and book with confidence.
            </p>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-3 shadow-soft sm:flex sm:items-center">
              <label className="sr-only" htmlFor="service-search">
                What service do you need?
              </label>
              <input
                id="service-search"
                type="search"
                placeholder="What service do you need?"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="min-w-0 flex-1 rounded-xl border-0 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500"
              />
              <Link
                href={searchHref}
                className="mt-3 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 sm:mt-0"
              >
                Search services
              </Link>
            </div>
            <a
              href="/categories"
              className="mt-4 inline-flex items-center font-semibold text-brand-700 hover:text-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Browse categories <span aria-hidden="true" className="ml-2">-&gt;</span>
            </a>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Your next project</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">Starts with the right local expert.</h2>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-lg text-brand-700" aria-hidden="true">1</span>
                <p className="font-medium text-slate-700">Explore services near you</p>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-lg text-brand-700" aria-hidden="true">2</span>
                <p className="font-medium text-slate-700">Compare providers and reviews</p>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-lg text-brand-700" aria-hidden="true">3</span>
                <p className="font-medium text-slate-700">Book when you are ready</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-16" aria-labelledby="quick-actions-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Get started</p>
            <h2 id="quick-actions-heading" className="mt-2 text-3xl font-bold text-slate-900">Everything you need, close by.</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Browse Services", "/services", "Explore available services"],
            ["Categories", "/categories", "Find the right place to start"],
            ["Find Providers", "/providers", "Meet local professionals"],
            ["Login", "/login", "Return to your account"],
            ["Register", "/register", "Create your free account"],
          ].map(([title, href, description]) => (
            <a key={href} href={href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
              <p className="font-bold text-slate-900">{title} <span aria-hidden="true" className="text-brand-600">-&gt;</span></p>
              <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="container-shell pb-16" aria-labelledby="categories-heading">
        <div className="rounded-3xl bg-slate-900 p-8 text-white md:p-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-300">Popular categories</p>
          <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 id="categories-heading" className="max-w-xl text-3xl font-bold">Find help for what is next.</h2>
            <a href="/categories" className="shrink-0 font-semibold text-brand-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2 focus:ring-offset-slate-900">View all categories -&gt;</a>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Browse all services", "Explore by category", "Discover providers", "See what is available"].map((label) => (
              <a key={label} href="/categories" className="rounded-2xl border border-slate-700 bg-slate-800 p-5 font-semibold text-slate-100 transition hover:border-brand-400 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2 focus:ring-offset-slate-900">
                {label} <span aria-hidden="true" className="ml-2 text-brand-300">-&gt;</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-8" aria-labelledby="benefits-heading">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Why LocalPro</p>
        <h2 id="benefits-heading" className="mt-2 text-3xl font-bold text-slate-900">A simpler way to hire locally.</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Trusted providers", "Browse professional profiles and make informed choices."],
            ["Easy booking", "Request the service you need in just a few steps."],
            ["Reviews & ratings", "Use customer feedback to choose with confidence."],
            ["Search and filters", "Narrow down your options and find a better match."],
          ].map(([title, description]) => (
            <div key={title} className="border-l-2 border-brand-500 pl-5">
              <h3 className="font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell pt-16" aria-labelledby="cta-heading">
        <div className="rounded-3xl border border-brand-200 bg-brand-50 px-6 py-12 text-center md:px-12">
          <h2 id="cta-heading" className="text-3xl font-bold text-slate-900">Ready to find the right professional?</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">Start exploring local services and take the next step with confidence.</p>
          <Link href="/services" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-600 px-7 py-3 font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">Explore services</Link>
        </div>
      </section>
    </main>
  );
}
