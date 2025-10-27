import { z } from 'zod';

export const participantSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),
  phone: z
    .string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .max(15, 'Telefone deve ter no máximo 15 dígitos')
    .regex(/^[\d\s\(\)\-\+]+$/, 'Formato de telefone inválido')
    .trim(),
  instagram_followed: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Você deve seguir o Instagram @monalu_oficial para participar'
    })
});

export type ParticipantInput = z.infer<typeof participantSchema>;
