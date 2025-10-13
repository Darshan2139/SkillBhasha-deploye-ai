import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(() => [
    { role: "bot", text: "Hello! Ask me about translations, summaries, or accessibility." },
  ]);
  const [val, setVal] = useState("");

  useEffect(() => {
    // keep minimized on mobile
    const onResize = () => {
      if (window.innerWidth < 640) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function send() {
    if (!val.trim()) return;
    setMessages((s) => [...s, { role: "user", text: val }]);
    const q = val;
    setVal("");
    setTimeout(() => {
      setMessages((s) => [...s, { role: "bot", text: `Demo answer for: ${q}` }]);
    }, 800 + Math.random() * 600);
  }

  return (
    <div className={`fixed z-50 right-4 bottom-4 ${open ? "w-80 h-56" : "w-12 h-12"} transition-all`}>
      {open ? (
        <div className="flex flex-col h-full bg-primary text-primary-foreground shadow-lg rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <div className="font-semibold">AI Assistant</div>
            </div>
            <div>
              <button className="text-sm text-primary-foreground/80 px-2" onClick={() => setOpen(false)}>Close</button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-2 bg-white/5">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <div className={`inline-block px-3 py-1.5 rounded-md ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-white text-primary-foreground/90"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t bg-white/5 flex gap-2">
            <input className="flex-1 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm" value={val} onChange={(e)=>setVal(e.target.value)} onKeyDown={(e)=>{if(e.key==='Enter') send();}} placeholder="Ask about translations..." />
            <button className="px-3 py-2 rounded-md bg-accent text-accent-foreground" onClick={send}>Send</button>
          </div>
        </div>
      ) : (
        <button onClick={()=>setOpen(true)} className="rounded-full w-12 h-12 bg-accent text-accent-foreground shadow-lg grid place-items-center">
          <MessageSquare className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
