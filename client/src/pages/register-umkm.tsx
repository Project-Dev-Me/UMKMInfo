
import { useState } from "react";
import { ArrowLeft, Upload, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface UmkmFormData {
  name: string;
  category: string;
  description: string;
  location: string;
  contact: string;
  image: string;
}

export default function RegisterUmkmPage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<UmkmFormData>({
    name: "",
    category: "",
    description: "",
    location: "",
    contact: "",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop"
  });

  const registerMutation = useMutation({
    mutationFn: async (data: UmkmFormData) => {
      const response = await apiRequest("/api/umkm/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to register UMKM");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Save to localStorage to simulate user registration
      localStorage.setItem("userUmkm", JSON.stringify(data));
      queryClient.invalidateQueries({ queryKey: ["/api/umkm"] });
      setLocation("/umkm");
    },
  });

  const handleInputChange = (field: keyof UmkmFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.description || !formData.location || !formData.contact) {
      alert("Harap lengkapi semua field yang wajib diisi");
      return;
    }

    registerMutation.mutate(formData);
  };

  const handleBack = () => {
    setLocation("/umkm");
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center border-b border-gray-100">
        <Button
          variant="ghost"
          size="icon"
          className="p-2 rounded-full hover:bg-gray-100 mr-3"
          onClick={handleBack}
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </Button>
        <h1 className="text-xl font-bold text-gray-900">Daftarkan UMKM</h1>
      </header>

      {/* Form */}
      <div className="px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Foto UMKM */}
          <Card>
            <CardContent className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Foto UMKM
              </label>
              <div className="w-full h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Upload foto</p>
                  <p className="text-xs text-gray-400">JPG, PNG max 5MB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nama UMKM */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama UMKM <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Masukkan nama UMKM"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full"
              required
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori UMKM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="makanan">Makanan & Minuman</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="jasa">Jasa</SelectItem>
                <SelectItem value="kerajinan">Kerajinan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi UMKM <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Ceritakan tentang UMKM Anda..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full h-24"
              required
            />
          </div>

          {/* Lokasi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lokasi <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Alamat lengkap UMKM"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="pl-12"
                required
              />
            </div>
          </div>

          {/* Kontak */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor WhatsApp <span className="text-red-500">*</span>
            </label>
            <Input
              type="tel"
              placeholder="08xxxxxxxxxx"
              value={formData.contact}
              onChange={(e) => handleInputChange("contact", e.target.value)}
              className="w-full"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Mendaftarkan..." : "Daftarkan UMKM"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
