
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Harap lengkapi email dan password");
      return;
    }

    // Simple validation for demo
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    setLocation("/");
  };

  const handleGoogleLogin = () => {
    // Simulate Google login
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", "user@gmail.com");
    setLocation("/");
  };

  const handleRegisterClick = () => {
    setLocation("/register");
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen px-6 py-8">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto rounded-full bg-gray-900 flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
            <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          <span className="text-yellow-600">UMKM</span>Info
        </h1>
      </div>

      {/* Login Form */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Masuk ke Akun Anda
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              type="email"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-xl"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kata Sandi
            </label>
            <Input
              type="password"
              placeholder="Masukkan kata sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-xl"
              required
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Ingat Saya
              </label>
            </div>
            <button type="button" className="text-sm text-blue-600 hover:underline">
              Lupa Kata Sandi?
            </button>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
          >
            Masuk
          </Button>
        </form>

        {/* Google Login */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          className="w-full h-12 border border-gray-300 rounded-xl font-medium flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Masuk dengan Google</span>
        </Button>

        {/* Register Link */}
        <div className="text-center">
          <span className="text-gray-600">Belum punya akun? </span>
          <button
            onClick={handleRegisterClick}
            className="text-blue-600 font-medium hover:underline"
          >
            Daftar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
