import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Configura a fonte "Geist" (sans-serif) para ser usada em toda a aplicação
// variable: "--font-geist-sans" - Define uma variável CSS que pode ser usada nos estilos
// subsets: ["latin"] - Carrega apenas subconjunto de caracteres latinos (otimização)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Configura a fonte "Geist Mono" (monospace) para código e elementos especiais
// variable: "--font-geist-mono" - Define uma variável CSS para fontes monospace
// subsets: ["latin"] - Carrega apenas subconjunto latino
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Exporta os metadados da página (SEO - Search Engine Optimization)
// Estes dados aparecem nos resultados de busca e ao compartilhar a página
export const metadata: Metadata = {
  // title: Título que aparece na aba do navegador e nos resultados de busca
  title: "Task Manager API",
  // description: Descrição da página que aparece nos resultados de busca
  description:
    "Gerencie suas tarefas de forma simples e eficiente com a Task Manager API. Crie, atualize e exclua tarefas facilmente.",
};

// RootLayout: Componente principal que envolve TODAS as páginas da aplicação
// Este é o layout raiz do Next.js - define a estrutura HTML comum
// Parâmetro: { children } - Componentes/páginas filhas que serão renderizadas dentro deste layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Tag HTML raiz com idioma "en" (inglês)
    <html lang="en">
      <body
        // className: Aplica as variáveis de fonte (--font-geist-sans e --font-geist-mono) e antialiased (suaviza texto)
        // ${geistSans.variable}: Injeta a variável CSS da fonte sem-serif
        // ${geistMono.variable}: Injeta a variável CSS da fonte monospace
        // antialiased: Classe que suaviza as bordas das letras para melhor legibilidade
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* children: Renderiza o conteúdo das páginas filhas dentro deste layout */}
        {children}
      </body>
    </html>
  );
}
