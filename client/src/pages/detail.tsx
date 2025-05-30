import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import type { UmkmBusiness } from "@shared/schema";

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const { data: business, isLoading } = useQuery<UmkmBusiness>({
    queryKey: ["/api/umkm", id],
    queryFn: async () => {
      const response = await fetch(`/api/umkm/${id}`);
      if (!response.ok) throw new Error("Failed to fetch business");
      return response.json();
    },
    enabled: !!id,
  });

  const handleBackClick = () => {
    window.history.back();
  };

  const handleShareClick = () => {
    console.log("Share business:", business?.name);
    // In real app, this would trigger share functionality
  };

  const getOwnerName = (businessName: string): string => {
    const ownerNames = {
      "Batik Sekar Arum": "Ibu dewi suryani",
      "Kopi Tuku Cita": "Bapak Andi Wijaya", 
      "Jahit Kreasi Nusantara": "Bapak Rudi Hartono",
      "Warung Sari Rasa": "Ibu Sari Rahayu",
      "Batik Keluarga": "Bapak Joko Susilo",
      "Butik Nusantara": "Ibu Maya Indira",
      "Kerajinan Sekar Arum": "Ibu dewi suryani",
      "Toko Kain Tradisional": "Bapak Agus Santoso",
      "Salon Kecantikan Sari": "Ibu Sari Kencana",
      "Kedai Kopi Nusantara": "Bapak Made Wirawan",
      "Bengkel Kayu Pak Joko": "Bapak Joko Widodo"
    };
    return ownerNames[businessName as keyof typeof ownerNames] || "Pemilik UMKM";
  };

  const getBusinessDescription = (business: UmkmBusiness): string => {
    const descriptions = {
      "Batik Sekar Arum": "Batik Sekar Arum adalah usaha keluarga yang telah berdiri sejak 2010. Kami menyediakan batik tulis dan cap berkualitas dengan harga terjangkau, mengusung motif khas Nusantara untuk segala kebutuhan busana.",
      "Kopi Tuku Cita": "Kedai kopi yang menyajikan kopi lokal dari berbagai daerah di Indonesia dengan citarasa otentik dan proses roasting yang sempurna.",
      "Jahit Kreasi Nusantara": "Menyediakan jasa jahit dan menjual pakaian custom dengan desain modern yang memadukan unsur tradisional Indonesia.",
      "Warung Sari Rasa": "Masakan Indonesia autentik dengan bumbu tradisional yang telah diwariskan turun temurun dalam keluarga.",
      "Batik Keluarga": "Batik tradisional dengan kualitas premium dan motif keluarga yang telah diproduksi selama puluhan tahun.",
      "Butik Nusantara": "Fashion modern dengan sentuhan tradisional Indonesia, menghadirkan busana berkualitas untuk berbagai acara.",
      "Kerajinan Sekar Arum": "Kerajinan tangan berkualitas dengan desain unik yang memadukan seni tradisional dengan sentuhan modern.",
      "Toko Kain Tradisional": "Kain tradisional Indonesia dengan kualitas terbaik dari berbagai daerah untuk kebutuhan busana tradisional.",
      "Salon Kecantikan Sari": "Layanan kecantikan profesional dengan harga terjangkau dan perawatan menggunakan produk berkualitas.",
      "Kedai Kopi Nusantara": "Kopi specialty Indonesia dengan cita rasa premium dan biji kopi pilihan dari petani lokal.",
      "Bengkel Kayu Pak Joko": "Furnitur kayu custom dengan kualitas premium dan desain yang dapat disesuaikan dengan kebutuhan pelanggan."
    };
    return descriptions[business.name as keyof typeof descriptions] || business.description || "Deskripsi usaha tidak tersedia";
  };

  const getCategoryBadge = (category: string): string => {
    const categoryLabels = {
      "fashion": "Toko fashion",
      "makanan": "Toko makanan",
      "kerajinan": "Toko kerajinan",
      "jasa": "Layanan jasa"
    };
    return categoryLabels[category as keyof typeof categoryLabels] || category;
  };

  const getProducts = (businessName: string) => {
    const products = {
      "Batik Sekar Arum": [
        {
          id: 1,
          name: "Batik Pria",
          image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        },
        {
          id: 2,
          name: "Makanan Ringan",
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        }
      ]
    };
    return products[businessName as keyof typeof products] || [];
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200"></div>
          <div className="p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">UMKM tidak ditemukan</h2>
          <Button onClick={handleBackClick} variant="outline">
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      {/* Header */}
      <div className="relative">
        <img
          src={business.featuredImage || business.image}
          alt={business.name}
          className="w-full h-64 object-cover"
        />
        
        {/* Header Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Button
            variant="secondary"
            size="icon"
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white"
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-5 w-5 text-gray-900" />
          </Button>
          
          <h1 className="text-lg font-semibold text-white bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
            Detail UMKM
          </h1>
          
          <Button
            variant="secondary"
            size="icon"
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white"
            onClick={handleShareClick}
          >
            <Share2 className="h-5 w-5 text-gray-900" />
          </Button>
        </div>

        {/* Profile Section */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <Avatar className="w-24 h-24 border-4 border-white">
            <AvatarImage 
              src={business.image} 
              alt={getOwnerName(business.name)}
            />
            <AvatarFallback className="text-lg">
              {getOwnerName(business.name).split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Business Info */}
      <div className="pt-16 px-6 pb-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{business.name}</h2>
          <p className="text-gray-600 mb-4">Dikelola oleh: {getOwnerName(business.name)}</p>
          
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
            {getCategoryBadge(business.category)}
          </Badge>
        </div>

        {/* Description */}
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed">
            {getBusinessDescription(business)}
          </p>
        </div>

        {/* Products Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Produk Kami</h3>
          <div className="grid grid-cols-2 gap-4">
            {getProducts(business.name).map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover"
                />
                <CardContent className="p-3">
                  <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Business Details */}
        <Card className="bg-gray-50">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Rating:</span>
              <span className="font-medium">{business.rating} ⭐ ({business.reviewCount} ulasan)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Lokasi:</span>
              <span className="font-medium">{business.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kategori:</span>
              <span className="font-medium capitalize">{business.category}</span>
            </div>
            {business.contact && (
              <div className="flex justify-between">
                <span className="text-gray-600">Kontak:</span>
                <span className="font-medium">{business.contact}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <Button className="w-full bg-primary hover:bg-primary/90 text-white">
            Hubungi Penjual
          </Button>
          <Button variant="outline" className="w-full">
            Simpan ke Favorit
          </Button>
        </div>
      </div>
    </div>
  );
}