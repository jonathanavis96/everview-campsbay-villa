// Everview has no backend and no third-party form service (design-direction §7).
// The enquiry form composes a WhatsApp deep link; nothing is stored or sent
// anywhere except the guest's own WhatsApp client when they press send.
export const WHATSAPP_NUMBER = "27822227457";

// design-direction §14.5: dictated ("JonathanEvers96 at gmail.com") and
// resolved to Jonathan's own address. One constant, so a correction is one word.
export const ENQUIRY_FALLBACK_EMAIL = "jonathanavis96@gmail.com";

export const SEND_ON_WHATSAPP_LABEL = "Send on WhatsApp";

export type EnquiryIntent = "check-dates" | "ask-question";

export type EnquiryFields = {
  intent: EnquiryIntent;
  arriving: string;
  leaving: string;
  guests: string;
  name: string;
  note: string;
};

export const EMPTY_ENQUIRY: EnquiryFields = {
  intent: "check-dates",
  arriving: "",
  leaving: "",
  guests: "",
  name: "",
  note: "",
};

function formatDate(iso: string): string | null {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/** Builds the human-readable message shown live above the send button. */
export function composeEnquiryMessage(fields: EnquiryFields): string {
  const arriving = formatDate(fields.arriving);
  const leaving = formatDate(fields.leaving);

  const opening =
    fields.intent === "ask-question"
      ? "Hi — I have a question about Everview"
      : "Hi — I'd like to check availability at Everview";

  const parts: string[] = [opening];

  if (arriving && leaving) {
    parts.push(`for ${arriving}–${leaving}`);
  } else if (arriving) {
    parts.push(`arriving ${arriving}`);
  }

  if (fields.guests) {
    const n = Number(fields.guests);
    parts.push(n > 0 ? `${n} guest${n === 1 ? "" : "s"}` : "");
  }

  let message = parts.filter(Boolean).join(", ") + ".";

  if (fields.note.trim()) {
    message += ` ${fields.note.trim()}`;
  }

  if (fields.name.trim()) {
    message += ` — ${fields.name.trim()}`;
  }

  return message;
}

export function buildWhatsAppUrl(fields: EnquiryFields): string {
  const text = composeEnquiryMessage(fields);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function buildMailtoUrl(fields: EnquiryFields): string {
  const body = composeEnquiryMessage(fields);
  const subject =
    fields.intent === "ask-question"
      ? "Question about Everview"
      : "Availability enquiry — Everview";
  return `mailto:${ENQUIRY_FALLBACK_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}
