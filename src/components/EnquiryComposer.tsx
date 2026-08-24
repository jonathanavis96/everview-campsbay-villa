import { useMemo, useState } from "react";
import {
  EMPTY_ENQUIRY,
  SEND_ON_WHATSAPP_LABEL,
  buildWhatsAppUrl,
  composeEnquiryMessage,
  type EnquiryIntent,
} from "@/lib/enquiry";

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function EnquiryComposer() {
  const [fields, setFields] = useState(EMPTY_ENQUIRY);

  const message = useMemo(() => composeEnquiryMessage(fields), [fields]);
  const whatsappUrl = useMemo(() => buildWhatsAppUrl(fields), [fields]);

  const setIntent = (intent: EnquiryIntent) =>
    setFields((f) => ({ ...f, intent }));

  const field =
    (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));

  return (
    <section id="enquire" className="bg-paper py-16 md:py-24">
      <div className="container">
        <div className="max-w-2xl">
          <p className="text-label text-stone-text mb-3">Enquire</p>
          <h2 className="text-display-l mb-4">Check dates</h2>
          <p className="text-body text-stone-text mb-10">
            Tell us when and how many. We'll open WhatsApp with your enquiry
            already written — nothing is sent until you press the button.
          </p>

          <div
            role="tablist"
            aria-label="Enquiry type"
            className="flex gap-2 mb-8"
          >
            <button
              type="button"
              role="tab"
              aria-selected={fields.intent === "check-dates"}
              onClick={() => setIntent("check-dates")}
              className={`text-label px-4 py-2 border rounded-sm transition-colors ${
                fields.intent === "check-dates"
                  ? "bg-ink text-paper border-ink"
                  : "border-line text-ink hover:border-ink"
              }`}
            >
              Check dates
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={fields.intent === "ask-question"}
              onClick={() => setIntent("ask-question")}
              className={`text-label px-4 py-2 border rounded-sm transition-colors ${
                fields.intent === "ask-question"
                  ? "bg-ink text-paper border-ink"
                  : "border-line text-ink hover:border-ink"
              }`}
            >
              Ask a question
            </button>
          </div>

          <form
            className="space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="block">
                <span className="text-label text-stone-text block mb-2">
                  Arriving
                </span>
                <input
                  type="date"
                  value={fields.arriving}
                  onChange={field("arriving")}
                  className="w-full border border-line bg-transparent px-3 py-2 text-data rounded-sm focus:border-ink"
                />
              </label>
              <label className="block">
                <span className="text-label text-stone-text block mb-2">
                  Leaving
                </span>
                <input
                  type="date"
                  value={fields.leaving}
                  onChange={field("leaving")}
                  className="w-full border border-line bg-transparent px-3 py-2 text-data rounded-sm focus:border-ink"
                />
              </label>
              <label className="block">
                <span className="text-label text-stone-text block mb-2">
                  Guests
                </span>
                <select
                  value={fields.guests}
                  onChange={field("guests")}
                  className="w-full border border-line bg-transparent px-3 py-2 text-data rounded-sm focus:border-ink"
                >
                  <option value="">—</option>
                  {GUEST_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-label text-stone-text block mb-2">
                Your name
              </span>
              <input
                type="text"
                value={fields.name}
                onChange={field("name")}
                className="w-full border border-line bg-transparent px-3 py-2 text-body rounded-sm focus:border-ink"
              />
            </label>

            <label className="block">
              <span className="text-label text-stone-text block mb-2">
                Anything we should know
              </span>
              <input
                type="text"
                value={fields.note}
                onChange={field("note")}
                className="w-full border border-line bg-transparent px-3 py-2 text-body rounded-sm focus:border-ink"
              />
            </label>

            <div className="border-t border-line pt-6">
              <p className="text-label text-stone-text mb-2">Your message</p>
              <p className="text-body italic" aria-live="polite">
                "{message}"
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-ink text-paper px-8 py-4 text-body font-medium rounded-sm hover:bg-ink/90 transition-colors"
            >
              {SEND_ON_WHATSAPP_LABEL}
            </a>
          </form>
        </div>
      </div>
    </section>
  );
}
