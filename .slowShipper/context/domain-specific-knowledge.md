# Domain-Specific Knowledge

<!-- Refined from loot/ by slowShipper refine. Source: vocabulary.md, kitchen-sink.md. -->

## Product overview

SME Roster is a static, mobile-first roster of subject-matter experts (SMEs) for discovery and contact. Visitors browse a grid of expert cards, filter by sector and search, and open detail profiles. The site is "Bento-lite / Linear-inspired" dark UI, deployed from `docs/` via GitHub Pages. No backend; all data is `docs/data/smes.json`. Maintainers and AI add or edit profiles by editing that file; UI chrome is localized (EN/FI/SV).

## Key vocabulary

| Term | Meaning |
|------|---------|
| **id** | UUID v4; unique per profile. **Assigned at creation only.** Used in profile URLs (`profile.html?id=<uuid>`) and for stable color variant. Generate with e.g. `uuidgen` or `python3 -c "import uuid; print(uuid.uuid4())"`. Must be unique across `docs/data/smes.json`. |
| **SME** | Subject-matter expert; one person/role in the roster (one object in smes.json). |
| **Profile** | Full record for one SME: name, title, bios, sectors, tags, history, links. Shown on `profile.html?id=<uuid>`. |
| **Roster** | The product/site: the grid of expert cards (index) plus detail pages. |
| **Card** | One tile on the roster grid (sme-card): name, role, short bio, sector pill, languages; links to profile. |
| **sectors** | High-level areas (e.g. IoT, SaaS). Used for main-page filter chips only. |
| **tags** | Expertise tags; shown on card and profile; used in search and filter matching. |
| **keywords** | Extra terms for search only; not displayed as chips. |
| **engagement** | How the expert works (e.g. Advisory, Fractional, Hands-on). |
| **colorVariant** | Integer 0–5 for card/avatar color; optional; else derived from id hash. |
| **Filter / Search / Sort** | Filter = sector chips + text search; state in localStorage. Sort = Name, Recently added, Primary sector. |
| **Theme / Language** | Dark/light and EN/FI/SV; persisted in localStorage; language applies to UI chrome only, not profile content. |
| **UUID v4** | Required format for profile `id`. EN/FI/SV = language codes. **a11y** = accessibility. |

## Profile data rules

- **Every profile must have an `id` in UUID v4 format.** The `id` is tied at creation: when adding a new entry to `docs/data/smes.json`, generate a new UUID v4 and set it as `id`. Do not reuse or derive from existing ids.
- **Uniqueness:** The `id` must be unique in the file. Used in URLs and for stable card/avatar colors. Full schema and examples: **`AI-HANDOFF.md`**.

## User types / roles

- **Visitor** — Views roster and profiles; uses filters, search, sort; can switch theme and language. No auth.
- **Maintainer / AI** — Adds or edits entries in `smes.json`; follows AI-HANDOFF schema and anonymization rules when deriving from real CVs.

## Core workflows

### View roster

1. Open index; data loads from `data/smes.json`.
2. Filter by sector chips and/or search text; sort by name, recent, or sector.
3. Click a card → `profile.html?id=<uuid>`.

### View profile

1. Open profile page with `?id=<uuid>`; app finds SME by id and renders sections (headline, bio, history, expertise, engagement, links).
2. If id missing or not found, error message and link back to roster.

### Add or edit expert

1. Edit `docs/data/smes.json`: add or change one object per SME.
2. For **new** profiles: generate new UUID v4 for `id`; ensure unique in file; set required fields (name, title, shortBio). Optional: set `colorVariant` 0–5.
3. No build step; roster and profile reflect changes after refresh. See **AI-HANDOFF.md** for full schema.

### Anonymization (CV → profile)

When profiles are derived from **real CVs**, anonymize so individuals and employers cannot be identified. Apply consistently: role-based display names (not real names); generic org descriptors; region-only location; no identifying courses or institutes. Keep roles, technologies, and responsibilities; strip names of people and programs that identify employer or person. Details: **AI-HANDOFF.md** (Anonymization section). The app does not validate or redact; reviewers apply the rules.
