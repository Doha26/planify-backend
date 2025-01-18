import { auth } from "./lib/auth";
import { redirect } from "next/navigation";
import { Hero } from "./components/landingPage/Hero";
import { Navbar } from "./components/landingPage/Navbar";

export default async function Home() {

  const session = await auth();

  if (session?.user) {
    return redirect("/dashboard");
  }
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
       <Navbar />
       <Hero />
    </div>
  );
}
