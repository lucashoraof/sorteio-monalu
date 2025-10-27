import { NextRequest, NextResponse } from 'next/server';
import { participantsService } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Buscar todos os participantes
    const participants = await participantsService.getAll();

    if (participants.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum participante encontrado' },
        { status: 400 }
      );
    }

    // Realizar sorteio
    const randomIndex = Math.floor(Math.random() * participants.length);
    const winner = participants[randomIndex];

    return NextResponse.json({
      success: true,
      winner: {
        id: winner.id,
        name: winner.name,
        phone: winner.phone,
        created_at: winner.created_at
      },
      total_participants: participants.length
    });

  } catch (error) {
    console.error('Raffle error:', error);
    return NextResponse.json(
      { error: 'Erro ao realizar sorteio' },
      { status: 500 }
    );
  }
}
