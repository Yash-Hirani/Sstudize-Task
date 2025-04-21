// src/components/MathJaxWrapper.tsx
"use client";

import { useState } from "react";
import { MathJaxContext } from "better-react-mathjax";

const mathJaxConfig = {
  loader: { load: ["input/tex", "output/chtml"] },
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },
};

export default function MathJaxWrapper({
  children,
  fallback = <p>Loading MathJax...</p>,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  return (
    <MathJaxContext
      version={3}
      config={mathJaxConfig}
      onStartup={() => setReady(true)}
    >
      {ready ? children : fallback}
    </MathJaxContext>
  );
}
