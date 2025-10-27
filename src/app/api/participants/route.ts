import { NextRequest, NextResponse } from 'next/server';
import { participantSchema } from '@/lib/validations';
import { participantsService } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validação dos dados
    const validationResult = participantSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos', 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const { name, phone, instagram_followed } = validationResult.data;

    // Verificar se o telefone já existe
    const phoneExists = await participantsService.checkPhoneExists(phone);
    
    if (phoneExists) {
      return NextResponse.json(
        { error: 'Este telefone já está cadastrado no sorteio' },
        { status: 409 }
      );
    }

    // Criar participante no banco
    const participant = await participantsService.create({
      name,
      phone,
      instagram_followed
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Cadastro realizado com sucesso!',
        participant: {
          id: participant.id,
          name: participant.name
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { error: 'Erro interno do servidor. Tente novamente.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const participants = await participantsService.getAll();
    
    return NextResponse.json({
      success: true,
      participants: participants.map(p => ({
        id: p.id,
        name: p.name,
        phone: p.phone,
        created_at: p.created_at
      }))
    });

  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { error: 'Erro ao buscar participantes' },
      { status: 500 }
    );
  }
}
