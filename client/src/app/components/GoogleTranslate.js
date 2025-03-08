// "use client";
// import { useEffect } from "react";

// export default function GoogleTranslate() {
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src =
//       "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//     script.async = true;
//     document.body.appendChild(script);

//     window.googleTranslateElementInit = () => {
//       new window.google.translate.TranslateElement(
//         { pageLanguage: "en" },
//         "google_translate_element"
//       );
//     };
//   }, []);

//   return <div id="google_translate_element"></div>;
// }
"use client";
import { useEffect, useState } from "react";

export default function GoogleTranslate() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Load Google Translate script dynamically
    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
      setIsLoaded(true); // Mark as loaded once initialized
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start space-y-2">
      {/* Translate Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-yellow-700 transition"
      >
        🌍 Translate
      </button>

      {/* Google Translate Widget (Initially hidden) */}
      <div
        id="google_translate_element"
        className={`${
          isVisible ? "block" : "hidden"
        } bg-white p-2 shadow-lg rounded-lg border`}
      ></div>
    </div>
  );
}
