
import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = "Memuat..." }: LoadingScreenProps) {
  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 min-h-screen flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          {/* Outer Ring Animation */}
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-1 animate-spin">
            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
              {/* Inner Logo */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center animate-pulse">
                <svg className="w-12 h-12 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                  <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Pulsing Dots */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* App Name with Gradient */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold">
            <span className="text-yellow-400 drop-shadow-lg">UMKM</span>
            <span className="text-white drop-shadow-lg">Info</span>
          </h1>
          <p className="text-blue-100 text-sm mt-2 font-medium">Platform UMKM Terpercaya</p>
        </div>

        {/* Loading Animation */}
        <div className="mb-6">
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Loading Message */}
        <p className="text-white text-sm font-medium opacity-90">{message}</p>

        {/* Background Decorations */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-32 right-8 w-16 h-16 bg-orange-400 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-16 w-12 h-12 bg-blue-300 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
}
