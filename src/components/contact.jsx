import { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Github,
  Linkedin,
  Mail,
  Send,
  XCircle,
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const CONTACT_EMAIL = 'antbalanzategui@vt.edu';

const inputClass =
  'w-full rounded-md border hairline bg-bg/60 px-3 py-2.5 font-sans text-sm text-fg placeholder:text-muted/60 focus:border-fg/30 focus:outline-none focus:ring-1 focus:ring-fg/20';

function buildMailto({ name, email, message }) {
  const safeName = name.trim();
  const subject = `Portfolio message from ${safeName}`;
  const body = [
    `From: ${safeName} <${email.trim()}>`,
    '',
    message.trim(),
  ].join('\n');
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '', _hp: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | opened | fallback
  const [copied, setCopied] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    if (status === 'fallback') setStatus('idle');
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    else if (!/^[A-Za-z\s.'-]{2,80}$/.test(form.name.trim()))
      next.name = 'Letters, spaces, apostrophes, and hyphens only.';
    if (!form.email.trim()) next.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = 'That doesn’t look like a valid email.';
    if (!form.message.trim()) next.message = 'Please enter a message.';
    else if (form.message.trim().length < 10)
      next.message = 'A little more detail, if you can.';
    else if (form.message.length > 5000)
      next.message = 'Message is over 5,000 characters — trim it down a bit.';
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form._hp) return; // honeypot — silent drop
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    const url = buildMailto(form);
    let opened = false;
    try {
      // Best-effort detection: most browsers will navigate the same tab
      // when the OS has a default mail handler. Use a same-tab assign so
      // we don't trip popup blockers.
      window.location.href = url;
      opened = true;
    } catch {
      opened = false;
    }
    setStatus(opened ? 'opened' : 'fallback');
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="contact" className="border-b hairline py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12">
          <div className="font-mono text-xs uppercase tracking-widest text-muted">
            04 / Contact
          </div>
          <h2 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">
            Let&apos;s talk.
          </h2>
          <p className="mt-3 max-w-xl text-base text-muted">
            Drop a message below, or find me on the usual places.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-[280px_1fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <ContactLink
                href={`mailto:${CONTACT_EMAIL}`}
                icon={Mail}
                label={CONTACT_EMAIL}
              />
              <ContactLink
                href="https://github.com/antbalanzategui"
                icon={Github}
                label="github.com/antbalanzategui"
              />
              <ContactLink
                href="https://www.linkedin.com/in/antbalanzategui/"
                icon={Linkedin}
                label="linkedin.com/in/antbalanzategui"
              />
            </div>
            <div className="rounded-md border hairline bg-surface/40 p-4 font-mono text-xs leading-relaxed text-muted">
              <div>
                <span className="text-fg">status</span> · open to collaboration
              </div>
              <div>
                <span className="text-fg">based</span> · Richmond, VA
              </div>
              <div>
                <span className="text-fg">reply</span> · usually within a day
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-xl border hairline bg-surface/30 p-6 md:p-8"
            noValidate
          >
            <Field label="Name" error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                autoComplete="name"
                className={cn(inputClass, errors.name && 'border-red-500/50')}
                placeholder="Your name"
              />
            </Field>

            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                autoComplete="email"
                inputMode="email"
                className={cn(inputClass, errors.email && 'border-red-500/50')}
                placeholder="you@domain.com"
              />
            </Field>

            <Field label="Message" error={errors.message}>
              <textarea
                rows={5}
                value={form.message}
                onChange={handleChange('message')}
                className={cn(
                  inputClass,
                  'resize-y min-h-[120px]',
                  errors.message && 'border-red-500/50',
                )}
                placeholder="What are you working on?"
              />
            </Field>

            {/* Honeypot — hidden from real users, attractive to bots */}
            <div className="hidden" aria-hidden="true">
              <label>
                Website
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form._hp}
                  onChange={handleChange('_hp')}
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div aria-live="polite" className="text-sm">
                {status === 'opened' && (
                  <span className="inline-flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Email client opened — hit Send there to deliver.
                  </span>
                )}
                {status === 'fallback' && (
                  <span className="inline-flex items-center gap-2 text-amber-400">
                    <XCircle className="h-4 w-4" />
                    Couldn&apos;t open your mail client. Copy the address →
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-1.5 rounded-md border hairline bg-bg/60 px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:text-fg hover:border-fg/30"
                  aria-label="Copy email address"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copied ? 'Copied' : 'Copy email'}
                </button>
                <Button type="submit" variant="accent" size="md">
                  Send
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="text-[11px] leading-relaxed text-muted">
              This form opens your mail app with the message pre-filled — your
              email goes directly to {CONTACT_EMAIL}, with no third-party relay
              in the middle.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
          {label}
        </span>
        {error && <span className="text-[11px] text-red-400">{error}</span>}
      </div>
      {children}
    </label>
  );
}

function ContactLink({ href, icon: Icon, label }) {
  const external = href.startsWith('http');
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group flex items-center gap-3 rounded-md border hairline bg-surface/40 px-3 py-2.5 text-sm text-fg/85 transition-colors hover:text-fg"
    >
      <Icon className="h-4 w-4 text-muted group-hover:text-accent" />
      <span className="font-mono text-xs">{label}</span>
    </a>
  );
}
