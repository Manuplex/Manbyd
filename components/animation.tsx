"use client"; // Indique à Next.js que ce composant s'exécute côté client

import { useEffect, useRef } from "react";
import lottie from "lottie-web";

interface LottieAnimationProps {
  path: string;                  // Le chemin vers le fichier JSON (obligatoire)
  renderer?: "svg" | "canvas" | "html";   // Le type de rendu : 'svg', 'canvas' ou 'html' (optionnel, avec 'svg' par défaut)
  loop?: boolean;                // Si l'animation doit tourner en boucle (optionnel, true par défaut)
  autoplay?: boolean;            // Si l'animation se lance seule (optionnel, true par défaut)
  className?: string;            // Pour pouvoir lui passer des classes Tailwind depuis l'extérieur
}


export default function LottieAnimation({path,
  renderer = "svg",      // Valeur par défaut
  loop = true,          // Valeur par défaut
  autoplay = true,      // Valeur par défaut
  className = "w-64 h-64 mx-auto" // Classes de taille par défaut
}: LottieAnimationProps) {
  // 1. On crée une référence pour cibler le div HTML
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sécurité : on vérifie que le conteneur existe bien
    if (!containerRef.current) return;

    // 2. On initialise l'animation Lottie
    const animation = lottie.loadAnimation({
      container: containerRef.current, // Le div ciblé par le ref
      renderer: renderer,
      loop: loop,
      autoplay: autoplay,
      // Le chemin part directement du dossier 'public' dans Next.js
      path: path,
    });

    // 3. NETTOYAGE (Très important en React !)
    // On détruit l'animation si le composant est démonté (changement de page, etc.)
    // pour éviter les fuites de mémoire.
    return () => animation.destroy();
  }, [path, renderer, loop, autoplay]); // Le tableau vide [] assure que ça ne se lance qu'une seule fois au montage

  return (
    <div
      ref={containerRef}
      className={className}  />
  );
}