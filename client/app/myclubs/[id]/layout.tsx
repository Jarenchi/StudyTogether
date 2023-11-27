import { Sidebar } from "@/components/myclub/SideBar";

export default function ClubLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  return (
    <section className="grid lg:grid-cols-6">
      <Sidebar id={params.id} />
      {children}
    </section>
  );
}
