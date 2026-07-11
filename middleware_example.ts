// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { createClient } from '@supabase/supabase-js';

// /**
//  * MIDDLEWARE DE VALIDATION DES TOKENS SINGLE-USE
//  * 
//  * LOGIQUE GLOBALE :
//  * ================
//  * 1. Intercepte les requêtes vers `/services` et `/articles`
//  * 2. Vérifie si le token Bearer fourni existe dans la base de données Supabase
//  * 3. Si le token existe :
//  *    - Supprime atomiquement le token (consommation) via RPC `consume_token()`
//  *    - Retourne `true` (via le header `x-token-validated`)
//  * 4. Compare ce `true` avec le champ `special` de la table services/articles
//  * 5. Logique d'affichage côté client (ProtectedCard) :
//  *    - Si special === false : affiche (pas de vérification nécessaire)
//  *    - Si special === true ET token_valid === true : affiche
//  *    - Si special === true ET token_valid === false : n'affiche pas
//  */

// // Configuration Supabase avec clé SERVICE ROLE (accès admin complet)
// const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
// const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
//   throw new Error('NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis dans les env');
// }

// // Client Supabase admin (peut supprimer les tokens sans restrictions RLS)
// const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
//   auth: { persistSession: false },
// });

// /**
//  * Extrait le token du header Authorization: Bearer <token>
//  * Format attendu : "Bearer eyJhbGc..."
//  */
// function extractBearerToken(req: NextRequest) {
//   const auth = req.headers.get('authorization') || req.headers.get('Authorization');
//   if (!auth) return null;
//   const parts = auth.split(' ');
//   if (parts.length !== 2) return null;
//   const [scheme, token] = parts;
//   if (!/^Bearer$/i.test(scheme)) return null;
//   return token;
// }

// /**
//  * Parse les cookies HTTP en objet clé-valeur
//  */
// function parseCookies(cookieHeader: string) {
//   return cookieHeader.split(';').map((item) => item.trim()).filter(Boolean).reduce((acc, pair) => {
//     const idx = pair.indexOf('=');
//     if (idx === -1) return acc;
//     const key = pair.slice(0, idx).trim();
//     const val = pair.slice(idx + 1).trim();
//     acc[key] = decodeURIComponent(val);
//     return acc;
//   }, {} as Record<string, string>);
// }

// /**
//  * Récupère la session depuis le cookie `single_use_session`
//  * Ce cookie est créé APRÈS consommation réussie du token
//  * Format : base64 encodé de { role, expiresAt }
//  * Durée de validité : 2 heures
//  */
// function getSessionFromCookie(req: NextRequest) {
//   const cookies = parseCookies(req.headers.get('cookie') || '');
//   const sessionRaw = cookies.single_use_session;
//   if (!sessionRaw) return null;

//   try {
//     const decoded = JSON.parse(decodeURIComponent(sessionRaw)) as {
//       role?: string;
//       expiresAt?: string;
//     };
//     const expiresAt = decoded.expiresAt ? new Date(decoded.expiresAt) : null;
//     // Retourne null si le cookie a expiré ou ne contient pas le rôle
//     if (!decoded.role || !expiresAt || expiresAt <= new Date()) return null;

//     return { role: decoded.role, expiresAt };
//   } catch {
//     return null;
//   }
// }

// /**
//  * Crée et ajoute le cookie `single_use_session` à la réponse
//  * Ce cookie sera transmis automatiquement par le navigateur sur chaque requête
//  * Valable 2 heures (7200 secondes)
//  */
// function setSessionCookie(res: NextResponse, role: string) {
//   const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
//   const payload = { role, expiresAt };
//   const cookieValue = encodeURIComponent(JSON.stringify(payload));

//   // Utiliser l'API cookies de NextResponse (plus fiable que Set-Cookie manuelle)
//   res.cookies.set('single_use_session', cookieValue, {
//     path: '/',
//     maxAge: 2 * 60 * 60,
//     sameSite: 'lax',
//     secure: process.env.NODE_ENV === 'production',
//   });
// }

// /**
//  * MIDDLEWARE PRINCIPAL
//  * Exécuté sur chaque requête vers `/services` et `/articles`
//  */
// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // ÉTAPE 0 : Vérifie que c'est une route protégée
//   if (!pathname.startsWith('/services') && !pathname.startsWith('/articles')) {
//     return NextResponse.next();
//   }

//   // ÉTAPE 1 : Vérifie si une session valide existe déjà (token déjà consommé)
//   // Si oui, pas besoin de recontrôler le token
//   const validSession = getSessionFromCookie(req);
//   if (validSession) {
//     const res = NextResponse.next();
//     // Ajoute les headers pour que le client sache que le token est valide
//     res.headers.set('x-token-validated', 'true');
//     res.headers.set('x-token-role', validSession.role);
//     return res;
//   }

//   // ÉTAPE 2 : Extrait le token Bearer de l'header Authorization
//   const token = extractBearerToken(req);
//   if (!token) {
//     // Pas de token fourni -> retourne la réponse normalement
//     // ProtectedCard côté client verra qu'il n'y a pas de validation
//     return NextResponse.next();
//   }

//   // ÉTAPE 3 : Consomme le token via la RPC Supabase
//   try {
//     const { data, error } = await supabaseAdmin.rpc('consume_token', { p_token: token });

//     if (error) {
//       console.error('Supabase error consuming token:', error);
//       return NextResponse.next();
//     }

//     // ÉTAPE 4 : Vérifie que le token existait dans la BD
//     const row = Array.isArray(data) ? data[0] : data;
//     if (!row?.role) {
//       // Token n'existait pas, expiré, ou déjà consommé
//       // Retourne la réponse sans validation
//       return NextResponse.next();
//     }

//     // ÉTAPE 5 : Token valide ! Crée une session courte (2h)
//     const res = NextResponse.next();
//     setSessionCookie(res, row.role as string);
    
//     // ÉTAPE 6 : Ajoute les headers de validation pour le client
//     // `x-token-validated = true` signifie : le token a été supprimé de la BD avec succès
//     res.headers.set('x-token-validated', 'true');
//     res.headers.set('x-token-role', row.role as string);
//     return res;
//   } catch (error) {
//     console.error('Unexpected error consuming token:', error);
//     // En cas d'erreur BD, retourne la réponse sans validation
//     return NextResponse.next();
//   }
// }

// // Configuration du matcher : applique le middleware à ces routes
// export const config = {
//   matcher: ['/services/:path*', '/articles/:path*'],
// };
