---
title: Welcome to Field Notes
date: 2026-05-13
description: What this section is, what it isn't, and what to expect.
tags: [meta]
---

This is the working notebook side of the site. The polished writeups live under
**Work**; this is where the half-formed stuff lives — what I tried, what
didn't hold up, what surprised me on a Tuesday.

What ends up here won't necessarily relate to what I'm officially working on.
Some entries will. Plenty won't. Anything I find worth a few minutes of
thinking out loud is fair game: a paper I'm chewing on, an argument I've
changed my mind about, a graph that came out weird, something I noticed once
and want to remember later. Treat it as a low-stakes journal that happens to
be public.

Posts here will be short. Long-form belongs in [Case Studies](/case-studies).

---

### How this works under the hood

Each entry is a markdown file in `/posts/` with simple YAML frontmatter:

```yaml
---
title: A new entry
date: 2026-05-14
description: One-line summary for the index page.
tags: [bas, statistics]
draft: false
---
```

The index page picks up new files at build time and sorts them by date.
