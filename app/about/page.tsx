export default function About() {
  return (
    <div className="flex-1 bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-8 lg:p-10">
        <section className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">À propos</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Je crée des expériences digitales simples, propres et efficaces.</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-300">
            Mon objectif est de transformer des idées en interfaces élégantes, accessibles et pensées pour l’utilisateur.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Approche", text: "Un design clair pour une meilleure compréhension et une expérience fluide." },
            { title: "Focus", text: "Des solutions adaptées aux besoins réels, sans surcharge inutile." },
            { title: "Évolution", text: "Un travail continu pour améliorer chaque détail de la présence en ligne." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              <h2 className="text-lg font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}