/**
 * Renders an appliance manual section by model slug. The body of each
 * appliance lives in `src/content/appliances/<model>.tsx` and is registered
 * in `APPLIANCES`. Properties declare which appliances they have via
 * `facts.yaml::appliances:` (a list of model slugs); their MDX pages can
 * either render <AppliancePage model="..."> per appliance, or list them
 * via <ApplianceSet slug="..."> which fans out automatically.
 *
 * Adding a new appliance = one new file in `src/content/appliances/` plus a
 * one-line entry in APPLIANCES. The same appliance reused by N properties
 * is then a single source of truth.
 */

import { loadFacts } from '@/lib/sot';

import { BoschPUE611BB5 } from '@/content/appliances/bosch-pue611bb5';

const APPLIANCES: Record<string, () => React.ReactElement> = {
  'bosch-pue611bb5': BoschPUE611BB5,
  // Phase 2: register the rest of the appliance models as their MDX bodies
  // are migrated out of property-level user-instructions.mdx into
  // src/content/appliances/<model>.tsx.
};

export function AppliancePage({ model }: { model: string }) {
  const Component = APPLIANCES[model];
  if (!Component) {
    return (
      <div className="not-prose rounded border border-red-300 bg-red-50 p-4 text-sm">
        <strong>Missing appliance:</strong> <code>{model}</code>. Add an entry
        to <code>src/content/appliances/</code> and register in{' '}
        <code>src/components/appliance-page.tsx</code>.
      </div>
    );
  }
  return <Component />;
}

/** Render every appliance declared in this property's facts.yaml. */
export function ApplianceSet({ slug }: { slug: string }) {
  const facts = loadFacts(slug);
  const models = facts.appliances ?? [];
  if (models.length === 0) return null;
  return (
    <>
      {models.map((m) => (
        <AppliancePage key={m} model={m} />
      ))}
    </>
  );
}
