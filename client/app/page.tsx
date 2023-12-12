import Link from "next/link";
import Features from "@/components/introduction/Features";
import Questions from "@/components/introduction/FAQ";
import Footer from "@/components/introduction/Footer";

export default function Home() {
  return (
    <div>
      <main className="max-w-7xl mx-auto my-5">
        <div className="flex flex-col items-center py-28">
          <h1 className="text-4xl mb-6 text-center">Let&apos;s Study Together</h1>
          <Link
            href="/clubs"
            className="text-lg bg-primary text-white px-5 py-3 rounded-full text-center hover:opacity-75"
          >
            Start Using
          </Link>
        </div>
        <Features />
        <Questions />
      </main>
      <Footer />
    </div>
  );
}
