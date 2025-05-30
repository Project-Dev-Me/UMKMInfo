
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function SplashPage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    const timer = setTimeout(() => {
      if (isLoggedIn === "true") {
        setLocation("/");
      } else {
        setLocation("/login");
      }
    }, 2500); // Show splash for 2.5 seconds

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="max-w-md mx-auto bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="text-center">
        {/* Logo Circle */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                  <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* App Name */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            <span className="text-yellow-400">UMKM</span>
            <span className="text-white">Info</span>
          </h1>
        </div>

        {/* Loading Animation */}
        <div className="mt-8">
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
