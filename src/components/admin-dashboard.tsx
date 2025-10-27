'use client';

import { useState, useEffect } from 'react';
import type { Participant } from '@/types/participant';

export default function AdminDashboard() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isRaffling, setIsRaffling] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchParticipants();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isCountingDown && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (isCountingDown && countdown === 0) {
      // Contagem terminou, realizar sorteio
      performRaffle();
    }

    return () => clearTimeout(timer);
  }, [isCountingDown, countdown]);

  const fetchParticipants = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/participants');
      const data = await response.json();
      
      if (data.success) {
        setParticipants(data.participants);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startRaffle = () => {
    if (participants.length === 0) {
      setError('Nenhum participante encontrado para o sorteio');
      return;
    }
    
    setError('');
    setWinner(null);
    setIsCountingDown(true);
    setCountdown(5);
  };

  const performRaffle = async () => {
    setIsCountingDown(false);
    setIsRaffling(true);

    try {
      const response = await fetch('/api/admin/raffle', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        // Delay adicional para efeito dramático
        setTimeout(() => {
          setWinner(data.winner);
          setIsRaffling(false);
        }, 2000);
      } else {
        setError(data.error || 'Erro ao realizar sorteio');
        setIsRaffling(false);
      }
    } catch (error) {
      setError('Erro de conexão ao realizar sorteio');
      setIsRaffling(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Card - Apenas Total de Participantes */}
        <div className="grid grid-cols-1 max-w-sm mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-gray-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Participantes</p>
                <p className="text-2xl font-bold text-gray-900">{participants.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions - Sorteio e Atualizar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🎲 Ações do Sorteio</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            
            {/* Botão Principal do Sorteio */}
            <button
              onClick={startRaffle}
              disabled={isRaffling || isCountingDown || participants.length === 0}
              className="bg-linear-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isRaffling ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sorteando...</span>
                </>
              ) : isCountingDown ? (
                <>
                  <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center font-bold text-lg transition-transform ${
                    countdown <= 3 ? 'animate-pulse scale-110' : ''
                  }`}>
                    {countdown}
                  </div>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <span>Realizar Sorteio</span>
                </>
              )}
            </button>

            {/* Botão Atualizar - só aparece quando não está em contagem ou sorteando */}
            {!isCountingDown && !isRaffling && (
              <button
                onClick={fetchParticipants}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                <span>Atualizar</span>
              </button>
            )}
          </div>

          {/* Barra de progresso durante contagem */}
          {isCountingDown && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gray-800 h-2 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-600 mt-2">
                Sorteio em andamento...
              </p>
            </div>
          )}
        </div>

        {/* Winner Display */}
        {winner && (
          <div className="bg-linear-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-xl p-8 mb-8 shadow-lg">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">🏆</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Parabéns ao Ganhador!
              </h2>
              <div className="bg-white rounded-lg p-6 max-w-md mx-auto border border-gray-200 shadow-sm">
                <p className="text-2xl font-bold text-gray-900 mb-2">{winner.name}</p>
                <p className="text-gray-700 mb-1 flex items-center justify-center space-x-1">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>{winner.phone}</span>
                </p>
                <p className="text-sm text-gray-600 flex items-center justify-center space-x-1">
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>Cadastrado em: {new Date(winner.created_at!).toLocaleString('pt-BR')}</span>
                </p>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => setWinner(null)}
                  className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Fechar Resultado
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Participants Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">👥 Lista de Participantes</h2>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando participantes...</p>
              </div>
            ) : participants.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-gray-600">Nenhum participante encontrado</p>
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telefone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Cadastro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {participants.map((participant, index) => (
                    <tr key={participant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {participant.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(participant.created_at!).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Ativo
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
