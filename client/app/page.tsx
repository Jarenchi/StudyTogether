import { ModeToggle } from "@/components/ModeToggle";
import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <ModeToggle />
    </main>
  );
}
