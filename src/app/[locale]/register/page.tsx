"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const t = useTranslations("Auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setMessage({ text: t("registrationSuccess"), type: "success" });
        setTimeout(() => router.push("/login"), 1500);
      } else {
        const text = await res.text();
        let errorMessage = t("registrationFailed");
        try {
          const data = JSON.parse(text);
          errorMessage = data.error || errorMessage;
        } catch (e) {}
        setMessage({ text: errorMessage, type: "error" });
        setLoading(false);
      }
    } catch (err) {
      setMessage({ text: t("networkError"), type: "error" });
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-slate-50 py-12 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-900">{t("createAccountTitle")}</h1>
        
        {message.text && (
          <div className={`mb-4 p-3 rounded text-sm ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {message.text}
          </div>
        )}

        <input type="email" placeholder={t("emailPlaceholder")} required className="w-full mb-4 p-3 border rounded outline-none focus:ring-1 focus:ring-slate-400" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder={t("passwordPlaceholder")} required className="w-full mb-6 p-3 border rounded outline-none focus:ring-1 focus:ring-slate-400" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-3 rounded hover:bg-slate-800 transition disabled:opacity-50">
          {loading ? t("registeringBtn") : t("registerBtn")}
        </button>
      </form>
    </div>
  );
}