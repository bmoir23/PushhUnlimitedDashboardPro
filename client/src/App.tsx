import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Nexus from "@/pages/nexus";
import OneClickTools from "@/pages/one-click-tools";
import { ErrorBoundary } from "@/components/ui/error-boundary";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/nexus" component={Nexus} />
      <Route path="/one-click-tools" component={OneClickTools} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Router />
      </ErrorBoundary>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
