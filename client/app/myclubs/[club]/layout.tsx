import { Sidebar } from "@/components/myclub/SideBar";

export default function ClubLayout({ children, params }: { children: React.ReactNode; params: { club: string } }) {
  return (
    <section className="flex">
      <Sidebar id={params.club} />
      {children}
    </section>
  );
}
