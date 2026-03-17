import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useState } from 'react';
import { BsCheck2, BsClipboard, BsGithub } from 'react-icons/bs';

const INSTALL_CMD = 'copilot plugin install Pasquale-Favella/munaciello';

const SEO_DESCRIPTION =
  'Munaciello is a GitHub Copilot CLI chat mode that verifies code before presenting it. ' +
  'Multi-model adversarial review, SQL-tracked verification ledger, baseline snapshots, and automatic rollback.';

const FEATURES: { name: string; desc: React.ReactNode }[] = [
  {
    name: 'Adversarial Review',
    desc: 'Every change gets reviewed by up to 3 different AI models — GPT, Gemini, Claude — each trying to find bugs, security holes, and logic errors. They disagree with each other. That\'s the point.',
  },
  {
    name: 'SQL Verification Ledger',
    desc: (
      <>
        Every build, test, and lint result is <code className="kbd kbd-sm">INSERT</code>ed into a SQLite
        table. The evidence bundle at the end is a <code className="kbd kbd-sm">SELECT</code>, not prose.
        If the INSERT didn&apos;t happen, the verification didn&apos;t happen.
      </>
    ),
  },
  {
    name: 'Baseline Snapshots',
    desc: "Before touching anything, Munaciello records your project's state — build, diagnostics, tests. After changes, it compares. Regressions are caught before you see the code, not after you ship it.",
  },
  {
    name: 'Pushback',
    desc: "Munaciello is a senior engineer, not an order taker. Bad idea? Tech debt? Dangerous edge case? It tells you before writing a single line. You can override it. But you'll know.",
  },
  {
    name: 'Session Memory',
    desc: "Broke a file last session? Munaciello remembers. Learned your build command? Won't ask again. Context that actually persists across conversations.",
  },
  {
    name: 'Git Autopilot',
    desc: (
      <>
        Before writing code, Munaciello checks your git state — stashes uncommitted work, creates a
        branch off <code className="kbd kbd-sm">main</code> so you&apos;re never editing trunk directly.
        After verification passes, it commits with a clear message and gives you a one-line rollback.
      </>
    ),
  },
];

const LOOP_STEPS = [
  {
    label: 'Understand & Recall',
    desc: 'Parses your request. Checks session history for past work on these files, including what broke.',
  },
  {
    label: 'Survey & Pushback',
    desc: 'Searches for existing patterns to reuse. Tells you if the approach is wrong before writing code.',
  },
  {
    label: 'Baseline',
    desc: 'Snapshots build, tests, diagnostics into the SQL ledger. This is the "before" photo.',
  },
  {
    label: 'Implement',
    desc: "Makes changes following your codebase patterns. Extends what's there instead of inventing new abstractions.",
  },
  {
    label: 'The Haunt',
    desc: 'Build, type check, lint, test — all recorded. Then up to 3 AI models attack the code. Issues get fixed before you see anything.',
    highlight: true,
  },
  {
    label: 'Evidence & Commit',
    desc: 'Structured report from SQL. Auto-commit with rollback command. Done.',
  },
];

function CopyBlock({ cmd, prefix = '$' }: { cmd: string; prefix?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="mockup-code cursor-pointer group"
      onClick={handleCopy}
      title="Click to copy"
      role="button"
      aria-label={`Copy: ${cmd}`}
    >
      <pre data-prefix={prefix} className="flex items-center justify-between gap-2 pr-4 !whitespace-normal sm:!whitespace-pre">
        <code className="text-xs sm:text-sm break-all sm:break-normal">{cmd}</code>
        <span className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          {copied ? <BsCheck2 className="text-success" size={16} /> : <BsClipboard size={16} />}
        </span>
      </pre>
    </div>
  );
}

function InstallNotes() {
  return (
    <div className="space-y-1.5 text-sm text-base-content/50">
      <p>
        Then run <code className="kbd kbd-sm">copilot</code> and select the Munaciello agent.
        Includes the{' '}
        <Link
          href="https://github.com/upstash/context7"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-primary"
        >
          Context7
        </Link>{' '}
        MCP server for up-to-date library docs.
      </p>
      <p>
        <strong className="text-base-content/70">Recommended:</strong> Add the{' '}
        <Link
          href="https://skills.sh/anthropics/skills/frontend-design"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-primary"
        >
          frontend-design
        </Link>{' '}
        skill for beautiful UI generation.
      </p>
    </div>
  );
}

const MunacielloPage: React.FC = () => {
  return (
    <>
      <NextSeo
        title="Munaciello — Evidence-First GitHub Copilot Agent"
        description={SEO_DESCRIPTION}
        openGraph={{
          title: 'Munaciello — Evidence-First GitHub Copilot Agent',
          description: SEO_DESCRIPTION,
          url: 'https://pasquale-favella.github.io/munaciello',
          type: 'website',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content:
              'github copilot, ai agent, code verification, adversarial review, sql verification ledger, copilot plugin, munaciello',
          },
          { name: 'author', content: 'Pasquale Favella' },
        ]}
      />

      <main className="space-y-20 pb-20">

        {/* ── Hero ────────────────────────────────── */}
        <section className="pt-6 space-y-8">
          <div className="badge badge-outline badge-primary text-xs font-semibold tracking-widest uppercase">
            A chat mode for GitHub Copilot CLI
          </div>

          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl leading-[1.1]">
              Your agent should prove its work.{' '}
              <span className="text-primary">
                This one does.
              </span>
            </h1>
            <p className="text-lg text-base-content/70">
              Munaciello verifies every change before you see it — builds, tests, lints,
              then has other AI models try to break it. You get proof, not promises.
            </p>
          </div>

          <div className="flex flex-col gap-3 max-w-xl">
            <CopyBlock cmd={INSTALL_CMD} />
            <InstallNotes />
          </div>

          <Link
            href="https://github.com/Pasquale-Favella/munaciello"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm gap-2 pt-1"
          >
            <BsGithub size={16} />
            View on GitHub
          </Link>
        </section>

        {/* ── The Problem ─────────────────────────── */}
        <section className="space-y-4 border-l-4 border-primary pl-6">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl max-w-2xl">
            Most AI agents are ghosts. They haunt your codebase without ever really being there.
          </h2>
          <div className="max-w-2xl space-y-3 text-base-content/70 text-lg">
            <p>
              They claim the build passes without running it. They hallucinate test results.
              They never push back. And when production breaks, they vanish —
              leaving you to explain what happened.
            </p>
            <p className="text-base-content font-semibold">We got tired of it.</p>
          </div>
        </section>

        {/* ── Features ────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div className="space-y-2">
              <div className="badge badge-outline badge-primary text-xs font-semibold tracking-widest uppercase">
                What Munaciello Does
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">Six guarantees.</h2>
            </div>
          </div>
          <div className="divide-y divide-base-300">
            {FEATURES.map((f) => (
              <div
                key={f.name}
                className="py-5 grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-8 items-start"
              >
                <h3 className="text-base font-bold text-primary leading-tight pt-0.5">{f.name}</h3>
                <p className="text-base-content/70 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── The Loop ────────────────────────────── */}
        <section className="space-y-8">
          <div className="space-y-2">
            <div className="badge badge-outline badge-primary text-xs font-semibold tracking-widest uppercase">
              Under The Hood
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Every task runs through the same loop.
            </h2>
          </div>
          <ol className="relative space-y-0">
            <div className="absolute left-[15px] top-8 bottom-8 w-px bg-base-300" aria-hidden="true" />
            {LOOP_STEPS.map((step, i) => (
              <li key={i} className="relative pl-12 pb-7 last:pb-0">
                <span className={`absolute left-0 top-0.5 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold border transition-colors ${
                  step.highlight
                    ? 'bg-primary border-primary text-primary-content'
                    : 'bg-base-300 border-base-content/20 text-base-content/60'
                }`}>
                  {i + 1}
                </span>
                <div className="pt-0.5">
                  <strong className={`text-sm ${step.highlight ? 'text-primary' : 'text-base-content'}`}>
                    {step.label}
                    {step.highlight && (
                      <span className="ml-2 badge badge-primary badge-xs align-middle">verification</span>
                    )}
                  </strong>
                  <p className="mt-1 text-base-content/60 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Pushback ────────────────────────────── */}
        <section className="space-y-4">
          <div className="space-y-2">
            <div className="badge badge-outline badge-warning text-xs font-semibold tracking-widest uppercase">
              Senior Engineer Mode
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">Munaciello pushes back.</h2>
            <p className="text-base-content/60 text-sm max-w-xl">
              Bad idea before writing a single line of code — you get a structured callout, the real
              problem identified, and three options. You can always override it.
            </p>
          </div>
          <div className="rounded-xl border bg-base-300 p-4 sm:p-6 space-y-3 text-sm">
            <p className="font-bold text-warning">
              Munaciello pushback
            </p>
            <p className="text-base-content/70 leading-relaxed">
              You asked for a &quot;delete all conversations&quot; button with no confirmation.
              The delete is permanent — users who fat-finger this lose everything. Real problem:
              users want to clean up history, not destroy it permanently.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {['Proceed as requested', 'Help me understand the real goal', 'Let me rethink'].map((opt) => (
                <span key={opt} className="badge badge-outline badge-ghost text-xs">{opt}</span>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  );
};

export default MunacielloPage;
