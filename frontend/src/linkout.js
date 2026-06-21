// Guardrail: warn before sending the user to any external site.
export const leave = (url) => (e) => {
  e.preventDefault();
  const ok = window.confirm(
    "You're leaving Homestead for an external website.\n\n" +
    "Homestead isn't responsible for its content, accuracy, or how it handles your information. " +
    "Always verify program details with the official provider.\n\nContinue?"
  );
  if (ok) window.open(url, "_blank", "noopener,noreferrer");
};
