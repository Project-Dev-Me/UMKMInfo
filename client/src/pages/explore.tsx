import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import BottomNavigation from "@/components/bottom-navigation";
import type { UmkmBusiness } from "@shared/schema";

const categories = [
  { id: "semua", label: "Semua" },
  { id: "makanan", label: "Makanan" },
  { id: "fashion", label: "Fashion" },
  { id: "kerajinan", label: "Kerajinan" },
];

const sortOptions = [
  { id: "terdekat", label: "Terdekat" },
  { id: "populer", label: "Populer" },
  { id: "terbaru", label: "Terbaru" },
  { id: "diskon", label: "Diskon" },
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("semua");
  const [activeSort, setActiveSort] = useState("terdekat");
  const [, setLocation] = useLocation();

  const { data: businesses = [], isLoading } = useQuery<UmkmBusiness[]>({
    queryKey: ["/api/umkm", activeCategory, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeCategory && activeCategory !== "semua") {
        params.append("category", activeCategory);
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      
      const response = await fetch(`/api/umkm?${params}`);
      if (!response.ok) throw new Error("Failed to fetch businesses");
      return response.json();
    },
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const getOwnerName = (businessName: string): string => {
    const ownerNames = {
      "Batik Sekar Arum": "Ibu Dewi Suryani",
      "Kopi Tuku Cita": "Bapak Andi Wijaya", 
      "Jahit Kreasi Nusantara": "Bapak Rudi Hartono",
      "Warung Sari Rasa": "Ibu Sari Rahayu",
      "Batik Keluarga": "Bapak Joko Susilo",
      "Butik Nusantara": "Ibu Maya Indira",
      "Kerajinan Sekar Arum": "Ibu Dewi Suryani",
      "Toko Kain Tradisional": "Bapak Agus Santoso",
      "Salon Kecantikan Sari": "Ibu Sari Kencana",
      "Kedai Kopi Nusantara": "Bapak Made Wirawan",
      "Bengkel Kayu Pak Joko": "Bapak Joko Widodo"
    };
    return ownerNames[businessName as keyof typeof ownerNames] || "Pemilik UMKM";
  };

  const getBusinessDescription = (business: UmkmBusiness): string => {
    const descriptions = {
      "Batik Sekar Arum": "Menjual berbagai macam batik tradisional dengan motif khas...",
      "Kopi Tuku Cita": "Kedai kopi yang menyajikan kopi lokal dari berbagai daerah di...",
      "Jahit Kreasi Nusantara": "Menyediakan jasa jahit dan menjual pakaian custom dengan desain...",
      "Warung Sari Rasa": "Masakan Indonesia autentik dengan bumbu tradisional...",
      "Batik Keluarga": "Batik tradisional dengan kualitas premium dan motif keluarga...",
      "Butik Nusantara": "Fashion modern dengan sentuhan tradisional Indonesia...",
      "Kerajinan Sekar Arum": "Kerajinan tangan berkualitas dengan desain unik...",
      "Toko Kain Tradisional": "Kain tradisional Indonesia dengan kualitas terbaik...",
      "Salon Kecantikan Sari": "Layanan kecantikan profesional dengan harga terjangkau...",
      "Kedai Kopi Nusantara": "Kopi specialty Indonesia dengan cita rasa premium...",
      "Bengkel Kayu Pak Joko": "Furnitur kayu custom dengan kualitas premium..."
    };
    return descriptions[business.name as keyof typeof descriptions] || business.description || "Deskripsi usaha tidak tersedia";
  };

  const [, setLocation] = useLocation();

  const handleCardClick = (business: UmkmBusiness) => {
    console.log("Opening detail page for:", business.name);
    setLocation(`/detail/${business.id}`);
  };

  const handleDetailClick = (e: React.MouseEvent, business: UmkmBusiness) => {
    e.stopPropagation();
    console.log("Lihat Detail clicked for:", business.name);
    setLocation(`/detail/${business.id}`);
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      {/* Search Bar */}
      <div className="px-6 py-4 bg-white border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Cari UMKM..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-12 pr-4 py-3 bg-gray-100 rounded-full border-0 focus:ring-2 focus:ring-primary focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide mb-3">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "secondary"}
              size="sm"
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                activeCategory === category.id
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {sortOptions.map((option) => (
            <Button
              key={option.id}
              variant={activeSort === option.id ? "default" : "secondary"}
              size="sm"
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                activeSort === option.id
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setActiveSort(option.id)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Business List */}
      <div className="px-6 py-4 pb-24 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {businesses.map((business) => (
              <Card 
                key={business.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleCardClick(business)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarImage 
                        src={business.image} 
                        alt={getOwnerName(business.name)}
                      />
                      <AvatarFallback>
                        {getOwnerName(business.name).split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">
                            {business.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {getOwnerName(business.name)}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {getBusinessDescription(business)}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-400">
                          {business.location} • {business.category}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="px-4 py-2 text-primary border-primary hover:bg-primary hover:text-white"
                          onClick={(e) => handleDetailClick(e, business)}
                        >
                          Lihat Detail
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="jelajah" />
    </div>
  );
}