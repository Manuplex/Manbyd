export const dynamic = "force-dynamic";
import ReactMarkdown from 'react-markdown';
import ProtectedCard from "@/components/ProtectedCard";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AddCarter from "@/components/AddCarter";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function ServiceArticles({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // Récupérer tous les services
  const { data: services, error: servicesError } = await supabase
    .from("Services")
    .select("*");

  if (servicesError) {
    console.error(servicesError);
    return null;
  }

  // Trouver le service par son slug
  const service = services?.find((entry) => {
    const serviceName = typeof entry.name === "string" ? entry.name : "";
    return slugify(serviceName) === slug;
  });

  if (!service) {
    notFound();
  }

  // Récupérer les articles associés à ce service via jointure
  const { data: articles, error: articlesError } = await supabase
    .from("Articles")
    .select("*")
    .eq("service_id", service.id);

  if (articlesError) {
    console.error(articlesError);
    return null;
  }

  

  const serviceName = typeof service.name === "string" ? service.name : "Service";
  const contentPage = typeof service.content_page === "string" ? service.content_page : "";
  const articlesList = articles ?? [];
 

  return (
    <div className="flex-1 bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-8 lg:p-10">
        <section className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">{serviceName}</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Articles</h1>
        </section>

        {/* Afficher les articles avec le composant Card */}
        <section className="grid gap-4 md:grid-cols-2">
          {articlesList.map((article) => {
            const title = typeof article.name === "string" ? article.name : "";
            const imageSrc = typeof article.Image === "string" ? article.Image : undefined;
            const description = typeof article.price === "number" ? article.price : undefined;
            const articleSlug = slugify(title);

            const isSpecial = Boolean(article?.special);

            return (
              <ProtectedCard
                key={article.id}
                title={title}
                imageSrc={imageSrc}
                description={description}
                link={`/services/${slug}/order`}
                special={isSpecial}
                classNameImg="w-full h-45"
                className=""
              >
                <AddCarter
                  articleId={article.id}
                  articleName={title}
                  price={description || ''}
                />
              </ProtectedCard>
            );
          })}
        </section>

        {/* Afficher le contenu de la page du service après les articles */}
        {contentPage && (
          <section className="space-y-4 border-t border-white/10 pt-8">
            <ReactMarkdown>{contentPage}</ReactMarkdown>
          </section>
        )}
      </div>
    </div>
  );
}