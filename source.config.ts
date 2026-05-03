import { defineDocs, defineConfig } from 'fumadocs-mdx/config';
import remarkApplianceToc from './scripts/remark-appliance-toc.mjs';

export const docs = defineDocs({
  dir: 'content/docs',
});

export default defineConfig({
  mdxOptions: {
    valueToExport: ['structuredData'],
    // Expand <ApplianceSet slug="..." /> into explicit `## Appliances` H2 +
    // `### <Category>` H3 headings + per-appliance JSX bodies. Lifts the
    // headings into the MDX AST so fumadocs' TOC builder picks them up.
    // See scripts/remark-appliance-toc.mjs for full rationale.
    remarkPlugins: (v) => [remarkApplianceToc, ...v],
  },
});
