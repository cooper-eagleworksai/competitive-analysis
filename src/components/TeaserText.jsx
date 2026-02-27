import { useState } from "react";
import C from "../constants/colors";

const LockIcon = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ verticalAlign: "-1px" }}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

/**
 * Splits text into the visible portion and a fading tail that cuts
 * into the last sentence. Returns { visible, fading }.
 */
function splitForTeaser(text) {
  if (!text) return { visible: text, fading: "" };

  // Find the start of the last sentence (last .!? followed by a space)
  const sentenceBreaks = /[.!?]\s+/g;
  let lastBreak = -1;
  let m;
  while ((m = sentenceBreaks.exec(text)) !== null) {
    lastBreak = m.index + m[0].length;
  }

  // If only one sentence, cut at ~50% of its length at a word boundary
  if (lastBreak === -1) {
    const mid = Math.floor(text.length * 0.5);
    const spaceIdx = text.lastIndexOf(" ", mid);
    const cut = spaceIdx > 0 ? spaceIdx : mid;
    return { visible: text.slice(0, cut), fading: text.slice(cut, cut + 30) };
  }

  // Show everything before the last sentence fully,
  // then ~40% of the last sentence as the fading tail
  const lastSentence = text.slice(lastBreak);
  const tailLen = Math.floor(lastSentence.length * 0.4);
  const spaceIdx = lastSentence.lastIndexOf(" ", tailLen);
  const cut = spaceIdx > 0 ? spaceIdx : tailLen;

  return {
    visible: text.slice(0, lastBreak),
    fading: lastSentence.slice(0, cut),
  };
}

const fadeStyle = {
  display: "inline",
  backgroundImage: `linear-gradient(to right, currentColor 0%, transparent 100%)`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

export default function TeaserText({ text, style }) {
  const [locked, setLocked] = useState(false);
  const { visible, fading } = splitForTeaser(text);
  const isTruncated = (visible + fading).length < (text || "").length;

  if (!isTruncated) return <p style={style}>{text}</p>;

  return (
    <p style={style}>
      {visible}
      <span style={fadeStyle}>{fading}</span>
      {!locked ? (
        <span
          onClick={() => setLocked(true)}
          style={{ color: C.amber, cursor: "pointer" }}
        >
          {" "}...see more
        </span>
      ) : (
        <span style={{ color: C.amber, fontWeight: 700, fontSize: 12, marginLeft: 6, whiteSpace: "nowrap" }}>
          <LockIcon /> Full Report Required
        </span>
      )}
    </p>
  );
}
