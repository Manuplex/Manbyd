// Types pour le panier
export interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

export interface CartData {
  items: CartItem[];
  timestamp: number;
}

// Clé localStorage
const CART_KEY = 'panier_commande';

/**
 * Sauvegarde l'article dans le panier
 * @param item - L'article à ajouter/mettre à jour
 */
export function saveToCart(item: CartItem): void {
  if (typeof window === 'undefined') return; // SSR check

  try {
    const cart: CartData = getCart();
    
    // Chercher si l'article existe déjà
    const existingItemIndex = cart.items.findIndex(i => i.id === item.id);
    
    if (existingItemIndex > -1) {
      // Mettre à jour la quantité
      cart.items[existingItemIndex].quantity = item.quantity;
    } else {
      // Ajouter le nouvel article
      cart.items.push(item);
    }
    
    cart.timestamp = Date.now();
    window.dispatchEvent(new Event('cart-updated'))
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du panier:', error);
  }
}

/**
 * Récupère le panier complet
 */
export function getCart(): CartData {
  if (typeof window === 'undefined') {
    return { items: [], timestamp: 0 };
  }

  try {
    const cartData = localStorage.getItem(CART_KEY);
    if (!cartData) {
      return { items: [], timestamp: Date.now() };
    }
    return JSON.parse(cartData);
  } catch (error) {
    console.error('Erreur lors de la lecture du panier:', error);
    return { items: [], timestamp: Date.now() };
  }
}

/**
 * Récupère un article spécifique du panier
 */
export function getCartItem(itemId: string): CartItem | null {
  const cart = getCart();
  return cart.items.find(item => item.id === itemId) || null;
}

/**
 * Vide complètement le panier
 */
export function clearCart(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new Event('cart-updated'))
  } catch (error) {
    console.error('Erreur lors du nettoyage du panier:', error);
  }
}

/**
 * Supprime un article du panier
 */
export function removeFromCart(itemId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const cart = getCart();
    cart.items = cart.items.filter(item => item.id !== itemId);
    cart.timestamp = Date.now();
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'))
  } catch (error) {
    console.error('Erreur lors de la suppression du panier:', error);
  }
}
