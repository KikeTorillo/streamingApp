// App.jsx - Optimizado con Route-Based Code Splitting
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Providers optimizados
import { CoreProviders } from "./providers/CoreProviders";
import { AdminProviders } from "./providers/AdminProviders";

// Componentes de rutas
import { AdminRoutes } from "./routes/AdminRoutes";
import { PublicRoutes } from "./routes/PublicRoutes";

import "./App.css";

/**
 * App - Componente principal optimizado
 * 
 * Estructura:
 * - CoreProviders: Contextos esenciales (Theme, Auth, Alert) - Siempre activos
 * - AdminProviders: Contextos administrativos - Solo en rutas /admin/*
 * - PublicRoutes: Rutas públicas sin contextos admin
 * - AdminRoutes: Rutas administrativas con todos los contextos
 */

function App() {
  return (
    <CoreProviders>
      <BrowserRouter>
        <Routes>
          {/* Rutas administrativas con AdminProviders */}
          <Route 
            path="/admin/*" 
            element={
              <AdminProviders>
                <AdminRoutes />
              </AdminProviders>
            } 
          />
          
          {/* Rutas públicas solo con CoreProviders */}
          <Route path="/*" element={<PublicRoutes />} />
        </Routes>
      </BrowserRouter>
    </CoreProviders>
  );
}

export { App };