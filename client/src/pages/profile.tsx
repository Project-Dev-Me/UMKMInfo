import { useState } from "react";
import { ArrowLeft, Settings, MapPin, TrendingUp, Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/bottom-navigation";
import { useLocation } from "wouter";

export default function Profile() {
  const [, setLocation] = useLocation();
  const [hasUmkm] = useState(true); // For demo, set to true to show profile with UMKM

  const handleBackClick = () => {
    window.history.back();
  };

  const handleSettingsClick = () => {
    console.log("Settings clicked");
  };

  const handleEditProfile = () => {
    console.log("Edit Profile clicked");
  };

  const handleShare = () => {
    console.log("Bagikan clicked");
  };

  const handleManageUmkm = () => {
    console.log("Kelola UMKM clicked");
  };

  const handleAddUmkm = () => {
    console.log("Tambah UMKM Baru clicked");
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <Button
          variant="ghost"
          size="icon"
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={handleBackClick}
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </Button>
        
        <h1 className="text-xl font-bold text-gray-900">Profil UMKM</h1>
        
        <Button
          variant="ghost"
          size="icon"
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={handleSettingsClick}
        >
          <Settings className="h-6 w-6 text-gray-600" />
        </Button>
      </header>

      {/* Profile Section */}
      <div className="px-6 py-6">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
              alt="Farid Slebew"
            />
            <AvatarFallback className="text-lg font-semibold">FS</AvatarFallback>
          </Avatar>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Farid Slebew</h2>
          <p className="text-gray-500 mb-2">@farid_slebew</p>
          
          <div className="flex items-center text-gray-500 mb-4">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">Jakarta, Indonesia</span>
          </div>

          <div className="flex space-x-3 w-full">
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 rounded-xl"
              onClick={handleEditProfile}
            >
              Edit Profil
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 py-2 rounded-xl"
              onClick={handleShare}
            >
              Bagikan
            </Button>
          </div>
        </div>

        {/* UMKM Information */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Informasi UMKM</h3>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                Terverifikasi
              </Badge>
            </div>

            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Warung Berkah</h4>
                <p className="text-sm text-gray-500">Makanan & Minuman</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Produk</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Data Penjualan</p>
                <p className="text-2xl font-bold text-gray-900">128</p>
              </div>
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl mb-3"
              onClick={handleManageUmkm}
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Kelola UMKM
            </Button>
          </CardContent>
        </Card>

        {/* Add New UMKM */}
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="p-4">
            <Button 
              variant="ghost" 
              className="w-full text-gray-600 hover:text-gray-900 py-6"
              onClick={handleAddUmkm}
            >
              <Plus className="w-5 h-5 mr-2" />
              Tambah UMKM Baru
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="profil" />
    </div>
  );
}