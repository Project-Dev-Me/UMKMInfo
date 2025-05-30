import { useState } from "react";
import { Star, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import type { UmkmBusiness } from "@shared/schema";

interface UmkmCardProps {
  business: UmkmBusiness;
  variant: "horizontal" | "vertical";
  showBookmark?: boolean;
  className?: string;
}

export default function UmkmCard({ 
  business, 
  variant, 
  showBookmark = false, 
  className = "" 
}: UmkmCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const bookmarkMutation = useMutation({
    mutationFn: async (businessId: number) => {
      const response = await apiRequest("POST", "/api/bookmarks/toggle", {
        userId: 1, // Simplified - in real app would come from auth context
        businessId,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setIsBookmarked(data.bookmarked);
    },
  });

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    bookmarkMutation.mutate(business.id);
  };

  const handleCardClick = () => {
    console.log("Opening detail page for:", business.name);
    setLocation(`/detail/${business.id}`);
  };

  if (variant === "horizontal") {
    return (
      <Card 
        className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${className}`}
        onClick={handleCardClick}
      >
        <div className="flex">
          <img
            src={business.image}
            alt={business.name}
            className="w-20 h-20 object-cover"
            loading="lazy"
          />
          <CardContent className="flex-1 p-4">
            <h3 className="font-semibold text-gray-900 mb-1">{business.name}</h3>
            <p className="text-sm text-gray-500 mb-2 capitalize">{business.category}</p>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-900 ml-1">{business.rating}</span>
              <span className="text-sm text-gray-500 ml-1">({business.reviewCount}+ ulasan)</span>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${className}`}
      onClick={handleCardClick}
    >
      <img
        src={business.featuredImage || business.image}
        alt={business.name}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg mb-1">{business.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{business.category}</p>
          </div>
          {showBookmark && (
            <Button
              variant="ghost"
              size="icon"
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={handleBookmarkClick}
              disabled={bookmarkMutation.isPending}
            >
              <Bookmark 
                className={`w-5 h-5 ${
                  isBookmarked ? "text-primary fill-current" : "text-gray-400"
                }`} 
              />
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between">
          {business.isNewlyJoined && (
            <Badge className="bg-green-500 text-white hover:bg-green-600">
              Baru Bergabung
            </Badge>
          )}
          <div className="flex items-center space-x-1 ml-auto">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-900">{business.rating}</span>
            <span className="text-sm text-gray-500">({business.reviewCount} ulasan)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
