# Resume source

`Antonio_Balanzategui_Resume.tex` is the LaTeX source for the resume that
ships at `/public/Antonio_Balanzategui_Resume_1.pdf`.

## Build

Easiest: paste into [Overleaf](https://overleaf.com), hit Recompile.

Local:

```
pdflatex Antonio_Balanzategui_Resume.tex
```

Then copy the resulting PDF into `public/Antonio_Balanzategui_Resume_1.pdf`
so the portfolio Hero button serves the latest version.

## ATS-friendly design choices

- **Single column.** All ATS handle this.
- **Standard section headings:** EXPERIENCE, PROJECTS, EDUCATION, SKILLS.
- **ASCII-only body text.** No Unicode superscripts, en-dashes, minus
  signs, or tildes. Older Workday / Taleo parsers strip those silently.
  Specifically: `T-squared` not `T²`, `-512.26` not `−512.26`, `~330K`
  not `∼330K`, `Navier-Stokes` not `Navier–Stokes`, `n*` not `n∗`.
- **Bullet character is `\bullet`** (renders as standard round dot) rather
  than en-dash, which some ATS treat as a hyphen and concatenate items.
- **Plain hyperlinks** (no colored boxes around URLs).
- **2-line italicized headline** under the contact block reframes the
  "BAS Programmer" title against the actual work — applied statistics
  and GPU scientific computing — so keyword searches for "data
  scientist," "applied statistics," "GPU," and "scientific computing"
  hit the document.
- **Skills section expanded** to surface every technical noun mentioned
  in the body (Hawkes processes, CFD primitives, MD libraries, GPU
  toolchain). ATS keyword-matching weighs the Skills section heavily.

## What to edit when applying for specific roles

The Skills section is grouped so you can lightly re-order to match the
job description without rewriting the body. Quant fund: move "Statistics
& Time Series" to the top. National lab / research: move "Scientific
Computing & Physics" to the top. Industrial ML: move "Building
Automation & Industrial Control" up.
