"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("Auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setErrorMsg(t("invalidCredentials"));
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-slate-50 py-12 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-900">{t("signInTitle")}</h1>
        
        {errorMsg && (
          <div className="mb-4 p-3 rounded text-sm bg-red-100 text-red-800">
            {errorMsg}
          </div>
        )}

        <input type="email" placeholder={t("emailPlaceholder")} required className="w-full mb-4 p-3 border rounded outline-none focus:ring-1 focus:ring-slate-400" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder={t("passwordPlaceholder")} required className="w-full mb-6 p-3 border rounded outline-none focus:ring-1 focus:ring-slate-400" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-3 rounded hover:bg-slate-800 transition disabled:opacity-50">
          {loading ? t("loggingInBtn") : t("loginBtn")}
        </button>
      </form>
    </div>
  );
}