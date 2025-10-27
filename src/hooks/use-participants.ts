'use client';

import { useState, useEffect, useCallback } from 'react';
import { participantsService } from '@/lib/supabase';
import type { Participant } from '@/types/participant';

export function useParticipants() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipants = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await participantsService.getAll();
      setParticipants(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar participantes');
      console.error('Fetch participants error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar participantes na montagem
  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  // Polling para atualização em tempo real (a cada 5 segundos)
  useEffect(() => {
    const interval = setInterval(fetchParticipants, 5000);
    return () => clearInterval(interval);
  }, [fetchParticipants]);

  return {
    participants,
    isLoading,
    error,
    refetch: fetchParticipants,
  };
}
