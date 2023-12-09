import Link from "next/link";
import Features from "@/components/introduction/Features";
import Questions from "@/components/introduction/FAQ";
import Footer from "@/components/introduction/Footer";

export default function Home() {
  return (
    <div>
      <div className="max-w-7xl mx-auto my-4 ">
        <div className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500">
          <div>
            <h1 className="text-4xl mb-6 text-center">Let&apos;s Study Together</h1>
            <Link
              href="/clubs"
              className="text-lg bg-primary text-white px-5 py-3 rounded-full text-center hover:opacity-75"
            >
              Start using
            </Link>
          </div>
          <div />
        </div>
        <Features />
        <Questions />
      </div>
      <Footer />
    </div>
  );
}
