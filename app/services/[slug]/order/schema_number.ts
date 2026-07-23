import { z } from 'zod';
import { isValidPhoneNumber } from "libphonenumber-js";

export const PhoneSchema = z.object({
  name:z.string().min(1),
  phoneNumber: z
  .string()
  .min(1, "Le numéro de téléphone est requis")
  .refine((val) => isValidPhoneNumber(val), {
      message: "Le numéro de téléphone n'est pas valide ou incomplet",
    }),
  email: z.string().min(1)
  });

export type PhoneSchemaType = z.infer<typeof PhoneSchema>;