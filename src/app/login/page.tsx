"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      alert("Invalid credentials");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-slate-50 py-12 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-900">Sign In</h1>
        <input type="email" placeholder="Email" required className="w-full mb-4 p-3 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required className="w-full mb-6 p-3 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded hover:bg-slate-800 transition">Login</button>
      </form>
    </div>
  );
}