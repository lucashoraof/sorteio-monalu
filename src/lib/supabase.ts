import { createClient } from '@supabase/supabase-js';
import type { Participant } from '@/types/participant';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const participantsService = {
  async create(participant: Omit<Participant, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('participants')
      .insert([participant])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async checkPhoneExists(phone: string) {
    const { data, error } = await supabase
      .from('participants')
      .select('phone')
      .eq('phone', phone)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }
};
