"use client";
import { ReactNode, useEffect, useState } from "react";
import Card from "./card";

/**
 * COMPOSANT ProtectedCard
 * 
 * Affiche une Card de manière conditionnelle selon :
 * 1. Le champ `special` de la table (services ou articles)
 * 2. La présence d'un token single-use valide
 * 
 * LOGIQUE D'AFFICHAGE:
 * - special === false : affiche TOUJOURS (aucune vérification)
 * - special === true && token valide : affiche
 * - special === true && pas de token valide : n'affiche PAS
 */

interface ProtectedCardProps {
  title: string;
  description?: string;
  imageSrc?: string;
  link?: string;
  classNameImg?:string;
  className?: string;
  special?: boolean | null;  // Champ provenant de la table services/articles
  token?: string;  // Token optionnel (depuis props, localStorage, ou cookie)
  children?: ReactNode;
}

export default function ProtectedCard({
  title,
  description,
  imageSrc,
  link,
  className,
  classNameImg,
  // special, // La prop `special` est toujours là, mais sa logique est désactivée.
  // token, // La prop `token` est toujours là, mais sa logique est désactivée.
  children,
}: ProtectedCardProps) {
  // Logique de protection désactivée temporairement. La carte s'affiche toujours.
  return (
    <Card title={title} description={description} imageSrc={imageSrc} link={link} className={className} classNameImg={classNameImg}>
      {children}
    </Card>
  );
}

// Ancienne implémentation commentée pour référence future
/*
const isSpecial = special === true;
const [allowed, setAllowed] = useState<boolean>(() => !isSpecial);
const [checked, setChecked] = useState<boolean>(() => !isSpecial);

useEffect(() => {
  if (!isSpecial) return;

  let mounted = true;

  async function verify() {
    // ... (toute la logique de vérification du cookie et du token)
    // ====== ÉTAPE 1 : Vérifier la session existante ======
    const c = document.cookie.match('(^|;)\\s*single_use_session\\s*=\\s*([^;]+)');
    const sessionRaw = c ? decodeURIComponent(c[2]) : null;
    
    if (sessionRaw) {
        try {
          const obj = JSON.parse(decodeURIComponent(sessionRaw));
          const expiresAt = new Date(obj.expiresAt);
        
        if (expiresAt > new Date()) {
          if (mounted) {
            setAllowed(true); 
            setChecked(true);  
          }
          return;
        }
      } catch {
        
      }
    }

    // ====== ÉTAPE 2 : Chercher un token à consommer ======
    let t: string | null = token ?? null;
    if (!t && typeof window !== 'undefined') {
      t = window.localStorage.getItem('single_use_token');
    }
    if (!t) {
      const m = document.cookie.match('(^|;)\\s*single_use_token\\s*=\\s*([^;]+)');
      t = m ? decodeURIComponent(m[2]) : null;
    }
    
    if (!t) {
      if (mounted) {
        setAllowed(false);
        setChecked(true);
      }
      return;
    }

    // ====== ÉTAPE 3 : faire passer la validation par le middleware ======
    const validationPath = window.location.pathname.startsWith('/articles')
      ? '/articles'
      : '/services';

    await fetch(validationPath, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        Authorization: `Bearer ${t}`,
      },
    });

    const c2 = document.cookie.match('(^|;)\\s*single_use_session\\s*=\\s*([^;]+)');
    const sessionRaw2 = c2 ? decodeURIComponent(c2[2]) : null;

    if (mounted) {
        if (sessionRaw2) {
        try {
          const obj = JSON.parse(decodeURIComponent(sessionRaw2));
          const expiresAt = new Date(obj.expiresAt);
          setAllowed(expiresAt > new Date());
        } catch {
          setAllowed(false);
        }
      } else {
        setAllowed(false);
      }
      setChecked(true);
    }
  }

  verify();

  return () => {
    mounted = false;
  };
}, [isSpecial, token]);

if (!checked) {
  return <div style={{ minHeight: 160 }} />;
}

if (!allowed) return null;
*/