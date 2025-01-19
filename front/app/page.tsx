import { redirect } from "next/navigation";
import { auth } from "../lib/auth";

export default async function Home() {
  const session = await auth()
  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
    Welcome to Planify
    </div>
  );
}