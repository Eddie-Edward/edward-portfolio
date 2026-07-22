# Recruiter-readiness design audit

_Structural Design-DNA-style audit performed 2026-07-21 during the recruiter-readiness
rebuild (branch `rebuild/recruiter-readiness`). Analysis method only — no external
portfolio's composition, branding, or illustration was copied._

## Method

Each dimension below was audited against baseline screenshots (390×844, 768×1024,
1440×1000, 1920×1080, reduced-motion 1440×1000) captured at commit `0d2acd2`, then
re-checked after the PR 4/PR 5 changes.

## 1. Hierarchy

- **Before:** the constellation was the second section and the primary way to understand
  the portfolio; all ten nodes carried near-equal visual weight, and the Selected Work
  grid opened on all projects, so previews competed with resume-verified work.
- **After:** reading order is identity → four featured systems → timeline/evidence →
  systems map → skills → roadmap → contact. Featured nodes keep glow + stronger labels;
  secondary nodes are smaller, glow-free, and 70% opacity. Edges touching the selected
  node brighten; unrelated edges recede to 30% opacity.

## 2. First-10-second recruiter path

Hero answers: who (name + headline), where (UMich, class of 2028), what now (status
chip), and offers a one-row path — Featured work ↓ / Resume (once hosted) / GitHub /
Contact. The Work section opens on exactly the four resume projects with status badges.
**Open friction:** the resume PDF and custom domain are blocked on Edward (see NEEDS
INPUT checklist); until then the resume step of the path is intentionally absent.

## 3. Typography

Three families with clear roles: Space Grotesk (display/headings), Inter (body),
JetBrains Mono (metadata/kickers/labels). Scale is consistent; mono is reserved for
system-ish metadata (periods, kickers, chips), which supports the "technical, evidence-led"
tone without fake-terminal styling. No change needed.

## 4. Density

- Preview clutter reduced: 11 → 10 projects, standalone placeholder cards (FrameZero,
  Agent Ops Daily) folded into contentOS; exactly one `source:"todo"` preview remains
  (Trading Research).
- Work grid default shows 4 cards instead of 10+ — density now escalates on demand
  (All is one click away) instead of front-loading.

## 5. Color roles

Accent (cyan) = shipped/working + interactive emphasis; nebula (violet) = active/
in-development; signal = "now" status; dim/mist/ink = three-step text hierarchy.
Status color is always paired with a text badge, so color is never the only signal.
`dim` (#7c85a8, ~5:1 on void) is used for labels/metadata only, not body copy.

## 6. Motion purpose

- Motion (library): component state — reveals, hover physics, filter transitions,
  panel crossfade.
- GSAP: deterministic sequences — hero entrance, scroll scrub, constellation draw-in,
  ambient drift with freeze-on-focus.
- New in PR 5: selection state expressed by CSS-transitioned edge opacity and a single
  0.7 s one-shot selection pulse — no new infinite loops, no animated blur/shadow.
- Reduced motion: all three layers collapse to static; verified by e2e tests.

## 7. Repeated visual motifs

Orbital ring + node + connection line is the identity motif (hero field, constellation,
node-list dots). Glass surfaces are the container motif — used for cards/panels but not
stacked; the constellation detail panel adds evidence bullets via typography rather than
more glass. Watch item: keep glass count flat; add depth with spacing/type, not blur.

## 8. Mobile behavior

The constellation is desktop-only; mobile gets a node list that anchors into the
canonical work cards (dead-anchor reset to All on hashchange). Featured systems are
first in the list. No horizontal overflow at 390/768/1024/1440/1920 (e2e-enforced).

## 9. Proof visibility

Every strong number on the site is now a verified checkpoint with explicit framing
("at the last directly verified checkpoint"), sourced via the content layer's
`source` provenance enum. Proof-of-work achievement cards sit directly under the
timeline. Case studies carry Problem → Built → Engineering → Outcome → Future with
honest "not complete" outcomes for active work.

## 10. Recruiter friction (remaining)

1. No hosted resume PDF (blocked on Edward — checklist Q12/Q13).
2. No custom domain; canonical URLs use the Vercel subdomain (checklist Q14).
3. InterviewCopilot has no public repository link until Edward supplies a working URL
   (checklist Q3) — currently stated honestly on the card.
4. Social embeds depended on default metadata — addressed in PR 6 (OG image + canonical
   metadata).

## Verdict

The site's structural DNA is orbital, editorial, and evidence-led; the rebuild keeps
that identity while making the recruiter path explicit and the hierarchy legible. The
remaining gaps are human-blocked inputs, not design defects.
