import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface CardProps {
  title: string;
  description?: string;
  imageSrc?: string;
  link?: string;
  className?: string;
  classNameImg?: string;
  children?: ReactNode;
}

export default function Card({ 
  title, 
  description, 
  imageSrc, 
  link, 
  className, 
  classNameImg = "h-28 w-28 rounded-xl object-cover shadow-md", 
  children 
}: CardProps) {
  
  return (
    <div className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 ${className || ""}`}>
      
      {/* Zone Image avec fond décoratif abstrait */}
      <div className="relative flex h-40 w-full items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-800/50">
        {/* Décoration d'arrière-plan */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-50 transition-opacity duration-300 group-hover:opacity-100" />
        
        {imageSrc ? (
          <Image 
            src={imageSrc} 
            alt={title} 
            width={160}  // On charge une image un peu plus grande pour garantir la netteté
            height={160}
            quality={100} // Qualité maximale pour éviter le gaspillage de pixels
            className={`relative z-10 transition-transform duration-500 group-hover:scale-110 ${classNameImg}`} 
          />
        ) : (
          <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-xl bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">À venir</span>
          </div>
        )}
      </div>

      {/* Zone Contenu */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h3>
        
        <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {description ?? "Une compétence à explorer avec une approche soignée et moderne."}
        </p>
        
        {/* Zone Action (Bouton & Children) alignée en bas */}
        <div className="mt-auto flex flex-col gap-4">
          {children}
          
          {link && (
            <Link 
              href={link} 
              className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-cyan-600 dark:hover:bg-cyan-500"
            >
              Commandez
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}