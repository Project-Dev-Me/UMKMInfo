
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import LoadingScreen from "@/components/loading-screen";
import { db } from "@/lib/supabase";

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      alert("Harap lengkapi semua field");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Password dan konfirmasi password tidak sama");
      return;
    }

    if (!agreeToTerms) {
      alert("Harap setujui Syarat & Ketentuan");
      return;
    }

    setIsLoading(true);

    try {
      // Try to register with Supabase
      const { user } = await db.signUp(formData.email, formData.password, {
        full_name: formData.fullName
      });
      
      if (user) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("userName", formData.fullName);
        localStorage.setItem("userId", user.id);
        setLocation("/");
      }
    } catch (error) {
      console.log("Register error, using demo mode:", error);
      // Fallback to demo mode
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("userName", formData.fullName);
      localStorage.setItem("userId", "demo-user");
      setLocation("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", "user@gmail.com");
    localStorage.setItem("userName", "Google User");
    setLocation("/");
  };

  const handleAppleRegister = () => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", "user@icloud.com");
    localStorage.setItem("userName", "Apple User");
    setLocation("/");
  };

  const handleLoginClick = () => {
    setLocation("/login");
  };

  // Show loading screen while registering
  if (isLoading) {
    return <LoadingScreen message="Mendaftarkan akun..." />;
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen px-6 py-8">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-full bg-gray-900 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
            <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900">
          <span className="text-yellow-600">UMKM</span>Info
        </h1>
      </div>

      {/* Register Form */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Buat Akun</h2>
          <p className="text-gray-600">Daftar untuk memulai usaha Anda</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-xl"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="email"
                placeholder="Masukkan email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-xl"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Buat password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full h-12 pl-12 pr-12 border border-gray-300 rounded-xl"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konfirmasi Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Konfirmasi password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="w-full h-12 pl-12 pr-12 border border-gray-300 rounded-xl"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              Saya menyetujui{" "}
              <button type="button" className="text-blue-600 hover:underline">
                Syarat & Ketentuan
              </button>{" "}
              yang berlaku
            </label>
          </div>

          {/* Register Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
          >
            Daftar Sekarang
          </Button>
        </form>

        {/* Divider */}
        <div className="text-center text-gray-500">
          Atau daftar dengan
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleRegister}
            className="h-12 border border-gray-300 rounded-xl font-medium flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleAppleRegister}
            className="h-12 border border-gray-300 rounded-xl font-medium flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <span>Apple</span>
          </Button>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <span className="text-gray-600">Sudah punya akun? </span>
          <button
            onClick={handleLoginClick}
            className="text-blue-600 font-medium hover:underline"
          >
            Masuk
          </button>
        </div>
      </div>
    </div>
  );
}
