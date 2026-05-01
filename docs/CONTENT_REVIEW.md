# Content Review Checklist

> **Related:** for SOT data-layer audits (per-property `AUDIT.md` × 14 + workspace roll-up), see `__Production/_shared/properties/<slug>/AUDIT.md` and `__Production/_shared/SOT_AUDIT_YYYY-MM.md`. Quarterly cadence; driven by `__Production/_shared/scripts/audit-properties.sh`. Last pass: 2026-05-02.

For each page, mark each row:
- ☐ not yet reviewed
- 🔍 in progress
- ✅ reviewed + approved
- ⚠️ issue noted, fix pending

## Review dimensions (per page)
1. **Accuracy** — does every claim match reality (addresses, appliance models, emergency numbers, check-in instructions)?
2. **Completeness** — are any placeholders, TODOs, or obvious gaps remaining?
3. **Consistency** — matches the structure/tone of the corresponding page on other properties?
4. **Sensitive data** — no plaintext credentials, no PII, no vendor phone/email, no security codes?
5. **Vault artefacts** — no wiki-links (`[[...]]`), no dataview blocks, no stray Obsidian frontmatter (`tags:` should be stripped by sync script), no Obsidian comments?
6. **Readability** — no typos, clear headings, appropriate length, works on mobile?

## Pages in scope (13 live pages)

### Migrated properties (real content)
| Page | Accuracy | Completeness | Consistency | Sensitive | Artefacts | Readability |
|---|---|---|---|---|---|---|
| 7-suburb/index | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 7-suburb/welcome-house-rules | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 7-suburb/user-instructions | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 7-suburb/critical-info | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 25-dublin/index | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 25-dublin/welcome-house-rules | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 25-dublin/user-instructions | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 25-dublin/critical-info | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 6-25-belfast/index | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 6-25-belfast/welcome-house-rules | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 6-25-belfast/user-instructions | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 6-25-belfast/critical-info | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

### Shared
| Page | Accuracy | Completeness | Consistency | Sensitive | Artefacts | Readability |
|---|---|---|---|---|---|---|
| queenstown-insights | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

### Placeholder properties — decide per property
For each of these, choose: (a) delete the stub entirely + drop from `content/docs/properties/meta.json`, OR (b) keep placeholder but add `draft: true` frontmatter + a not-indexed message:

- 1-34-shotover
- 2-34-shotover
- 3-15-gorge
- 10-15-gorge
- 14-15-gorge
- 41-suburb-bonsai
- 10b-delamare
- 6a-643-frankton
- 73a-hensman
- 73b-hensman
- 100-risinghurst-home
- 100-risinghurst-unit

## Review process per page

1. Open the page in a browser using a Short.io link (or `docs.snowbirdhq.com/docs/properties/{slug}/{page}?access=<DOCS_ACCESS_KEY>`)
2. Scan through all 6 dimensions with the user
3. Fix issues in the corresponding Obsidian vault `.md` file (NOT the MDX)
4. Re-sync: `./scripts/sync-property-compendium.sh --only {slug}`
5. Re-verify in browser
6. Commit with message `content({slug}/{page}): review pass — <short note>`
7. Mark ✅ on the checklist, commit the checklist update in a separate commit.
