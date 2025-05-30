import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SplashPage from "@/pages/splash";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import Home from "@/pages/home";
import Explore from "@/pages/explore";
import UmkmPage from "@/pages/umkm";
import RegisterUmkmPage from './pages/register-umkm';
import SettingsPage from './pages/settings';
import Profile from "@/pages/profile";
import DetailPage from "@/pages/detail";
import NotFound from "@/pages/not-found";

// Protected Route Component
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  
  if (!isLoggedIn) {
    window.location.href = "/login";
    return null;
  }
  
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/splash" component={SplashPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/" component={() => <ProtectedRoute component={Home} />} />
      <Route path="/explore" component={() => <ProtectedRoute component={Explore} />} />
      <Route path="/detail/:id" component={() => <ProtectedRoute component={DetailPage} />} />
      <Route path="/umkm" component={() => <ProtectedRoute component={UmkmPage} />} />
      <Route path="/register-umkm" component={() => <ProtectedRoute component={RegisterUmkmPage} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={Profile} />} />
      <Route path="/settings" component={() => <ProtectedRoute component={SettingsPage} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Check if app should show splash screen
  const shouldShowSplash = !window.location.pathname.includes('/login') && 
                          !window.location.pathname.includes('/register') &&
                          !localStorage.getItem('hasSeenSplash');

  if (shouldShowSplash) {
    localStorage.setItem('hasSeenSplash', 'true');
    window.location.href = '/splash';
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;