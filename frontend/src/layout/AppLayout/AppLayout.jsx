import { Header } from "@/layout/Header/Header";
import { Footer } from "@/layout/Footer/Footer";

export function AppLayout({ title, children, onAdd }) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <Header title={title} onAdd={onAdd} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-32 pt-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}