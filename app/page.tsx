"use client";

import { motion } from "motion/react";
import { Autour_One } from "next/font/google";
import { useEffect, useState } from "react";
import Image from "next/image";
import LottieAnimation from "@/components/animation";
import Link from "next/link";
import Card from "@/components/card";
import interestsData from "@/public/interests.json";

const Auto = Autour_One({ subsets: ["latin"], weight: "400" });

export default function Home() {
  const fullTitle = "Salut ! Moi, c'est Pierre.";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    let typingTimer: number | undefined;
    let pauseTimer: number | undefined;

    const startTyping = () => {
      index = 0;
      setDisplayedText("");
      typingTimer = window.setInterval(() => {
        setDisplayedText(fullTitle.slice(0, index + 1));
        index += 1;

        if (index === fullTitle.length) {
          if (typingTimer) window.clearInterval(typingTimer);
          pauseTimer = window.setTimeout(() => {
            startTyping();
          }, 1500);
        }
      }, 60);
    };

    startTyping();

    return () => {
      if (typingTimer) window.clearInterval(typingTimer);
      if (pauseTimer) window.clearTimeout(pauseTimer);
    };
  }, []);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.25),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.2),_transparent_40%)]" />
      <main className="relative z-10 flex w-full max-w-6xl flex-col gap-8 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl sm:p-8 lg:p-10">
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
              Développeur web & créateur de produits
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex min-h-10 flex-wrap items-center gap-3 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
            >
              <Image src="/emoji_hi.png" alt="greetings_icon" width={40} height={40} />
              <span>{displayedText}</span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="ml-1 inline-block h-[1em] w-[0.6ch] translate-y-[0.1em] rounded-sm bg-cyan-300"
              />
            </motion.h1>

            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              Je conçois des interfaces modernes, des expériences fluides et des solutions utiles pour accompagner vos idées.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/services"
                className="rounded-full bg-cyan-500 px-5 py-3 font-semibold text-white transition hover:bg-cyan-400"
              >
                En savoir plus
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-white/15 px-5 py-3 font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-300"
              >
                Découvrir mon parcours
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-lg shadow-slate-950/40">
            <LottieAnimation path="/dev.json" className="mx-auto h-64 w-64 sm:h-72 sm:w-72" />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className={`text-2xl font-semibold sm:text-3xl ${Auto.className}`}>Mes objectifs</h3>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Compétences & centres d’intérêt</p>
          </div>
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" id="Skills">
            {interestsData.map((interest, index) => (
              <li key={`${interest.name}-${index}`}>
                <Card title={interest.name} imageSrc={interest.url} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
