'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { participantSchema, type ParticipantInput } from '@/lib/validations';

export default function RaffleForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [showInstagramSuccess, setShowInstagramSuccess] = useState(true);

  // Auto-hide Instagram success notification after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstagramSuccess(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ParticipantInput>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      instagram_followed: true // Já seguiu pelo gate
    }
  });

  const onSubmit = async (data: ParticipantInput) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage({
          type: 'success',
          message: result.message || 'Cadastro realizado com sucesso! 🎉'
        });
        reset();
      } else {
        setSubmitMessage({
          type: 'error',
          message: result.error || 'Erro ao realizar cadastro'
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        message: 'Erro de conexão. Tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-200">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sorteio Monalu
        </h1>
        <p className="text-gray-600">
          Você já segue nosso Instagram! <br />
          Agora complete seu cadastro:
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors bg-gray-50/50"
            placeholder="Digite seu nome completo"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            {...register('phone')}
            type="tel"
            id="phone"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors bg-gray-50/50"
            placeholder="(11) 99999-9999"
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Instagram Success Notification */}
        {showInstagramSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 transition-all duration-500">
            <div className="flex items-center space-x-3">
              <div className="shrink-0">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">
                  Instagram @monalu_oficial seguido!
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Agora você está participando do sorteio
                </p>
              </div>
            </div>
          </div>
        )}

        <input
          {...register('instagram_followed')}
          type="hidden"
          value="true"
        />

        {submitMessage && (
          <div className={`p-4 rounded-lg ${
            submitMessage.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              {submitMessage.type === 'success' ? (
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              <span className="text-sm">{submitMessage.message}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-linear-to-r from-gray-700 to-gray-800 text-white py-4 px-6 rounded-lg font-medium hover:from-gray-800 hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Cadastrando...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Participar do Sorteio</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-gray-500">
        Ao participar, você concorda com nossos termos e condições
      </div>
    </div>
  );
}
