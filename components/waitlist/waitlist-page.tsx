"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { DitherImage } from "@/components/home/dither-image";
import { orderedDither, randomDither } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { amplitudeTrack } from "@/lib/tracking/amplitude";
import { posthogCapture, posthogLogInfo } from "@/lib/tracking/posthog";
import { SUBMIT_ERROR_TEXT, submitLead } from "@/lib/leads/submit";
import styles from "@/components/waitlist/waitlist.module.css";


const artBase = {
  ...orderedDither,
  animation: false,
  intensity: 10,
  interval: 0.1,
  brightness: -10,
  pixelSize: 1,
  threshold: 125,
  midtones: 50,
  glow: 0,
};

const artHighlight = {
  ...randomDither,
  animation: true,
  intensity: 100,
  interval: 0.08,
  brightness: 50,
  pixelSize: 1,
  threshold: 55,
  midtones: 65,
  glow: 0,
};

function unitBezier(x1: number, y1: number, x2: number, y2: number, time: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (u: number) => ((ax * u + bx) * u + cx) * u;
  const sampleY = (u: number) => ((ay * u + by) * u + cy) * u;
  const slope = (u: number) => (3 * ax * u + 2 * bx) * u + cx;
  let u = time;
  for (let step = 0; step < 6; step += 1) {
    const delta = sampleX(u) - time;
    const derivative = slope(u);
    if (Math.abs(delta) < 1e-5 || derivative === 0) {
      break;
    }
    u -= delta / derivative;
  }
  return sampleY(Math.min(1, Math.max(0, u)));
}

function easeRadius(kind: "in" | "out", progress: number) {
  const t = Math.min(1, Math.max(0, progress));
  return kind === "out"
    ? unitBezier(0, 0, 0.58, 1, t)
    : unitBezier(0.42, 0, 1, 1, t);
}

function Flashlight({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const point = useRef({
    x: 0,
    y: 0,
    radius: 0,
    from: 0,
    to: 0,
    start: 0,
    ease: "out" as "in" | "out",
  });

  useEffect(() => {
    let frame = 0;
    const tick = (now: number) => {
      const state = point.current;
      const progress = (now - state.start) / 300;
      state.radius =
        progress >= 1
          ? state.to
          : state.from + (state.to - state.from) * easeRadius(state.ease, progress);
      const node = ref.current;
      if (node) {
        node.style.maskImage = `radial-gradient(circle ${state.radius}px at ${state.x}px ${state.y}px, rgb(0, 0, 0), rgb(0, 0, 0) 40%, rgba(0, 0, 0, 0) 100%)`;
        node.style.webkitMaskImage = node.style.maskImage;
        node.style.maskComposite = "destination-out";
        node.style.webkitMaskComposite = "destination-out";
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  function place(event: PointerEvent<HTMLDivElement>, open: boolean) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const state = point.current;
    state.x = event.clientX - bounds.left;
    state.y = event.clientY - bounds.top;
    if (!open) {
      return;
    }
    state.from = state.radius;
    state.to = 400;
    state.start = performance.now();
    state.ease = "out";
  }

  return (
    <div
      ref={ref}
      className={styles.flashlight}
      onPointerEnter={(event) => place(event, true)}
      onPointerLeave={() => {
        const state = point.current;
        state.from = state.radius;
        state.to = 0;
        state.start = performance.now();
        state.ease = "in";
      }}
      onPointerMove={(event) => place(event, false)}
    >
      {children}
    </div>
  );
}

export function WaitlistPage() {
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="waitlist-title">
        <div className={styles.art}>
          <div className={styles.artBase}>
            <DitherImage src="/waitlist/art.png" label="waitlist art" preset={artBase} />
          </div>
          <Flashlight>
            <div className={styles.artHighlight}>
              <DitherImage src="/waitlist/art.png" label="" preset={artHighlight} />
            </div>
          </Flashlight>
        </div>
        <div className={styles.copy}>
          <div className={styles.text}>
            <p className={styles.badge}>
              <span className="shimmer-text">
                WAITLIST IS NOW OPEN
                <span className="shimmer-text-glow" aria-hidden="true">
                  WAITLIST IS NOW OPEN
                </span>
              </span>
            </p>
            <h1 id="waitlist-title">Jet is launching soon. </h1>
            <p className={styles.lede}>
              Get on the waitlist and be among the first to get access to Jet.
            </p>
          </div>
          <form
            className={styles.form}
            data-track-form="waitlist"
            data-form-state={done ? "success" : pending ? "pending" : "idle"}
            data-private=""
            onSubmit={async (event) => {
              event.preventDefault();
              if (pending || done) {
                return;
              }
              const data = new FormData(event.currentTarget);
              setError("");
              setPending(true);
              const result = await submitLead(
                "waitlist",
                { email: String(data.get("Email") ?? "").trim() },
                String(data.get("company_url") ?? ""),
              );
              setPending(false);
              if (result.ok) {
                amplitudeTrack("Waitlist Joined");
                posthogCapture("waitlist_joined");
                posthogLogInfo("waitlist_form_submitted", { form: "waitlist" });
                setDone(true);
              } else if (result.error === "validation") {
                setError(result.errors.email ?? "Enter a valid email.");
              } else {
                setError(SUBMIT_ERROR_TEXT[result.error]);
              }
            }}
          >
            <div className="visually-hidden" aria-hidden="true">
              <label htmlFor="waitlist-company-url">Company URL</label>
              <input
                id="waitlist-company-url"
                name="company_url"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <FieldGroup className="w-full flex-row items-end">
              <Field className="min-w-0 flex-1" data-invalid={error ? true : undefined}>
                <FieldLabel htmlFor="waitlist-email" className="sr-only">
                  Email
                </FieldLabel>
                <Input
                  id="waitlist-email"
                  name="Email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  required
                  disabled={done || pending}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "waitlist-email-error" : undefined}
                />
              </Field>
              {done ? null : (
                <Button type="submit" disabled={pending} aria-busy={pending}>
                  Join now
                </Button>
              )}
            </FieldGroup>
            {done ? (
              <p className="text-brand" role="status" data-form-success="waitlist">
                You&apos;re on the waitlist!
              </p>
            ) : null}
            {error ? <FieldError id="waitlist-email-error">{error}</FieldError> : null}
          </form>
        </div>
      </section>
    </div>
  );
}
