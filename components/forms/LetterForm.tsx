"use client";

import { useActionState, useEffect, useId, useRef, useState, useTransition, type CSSProperties, type FormEvent, type InputHTMLAttributes } from "react";
import { sendEnquiry } from "@/app/actions/enquiry";
import type { EnquiryState } from "@/lib/enquiry";
import { prefersReducedMotion } from "@/lib/curtain";
import { Paw } from "@/components/ui/Paw";
import type { PuppyOption } from "./EnquiryForm";

/** A write-on-the-line blank inside a sentence. */
function Blank({ name, label, error, size = 14, ...rest }: { name: string; label: string; error?: string; size?: number } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <span className="tp-blank" style={{ "--size": `${size}ch` } as CSSProperties}>
      <input name={name} aria-label={label} aria-invalid={!!error || undefined} aria-describedby={error ? `${name}-err` : undefined} {...rest} />
    </span>
  );
}

type Phase = "writing" | "sealing" | "posting" | "sent";

/**
 * Contact form written as a letter. On success the letter folds into an envelope,
 * a postbox rises to swallow it, and a "sent" card takes its place.
 */
export function LetterForm({ puppies, success, whatsappHref }: { puppies: PuppyOption[]; success: { heading: string; body: string }; whatsappHref: string }) {
  const [state, action, actionPending] = useActionState<EnquiryState, FormData>(sendEnquiry, { ok: false });
  const [transitioning, startTransition] = useTransition();
  const pending = actionPending || transitioning;
  const [phase, setPhase] = useState<Phase>("writing");
  const [lockHeight, setLockHeight] = useState<number>();
  const wrap = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const sent = useRef<HTMLDivElement>(null);
  const selectId = useId();
  const noteId = useId();

  // Play the posting sequence once the server accepts the letter.
  useEffect(() => {
    if (!state.ok) return;
    const timers = prefersReducedMotion()
      ? [setTimeout(() => setPhase("sent"), 0)]
      : [
          setTimeout(() => {
            setLockHeight(wrap.current?.offsetHeight); // keep the page from jumping while the letter folds away
            setPhase("sealing");
          }, 0),
          setTimeout(() => setPhase("posting"), 750),
          setTimeout(() => {
            setLockHeight(undefined);
            setPhase("sent");
          }, 1750),
        ];
    return () => timers.forEach(clearTimeout);
  }, [state.ok]);

  // Move focus to the confirmation and make sure it isn't hidden under the header.
  useEffect(() => {
    const el = sent.current;
    if (phase !== "sent" || !el) return;
    el.focus({ preventScroll: true });
    const top = el.getBoundingClientRect().top;
    const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) * 16 || 76;
    if (top < header + 8) scrollBy({ top: top - header - 24, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [phase]);

  // After a failed submit, jump to the first problem.
  useEffect(() => {
    if (!state.ok && state.errors) form.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
  }, [state]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => action(fd));
  };

  const err = state.errors ?? {};
  const errorList = Object.entries(err);
  const writing = phase === "writing";

  return (
    <div ref={wrap} className="tp-post" data-phase={phase} style={{ minHeight: lockHeight }}>
      {phase !== "sent" && (
        <form ref={form} onSubmit={onSubmit} noValidate className="tp-letterform" aria-hidden={!writing || undefined} inert={!writing}>
          <span aria-hidden="true" className="tp-letter__stamp">
            <Paw className="size-9" />
          </span>
          <p className="font-scrawl tp-letterform__greeting">Dear TeddyPups,</p>
          {state.message && !state.ok && (
            <div role="alert" className="tp-letterform__alert">
              <p className="font-semibold">{state.message}</p>
              {errorList.length > 0 && (
                <ul>
                  {errorList.map(([k, msg]) => (
                    <li key={k} id={`${k}-err`}>
                      {msg}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <p className="tp-letterform__line">
            my name is <Blank name="name" label="Your name (required)" autoComplete="name" required minLength={2} maxLength={80} size={16} error={err.name} />, and you can
            reach me on{" "}
            <Blank
              name="phone"
              label="Phone or WhatsApp number with country code (required)"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              size={15}
              placeholder="+971 50 123 4567"
              error={err.phone}
            />{" "}
            or by email at <Blank name="email" label="Email (optional)" type="email" autoComplete="email" size={20} placeholder="optional" error={err.email} />.
          </p>
          <p className="tp-letterform__line">
            I live in <Blank name="area" label="Your area (optional)" autoComplete="address-level2" maxLength={80} size={13} placeholder="e.g. Dubai Marina" error={err.area} />,
            and I&apos;m curious about{" "}
            <span className="tp-blank tp-blank--select">
              <label htmlFor={selectId} className="sr-only">
                Puppy you&apos;re interested in (optional)
              </label>
              <select id={selectId} name="puppyId" defaultValue="">
                <option value="">any puppy (not sure yet)</option>
                {puppies.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </span>
            .
          </p>
          <label htmlFor={noteId} className="sr-only">
            Your message (optional)
          </label>
          <textarea
            id={noteId}
            name="message"
            rows={4}
            maxLength={2000}
            placeholder="Anything else you'd like to tell us…"
            className="tp-letterform__note"
            aria-invalid={!!err.message || undefined}
          />
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
            </label>
          </div>
          <div className="tp-letterform__sign">
            <p className="font-scrawl">with love, a future puppy parent</p>
            <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-70">
              {pending ? "Sealing the envelope…" : "Post my letter"}
            </button>
          </div>
        </form>
      )}

      {(phase === "sealing" || phase === "posting") && (
        <div aria-hidden="true" className="tp-post__scene">
          <svg viewBox="0 0 160 112" className="tp-post__envelope">
            <rect x="4" y="18" width="152" height="90" rx="6" fill="#fffdf8" stroke="#2a170e" strokeWidth="4" />
            <path d="M6 104 64 62M154 104 96 62" fill="none" stroke="#2a170e" strokeWidth="3" strokeLinecap="round" />
            <path className="tp-post__flap" d="M6 22 80 74 154 22" fill="#fbe3b4" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
            <circle cx="80" cy="72" r="11" fill="#a24a1a" stroke="#2a170e" strokeWidth="3" />
          </svg>
          <svg viewBox="0 0 200 260" className="tp-post__box">
            <rect x="86" y="170" width="28" height="86" fill="#5a3a28" stroke="#2a170e" strokeWidth="4" />
            <path d="M30 70a70 54 0 0 1 140 0v104H30z" fill="#c2622b" stroke="#2a170e" strokeWidth="5" strokeLinejoin="round" />
            <rect x="58" y="86" width="84" height="14" rx="7" fill="#2a170e" />
            <path d="M44 128h112" stroke="#2a170e" strokeWidth="3" strokeLinecap="round" opacity=".35" />
            <g className="tp-post__flag">
              <path d="M170 120V64" stroke="#2a170e" strokeWidth="5" strokeLinecap="round" />
              <path d="M170 64h22v16h-22" fill="#f2be6b" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
            </g>
          </svg>
        </div>
      )}

      {phase === "sent" && (
        <div ref={sent} tabIndex={-1} role="status" className="tp-post__sent">
          <svg viewBox="0 0 200 150" aria-hidden="true" className="tp-post__box tp-post__box--sent">
            <rect x="86" y="96" width="28" height="52" fill="#5a3a28" stroke="#2a170e" strokeWidth="4" />
            <path d="M30 50a70 44 0 0 1 140 0v52H30z" fill="#c2622b" stroke="#2a170e" strokeWidth="5" strokeLinejoin="round" />
            <rect x="58" y="58" width="84" height="12" rx="6" fill="#2a170e" />
            <path d="M170 92V22" stroke="#2a170e" strokeWidth="5" strokeLinecap="round" />
            <path d="M170 22h22v16h-22" fill="#f2be6b" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
          </svg>
          <p className="font-plush mt-4 text-[2rem]">{success.heading}</p>
          <p className="mx-auto mt-2 max-w-[40ch] text-cocoa-soft">{success.body}</p>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-6">
            WhatsApp us
          </a>
        </div>
      )}
    </div>
  );
}
