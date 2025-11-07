import { useEffect, useRef } from "react";

// Minimal Cloudflare Turnstile wrapper
// Requires: VITE_TURNSTILE_SITE_KEY in environment

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: any) => void;
    };
  }
}

interface CaptchaProps {
  onVerify?: (token: string) => void;
  theme?: "light" | "dark";
}

const Captcha = ({ onVerify, theme = "light" }: CaptchaProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

  useEffect(() => {
    if (!siteKey) {
      console.warn("Turnstile site key missing: set VITE_TURNSTILE_SITE_KEY");
      return;
    }

    const ensureScript = () => {
      const src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      const existing = document.querySelector(`script[src='${src}']`) as HTMLScriptElement | null;
      if (existing) return Promise.resolve();
      return new Promise<void>((resolve) => {
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.defer = true;
        s.onload = () => resolve();
        document.head.appendChild(s);
      });
    };

    ensureScript().then(() => {
      // small delay to ensure window.turnstile is defined
      const t = setTimeout(() => {
        if (window.turnstile && containerRef.current) {
          window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme,
            callback: (token: string) => onVerify?.(token),
          });
        }
      }, 50);
      return () => clearTimeout(t);
    });
  }, [onVerify, siteKey, theme]);

  if (!siteKey) return null;
  return <div ref={containerRef} />;
};

export default Captcha;
