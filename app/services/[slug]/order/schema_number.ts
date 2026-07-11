import { z } from 'zod';

// Liste de vos indicatifs autorisés (facile à faire évoluer)
const allowedPrefixes = ['241', '228']; 

export const PhoneSchema = z.object({
  name:z.string(),
  phoneNumber: z.string()
    .trim()
    // Élimine les espaces cachés
    .regex(/^[0-9]+$/, "Le numéro ne doit contenir que des chiffres (pas de + ni d'espaces)")
    // Vérifie que le numéro commence par un préfixe valide
    .refine((val) => allowedPrefixes.some(prefix => val.startsWith(prefix)), {
      message: "L'indicatif pays n'est pas autorisé (ex: commencez par 241 ou 228)",
    })
    // Vérifie la longueur totale minimale et maximale (indicatif inclus)
    .refine((val) => val.length >= 10 && val.length <= 12, {
      message: "Le numéro complet doit faire entre 10 et 12 chiffres",
    }),
});

export type PhoneSchemaType = z.infer<typeof PhoneSchema>;