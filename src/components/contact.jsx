import { useState } from 'react';
import { CheckCircle2, Github, Linkedin, Mail, Send, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const inputClass =
  'w-full rounded-md border hairline bg-bg/60 px-3 py-2.5 font-sans text-sm text-fg placeholder:text-muted/60 focus:border-fg/30 focus:outline-none focus:ring-1 focus:ring-fg/20';

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | sent | error

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    if (status === 'error') setStatus('idle');
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    else if (!/^[A-Za-z\s.'-]+$/.test(form.name))
      next.name = 'Letters, spaces, apostrophes, and hyphens only.';
    if (!form.email.trim()) next.email = 'Please enter your email.';
    else if (!/\S+@\S+\.\S+/.test(form.email))
      next.email = 'That doesn’t look like a valid email.';
    if (!form.message.trim()) next.message = 'Please enter a message.';
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('send failed');
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
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
                href="mailto:antbalanzategui@vt.edu"
                icon={Mail}
                label="antbalanzategui@vt.edu"
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
                className={cn(inputClass, errors.name && 'border-red-500/50')}
                placeholder="Your name"
              />
            </Field>

            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
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

            <div className="flex items-center justify-between gap-3">
              <div aria-live="polite" className="text-sm">
                {status === 'sent' && (
                  <span className="inline-flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Message sent — I&apos;ll be in touch.
                  </span>
                )}
                {status === 'error' && (
                  <span className="inline-flex items-center gap-2 text-red-400">
                    <XCircle className="h-4 w-4" />
                    Something went wrong. Email me directly?
                  </span>
                )}
              </div>
              <Button
                type="submit"
                variant="accent"
                size="md"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Sending…' : 'Send'}
                <Send className="h-4 w-4" />
              </Button>
            </div>
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
        {error && (
          <span className="text-[11px] text-red-400">{error}</span>
        )}
      </div>
      {children}
    </label>
  );
}

function ContactLink({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-md border hairline bg-surface/40 px-3 py-2.5 text-sm text-fg/85 transition-colors hover:text-fg"
    >
      <Icon className="h-4 w-4 text-muted group-hover:text-accent" />
      <span className="font-mono text-xs">{label}</span>
    </a>
  );
}
