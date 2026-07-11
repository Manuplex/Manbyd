import Link from "next/link";
import Card from "@/components/card";

export default function Contact() {
  return (
    <div className="flex-1 bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-8 lg:p-10">
        <section className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Contact</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Discutons de votre projet.</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-300">
            Un site, une refonte ou une idée à concrétiser ? Je peux vous aider à clarifier la direction visuelle et technique.
          </p>
        </section>

        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Email</p>
          <a href="mailto:manbeyond02@gmail.com" className="mt-2 inline-flex text-xl font-semibold text-cyan-300 transition hover:text-cyan-200">
            manbeyond02@gmail.com
          </a>
          <div className="mt-6 flex flex-wrap gap-3">
            <Card title="Maitrise de CapCut" imageSrc=""/>
            <Link href="/about" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-300">
              Découvrir l’approche
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
