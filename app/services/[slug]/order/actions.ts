// actions.ts
'use server';

import { flattenError } from 'zod';
import { CartData } from '@/lib/cartStorage';
import { PhoneSchema } from './schema_number';

type ActionState = {
  success: boolean;
  errors: Record<string, string[]> | null;
  message: string | null;
};

export default async function Action(
  cartItems: CartData,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState>
{
  const details = {
    name: formData.get('name'),
    phoneNumber: formData.get('number'),
    email: formData.get('email'),
  };

  const result = PhoneSchema.safeParse(details);

  if (!result.success) {
    const errors = flattenError(result.error).fieldErrors;
    return { success: false, errors, message: null };
  }

  const payload = {
    name: result.data.name,
    phoneNumber: result.data.phoneNumber,
    email: result.data.email,
    items: cartItems.items,
  };
  console.log(payload.phoneNumber);

  try {
    const res = await fetch(process.env.WEBHOOK_URL!, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        "CF-Access-Client-Id": process.env.CLIENT_ID!,
        "CF-Access-Client-Secret": process.env.CLIENT_SECRET!,
      },
    });

    if (!res.ok) {
      return {
        success: false,
        errors: null,
        message: "Le système n'est pas disponible pour le moment. Veuillez réessayer plus tard.",
      };
    }
  } catch (err) {
    console.error("Erreur webhook :", err);
    return {
      success: false,
      errors: null,
      message: "Le système n'est pas disponible pour le moment. Veuillez réessayer plus tard.",
    };
  }

  return { success: true, errors: null, message: null };
}