# Resume source

`Antonio_Balanzategui_Resume.tex` is the LaTeX source for the resume that
ships at `/public/Antonio_Balanzategui_Resume_1.pdf` (the Hero "Resume"
button).

## Build

Compile with [Tectonic](https://tectonic-typesetting.github.io/):

```
tectonic -X compile Antonio_Balanzategui_Resume.tex --outdir .
```

Check the result is still one page, then copy the PDF to
`public/Antonio_Balanzategui_Resume_1.pdf`.

## Retired pipeline

`resume.html` and `scripts/build-resume.js` (HTML + Playwright, May 2026)
are the old build. They are out of date: do not run `build-resume.js`, it
would overwrite the current PDF with the old resume.
