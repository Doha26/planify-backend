
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen">
        <nav className="w-64 bg-gray-800">
            <div className="p-4 text-white">Dashboard</div>
            </nav>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
