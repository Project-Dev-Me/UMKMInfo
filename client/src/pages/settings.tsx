
import { useState } from "react";
import { ArrowLeft, Edit, Lock, Globe, Bell, HelpCircle, Smartphone, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";

export default function Settings() {
  const [, setLocation] = useLocation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("id");

  const handleBackClick = () => {
    window.history.back();
  };

  const handleEditProfile = () => {
    console.log("Edit Profile clicked");
  };

  const handleChangePassword = () => {
    console.log("Ganti Password clicked");
  };

  const handleAboutDeveloper = () => {
    console.log("Tentang Pengembang clicked");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    setLocation("/login");
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center border-b border-gray-100">
        <Button
          variant="ghost"
          size="icon"
          className="p-2 rounded-full hover:bg-gray-100 mr-4"
          onClick={handleBackClick}
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </Button>
        
        <h1 className="text-xl font-bold text-gray-900">Pengaturan</h1>
      </header>

      <div className="px-6 py-6 space-y-6">
        {/* Profile Section */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                  alt="Farid Slebew"
                />
                <AvatarFallback className="text-lg font-semibold">FS</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Farid Slebew</h3>
                <p className="text-sm text-gray-500">faridslebew@gmail.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Options */}
        <div className="space-y-3">
          {/* Edit Profile */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleEditProfile}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Edit className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="font-medium text-gray-900">Edit Profil</span>
                </div>
                <Edit className="w-4 h-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleChangePassword}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lock className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="font-medium text-gray-900">Ganti Password</span>
                </div>
                <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Globe className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="font-medium text-gray-900">Bahasa</span>
                </div>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-32 border-0 shadow-none focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">Bahasa Indonesia</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="font-medium text-gray-900">Notifikasi</span>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
            </CardContent>
          </Card>

          {/* About Developer */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleAboutDeveloper}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <HelpCircle className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="font-medium text-gray-900">Tentang Pengembang</span>
                </div>
                <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
              </div>
            </CardContent>
          </Card>

          {/* App Version */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Smartphone className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="font-medium text-gray-900">Versi Aplikasi</span>
                </div>
                <span className="text-sm text-gray-500">1.0.0</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Logout Button */}
        <div className="pt-6">
          <Button 
            variant="destructive" 
            className="w-full bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400 pt-6">
          © 2025 - UMKMinfo
        </div>
      </div>
    </div>
  );
}
