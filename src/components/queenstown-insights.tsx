/**
 * Queenstown Insights — guest-facing local recommendations rendered from
 * data/sot/queenstown/insights.yaml (vendored copy of _shared/queenstown/).
 *
 * Mirrors the heading hierarchy of the original MDX so the rendered page
 * is visually equivalent to the pre-extraction version.
 */

import ReactMarkdown from 'react-markdown';
import {
  loadQueenstownInsights,
  type QueenstownInsightItem,
  type QueenstownInsightSection,
  type QueenstownInsightSubgroup,
} from '@/lib/sot';

export function QueenstownInsights() {
  const data = loadQueenstownInsights();

  return (
    <>
      <h1>Recommendations</h1>
      {data.sections.map((section) => (
        <Section key={section.id} section={section} />
      ))}
    </>
  );
}

function Section({ section }: { section: QueenstownInsightSection }) {
  return (
    <>
      <h3>{section.title}</h3>
      {section.intro && <ReactMarkdown>{section.intro}</ReactMarkdown>}
      {section.items && section.items.length > 0 && (
        <ItemList items={section.items} />
      )}
      {section.subgroups?.map((sub) => (
        <Subgroup key={sub.title} subgroup={sub} />
      ))}
      {section.outro && <ReactMarkdown>{section.outro}</ReactMarkdown>}
    </>
  );
}

function Subgroup({ subgroup }: { subgroup: QueenstownInsightSubgroup }) {
  return (
    <>
      <h4>
        <strong>{subgroup.title}:</strong>
      </h4>
      <ItemList items={subgroup.items} />
    </>
  );
}

function ItemList({ items }: { items: QueenstownInsightItem[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.name}>
          <Item item={item} />
        </li>
      ))}
    </ul>
  );
}

function Item({ item }: { item: QueenstownInsightItem }) {
  return (
    <>
      <h5>
        <strong>{item.name}:</strong>
      </h5>
      <ReactMarkdown>{item.description}</ReactMarkdown>
      {item.website && (
        <p>
          <a href={item.website} target="_blank" rel="noopener noreferrer">
            Website Link
          </a>
        </p>
      )}
      {item.google_maps && (
        <p>
          <a href={item.google_maps} target="_blank" rel="noopener noreferrer">
            Google Maps Location
          </a>
        </p>
      )}
    </>
  );
}
