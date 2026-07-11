'use client';

import { useEffect, useState } from 'react';
import { getCart, CartData, removeFromCart } from '@/lib/cartStorage';

export default function OrderSummary() {
  const [cart, setCart] = useState<CartData>({ items: [], timestamp: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Charger le panier depuis localStorage au montage du composant
  useEffect(() => {
    const loadCart = () => {
      const cartData = getCart();
      setCart(cartData);
      setIsLoading(false);
    };

    loadCart();
  }, []);

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
    setCart(getCart());
  };

  // État de chargement
  if (isLoading) {
    return (
      <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">Chargement du panier...</p>
      </div>
    );
  }

  // Panier vide
  if (cart.items.length === 0) {
    return (
      <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Résumé du panier
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          Votre panier est vide. Veuillez sélectionner des articles avant de commander.
        </p>
      </div>
    );
  }

  // Afficher les articles du panier
  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        Résumé du panier
      </h3>

      {/* Liste des articles */}
      <div className="space-y-3">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-600 dark:bg-slate-700"
          >
            <div className="flex-1">
              <p className="font-medium text-slate-900 dark:text-white">
                {item.name}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Prix: {item.price}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Quantité: <span className="text-cyan-600 dark:text-cyan-400">{item.quantity}</span>
                </p>
              </div>

              <button
                onClick={() => handleRemoveItem(item.id)}
                className="rounded bg-red-500 px-3 py-1 text-sm text-white transition hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Informations supplémentaires */}
      <div className="border-t border-slate-200 pt-4 dark:border-slate-600">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          <span className="font-medium">Total d&apos;articles:</span> {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
        </p>
      </div>
    </div>
  );
}
