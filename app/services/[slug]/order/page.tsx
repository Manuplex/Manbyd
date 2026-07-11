'use client';

import OrderSummary from '@/components/OrderSummary';
import { useCart } from '@/hooks/UseCart';
import { clearCart } from '@/lib/cartStorage'; // ✅ import direct, pas via useCart
import Action from './actions';
import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const initialState = { success: false, errors: null, message: null };

export default function Order() {
  const { cartData, isLoaded } = useCart();
  const router = useRouter();
  const actionAvecPanier = Action.bind(null, cartData);
  const [state, formAction, isPending] = useActionState(actionAvecPanier, initialState);

  useEffect(() => {
    if (state.success) {
      clearCart(); // ✅ vide le localStorage + déclenche 'cart-updated'
      router.push('/services/[slug]/order/validation');
    }
  }, [state.success, router]);

  return (
    <div className="flex-1 bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-8 lg:p-10">
        <section className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Commande</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Récapitulatif</h1>
        </section>

        <OrderSummary />

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-slate-300">
              Nom du commanditaire
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Votre nom"
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100 placeholder-slate-500 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="number" className="block text-sm font-medium text-slate-300">
              Numéro WhatsApp
            </label>
            <input
              type="tel"
              id="number"
              inputMode="numeric"
              name="number"
              placeholder="2289000000"
              title="Seulement au Togo ou au Gabon"
              pattern="^(241|228)[0-9]{7,9}$"
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100 placeholder-slate-500 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              required
            />
            {state?.errors?.phoneNumber && (
              <p className="text-sm text-red-400">{state.errors.phoneNumber[0]}</p>
            )}
          </div>

          {state?.message && (
            <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending || !isLoaded}
            className="w-full rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-2 font-medium text-white transition hover:from-cyan-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? 'Envoi en cours...' : 'Confirmer la commande'}
          </button>
        </form>
      </div>
    </div>
  );
}