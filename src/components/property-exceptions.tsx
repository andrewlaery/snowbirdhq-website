/**
 * Renderers for facts.yaml::exceptions — the per-property structured deltas.
 *
 * The four components map 1:1 to the four exception subsections so MDX can
 * place them precisely (hazards belong in critical-info, house_rules in
 * welcome-house-rules, etc.).
 */

import ReactMarkdown from 'react-markdown';

import { loadFacts } from '@/lib/sot';

interface SlugProp {
  slug: string;
}

export function PropertyHazards({ slug }: SlugProp) {
  const hazards = loadFacts(slug).exceptions?.hazards ?? [];
  if (hazards.length === 0) return null;
  return (
    <>
      <h3>Property-Specific Hazards</h3>
      <ul>
        {hazards.map((h, i) => (
          <li key={i}>{h.description.trim()}</li>
        ))}
      </ul>
    </>
  );
}

export function PropertyHouseRulesDeltas({ slug }: SlugProp) {
  const deltas = loadFacts(slug).exceptions?.house_rules ?? [];
  if (deltas.length === 0) return null;
  return (
    <>
      {deltas.map((d) => (
        <section key={d.category}>
          <h3>{d.heading}</h3>
          <ul>
            {d.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

export function PropertyAccessInstructions({ slug }: SlugProp) {
  const a = loadFacts(slug).exceptions?.access;
  if (!a || !(a.front_door || a.back_door || a.garage || a.other)) return null;
  return (
    <section>
      <h3>Access</h3>
      <ul>
        {a.front_door && (
          <li>
            <strong>Front door:</strong> {a.front_door.trim()}
          </li>
        )}
        {a.back_door && (
          <li>
            <strong>Back door:</strong> {a.back_door.trim()}
          </li>
        )}
        {a.garage && (
          <li>
            <strong>Garage:</strong> {a.garage.trim()}
          </li>
        )}
        {a.other && <li>{a.other.trim()}</li>}
      </ul>
    </section>
  );
}

export function PropertyOperationalNotes({ slug }: SlugProp) {
  const notes = loadFacts(slug).exceptions?.notes ?? [];
  if (notes.length === 0) return null;
  return (
    <section>
      <h3>Notes</h3>
      <ul>
        {notes.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
    </section>
  );
}

export function PropertyUsageSections({ slug }: SlugProp) {
  const sections = loadFacts(slug).exceptions?.usage_sections ?? [];
  if (sections.length === 0) return null;
  return (
    <>
      {sections.map((s) => {
        // The Appliances section renders as H2 (with TOC anchor) to match
        // the heading rendered by <ApplianceSet> on properties using the
        // per-model component pattern. All other sections stay H3.
        const isAppliances = s.category === 'appliances';
        return (
          <section key={s.category}>
            {isAppliances ? (
              <h2 id="appliances">{s.heading}</h2>
            ) : (
              <h3>{s.heading}</h3>
            )}
            <ReactMarkdown>{s.body.trim()}</ReactMarkdown>
          </section>
        );
      })}
    </>
  );
}
