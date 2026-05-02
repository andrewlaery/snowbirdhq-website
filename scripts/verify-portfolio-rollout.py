#!/usr/bin/env python3
"""verify-portfolio-rollout.py

Git-based content-coverage check for portfolio rollout (PR #18).

For each migrated property, compares:
  - PRE-migration: EN source files (user-instructions.mdx + facts.yaml::usage_sections)
    extracted from the parent commit of the wave that touched this property.
  - POST-migration: current EN files (user-instructions.mdx + every appliance
    library entry referenced in facts.yaml::appliances).

Reports per-property:
  - Pre-migration token set size (unique meaningful words)
  - Post-migration token set size
  - Coverage % (intersection / pre-migration set)
  - Top missing tokens (sorted by importance)

Usage: python scripts/verify-portfolio-rollout.py
"""

import re
import subprocess
import sys
import yaml
from pathlib import Path

WEB = Path(__file__).resolve().parent.parent
APPLIANCES_DIR = WEB / "data" / "sot" / "_appliances"
PROPERTIES_DIR = WEB / "data" / "sot" / "properties"
MDX_DIR = WEB / "content" / "docs" / "properties"

WAVES = {
    "41-suburb-basecamp": "1547b11",
    "7-suburb": "7103747",
    "1-34-shotover": "0a9d707",
    "2-34-shotover": "0a9d707",
    "10-15-gorge": "caed2c9",
    "3-15-gorge": "caed2c9",
    "100-risinghurst-home": "0bac0a4",
    "100-risinghurst-unit": "0bac0a4",
    "73a-hensman": "81b4981",
    "73b-hensman": "81b4981",
    "10b-delamare": "8dca173",
    "6a-643-frankton": "8dca173",
    "6-25-belfast": "49b18b9",
}

STOP = set(
    """
the a an and or but if then else when of in to for on at by from with as is are was were
be been being have has had do does did this that these those it its it's i you your we
us our they them their he she his her my mine yours ours theirs himself herself itself
themselves not no yes please use used using can could should would may might must shall
will all any some many most more less few each every other another some same such only just
also too very really quite rather etc i.e. e.g. ie eg via per across over under above
below into onto off up down out in on at to by for of with from
""".split()
)

WORD_RE = re.compile(r"[A-Za-z][A-Za-z0-9\-]{2,}")


def tokenize(text: str) -> set[str]:
    """Lowercase set of meaningful tokens (3+ chars, no stopwords)."""
    return {
        w.lower()
        for w in WORD_RE.findall(text)
        if w.lower() not in STOP and len(w) >= 3
    }


def git_show(rev: str, path: str) -> str:
    try:
        out = subprocess.check_output(
            ["git", "-C", str(WEB), "show", f"{rev}:{path}"], stderr=subprocess.DEVNULL
        )
        return out.decode("utf-8", errors="replace")
    except subprocess.CalledProcessError:
        return ""


def get_pre_migration_text(slug: str, wave_commit: str) -> str:
    """Source content from the commit IMMEDIATELY BEFORE the wave commit."""
    parent = f"{wave_commit}^"
    parts = []
    mdx = git_show(parent, f"content/docs/properties/{slug}/user-instructions.mdx")
    parts.append(mdx)
    facts_yaml = git_show(parent, f"data/sot/properties/{slug}/facts.yaml")
    if facts_yaml:
        try:
            data = yaml.safe_load(facts_yaml)
            exc = (data or {}).get("exceptions", {}) or {}
            us = exc.get("usage_sections") or []
            for sec in us:
                if isinstance(sec, dict):
                    body = sec.get("body") or ""
                    heading = sec.get("heading") or ""
                    parts.append(f"## {heading}\n{body}")
        except yaml.YAMLError:
            parts.append(facts_yaml)
    return "\n\n".join(parts)


def get_post_migration_text(slug: str) -> str:
    """Current MDX + every appliance library entry referenced in facts.yaml::appliances."""
    parts = []
    mdx_path = MDX_DIR / slug / "user-instructions.mdx"
    if mdx_path.exists():
        parts.append(mdx_path.read_text())
    facts_path = PROPERTIES_DIR / slug / "facts.yaml"
    if facts_path.exists():
        try:
            data = yaml.safe_load(facts_path.read_text())
            appliances = (data or {}).get("appliances") or []
            for app_slug in appliances:
                ap = APPLIANCES_DIR / f"{app_slug}.md"
                if ap.exists():
                    parts.append(ap.read_text())
        except yaml.YAMLError:
            pass
    return "\n\n".join(parts)


def main():
    print()
    print(f"{'PROPERTY':<28} {'PRE':>6} {'POST':>6} {'COVERED':>8} {'%':>6}  STATUS")
    print("-" * 90)
    overall_pre, overall_covered = 0, 0
    issues = []
    for slug, commit in WAVES.items():
        pre_text = get_pre_migration_text(slug, commit)
        post_text = get_post_migration_text(slug)
        pre_tokens = tokenize(pre_text)
        post_tokens = tokenize(post_text)
        covered = pre_tokens & post_tokens
        missing = pre_tokens - post_tokens
        ratio = (len(covered) / len(pre_tokens) * 100) if pre_tokens else 100.0
        if ratio >= 90:
            status = "OK"
        elif ratio >= 80:
            status = "OK*"
        elif ratio >= 70:
            status = "REVIEW"
        else:
            status = "LOSS"
        if status in ("REVIEW", "LOSS"):
            issues.append((slug, ratio, sorted(missing)))
        overall_pre += len(pre_tokens)
        overall_covered += len(covered)
        print(
            f"{slug:<28} {len(pre_tokens):>6} {len(post_tokens):>6} {len(covered):>8} {ratio:>5.1f}%  {status}"
        )
    print("-" * 90)
    overall = (overall_covered / overall_pre * 100) if overall_pre else 100.0
    print(
        f"{'PORTFOLIO TOTAL':<28} {overall_pre:>6} {'':>6} {overall_covered:>8} {overall:>5.1f}%"
    )
    print()
    print("Legend: OK >=90% | OK* 80-89% (rephrasing) | REVIEW 70-79% | LOSS <70%")
    print()
    if issues:
        print("=== Properties to investigate ===")
        for slug, ratio, missing in issues:
            print(f"\n{slug} ({ratio:.1f}% coverage)")
            sample = [t for t in missing if len(t) >= 5][:30]
            print(f"  Top missing tokens (sample): {', '.join(sample)}")
    return 0 if not issues else 1


if __name__ == "__main__":
    sys.exit(main())
