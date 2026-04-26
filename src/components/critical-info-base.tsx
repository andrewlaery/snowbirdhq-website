/**
 * Shared "Critical Info" boilerplate — emergency numbers, services directory,
 * fire safety procedures. Identical across all 13 active properties (and
 * verified against `7-suburb/critical-info.mdx`, `25-dublin/critical-info.mdx`,
 * etc. — the only deltas are property-specific hazard items, which stay in
 * each property's own `critical-info.mdx`).
 *
 * Per-property additions go AFTER this component in each property's MDX:
 *
 *   <CriticalInfoBase />
 *
 *   ## Property-Specific Hazards
 *   - Driveway with blind spots ...
 *
 * Source of these numbers/addresses: `__server-bcampx/guest-ops/knowledge/`
 * (currently the canonical AI-prompt copy). Update HERE when council/QLDC
 * numbers change — they ripple to all 13 property pages.
 */

export function CriticalInfoBase() {
  return (
    <>
      <h2>Emergencies</h2>
      <p>
        For an emergency requiring ambulance, fire, or police call{' '}
        <strong>111</strong> from any public, private or mobile phone in New
        Zealand.
      </p>
      <h3>Non-emergencies</h3>
      <ul>
        <li>Queenstown Police: 11 Camp Street, Queenstown — 03 441 1600</li>
        <li>Lakes District Hospital: 20 Douglas Street, Frankton — 03 441 0015</li>
        <li>Queenstown Medical Centre: 9 Isle Street, Queenstown — 03 441 0500</li>
        <li>Queenstown Dental Centre: 7 Shotover Street — 0800 586 466</li>
        <li>Wilkinson&apos;s Unichem Pharmacy: Rees Street &amp; The Mall — 03 442 7313</li>
      </ul>

      <h2>Health &amp; Safety</h2>
      <p>
        This home is equipped with certified smoke detectors, CO2 detectors, a
        first aid kit and fire extinguishers for use in an emergency.
      </p>

      <h2>Emergency Procedures — Fire</h2>
      <h3>Action in case of fire</h3>
      <ol>
        <li>Please remain calm</li>
        <li>Touch your door. If hot, do NOT open</li>
        <li>If you are able to leave your room, proceed to the nearest fire exit</li>
        <li>Stay beneath the smoke by crawling on the floor if necessary</li>
        <li>
          Upon exiting the building, proceed to the assembly area outside the
          property
        </li>
        <li>Call 111 to alert the fire brigade</li>
        <li>Do not re-enter the building until authorised by your hosts</li>
      </ol>
      <h3>If you must stay in your room</h3>
      <ol>
        <li>Stay calm</li>
        <li>Fill the bathroom sink with water</li>
        <li>Wet sheets and towels, seal these around the door</li>
        <li>Call 111 to advise you are unable to evacuate your room</li>
      </ol>
    </>
  );
}
