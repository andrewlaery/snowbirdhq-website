# Portfolio Rollout — Property Orientation + Grouped Appliances (2026-05)

## What this is

Rolls out the canonical pattern from the 25-dublin pilot (PR #17) to the 13 remaining properties. Branch: `fix/portfolio-rollout`. PR: #18.

Each property's `user-instructions.mdx` becomes:

```
## Property Orientation     (concept-level: Internet, Heating Guide, Rubbish, Children's, ...)
## Appliances               (rendered by <ApplianceSet> from facts.yaml::appliances, grouped by category)
```

Categories under `## Appliances` H2: Kitchen / Heating / Climate / Laundry / Wellness / Tech / Outdoor / Smart home / Other.

## Wave structure

| Wave | Properties | Status |
|---|---|---|
| 0 — pre-flight | `__Production/_shared/scripts/migration-verify.py` + `migration-spot-checks.yaml` | ✅ shipped |
| A | 7-suburb (verify), 41-suburb-basecamp | pending |
| B | 1-34-shotover + 2-34-shotover (paired) | pending |
| C | 10-15-gorge + 3-15-gorge (paired) | pending |
| D | 100-risinghurst-home + 100-risinghurst-unit (paired) | pending |
| E | 73a-hensman + 73b-hensman (paired) | pending |
| F | 10b-delamare + 6a-643-frankton | pending |
| G | 6-25-belfast (584-line outlier, alone) | pending |

## Per-property workflow

```bash
# 1. Capture pre-migration baseline
python ~/code/__Production/_shared/scripts/migration-verify.py <slug> --capture

# 2. Run migration (per-property script adapted from migrate-25-dublin-to-library.py)
python ~/code/__Production/_shared/scripts/migrate-<slug>.py   # OR adapted in-place

# 3. Translate new appliance entries × ZH + JA
node --env-file=.env.local scripts/translate-property.mjs --file <new appliance .md> <zh|ja path> <lang>

# 4. Re-translate user-instructions.mdx × ZH + JA
node --env-file=.env.local scripts/translate-property.mjs --file content/docs/properties/<slug>/user-instructions.mdx content/docs/<lang>/properties/<slug>/user-instructions.mdx <lang>

# 5. Refresh manifest hashes (post-pre-commit-hook)
# (mechanical fix — see CLAUDE.md "Pre-commit end-of-file-fixer recompacts files AFTER staging")

# 6. Verify
python ~/code/__Production/_shared/scripts/migration-verify.py <slug>
node scripts/check-translation-freshness.mjs

# 7. Build verify
SHARED_REPO=/nonexistent npx next build

# 8. Commit per property + push
```

## Reference

- Plan: `~/.claude/plans/can-you-please-do-rustling-pike.md`
- 25-dublin pilot: PR #17 (`6500b08` on main)
- Per-property audits: `__Production/_shared/properties/<slug>/AUDIT.md`
- Workspace audit roll-up: `__Production/_shared/SOT_AUDIT_2026-05.md`
- Migration script template: `__Production/_shared/scripts/migrate-25-dublin-to-library.py`
- Verification harness: `__Production/_shared/scripts/migration-verify.py`
- Spot-check probes: `__Production/_shared/scripts/migration-spot-checks.yaml`

## Cost + time

- ~$6 in Sonnet 4.6 API translations (45 new appliance entries × 2 locales + 13 user-instructions × 2 locales).
- 12-20 hours active work + 2-3 hours verification.
- Realistic to split across 2-3 sessions.

## When this is done

- Delete this file (`docs/PORTFOLIO_ROLLOUT_2026-05.md`).
- Mark the page-structure portfolio finding RESOLVED in `__Production/_shared/SOT_AUDIT_2026-05.md`.
- Update CHANGELOG with a single entry covering all 13 migrations.
