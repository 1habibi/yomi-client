import { useEffect, type RefObject } from "react";

export function useClipboardPaste(
  containerRef: RefObject<HTMLElement | null>,
  onPaste: (file: File) => void,
  enabled: boolean = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            onPaste(file);
            return;
          }
        }
      }
    };

    // Слушаем paste на контейнере или на document (для paste из любого места на странице)
    const el: EventTarget = containerRef.current ?? document;
    el.addEventListener("paste", handler as EventListener);
    return () => el.removeEventListener("paste", handler as EventListener);
  }, [containerRef, onPaste, enabled]);
}
