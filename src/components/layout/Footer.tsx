import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 px-6 py-4 flex items-center justify-between text-xs text-gray-500">
      <div>© {new Date().getFullYear()} EchoEarth AI. For our shared future.</div>
      <div className="flex gap-4">
        <a href="#" className="hover:text-gray-900 dark:hover:text-zinc-300 transition-colors">Privacy</a>
        <a href="#" className="hover:text-gray-900 dark:hover:text-zinc-300 transition-colors">Terms</a>
      </div>
    </footer>
  );
}
export default Footer;
