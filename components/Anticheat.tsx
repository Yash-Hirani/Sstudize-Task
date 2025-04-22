"use client";

import { useEffect, useState } from "react";

interface AntiCheatProps {
  children: React.ReactNode;
}

const AntiCheat: React.FC<AntiCheatProps> = ({ children }) => {
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  useEffect(() => {
    // DevTools detection via window resize (simplified version)
    let devToolsOpened = false;

    const detectDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      const isDevtoolsOpen = widthThreshold || heightThreshold;

      if (isDevtoolsOpen && !devToolsOpened) {
        setTabSwitchCount((c) => c + 1); // Simulate a tab switch count
        devToolsOpened = true;
      } else if (!isDevtoolsOpen && devToolsOpened) {
        devToolsOpened = false;
      }
    };

    window.addEventListener("resize", detectDevTools);

    return () => {
      window.removeEventListener("resize", detectDevTools);
    };
  }, []);

  console.log(tabSwitchCount + " Tabswitches made.");
  useEffect(() => {
    // Disable clipboard actions
    const preventClipboard = (e: ClipboardEvent) => e.preventDefault();
    document.addEventListener("copy", preventClipboard);
    document.addEventListener("cut", preventClipboard);
    document.addEventListener("paste", preventClipboard);

    // Disable common keyboard shortcuts (copy, paste, view source, save)
    const handleKeyDown = (e: KeyboardEvent) => {
      const forbiddenKeys = ["c", "v", "x", "u", "s"];
      if (
        (e.ctrlKey || e.metaKey) &&
        forbiddenKeys.includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }
      if (e.key === "F12" || (e.shiftKey && e.key === "F10")) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Count tab switches via Page Visibility API
    const handleVisibilityChange = () => {
      if (document.hidden) setTabSwitchCount((c) => c + 1);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Enforce fullscreen
    const requestFullScreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(console.error);
      }
    };
    requestFullScreen();
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) requestFullScreen();
    });

    // Cleanup
    return () => {
      document.removeEventListener("copy", preventClipboard);
      document.removeEventListener("cut", preventClipboard);
      document.removeEventListener("paste", preventClipboard);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener(
        "fullscreenchange",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        requestFullScreen as any
      );
    };
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="p-2 bg-red-100 text-red-800 text-sm">
        Tab switches detected: {tabSwitchCount}
      </div>
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default AntiCheat;
