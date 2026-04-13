"use client";
import React, { useState, useEffect } from 'react';

// Define the User type for TypeScript
interface User {
  id: string;
  email: string;
  role: string;
  createdAt: Date | string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  // We fetch users through a quick dedicated API call or a Server Action
  // For simplicity, we will assume you have a GET /api/users route, 
  // but if you don't, you can easily create one!
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    if (!confirm(`Change this user's role to ${newRole}?`)) return;

    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) fetchUsers(); // Refresh the list
    } catch (e) {
      alert("Failed to update role");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-slate-900">Registered Users</h1>
      {loading ? <p>Loading users...</p> : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-medium text-slate-600">Email</th>
                <th className="p-4 font-medium text-slate-600">Role</th>
                <th className="p-4 font-medium text-slate-600">Joined</th>
                <th className="p-4 font-medium text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-900">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => toggleRole(user.id, user.role)}
                      className={`text-sm px-3 py-1 rounded transition ${user.role === 'ADMIN' ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                    >
                      {user.role === 'ADMIN' ? 'Revoke Admin' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}