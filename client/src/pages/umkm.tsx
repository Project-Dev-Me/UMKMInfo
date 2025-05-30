import { useState } from "react";
import { Store, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/bottom-navigation";

export default function UmkmPage() {
  const [hasUmkm] = useState(false); // For demo, set to false to show "not registered" state

  const handleRegisterUmkm = () => {
    console.log("Daftarkan UMKM clicked");
    // In real app, this would navigate to registration form
  };

  if (!hasUmkm) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        {/* Header */}
        <header className="bg-white px-6 py-4 text-center border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">UMKM Saya</h1>
        </header>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center px-6 py-16 min-h-[60vh]">
          {/* Icon placeholder */}
          <div className="relative mb-8">
            <div className="w-32 h-32 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center">
              <Store className="w-12 h-12 text-gray-400" />
            </div>
            {/* X marks around the circle */}
            <div className="absolute -top-2 -left-2 text-gray-300 text-2xl font-bold">×</div>
            <div className="absolute -top-2 -right-2 text-gray-300 text-2xl font-bold">×</div>
            <div className="absolute -bottom-2 -left-2 text-gray-300 text-2xl font-bold">×</div>
            <div className="absolute -bottom-2 -right-2 text-gray-300 text-2xl font-bold">×</div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Belum Ada UMKM Terdaftar
          </h2>
          
          <p className="text-gray-600 text-center mb-8 leading-relaxed max-w-xs">
            Anda belum mendaftarkan UMKM. Daftarkan UMKM Anda sekarang untuk mulai memasarkan produk!
          </p>

          <Button 
            className="w-full max-w-xs bg-primary hover:bg-primary/90 text-white py-3 rounded-xl"
            onClick={handleRegisterUmkm}
          >
            <Plus className="w-5 h-5 mr-2" />
            Daftarkan UMKM Anda
          </Button>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab="umkm" />
      </div>
    );
  }

  // This would be shown if user has registered UMKM
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      {/* Header */}
      <header className="bg-white px-6 py-4 text-center border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">UMKM Saya</h1>
      </header>

      {/* UMKM Management Content would go here */}
      <div className="px-6 py-8">
        <p className="text-center text-gray-600">
          Halaman manajemen UMKM akan ditampilkan di sini setelah user mendaftar.
        </p>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="umkm" />
    </div>
  );
}