
// useCart.ts
import { useSyncExternalStore, useMemo } from 'react'
import { CartData } from '@/lib/cartStorage'

function subscribe(callback: () => void) {
  // 'storage' ne se déclenche qu'entre onglets différents,
  // donc on ajoute un event custom pour la réactivité intra-onglet
  window.addEventListener('storage', callback)
  window.addEventListener('cart-updated', callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener('cart-updated', callback)
  }
}

function getSnapshot(): string {
  return localStorage.getItem('panier_commande') ?? '{"items":[],"timestamp":0}'
}

function getServerSnapshot(): string {
  // valeur rendue côté serveur, avant hydratation
  return '{"items":[],"timestamp":0}'
}

export function useCart() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const cartData: CartData = useMemo(() => JSON.parse(raw), [raw])

  return { cartData, isLoaded: true }
}