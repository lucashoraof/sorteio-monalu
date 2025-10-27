'use client';

import { useParticipants } from '@/hooks/use-participants';

export default function ParticipantsList() {
  const { participants, isLoading, error } = useParticipants();

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">
          Erro ao carregar participantes. Tente recarregar a página.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          🏆 Participantes
        </h2>
        <div className="bg-linear-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {participants.length} inscritos
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : participants.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-gray-500 text-sm">
              Seja o primeiro a participar!
            </p>
          </div>
        ) : (
          participants.map((participant, index) => (
            <div
              key={participant.id}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-linear-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {participant.name}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(participant.created_at!).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="text-green-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          ))
        )}
      </div>

      {participants.length > 0 && (
        <div className="mt-4 text-center">
          <div className="text-xs text-gray-500 flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Atualização automática</span>
          </div>
        </div>
      )}
    </div>
  );
}
