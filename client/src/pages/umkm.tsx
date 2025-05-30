
import { useState, useEffect } from "react";
import { Store, Plus, Settings, BarChart3, Package, Eye, Edit, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/bottom-navigation";
import { useLocation } from "wouter";

interface UserUmkm {
  id: number;
  name: string;
  category: string;
  description: string;
  rating: number;
  reviewCount: number;
  image: string;
  location: string;
  contact: string;
  totalProducts: number;
  totalSales: number;
  status: string;
}

export default function UmkmPage() {
  const [, setLocation] = useLocation();
  const [userUmkm, setUserUmkm] = useState<UserUmkm | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate checking if user has registered UMKM
  useEffect(() => {
    // Check localStorage for registered UMKM
    const savedUmkm = localStorage.getItem("userUmkm");
    if (savedUmkm) {
      setUserUmkm(JSON.parse(savedUmkm));
    }
    setIsLoading(false);
  }, []);

  const handleRegisterUmkm = () => {
    setLocation("/register-umkm");
  };

  const handleEditUmkm = () => {
    console.log("Edit UMKM clicked");
    // Navigate to edit form
  };

  const handleViewProducts = () => {
    console.log("View products clicked");
    // Navigate to products management
  };

  const handleViewAnalytics = () => {
    console.log("View analytics clicked");
    // Navigate to analytics dashboard
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        <header className="bg-white px-6 py-4 text-center border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">UMKM Saya</h1>
        </header>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-2">Memuat...</p>
          </div>
        </div>
        <BottomNavigation activeTab="umkm" />
      </div>
    );
  }

  if (!userUmkm) {
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

  // UMKM Management Dashboard
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      {/* Header */}
      <header className="bg-white px-6 py-4 text-center border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">UMKM Saya</h1>
      </header>

      <div className="px-6 py-6 space-y-6">
        {/* UMKM Info Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <img
                src={userUmkm.image}
                alt={userUmkm.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{userUmkm.name}</h3>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    {userUmkm.status === "active" ? "Aktif" : "Pending"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{userUmkm.category}</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{userUmkm.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({userUmkm.reviewCount})</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              onClick={handleEditUmkm}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profil UMKM
            </Button>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{userUmkm.totalProducts}</p>
              <p className="text-sm text-gray-600">Produk</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{userUmkm.totalSales}</p>
              <p className="text-sm text-gray-600">Penjualan</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Options */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Kelola UMKM</h4>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleViewProducts}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="w-6 h-6 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Kelola Produk</p>
                    <p className="text-sm text-gray-600">Tambah, edit, atau hapus produk</p>
                  </div>
                </div>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleViewAnalytics}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart3 className="w-6 h-6 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Analitik & Laporan</p>
                    <p className="text-sm text-gray-600">Lihat performa UMKM Anda</p>
                  </div>
                </div>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Settings className="w-6 h-6 text-gray-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Pengaturan</p>
                    <p className="text-sm text-gray-600">Atur profil dan preferensi</p>
                  </div>
                </div>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="umkm" />
    </div>
  );
}
