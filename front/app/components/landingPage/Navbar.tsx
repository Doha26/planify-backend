import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.svg";
import { AuthModal } from "./AuthModal";
export function Navbar() {
  return (
    <div className="relative flex flex-col w-full mx-auto md:flex-row md:items-center md:justify-between">
      <div className="flex flex-row items-center text-sm lg:justify-start">
        <Link href="/" className="flex items-center gap-2">
          <Image src={Logo} className="size-40" alt="Logo" />
        </Link>
      </div>
      <nav className="hidden md:flex md:justify-end md:space-x-4">
        <AuthModal />
      </nav>
    </div>
  );
}
