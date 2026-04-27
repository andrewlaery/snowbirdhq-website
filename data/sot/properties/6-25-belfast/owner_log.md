---
schema_version: 1
slug: 6-25-belfast
audience: owner
last_reviewed: ""
---

# 6/25 Belfast (SkyCrest) — Owner-Only Knowledge

**Internal use only.** This file is NOT loaded by `src/knowledge_base.py` and never reaches guest-facing AI prompts. It holds owner-recommended setpoints, par levels, replacement cycles, costs, supplier details, and "internal" known issues that must not be surfaced to guests.

Guest-safe sibling: `6-25-belfast.md`.

Last reviewed: 2026-04-24

---

## Contractors

Property-specific trusted contractors. Source: Pete's referrals + engaged through Andrew. Keep updated as new trades engage.

| Service | Company | Contact | Email | Phone | Last engaged | Notes |
|---|---|---|---|---|---|---|
| Gas (annual service + appliance) | Brookes Gas | Eliana Rodriguez (admin); also Sandra | admin@brookes.co.nz; sandra@brookes.co.nz | — | 2026-04-24 — annual service completed | Terms-of-trade PDF received from Pete 2026-04-22. Next due 2027-04. |
| Heat pumps (supply + service + WiFi adaptors) | Queenstown Heatpumps | Becki Palmer (Owner / General Manager) | info@queenstownheatpumps.co.nz | — | 2026-04-24 — re-quote requested for 3× WiFi adaptors | Oct 2025 quote: $199 ex-GST per adaptor + 1 hr labour @ $95 per adaptor. Becki to contact Andrew direct for install coordination. |
| Electrical / lighting | Vision Electrics Ltd | Simon Millington | simonmillington@icloud.com | 022 176 6522 | 2026-04-08 — draft quote (33 downlights + 12 wall lights, ex dimmers/switch plates). 2026-04-05 — on-site visit. | Pete's referral. Dimmable + warm↔cool tunable preference from Pete; final spec pending from Andrew. |
| Cleaning | — | — | — | — | — | Assigned via `config/cleaning_assignments.json` in this repo, not here. |

---

## Owner Entity / Billing

| Field | Value |
|---|---|
| Legal owner | Trustees in the **Belleve NZ Family Trust** |
| Primary contact | Pete Bouma |
| GST status | **Registered** |
| GST number | **139-154-711** |
| GST effective date | **1 December 2025** |
| Source | Trustee-provided IR registration confirmation letter dated 30 January 2026 |
| Trust Deed on file | `~/Nextcloud/Documents/owner-clients/Belleve NZ Family Trust/_key docs/230505_BNFT_TrustDeed.pdf` (executed 5 May 2023, filed 2026-04-24) |
| Entity document folder | `~/Nextcloud/Documents/owner-clients/Belleve NZ Family Trust/` — subfolders: `_key docs/`, `agreements/`, `tax/`, `correspondence/`. See `~/Nextcloud/Documents/owner-clients/README.md` for convention. |
| Short code | `BNFT` |

**Operational implications (to action outside guest-ops):**
- Xero — flip the Belleve Trust contact record to "GST registered" and set their GST number.
- Owner statements — from 1 Dec 2025 onwards, management fees and rechargeable expenses must be issued with GST handled correctly (talk to accountant re: tax invoice vs. buyer-created invoice treatment for owner statements).
- Back-dated reissue — 5 months of statements (Dec 2025 – Apr 2026) already issued under non-registered treatment may need reissuing as tax-compliant tax invoices to let Pete claim GST.
- See also: `hostaway-integration` owner-statement logic, BCampX/SnowbirdHQ accounting.

---

## Owner-Recommended Heating Setpoints

Source: Pete Bouma's 2026-04-16 20:55 email "SkyCrest Floor Settings" (from previous owner) — see `owner-log/6-25-belfast.md` 2026-04-17 entry, commitment #11. Andrew adopted this regime as baseline on 2026-04-24.

| Season | Main floor (downstairs) | Top floor (upstairs) | Bathrooms |
|---|---|---|---|
| Summer (warm) | OFF | OFF | OFF |
| Summer (cool option) | 10 (Pete-suggested — previous owner hardly used) | 10 | — |
| Autumn | 18–20 | 18–20 | 18–20 |
| Spring | 18–20 | 18–20 | 18–20 |
| Winter | ~25 | 18–20 + top up with heatpumps | 20 (max 25) |

**Pete's note:** Previously (pre-heatpumps) upstairs ran up to 30 in winter. With heatpumps upstairs now leave the floor slab at 18–20 and use the heatpump for final comfort. Open to discussion on summer setting.

**Outstanding:** Andrew to observe one full seasonal changeover then feed the initiation-timing rule back to Pete (e.g. "switch to winter when overnight low < X for Y consecutive nights").

---

## Seasonal Changeover Observations

Running log of when Andrew initiated each changeover, to build a repeatable rule.

| Date | From | To | Trigger | Notes |
|---|---|---|---|---|
| 2026-04-24 | (unset) | Autumn / winter-ish | "Genuinely cold in Queenstown" per Andrew's reply to Pete. Zones warmed per Pete's regime. | First changeover under new monitoring cadence. |

---

## Item Locations & Par Levels

Last reviewed: 2026-04-25 (migrated from old `## Par Levels` section to the unified location-keyed register)
Template: `docs/property-monitoring/item_locations_register_template.md`

Property: SkyCrest, 6 guests / 3 bedrooms / 3 bathrooms / lift to main floor / stairs to top floor

Source register for this property. Cleaners walk room-by-room and verify each location matches the table at end-of-turn. **Many rows below are TBC at first audit** — Wave 3 PM monthly audit (target early May 2026) is the planned data-capture pass.

### Kitchen

#### Top utensils drawer

| Item | Par | Notes |
|---|---|---|
| Steak knives (in dedicated divider) | 6 | New steak-knife divider installed Apr 2026. Cleaners: return to this slot every turn. |
| Cutlery — dinner forks | 8 | TBC: confirm exact drawer at first audit |
| Cutlery — dinner knives | 8 | TBC: confirm exact drawer at first audit |
| Cutlery — teaspoons | 8 | TBC: confirm exact drawer at first audit |
| Cutlery — dessert spoons | 8 | TBC: confirm exact drawer at first audit |

#### Knife block (kitchen bench)

| Item | Par | Notes |
|---|---|---|
| Knife block set (chef's, bread, paring, utility) | 1 each | New block installed Mar 2026 |

#### Cupboard above hobs and rangehood

| Item | Par | Notes |
|---|---|---|
| First aid kit | 1 | Per `6-25-belfast.md` Health & Safety section |

#### Under kitchen sink

| Item | Par | Notes |
|---|---|---|
| Fire extinguisher | 1 | Per `6-25-belfast.md` Health & Safety section |
| Dish soap | 1 full bottle | TBC: confirm under-sink vs counter location |
| Rubbish bin liners | 20 | TBC: confirm under-sink stash location |
| Dishwasher tablets | 20 | TBC: confirm location |

#### Crockery / glassware cupboards

| Item | Par | Notes |
|---|---|---|
| Dinner plates | 8 | TBC: confirm cupboard at first audit |
| Side plates | 8 | TBC: confirm cupboard at first audit |
| Bowls | 8 | TBC: confirm cupboard at first audit |
| Mugs | 8 | TBC: confirm cupboard at first audit |
| Red wine glasses | 6 | Briscoes — brand/model TBC (Pete to send). 2 spares in cleaners' storeroom. |
| Whiskey / tumbler glasses | 6 | As above. 2 spares in cleaners' storeroom. |
| Champagne flutes | 6 | As above. 2 spares in cleaners' storeroom. |
| Water glasses | 8 | TBC: confirm cupboard at first audit |

#### Cookware cupboards

| Item | Par | Notes |
|---|---|---|
| Saucepans (small, med, large + lids) | 1 each | TBC: confirm cupboard |
| Frying pans (small, large) | 1 each | TBC: confirm cupboard |
| Baking dishes (enamel, pizza pan, bake sheet, oblong pan, bake pan) | 1 each | Installed Mar 2026. TBC: confirm cupboard |
| Chopping boards | 2 | Large + small. TBC: confirm location |

#### Pantry

| Item | Par | Notes |
|---|---|---|
| Tea bags (English Breakfast, Earl Grey, green) | 10 each | TBC: confirm pantry shelf |
| Nespresso capsules | 24 (mixed blend) | Installed + spare sleeve. TBC: confirm shelf. SQLite `property_inventory.min_quantity` for capsules = 6 |

#### Dish cloths / sponges drawer

| Item | Par | Notes |
|---|---|---|
| Dish cloths / sponges / scrubbers | Fresh pair + 2 spare | Missing by default before March 2026 — guest-reported Dec 2025 + Feb 2026. Now par'd. TBC: confirm drawer. |

#### On top of fridge

| Item | Par | Notes |
|---|---|---|
| Light bulbs (common types) | 2 spares of each | Pete set up Mar 2026 |

### Living area (main floor)

| Item | Par | Notes |
|---|---|---|
| Gas fire remote | 1 | Lives on the table in the same room (per guest guide) |
| Sonos speakers (Living + UpstairsDeck) | — | Always-on AirPlay/Spotify targets — no physical retrieval needed |

### Master bedroom (main floor)

| Item | Par | Notes |
|---|---|---|
| Hotel pillows (deployed) | 2 | New Mar 2026 |
| Pillow protectors | 2 | New Mar 2026 |
| Mattress topper 1500gsm | 1 | New Mar 2026 |
| Duvet — winter | 1 | Split-season set installed Mar 2026 |
| Duvet — summer | 1 | Split-season set |
| Duvet cover (deployed) | 1 | New Mar 2026 |
| Shark TurboBlade TF202S fan + remote | 1 | Remote on bedside table (per guest guide) |

#### Master bedroom wardrobe / cupboard

| Item | Par | Notes |
|---|---|---|
| Spare pillowcases for extra pillows | Matching covers | **MISSING** per Known Issues — source before first audit |
| Duvet — winter clip-on spare | 1 | In cupboard (per existing replacement-cycle row) |
| Spare extra pillows | TBC | Stored in wardrobes per Known Issues — count + slot TBC |

### Bedroom 2 (top floor)

| Item | Par | Notes |
|---|---|---|
| Hotel pillows (deployed) | 2 | New Mar 2026 |
| Pillow protectors | 2 | New Mar 2026 |
| Mattress topper 1500gsm | 1 | New Mar 2026 |
| Duvet | 1 | TBC at first audit |
| Shark TurboBlade TF202S fan + remote | 1 | Remote on bedside table |
| Daikin CTXM25RVMA heatpump remote | 1 | On wall (per guest guide) |

#### Bedroom 2 wardrobe

| Item | Par | Notes |
|---|---|---|
| Hangers | TBC at first audit | |
| Spare pillowcases | Matching covers | MISSING — source before first audit (per Known Issues) |

### Bedroom 3 (top floor)

| Item | Par | Notes |
|---|---|---|
| Hotel pillows (deployed) | 2 | New Mar 2026 |
| Pillow protectors | 2 | New Mar 2026 |
| Mattress topper 1500gsm | 1 | New Mar 2026 |
| Duvet | 1 | TBC at first audit |
| Shark TurboBlade TF202S fan + remote | 1 | Remote on bedside table |
| Daikin CTXM25RVMA heatpump remote | 1 | On wall (per guest guide) |

#### Bedroom 3 wardrobe

| Item | Par | Notes |
|---|---|---|
| Hangers | TBC at first audit | |

### TV nook (top floor)

| Item | Par | Notes |
|---|---|---|
| Samsung Smart TV (UA58NU7103) + remote | 1 | Per guest guide |
| Daikin CTXM25RVMA heatpump remote | 1 | On wall |

### Bathroom — Master ensuite (main floor)

| Item | Par | Notes |
|---|---|---|
| Shampoo Ashley & Co 500ml (deployed) | 1 full | Pump breakage rate higher than ideal — carry spare pumps |
| Conditioner Ashley & Co 500ml (deployed) | 1 full | Spare pumps from Ashley & Co on hand |
| Body wash Ashley & Co 500ml (deployed) | 1 full | |
| Hand soap 500ml | 1 per sink | |
| Toilet paper rolls (installed) | 3 | |
| Toilet paper rolls (spare) | 3 | TBC: confirm cupboard / under-sink |
| Bath towels | TBC count | TBC at first audit |
| Hand towels | TBC count | TBC at first audit |
| Face cloths | TBC count | TBC at first audit |
| Bathmat | 1 | TBC at first audit |
| OJ Microline thermostat | 1 | Bathroom underfloor heating control |

### Bathroom — Bedroom 2 ensuite (top floor)

Same template as Master ensuite — confirm full inventory at first audit. Toilet par 3 installed + 3 spare per WC convention applies.

### Bathroom — Bedroom 3 ensuite (top floor)

Same template as Master ensuite — confirm full inventory at first audit. **Note: this ensuite had a continuous-flush valve issue; replaced by Pete Mar 2026.** Toilet par 3 installed + 3 spare per WC convention applies.

### Laundry room

| Item | Par | Notes |
|---|---|---|
| Smeg S650 6.5kg washing machine | 1 | Per guest guide |
| Simpson SDV401 4kg dryer | 1 | Per guest guide |
| Braun TextStyle 6 steam iron | 1 | Per guest guide |
| Outdoor clothes rack | 1 | Per guest guide |

### Top deck (outdoor, off top floor)

| Item | Par | Notes |
|---|---|---|
| HotSpring spa / hot tub + cover | 1 | |
| Sonos UpstairsDeck speakers | — | Outdoor wired, always-on |

### Outdoor — back of property

| Item | Par | Notes |
|---|---|---|
| Alpine Ice Bath / cold plunge (SY-08-HC) + insulated cover | 1 | Pump/chiller turned OFF at wall plug May–Sep |
| Alpine Barrel Sauna + Harvia Vega BC60 heater | 1 | Isolation switch on right side at ground level (off between guests is the most common "sauna not working" cause) |

### Outdoor — entry / driveway

| Item | Par | Notes |
|---|---|---|
| Rinnai MAXIM X4 PLUS gas BBQ + cover | 1 | Outdoor area |

### Garage

| Item | Par | Notes |
|---|---|---|
| Cot / travel crib (on request) | 0 | Not stored at SkyCrest by default — pulled from another property when needed (per guest guide) |
| Sports equipment storage area | — | Guest-use overflow |

### Garage — guest lockup

| Item | Par | Notes |
|---|---|---|
| Spare key | 1 | TBC: confirm location at first audit |

### Building lockboxes (beside letterboxes)

| Item | Par | Notes |
|---|---|---|
| FOBs | 2 | Building access + front door |
| Physical key (guest lockup) | 1 | Garage guest lockup access |
| Spare FOB + keyring | 1 | Pete prepared Mar 2026 (commitment #4 — engraving in progress). Storage location TBC. |

### Cleaners' storeroom (overflow stock — external to unit)

#### Glassware overflow

| Item | Par | Notes |
|---|---|---|
| Red wine glasses (spare) | 2 | Briscoes match — refill glassware cupboard when count drops below 6 |
| Whiskey / tumbler glasses (spare) | 2 | As above |
| Champagne flutes (spare) | 2 | As above |

#### Linen overflow (TBC at first audit)

| Item | Par | Notes |
|---|---|---|
| Queen sheet sets | 3 sets total (incl. deployed) | TBC: confirm storeroom shelf |
| Bath towels | 8 total | TBC at first audit |
| Hand towels | 6 total | TBC at first audit |
| Face cloths | 6 total | TBC at first audit |
| Bathmats | 2 total | TBC at first audit |
| Tea towels | 4 total | TBC at first audit |
| Pillowcases | 6 pairs | "Spares in bedroom cupboards" (per old Par Levels) — confirm whether storeroom or in-unit cupboards |
| Duvet covers | 2 | Main bed has split-season; confirm spare location |

#### Consumables refill stock

| Item | Par | Notes |
|---|---|---|
| Ashley & Co shampoo refill | TBC | Bulk refill stock for the 500ml bottles in each shower. TBC at first audit. |
| Ashley & Co conditioner refill | TBC | TBC at first audit. |
| Ashley & Co body wash refill | TBC | TBC at first audit. |
| Ashley & Co spare pumps | TBC | Pete confirmed pumps break more often than ideal — keep spares. |
| Hand soap refill | TBC | TBC at first audit. |
| Toilet paper bulk | TBC | TBC at first audit. |
| Nespresso capsules bulk | TBC | SKU `BLEND12` (Coffee Capsules 2U) — 360-pack ≈ $218.82 ex-GST. Per `CLAUDE.md` Inventory System block. |

---

## Migration note

The above unified register supersedes the old `## Par Levels` section (rev 2026-04-16). All items from the old section are preserved with explicit storage-location context added. Rows marked **TBC at first audit** were already TBC in the old register — they stay flagged for the Wave 3 PM monthly audit walkthrough.

Replacement-cycle data continues to live in the `## Replacement Cycles` section below — that's a separate concern (when to replace) from this register (where things live + how many).

---

## Replacement Cycles

Last reviewed: 2026-04-16 (seeded from Pete's March 2026 remediation)
Template: `docs/property-monitoring/replacement_cycles_register_template.md`
Cycle defaults: see template

### Main bedroom
| Item | Count | Installed | Cycle | Next due | Status | Notes |
|---|---|---|---|---|---|---|
| Hotel pillows | 2 | 2026-03 | 12mo | 2027-03 | OK | New Mar 2026 |
| Pillow protectors | 2 | 2026-03 | 6mo | 2026-09 | OK | New Mar 2026 |
| Mattress topper (1500gsm) | 1 | 2026-03 | 18mo | 2027-09 | OK | Higher-gsm — may stretch |
| Duvet — winter | 1 | 2026-03 | 3yr | 2029-03 | OK | Split-season |
| Duvet — summer | 1 | 2026-03 | 3yr | 2029-03 | OK | Split-season |
| Duvet — winter clip-on spare | 1 | 2026-03 | 3yr | 2029-03 | OK | In cupboard |
| Duvet cover | 1 | 2026-03 | 18mo | 2027-09 | OK | New Mar 2026 |
| Sheet sets | 3 | TBC | 24mo | TBC | TBC | Confirm at first audit |
| Mattress | 1 | TBC | 8yr | TBC | TBC | Confirm at first audit |

### Bedroom 2
| Item | Count | Installed | Cycle | Next due | Status | Notes |
|---|---|---|---|---|---|---|
| Hotel pillows | 2 | 2026-03 | 12mo | 2027-03 | OK | New Mar 2026 |
| Pillow protectors | 2 | 2026-03 | 6mo | 2026-09 | OK | |
| Mattress topper (1500gsm) | 1 | 2026-03 | 18mo | 2027-09 | OK | |
| Duvet | 1 | TBC | 3yr | TBC | TBC | Confirm at first audit |
| Duvet cover | 2 | TBC | 18mo | TBC | TBC | |
| Sheet sets | 3 | TBC | 24mo | TBC | TBC | |
| Mattress | 1 | TBC | 8yr | TBC | TBC | |

### Bedroom 3 (if applicable — confirm at audit)
| Item | Count | Installed | Cycle | Next due | Status | Notes |
|---|---|---|---|---|---|---|
| Hotel pillows | 2 | 2026-03 | 12mo | 2027-03 | OK | New Mar 2026 |
| Pillow protectors | 2 | 2026-03 | 6mo | 2026-09 | OK | |
| Mattress topper (1500gsm) | 1 | 2026-03 | 18mo | 2027-09 | OK | |
| Duvet | 1 | TBC | 3yr | TBC | TBC | |
| Duvet cover | 2 | TBC | 18mo | TBC | TBC | |
| Sheet sets | 3 | TBC | 24mo | TBC | TBC | |
| Mattress | 1 | TBC | 8yr | TBC | TBC | |

### Bathrooms (combined)
| Item | Count | Installed | Cycle | Next due | Status | Notes |
|---|---|---|---|---|---|---|
| Bath towels | 8 | TBC | 18mo | TBC | TBC | |
| Hand towels | 6 | TBC | 12mo | TBC | TBC | |
| Face cloths | 6 | TBC | 12mo | TBC | TBC | |
| Bathmats | 2 | TBC | 12mo | TBC | TBC | |

### Living / common
| Item | Count | Installed | Cycle | Next due | Status | Notes |
|---|---|---|---|---|---|---|
| Couch cushion covers | TBC | TBC | 6mo | TBC | TBC | |
| Throws | TBC | TBC | 3yr | TBC | TBC | |
| Rugs (living) | TBC | TBC | 7yr | TBC | TBC | |

### Small appliances
| Item | Installed | Cycle | Next due | Status | Notes |
|---|---|---|---|---|---|
| Kettle | TBC | 3yr | TBC | TBC | |
| Toaster | TBC | 3yr | TBC | TBC | |
| Coffee machine (Nespresso) | TBC | 4yr | TBC | TBC | |
| Hair dryer | TBC | 3yr | TBC | TBC | Casing-dirt issue — reported Dec 2025 + Feb 2026 |
| Iron | TBC | 5yr | TBC | TBC | |

### Plumbing / fittings (note — outside standard soft-furnishings cycle)
| Item | Installed / replaced | Notes |
|---|---|---|
| Upstairs ensuite toilet valve | 2026-03 | Replaced by Pete Mar 2026 — addressed Nov 2025 continuous-flush issue |
| Conditioner pump (upstairs) | 2026-03 | Replaced from Ashley & Co spare stock |

### Servicing (outside replacement cycle — track for owner report)
| Item | Last serviced | Next due | Notes |
|---|---|---|---|
| Ice bath / cold plunge | 2026-03 | TBD — Pete may arrange regular servicer (owner-log commitment #8) | Additional filter flagged by Pete; order pending |
| Gas (annual) | 2026-04-24 | 2027-04 | Brookes Gas — terms-of-trade PDF received from Pete 2026-04-22 |

---

## Known Issues

- **SAFETY**: Kitchen knives dangerously dull and old — largest knife broken at handle/blade junction (reported Feb 2026). Needs immediate replacement
- Pillow quality below price point — described as "cheap Kmart" level by guest (Feb 2026). Needs upgrading
- Master bedroom doona/blanket appears weighted and old — too heavy for some guests, doesn't match price point
- No spare pillowcases for extra pillows stored in wardrobes
- No dish cloths, sponges, or scrubbers stocked by default — reported by 2 separate guests (Dec 2025, Feb 2026)
- FOB access can be finicky — guests must swipe only once and wait 1 second before pulling the door
- Multiple FOB swipes trigger the building alarm — guest should swipe again to disarm
- Front door mechanism genuinely difficult to open for some guests — pull toward you before pushing open. May need physical repair/adjustment
- Front door intercom system does not work — no doorbell from gate, no remote access from apartment
- Noise monitor (Minut) can trigger false alerts from normal indoor conversation
- Automated messages sometimes show unresolved template variables (`{{guest_first_name}}` etc.) — still occurring as of Feb 2026
- Host-to-guest review templates still contain `{{guest_name}}` placeholders — looks unprofessional
- Sauna isolation switch (right side, ground level) frequently OFF between guests — most common cause of "sauna not working"
- Sauna light switch at top of stairs must be ON — guests don't know this
- Cold plunge pump freezes and beeps continuously in winter — should be turned OFF at wall plug May–Sep
- Jetted bathtub can discharge pipe residue if not flushed between guests
- Oven has a separate wall power switch that guests cannot find
- Hairdryer casing gets dirty/sticky between guests — reported by 2 separate guests (Dec 2025, Feb 2026). Cleaning checklist not addressing this
- QR code house compendium link reported not working (Dec 2025) — needs verification
- Lift/elevator subject to outages managed by building management (extended outage Oct–Nov 2025)
- Lockbox: guests sometimes try wrong lockbox — ensure correct lockbox is clearly identified
- Parking space occasionally occupied by another vehicle — building-level issue (reported Feb 2026)
- BBQ gas tank can run empty — needs checking on turnover
- Wine glass inventory low — resolved Mar 2026 via Pete's Briscoes restock to 6 of each
- No additives (Epsom salts etc.) allowed in the jetted bathtub — same restriction as spa pool but not documented in house rules
- Upstairs ensuite toilet flush button sticks — resolved Mar 2026 via Pete's valve replacement
- Pot/pan handles prone to loosening — Pete tightened all Mar 2026, some dangerously loose. Added to monitoring checklist 2026-04-24.
- Shower hoses — to be checked every turn for cleanliness / mineral build-up / kinks (added to cleaner checklist 2026-04-24 after Pete raised it).
- Knife/utensil drawer must be returned to tidy state every turn (new steak-knife divider installed Apr 2026). Added to cleaner checklist 2026-04-24.

---

## Owner & Commitments Index

Authoritative correspondence and commitment record: `owner-log/6-25-belfast.md`.

Key references:
- 2026-04-24 consolidated status reply (gas done, floor heating adjusted, TV live, Briscoes filed, heatpump WiFi in progress, lighting pivoted to Philips)
- 2026-04-17 Pete's monitoring pushback ("2–3x/month is not adequate"; no-coffee for current guest; pot/pan handles; WiFi heatpump time-limits)
- 2026-04-16 Pete's SkyCrest Floor Settings email (seeded the heating setpoints above)
- 2026-04-15 Pete's post-remediation email + $2,400 of purchases + "right on the brink of poor ratings" criticism

Open commitments (ball with Andrew):
- Airbnb payouts login + bank-detail verification (credentials sent by Pete 2026-04-24 02:15; DO NOT record here — rotate password after fixing).
- Philips lighting full spec: Simon Millington's draft covers 33 downlights + 12 wall lights ex dimmers/switch plates; Andrew owes Pete the driver + smart-system spec, then Simon re-quotes. Pete wants dimmable + warm↔cool tunable.
- Home Assistant heatpump WiFi integration — triggers once Queenstown Heatpumps have installed the adaptors.
- First owner condition report (target early May 2026 — closes commitment #1).
- Seasonal changeover initiation rule (observe one full changeover, report back to Pete).

Open commitments (ball with Pete):
- Heatpump WiFi adaptors: Pete re-engaged Queenstown Heatpumps (Becki Palmer) 2026-04-24. Old quote $199 ex-GST/adaptor + 1 hr labour @ $95 for 3 indoor units — re-quote pending. Becki will contact Andrew directly for install coordination.

Recent discrete actions (completed):
- GST number `139-154-711` added to Pete's Airbnb account 2026-04-24 15:32.
- Trust Deed filed to `~/Nextcloud/Documents/owner-clients/Belleve NZ Family Trust/_key docs/230505_BNFT_TrustDeed.pdf` 2026-04-24.

Awaiting filing (pending Finder drag / download from Gmail):
- `Belleve NZ Trust TFN.pdf` → `tax/260424_BNFT_TFN.pdf`.
- GST registration confirmation letter (if PDF exists) → `tax/260130_BNFT_GSTRegistrationLetter.pdf`.
- Lighting quote pack (Simon Millington 2026-04-08) → `agreements/260408_BNFT_LightingQuote_*.pdf` (hold until quote is finalised).
