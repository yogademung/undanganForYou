'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        username,
        password,
      });

      if (res?.error) {
        setError('Username atau password salah');
      } else {
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-inter">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin Login</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500 focus:outline-none text-black bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500 focus:outline-none text-black bg-white"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${loading ? 'bg-gray-400' : 'bg-gray-900 hover:bg-black'} transition-colors`}
          >
            {loading ? 'Processing...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
