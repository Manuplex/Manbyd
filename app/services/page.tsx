

import ProtectedCard from "@/components/ProtectedCard";
import { supabase } from "@/lib/supabase";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function Services() {
  const { data: services, error } = await supabase.from("Services").select("*");

  if (error) {
    console.error(error);
    return null;
  }



  const servicesList = services ?? [];

  return (
    <div className="flex-1 bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-8 lg:p-10">
        <section className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Services</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Des services web pensés pour donner de la visibilité et de la valeur.</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-300">
            De la mise en forme d’un site à l’organisation d’une présence plus forte, chaque détail est pensé pour être lisible et impactant.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {servicesList.map((service, index) => {
            const serviceName = typeof service.name === "string" ? service.name : `Service ${index + 1}`;
            const serviceImage = typeof service.Image === "string" ? service.Image : "";
            const serviceDescription = typeof service.State === "string" ? service.State : "";

            const isSpecial = Boolean(service?.special);

            return (
              <ProtectedCard
                key={`${serviceName}-${index}`}
                title={serviceName}
                description={serviceDescription}
                imageSrc={serviceImage}
                link={serviceName ? `/services/${slugify(serviceName)}` : undefined}
                special={isSpecial}
                classNameImg="w-full object-cover mt-34"
                className="justify-center align-center bg-gray-500"
              />
            );
          })}
        </section>
        </div>
    </div>
  );
}