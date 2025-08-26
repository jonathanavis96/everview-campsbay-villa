// components/lightbox/LightboxProvider.tsx
import React, { createContext, useContext, useMemo, useState } from "react";
import Lightbox, { type Photo } from "@/components/lightbox/Lightbox";

type Ctx = {
  open: (photos: Photo[], startIndex?: number) => void;
  close: () => void;
};
const LightboxCtx = createContext<Ctx | null>(null);

export function useLightbox() {
  const ctx = useContext(LightboxCtx);
  if (!ctx) throw new Error("useLightbox must be used within <LightboxProvider>");
  return ctx;
}

export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  const [index, setIndex] = useState<number>(0);

  const open = (p: Photo[], startIndex = 0) => { setPhotos(p); setIndex(startIndex); };
  const close = () => setPhotos(null);

  const onPrev = () => setIndex((i) => (i - 1 + (photos?.length ?? 1)) % (photos?.length ?? 1));
  const onNext = () => setIndex((i) => (i + 1) % (photos?.length ?? 1));

  const value = useMemo(() => ({ open, close }), []);

  return (
    <LightboxCtx.Provider value={value}>
      {children}
      {photos && (
        <Lightbox
          photos={photos}
          index={index}
          onClose={close}
          onPrev={onPrev}
          onNext={onNext}
        />
      )}
    </LightboxCtx.Provider>
  );
}
