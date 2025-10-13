import { ReactNode, useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ChatWidget from "@/components/chat/ChatWidget";

export default function Layout({ children }: { children: ReactNode }) {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const cls = document.documentElement.classList;
    if (highContrast) cls.add("hc");
    else cls.remove("hc");
  }, [highContrast]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header highContrast={highContrast} onToggleContrast={() => setHighContrast((v) => !v)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
