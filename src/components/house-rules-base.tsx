/**
 * Shared "House Rules" boilerplate — quiet hours, smoking, pets, parties,
 * registered-guest policy, child safety, security cameras notice, damages
 * clause, acceptance. Identical (or near-identical) across all 13 active
 * properties.
 *
 * Property-specific deltas go AFTER this component in each property's MDX:
 *
 *   <HouseRulesBase />
 *
 *   ### Property-specific rules
 *   - Spa pool max 4 adults at once...
 *
 * Per-guest deltas (max guests, max adults, check-in/out times) come from
 * facts.yaml and render via <PropertyQuickInfo>; this component covers the
 * always-true policy/legal rules.
 */

export function HouseRulesBase() {
  return (
    <>
      <h2>House Rules</h2>

      <h3>A Quick Note</h3>
      <ul>
        <li>We&apos;re delighted to share our home with you in this peaceful residential neighbourhood.</li>
        <li>To maintain our great relationship with our neighbours and comply with local regulations, please follow these house guidelines.</li>
        <li>Please remove your shoes inside to help keep our home clean and comfortable.</li>
      </ul>

      <h3>House Items</h3>
      <ul>
        <li>Consumable items in the house are provided free of charge on a fair-use basis (basic cooking supplies, tea, coffee, laundry powder, dishwasher capsules/powder, soaps and body wash).</li>
        <li>Unused items remain the property of the home.</li>
      </ul>

      <h3>Security &amp; Responsibility</h3>
      <ul>
        <li>Please look after your valuables and secure your accommodation. Despite protective measures we can&apos;t assume responsibility and won&apos;t be liable for any loss or damage to your possessions in or around the property.</li>
        <li>The hosts/owners are not responsible for any accidents, injuries, or illness that occur on the premises or its facilities, or for loss of personal belongings or valuables — including for adults and children.</li>
      </ul>

      <h3>Check-in &amp; Check-out</h3>
      <p>
        Check-in and check-out times are shown above in the Quick Reference.
        Multiple parties rely on these times for cleaning and maintenance — if
        you have requirements outside of these, contact the host and we&apos;ll
        do our best to accommodate.
      </p>

      <h4>When checking out</h4>
      <ul>
        <li>Ensure each room appears as it did when you first arrived.</li>
        <li>Place all rubbish &amp; recycling in the bins/bags provided.</li>
        <li>Load all dirty plates and glasses into the dishwasher (don&apos;t put dirty items away as if clean).</li>
        <li>Turn lights off and any electrical items used. Don&apos;t switch off Wi-Fi/modems.</li>
        <li>Turn off heated towel rails and the gas fire (if applicable).</li>
        <li>Ensure the house is secured (all windows and doors).</li>
      </ul>

      <h3>Guests &amp; Visitors</h3>
      <ul>
        <li>The lead guest must be 25 years old or older.</li>
        <li>All overnight guests must be registered with the host beforehand. Only registered guests may spend the night.</li>
        <li>Lead guest is responsible for the actions of any visitors during their stay.</li>
        <li>Strictly registered guests only — no unregistered visitors are permitted.</li>
        <li>Any unregistered guest can be asked to leave at any time.</li>
      </ul>

      <h3>Parties &amp; Events</h3>
      <ul>
        <li>Parties are NOT allowed.</li>
        <li>No confetti, glitter, or excessive rubbish — additional cleaning fees may apply.</li>
        <li>Failure to comply may result in termination of the contract and additional charges.</li>
      </ul>

      <h3>Quiet Hours &amp; Outdoor Spaces</h3>
      <ul>
        <li>Outdoor spaces are available between 7am and 10pm.</li>
        <li>Keep noise levels considerate of neighbours, especially between 10pm and 7am.</li>
        <li>No music or amplified sound outdoors between 8pm and 8am.</li>
        <li>After 8pm, please continue activities indoors with windows and doors closed.</li>
      </ul>
      <p>
        If you experience noise concerns from nearby properties during quiet
        hours, contact QLDC Noise Control. Under the District Plan, noise
        limits are 50 dBA LAeq daytime (8am–8pm) and 40 dBA LAeq night
        (8pm–8am).
      </p>

      <h3>Rubbish &amp; Recycling</h3>
      <ul>
        <li>Rubbish (red bins) collected every Wednesday.</li>
        <li>Glass recycling (blue bins) and mixed recycling (yellow bins) collected every Wednesday — blue and yellow bins alternate weeks.</li>
        <li>Check the QLDC website for the current week&apos;s schedule, or which bins the neighbours have out.</li>
        <li>Bins go to the street curb by 7am on Wednesday or the night before.</li>
        <li>Bins back off the street by Wednesday evening.</li>
      </ul>

      <h3>Littering</h3>
      <ul>
        <li>NO littering. This includes leaving food outside.</li>
        <li>Additional cleaning charges apply for excessive mess.</li>
      </ul>

      <h3>Commercial Photography</h3>
      <ul>
        <li>Not permitted without written host permission. Contact the host for pricing.</li>
      </ul>

      <h3>Pets</h3>
      <ul>
        <li>Pets are NOT permitted unless explicitly stated in the listing.</li>
        <li>Bringing a pet without permission means the host is not liable for any incident, and you will be asked to leave without a refund.</li>
      </ul>

      <h3>Smoking, Vaping &amp; E-Cigarettes</h3>
      <ul>
        <li>NOT permitted inside or directly outside the house.</li>
        <li>$250+ additional fee for smoking inside the home or improperly disposing of cigarette butts.</li>
      </ul>

      <h3>Security Cameras &amp; Other Equipment</h3>
      <ul>
        <li>External security cameras are installed at the property; cameras and locations are listed in the Hostaway/Airbnb/Booking.com listing.</li>
        <li>A noise monitor may be installed in main living areas (no audio recording — sound levels only).</li>
        <li>Tampering with any security, safety, or utility devices (smoke detectors, CO detectors, noise monitors, internet, power) results in immediate termination of your booking without a refund.</li>
      </ul>

      <h3>Child Safety</h3>
      <ul>
        <li>Children must be attended to — there are multiple potential hazards throughout properties.</li>
        <li>Guests are fully responsible for the safety and security of children at all times.</li>
      </ul>

      <h3>Damages, Breakages &amp; Furniture</h3>
      <ul>
        <li>Please respect our home as if it were your own.</li>
        <li>Use appliances, equipment and furniture for their intended purposes only.</li>
        <li>Removing items from the property (linens, kitchen and living furnishings) is not permitted; you will be charged for anything removed.</li>
        <li>Notify the owner immediately if any damage occurs.</li>
        <li>Damage to property items is the responsibility of the renter.</li>
        <li>Every item is inspected before arrival and after departure.</li>
      </ul>

      <h3>Acceptance of House Rules</h3>
      <p>
        By accepting this reservation, you agree that the House Rules are
        understood and accepted, and all guests assume the risk of any harm
        arising from their use of the premises or from people they invite to
        use the premises.
      </p>
    </>
  );
}
