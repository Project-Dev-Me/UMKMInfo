
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Share2, Star, MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { useState } from "react";
import type { UmkmBusiness } from "@shared/schema";

interface Review {
  id: number;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  date: string;
}

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const queryClient = useQueryClient();

  const { data: business, isLoading } = useQuery<UmkmBusiness>({
    queryKey: ["/api/umkm", id],
    queryFn: async () => {
      const response = await fetch(`/api/umkm/${id}`);
      if (!response.ok) throw new Error("Failed to fetch business");
      return response.json();
    },
    enabled: !!id,
  });

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/reviews", id],
    queryFn: async () => {
      // Mock data for now - in real app this would fetch from API
      return [
        {
          id: 1,
          userName: "Ahmad",
          userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          rating: 5,
          comment: "Produk sangat memuaskan, kualitas bagus, packaging rapi dan pengiriman cepat. Sangat recommended!",
          date: "2024-01-15"
        },
        {
          id: 2,
          userName: "Siti",
          userImage: "https://images.unsplash.com/photo-1494790108755-2616b332c2cb?w=100&h=100&fit=crop&crop=face",
          rating: 4,
          comment: "Batik motif tradisional yang sangat cantik. Kualitas kain bagus dan nyaman dipakai.",
          date: "2024-01-10"
        },
        {
          id: 3,
          userName: "Budi",
          userImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          rating: 5,
          comment: "Pelayanan ramah, harga terjangkau dan kualitas produk bagus. Terima kasih!",
          date: "2024-01-08"
        },
        {
          id: 4,
          userName: "Maya",
          userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
          rating: 4,
          comment: "Designnya unik dan berkualitas. Sangat puas dengan pembelian ini.",
          date: "2024-01-05"
        }
      ];
    },
    enabled: !!id,
  });

  const addReviewMutation = useMutation({
    mutationFn: async (reviewData: { rating: number; comment: string }) => {
      // Mock API call - in real app this would POST to server
      const newReview: Review = {
        id: Date.now(),
        userName: "Anda",
        rating: reviewData.rating,
        comment: reviewData.comment,
        date: new Date().toISOString().split('T')[0]
      };
      return newReview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews", id] });
      setNewReview("");
      setNewRating(5);
    },
  });

  const handleBackClick = () => {
    window.history.back();
  };

  const handleShareClick = () => {
    console.log("Share business:", business?.name);
  };

  const handleSubmitReview = () => {
    if (newReview.trim()) {
      addReviewMutation.mutate({
        rating: newRating,
        comment: newReview.trim()
      });
    }
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
      "Jahit Kreasi Nusantara": "Menyediakan jasa jahit dan menjual pakaian custom dengan design modern yang memadukan unsur tradisional Indonesia.",
      "Warung Sari Rasa": "Masakan Indonesia autentik dengan bumbu tradisional yang telah diwariskan turun temurun dalam keluarga.",
      "Batik Keluarga": "Batik tradisional dengan kualitas premium dan motif keluarga yang telah diproduksi selama puluhan tahun.",
      "Butik Nusantara": "Fashion modern dengan sentuhan tradisional Indonesia, menghadirkan busana berkualitas untuk berbagai acara.",
      "Kerajinan Sekar Arum": "Kerajinan tangan berkualitas dengan design unik yang memadukan seni tradisional dengan sentuhan modern.",
      "Toko Kain Tradisional": "Kain tradisional Indonesia dengan kualitas terbaik dari berbagai daerah untuk kebutuhan busana tradisional.",
      "Salon Kecantikan Sari": "Layanan kecantikan profesional dengan harga terjangkau dan perawatan menggunakan produk berkualitas.",
      "Kedai Kopi Nusantara": "Kopi specialty Indonesia dengan cita rasa premium dan biji kopi pilihan dari petani lokal.",
      "Bengkel Kayu Pak Joko": "Furnitur kayu custom dengan kualitas premium dan design yang dapat disesuaikan dengan kebutuhan pelanggan."
    };
    return descriptions[business.name as keyof typeof descriptions] || business.description || "Deskripsi usaha tidak tersedia";
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

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={interactive ? () => onRatingChange?.(star) : undefined}
          />
        ))}
      </div>
    );
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
            Toko batik
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

        {/* Contact Buttons */}
        <div className="mb-6 space-y-3">
          <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat WhatsApp
          </Button>
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            <Phone className="w-4 h-4 mr-2" />
            Telepon
          </Button>
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
        </div>

        {/* Location */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Lokasi Kami</h3>
          <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center mb-3">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 text-sm flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Jl. Sukarno Hatta No. 123, Kota, Indonesia
          </p>
        </div>

        {/* Reviews Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Ulasan Pelanggan</h3>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-orange-500">4.8</span>
              {renderStars(5)}
            </div>
          </div>

          {/* Add Review Form */}
          <Card className="mb-4 bg-gray-50">
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-900 mb-3">Tulis Ulasan Anda</h4>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                {renderStars(newRating, true, setNewRating)}
              </div>
              <Textarea
                placeholder="Bagikan pengalaman Anda dengan UMKM ini..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className="mb-3"
                rows={3}
              />
              <Button 
                onClick={handleSubmitReview}
                disabled={!newReview.trim() || addReviewMutation.isPending}
                className="w-full"
              >
                {addReviewMutation.isPending ? "Mengirim..." : "Kirim Ulasan"}
              </Button>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={review.userImage} alt={review.userName} />
                      <AvatarFallback>
                        {review.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{review.userName}</h5>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            Pelajari Profil UMKM
          </Button>
        </div>
      </div>
    </div>
  );
}
