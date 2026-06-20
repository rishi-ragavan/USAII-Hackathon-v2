import { useState } from "react";

// Reusable "i" explainer — click to reveal a plain-language description of a panel.
export default function InfoNote({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="info">
      <button className="info-btn" aria-label="What this means"
        aria-expanded={open} onClick={() => setOpen(!open)}>i</button>
      {open && <div className="info-note" onClick={() => setOpen(false)}>{children}</div>}
    </span>
  );
}
