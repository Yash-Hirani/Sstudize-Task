// src/components/Latex.tsx
"use client";

import katex from "katex";
import parse from "html-react-parser";

interface LatexProps {
  expression: string;
  displayMode?: boolean;
}

export default function Latex({ expression, displayMode = false }: LatexProps) {
  try {
    const html = katex.renderToString(expression, {
      throwOnError: false,
      displayMode,
    });
    return <span>{parse(html)}</span>;
  } catch (err) {
    return <span className="text-red-500">Invalid LaTeX</span>;
  }
}
