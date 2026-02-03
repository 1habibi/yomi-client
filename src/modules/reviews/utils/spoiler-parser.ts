export interface SpoilerPart {
  type: "text" | "spoiler";
  content: string;
}

export function parseSpoilers(text: string): SpoilerPart[] {
  const regex = /\|\|([^|]+)\|\|/g;
  const parts: SpoilerPart[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: text.slice(lastIndex, match.index),
      });
    }

    parts.push({
      type: "spoiler",
      content: match[1],
    });

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      content: text.slice(lastIndex),
    });
  }

  if (parts.length === 0) {
    parts.push({
      type: "text",
      content: text,
    });
  }

  return parts;
}
