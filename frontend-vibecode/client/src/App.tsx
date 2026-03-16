import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import BoothEntry from "./pages/BoothEntry";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import AuditorQueue from "./pages/AuditorQueue";
import ProducerEvents from "./pages/ProducerEvents";
import StockQueue from "./pages/StockQueue";
import DeliveryAvailable from "./pages/DeliveryAvailable";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/booth-entry"} component={BoothEntry} />
      <Route path={"/login"} component={Home} />

      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/auditor/queue"} component={AuditorQueue} />
      <Route path={"/producer/events"} component={ProducerEvents} />
      <Route path={"/stock/queue"} component={StockQueue} />
      <Route path={"/delivery/available"} component={DeliveryAvailable} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
