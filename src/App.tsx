import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Home, FileText, Accessibility } from "lucide-react";
import Index from "./pages/Index";
import Documentation from "./pages/Documentation";

const queryClient = new QueryClient();

function App() {
  return (
    <React.StrictMode>
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <div className="min-h-screen bg-background">
                <nav className="border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50">
                  <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                      <Link to="/" className="flex items-center gap-2 transition-colors hover:text-primary">
                        <Accessibility className="h-6 w-6 text-primary" />
                        <span className="font-semibold text-lg hidden sm:inline">Fuentes Accesibles</span>
                        <span className="font-semibold text-lg sm:hidden">WCAG</span>
                      </Link>
                      <div className="flex items-center space-x-4 sm:space-x-8">
                        <div className="flex space-x-3 sm:space-x-6">
                          <Link 
                            to="/" 
                            className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary p-2 rounded-md hover:bg-primary/10"
                          >
                            <Home className="h-4 w-4" />
                            <span className="hidden sm:inline">Inicio</span>
                          </Link>
                          <Link 
                            to="/documentation" 
                            className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary p-2 rounded-md hover:bg-primary/10"
                          >
                            <FileText className="h-4 w-4" />
                            <span className="hidden sm:inline">Documentos</span>
                          </Link>
                        </div>
                        <ThemeToggle />
                      </div>
                    </div>
                  </div>
                </nav>

                <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] flex flex-col">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/documentation" element={<Documentation />} />
                  </Routes>
                </main>

                <footer className="border-t py-6 bg-background/80 backdrop-blur-sm">
                  <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>© 2024 Accesibilidad Web. Todos los derechos reservados.</p>
                  </div>
                </footer>

                <Toaster />
                <Sonner />
              </div>
            </TooltipProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;