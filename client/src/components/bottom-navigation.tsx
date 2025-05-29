import { Home, Compass, Store, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

const navItems = [
  { id: "beranda", icon: Home, label: "Beranda" },
  { id: "jelajah", icon: Compass, label: "Jelajah" },
  { id: "umkm", icon: Store, label: "UMKM" },
  { id: "profil", icon: User, label: "Profil" },
];

export default function BottomNavigation({ 
  activeTab, 
  onTabChange 
}: BottomNavigationProps) {
  const [, setLocation] = useLocation();

  const handleTabClick = (tabId: string) => {
    console.log("Navigation to:", tabId);
    
    // Navigate to the appropriate route
    switch (tabId) {
      case "beranda":
        setLocation("/");
        break;
      case "jelajah":
        setLocation("/explore");
        break;
      case "umkm":
        console.log("UMKM page not implemented yet");
        break;
      case "profil":
        console.log("Profile page not implemented yet");
        break;
    }
    
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col items-center p-3 space-y-1 ${
                isActive 
                  ? "text-primary" 
                  : "text-gray-400 hover:text-primary"
              }`}
              onClick={() => handleTabClick(item.id)}
            >
              <IconComponent className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
