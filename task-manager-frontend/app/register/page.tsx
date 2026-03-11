"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/api";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authService.register(email, password);
      // Após registrar, faz login automaticamente
      await authService.login(email, password);
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error && "response" in err 
        ? (err.response as { data?: { message?: string } }).data?.message 
        : undefined;
      setError(
        msg === "Email já cadastrado"
          ? msg
          : "Erro ao criar conta. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow p-6 w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          🖊️ Criar Conta
        </h1>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400"
          />
          <input
            required
            type="password"
            placeholder="Senha (mínimo 6 caracteres)"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg py-2 text-sm font-medium transition"
          >
            {loading ? "Criando conta..." : "Criar Conta"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500">
          Já tem conta?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Faça login
          </Link>
        </p>
      </div>
    </main>
  );
}
