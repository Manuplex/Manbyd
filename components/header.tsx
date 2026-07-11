"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-2" onClick={() => setIsMenuOpen(false)}>
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">Manbyd</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-slate-300 transition hover:text-cyan-300">
            Accueil
          </Link>
          <Link href="/services" className="text-sm font-medium text-slate-300 transition hover:text-cyan-300">
            Services
          </Link>
          <Link href="/about" className="text-sm font-medium text-slate-300 transition hover:text-cyan-300">
            À propos
          </Link>
        </nav>

        <Link href="/contact" className="hidden rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-400 md:inline-flex">
          Contactez-moi
        </Link>

        <button
          type="button"
          aria-label="Ouvrir le menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="rounded-full border border-white/10 p-2 text-slate-200 transition hover:bg-white/10 md:hidden"
        >
          <i className={`fa-solid ${isMenuOpen ? "fa-xmark" : "fa-bars"}`} />
        </button>
      </div>

      {isMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setIsMenuOpen(false)} />

          <div className="absolute left-0 top-full z-50 w-full border-b border-white/10 bg-slate-950/95 md:hidden">
            <ul className="flex flex-col gap-2 p-4">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                <li className="rounded-xl px-3 py-2 text-slate-200 transition hover:bg-white/10">Accueil</li>
              </Link>
              <Link href="/services" onClick={() => setIsMenuOpen(false)}>
                <li className="rounded-xl px-3 py-2 text-slate-200 transition hover:bg-white/10">Services</li>
              </Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)}>
                <li className="rounded-xl px-3 py-2 text-slate-200 transition hover:bg-white/10">À propos</li>
              </Link>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                <li className="rounded-xl bg-cyan-500 px-3 py-2 text-center font-semibold text-white">Contactez-moi</li>
              </Link>
            </ul>
          </div>
        </>
      )}
    </header>
  );
}