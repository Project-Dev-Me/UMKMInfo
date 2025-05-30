import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Explore from "@/pages/explore";
import UmkmPage from "@/pages/umkm";
import RegisterUmkmPage from "@/pages/register-umkm";
import Profile from "@/pages/profile";
import DetailPage from "@/pages/detail";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/detail/:id" component={DetailPage} />
      <Route path="/umkm" component={UmkmPage} />
      <Route path="/register-umkm" component={RegisterUmkmPage} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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