import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UmkmCard from "@/components/umkm-card";
import BottomNavigation from "@/components/bottom-navigation";
import LoadingScreen from "@/components/loading-screen";
import type { UmkmBusiness } from "@shared/schema";

const categories = [
  { id: "semua", label: "Semua" },
  { id: "makanan", label: "Makanan" },
  { id: "fashion", label: "Fashion" },
  { id: "jasa", label: "Jasa" },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  const { data: popularUmkm = [], isLoading: isLoadingPopular } = useQuery<UmkmBusiness[]>({
    queryKey: ["/api/umkm/popular"],
  });

  const { data: latestUmkm = [], isLoading: isLoadingLatest } = useQuery<UmkmBusiness[]>({
    queryKey: ["/api/umkm/latest"],
  });

  // Show initial loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen on initial load
  if (initialLoading || (isLoadingPopular && isLoadingLatest)) {
    return <LoadingScreen message="Memuat data UMKM..." />;
  }

  const handleNotificationClick = () => {
    console.log("Notifications clicked");
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const filteredPopular = activeCategory === "semua" 
    ? popularUmkm 
    : popularUmkm.filter(business => business.category === activeCategory);

  const filteredLatest = activeCategory === "semua" 
    ? latestUmkm 
    : latestUmkm.filter(business => business.category === activeCategory);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">UMKM Info</h1>
        <Button
          variant="ghost"
          size="icon"
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={handleNotificationClick}
        >
          <Bell className="h-6 w-6 text-gray-600" />
        </Button>
      </header>

      {/* Search Bar */}
      <div className="px-6 py-4">
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

      {/* Category Tabs */}
      <div className="px-6 pb-4">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
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
      </div>

      {/* Main Content */}
      <div className="px-6 pb-24 space-y-6">
        {/* Popular Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">UMKM Popular</h2>
          {isLoadingPopular ? (
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-none w-72 bg-gray-200 rounded-xl h-24 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
              {filteredPopular.map((business) => (
                <UmkmCard
                  key={business.id}
                  business={business}
                  variant="horizontal"
                  className="flex-none w-72"
                />
              ))}
            </div>
          )}
        </section>

        {/* Latest Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">UMKM Terbaru</h2>
          {isLoadingLatest ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLatest.map((business) => (
                <UmkmCard
                  key={business.id}
                  business={business}
                  variant="vertical"
                  showBookmark={true}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="beranda" />
    </div>
  );
}
