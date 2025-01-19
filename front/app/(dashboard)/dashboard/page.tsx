'use client';

import { useAuth } from "../../../hooks/useAuth";
const DashbaordPage = () => {
    const { session, logout } = useAuth();
    return (
        <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {session?.user?.email}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Dashboard Content</h2>
          {/* Add your dashboard content here */}
        </div>
      </div>
    </div>
   )
}

export default DashbaordPage;