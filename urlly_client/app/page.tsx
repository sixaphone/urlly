import UrlForm from "@/components/UrlForm";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex flex-col justify-between bg-base-100 font-[family-name:var(--font-geist-sans)]">
      <header>
        <nav className="navbar bg-base-300">
          <Link href="/" className="btn btn-ghost text-xl">
            URL-ly
          </Link>
        </nav>
      </header>
      <main className="flex flex-grow justify-center items-center">
        <UrlForm />
      </main>
      <footer className="footer footer-center bg-base-300 text-base-content p-4">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by
            @sixaphone
          </p>
        </aside>
      </footer>
    </div>
  );
}
