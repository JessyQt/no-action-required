import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Documentation() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center animate-fade-in">
        Documentación de Accesibilidad Web
      </h1>

      <Tabs defaultValue="about" className="space-y-8">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="about">Acerca de</TabsTrigger>
          <TabsTrigger value="wcag">WCAG</TabsTrigger>
          <TabsTrigger value="scoring">Sistema de Puntuación</TabsTrigger>
          <TabsTrigger value="levels">Niveles de Conformidad</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Propósito de la Aplicación</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="mb-4">
                Esta aplicación web está diseñada para ayudar a desarrolladores y diseñadores a crear sitios web más accesibles mediante la evaluación automática de problemas de accesibilidad y la provisión de recomendaciones específicas basadas en las pautas WCAG (Web Content Accessibility Guidelines).
              </p>
              <p>
                La importancia de implementar WCAG en nuestros proyectos radica en:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Garantizar que todas las personas, independientemente de sus capacidades, puedan acceder y utilizar el contenido web.</li>
                <li>Cumplir con regulaciones y estándares internacionales de accesibilidad.</li>
                <li>Mejorar la experiencia de usuario para todos los visitantes.</li>
                <li>Aumentar el alcance y la visibilidad del contenido web.</li>
                <li>Reducir riesgos legales relacionados con la discriminación digital.</li>
              </ul>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="wcag" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">¿Qué es WCAG?</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="mb-4">
                WCAG (Web Content Accessibility Guidelines) son las pautas de accesibilidad para el contenido web desarrolladas por el W3C (World Wide Web Consortium). Estas pautas proporcionan un estándar internacional para hacer que el contenido web sea más accesible para personas con discapacidades.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">Principios Fundamentales</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Perceptible:</strong> La información debe ser presentada de manera que los usuarios puedan percibirla.</li>
                <li><strong>Operable:</strong> Los componentes de la interfaz deben ser operables por cualquier usuario.</li>
                <li><strong>Comprensible:</strong> La información y el funcionamiento de la interfaz deben ser comprensibles.</li>
                <li><strong>Robusto:</strong> El contenido debe ser suficientemente robusto para funcionar con diferentes tecnologías asistivas.</li>
              </ul>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="scoring" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Sistema de Puntuación</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="mb-4">
                Nuestro sistema de puntuación evalúa la accesibilidad de un sitio web en una escala de 0 a 100, donde 100 representa una conformidad perfecta con las pautas WCAG.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">Cálculo de la Puntuación</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Puntuación Base:</strong> 100 puntos</li>
                <li><strong>Penalizaciones:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Errores de severidad alta: -5 puntos cada uno</li>
                    <li>Errores de severidad media: -3 puntos cada uno</li>
                    <li>Errores de severidad baja: -1 punto cada uno</li>
                  </ul>
                </li>
              </ul>
              <p className="mt-4">
                La puntuación final refleja la calidad general de la accesibilidad del sitio y ayuda a identificar áreas de mejora prioritarias.
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="levels" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Niveles de Conformidad WCAG</h2>
            <div className="prose dark:prose-invert max-w-none">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Nivel A (Básico)</h3>
                  <p>
                    Nivel mínimo de accesibilidad. Aborda las barreras más significativas que impiden el acceso a contenido web.
                    Puntuación requerida: 70-79
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Nivel AA (Intermedio)</h3>
                  <p>
                    Nivel intermedio que aborda barreras significativas adicionales. Es el nivel comúnmente requerido por organizaciones y gobiernos.
                    Puntuación requerida: 80-89
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Nivel AAA (Avanzado)</h3>
                  <p>
                    El nivel más alto de accesibilidad web. Proporciona mejoras adicionales para la accesibilidad.
                    Puntuación requerida: 90-100
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-3">Recomendaciones de Uso</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Para sitios web públicos: Apuntar al menos al nivel AA</li>
                    <li>Para aplicaciones gubernamentales: Requerido nivel AA</li>
                    <li>Para sitios especializados en accesibilidad: Considerar nivel AAA</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}