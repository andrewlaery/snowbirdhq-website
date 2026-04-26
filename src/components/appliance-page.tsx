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
import { BoschDHL555BAU } from '@/content/appliances/bosch-dhl555bau';
import { DelonghiEN85BMAE } from '@/content/appliances/delonghi-en85bmae';
import { BoschSMU2ITS01A } from '@/content/appliances/bosch-smu2its01a';
import { AegKSK782220M } from '@/content/appliances/aeg-ksk782220m';
import { PanasonicNNST665B } from '@/content/appliances/panasonic-nn-st665b';
import { SamsungFrameQA65LS03DASXNZ } from '@/content/appliances/samsung-frame-qa65ls03dasxnz';
import { SamsungUA43DU8000SXNZ } from '@/content/appliances/samsung-ua43du8000sxnz';
import { SonosSystem } from '@/content/appliances/sonos-system';
import { MieleWCA020WCS } from '@/content/appliances/miele-wca020wcs';
import { MieleTCB140WP } from '@/content/appliances/miele-tcb140wp';
import { TefalFV2868 } from '@/content/appliances/tefal-fv2868';

const APPLIANCES: Record<string, () => React.ReactElement> = {
  'bosch-pue611bb5': BoschPUE611BB5,
  'bosch-dhl555bau': BoschDHL555BAU,
  'delonghi-en85bmae': DelonghiEN85BMAE,
  'bosch-smu2its01a': BoschSMU2ITS01A,
  'aeg-ksk782220m': AegKSK782220M,
  'panasonic-nn-st665b': PanasonicNNST665B,
  'samsung-frame-qa65ls03dasxnz': SamsungFrameQA65LS03DASXNZ,
  'samsung-ua43du8000sxnz': SamsungUA43DU8000SXNZ,
  'sonos-system': SonosSystem,
  'miele-wca020wcs': MieleWCA020WCS,
  'miele-tcb140wp': MieleTCB140WP,
  'tefal-fv2868': TefalFV2868,
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
