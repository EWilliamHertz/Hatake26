"use client";
import { useCartStore } from "@/store/cartStore";
import { QRCodeSVG } from 'qrcode.react';
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function CartDrawer() {
  const { items, isCartOpen, toggleCart, updateQuantity, removeFromCart, clearCart } = useCartStore();
  const { data: session } = useSession();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any>(null); 

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // ---> IMPORTANT: CHANGE THIS TO YOUR ACTUAL SWISH NUMBER <---
  const SWISH_NUMBER = "1235875737"; 

  const handleCheckout = async () => {
    if (!session?.user?.email) {
      alert("Please log in or register an account to checkout!");
      return;
    }
    
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: session.user.email.split('@')[0],
          customerEmail: session.user.email,
          items: items,
          totalValue: total,
        })
      });
      const order = await res.json();
      setOrderComplete(order); // Triggers the QR code screen!
      clearCart();
    } catch (e) {
      alert("Failed to process order.");
    }
    setIsCheckingOut(false);
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Dark Background Overlay */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={toggleCart} />
      
      {/* Sliding Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-2xl font-bold text-slate-900">Your Cart</h2>
          <button onClick={toggleCart} className="text-slate-400 hover:text-red-500 text-3xl transition">&times;</button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-white">
          {orderComplete ? (
            // SUCCESS SCREEN & SWISH QR
            <div className="text-center py-8 animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Order Secured!</h3>
              <p className="text-slate-500 mb-8">Open your Swish app and scan the code below to complete your payment.</p>
              
              <div className="bg-white p-4 inline-block rounded-2xl border-4 border-slate-100 shadow-lg mb-6">
                 <QRCodeSVG 
                    value={`swish://payment?data={"version":1,"payee":{"value":"${SWISH_NUMBER}"},"amount":{"value":${orderComplete.totalValue}},"message":{"value":"ORDER-${orderComplete.orderNumber}"}}`}
                    size={220}
                    level="H"
                 />
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left">
                <p className="font-bold text-slate-800 text-lg flex justify-between">Amount: <span className="text-amber-600">{orderComplete.totalValue} SEK</span></p>
                <p className="font-bold text-slate-800 text-lg flex justify-between mt-2">Message: <span className="text-slate-600">ORDER-{orderComplete.orderNumber}</span></p>
              </div>
            </div>
          ) : items.length === 0 ? (
            <p className="text-slate-400 text-center py-12 font-medium">Your cart is empty.</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                  <img src={item.imageUrl} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-slate-800 text-sm line-clamp-2">{item.name}</h4>
                  <p className="text-amber-600 font-extrabold text-sm mt-1">{item.price} SEK</p>
                  <div className="flex items-center gap-3 mt-2 bg-slate-50 w-fit rounded-lg border border-slate-200 p-1">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 font-bold hover:bg-slate-200">-</button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 font-bold hover:bg-slate-200">+</button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 p-2 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Checkout Footer */}
        {!orderComplete && items.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-white shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-slate-500">Cart Total</span>
              <span className="text-3xl font-extrabold text-amber-600">{total} SEK</span>
            </div>
            <button 
              onClick={handleCheckout} 
              disabled={isCheckingOut}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition shadow-lg disabled:opacity-50 text-lg"
            >
              {isCheckingOut ? "Processing..." : "Generate Swish Payment"}
            </button>
            {!session && (
              <p className="text-xs text-center text-red-500 mt-3 font-bold">*You must be logged in to checkout</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}