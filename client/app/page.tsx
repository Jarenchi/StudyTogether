import Link from "next/link";
import Features from "@/components/introduction/Features";
import Questions from "@/components/introduction/FAQ";
import Footer from "@/components/introduction/Footer";
import TechStack from "@/components/introduction/TechStack";

export default function Home() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background: subtle grid + radial glow */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 80% 60% at 50% -10%, hsl(var(--primary) / 0.15) 0%, transparent 60%),
              linear-gradient(hsl(var(--border) / 0.5) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--border) / 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "auto, 40px 40px, 40px 40px",
          }}
        />

        <div className="max-w-5xl mx-auto px-4 py-28 flex flex-col items-center text-center gap-6 animate-slide-up">
          {/* Pill badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            讀書會平台
          </span>

          <h1 className="font-display font-extrabold text-5xl sm:text-6xl leading-tight tracking-tight">
            Let&apos;s Study <span className="text-primary">Together</span>
          </h1>

          <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
            建立或加入讀書會，與志同道合的人一起學習。 即時協作文件、線上會議、活動管理，讓學習不再孤單。
          </p>

          <div className="flex gap-3 flex-wrap justify-center">
            <Link
              href="/clubs"
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-sm"
            >
              立即開始 →
            </Link>
            <Link
              href="/login"
              className="border border-border px-6 py-2.5 rounded-full font-semibold hover:bg-muted transition-colors"
            >
              登入帳號
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 pb-8">
        <Features />
        <TechStack />
        <Questions />
      </main>

      <Footer />
    </div>
  );
}
