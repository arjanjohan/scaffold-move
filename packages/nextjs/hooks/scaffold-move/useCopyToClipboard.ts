import { useEffect, useRef, useState } from "react";

export const useCopyToClipboard = () => {
  const [isCopiedToClipboard, setIsCopiedToClipboard] = useState(false);
  const resetTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Don't update state after the component using the hook has unmounted
  useEffect(() => () => clearTimeout(resetTimeout.current), []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopiedToClipboard(true);
      clearTimeout(resetTimeout.current);
      resetTimeout.current = setTimeout(() => {
        setIsCopiedToClipboard(false);
      }, 800);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return { copyToClipboard, isCopiedToClipboard };
};
