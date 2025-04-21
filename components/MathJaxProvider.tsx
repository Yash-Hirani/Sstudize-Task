// // src/components/MathJaxProvider.tsx
// "use client";

// import { useState } from "react";
// import Script from "next/script";

// export default function MathJaxProvider({
//   children,
//   loadingFallback = <p>Loading MathJax...</p>,
// }: {
//   children: React.ReactNode;
//   loadingFallback?: React.ReactNode;
// }) {
//   const [ready, setReady] = useState(false);

//   return (
//     <>
//       {!ready && loadingFallback}

//       <Script
//         id="mathjax"
//         src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
//         strategy="afterInteractive"
//         onLoad={() => {
//           setReady(true);
//         }}
//       />

//       {ready && children}
//     </>
//   );
// }
