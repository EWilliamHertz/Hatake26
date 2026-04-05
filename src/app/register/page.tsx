"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("Registration successful! You can now log in.");
      router.push("/login");
    } else {
      // Safely handle non-JSON responses (like Next.js HTML crash pages)
      const text = await res.text();
      let errorMessage = "Unknown server error";
      
      try {
        const data = JSON.parse(text);
        errorMessage = data.error || errorMessage;
      } catch (e) {
        console.error("Raw server response:", text);
        errorMessage = `Server crashed with status: ${res.status}. Check your Cloud Shell terminal logs for the exact error!`;
      }
      
      alert(`Registration failed: ${errorMessage}`);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-slate-50 py-12 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-900">Create Account</h1>
        <input type="email" placeholder="Email" required className="w-full mb-4 p-3 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required className="w-full mb-6 p-3 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded hover:bg-slate-800 transition">Register</button>
      </form>
    </div>
  );
}