'use client';

import { useInstagramFollow } from '@/hooks/use-instagram-follow';

interface InstagramFollowGateProps {
  children: React.ReactNode;
}

export default function InstagramFollowGate({ children }: InstagramFollowGateProps) {
  const { isFormUnlocked, hasOpenedInstagram, openInstagram } = useInstagramFollow();

  if (!isFormUnlocked) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎉 Sorteio Monalu
          </h1>
          <p className="text-gray-600">
            Para participar, você precisa seguir nosso Instagram!
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-linear-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Siga @monalu_oficial
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Clique no botão abaixo para seguir nosso Instagram. 
                Após seguir, volte para esta aba para desbloquear o formulário.
              </p>
            </div>
          </div>

          <button
            onClick={openInstagram}
            className="w-full bg-linear-to-r from-gray-700 to-gray-800 text-white py-4 px-6 rounded-lg font-medium hover:from-gray-800 hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>Seguir @monalu_oficial</span>
          </button>

          {hasOpenedInstagram && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="text-blue-500 mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-blue-800 font-medium">
                    Após seguir no Instagram
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Volte para esta aba que o formulário será liberado automaticamente
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
