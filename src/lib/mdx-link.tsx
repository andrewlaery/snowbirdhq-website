/**
 * Shared react-markdown component overrides used by SOT-driven content
 * components (HouseRulesBase, CriticalInfoBase, QueenstownEssentials,
 * AppliancePage, etc.). Adds `target="_blank"` and `rel="noopener noreferrer"`
 * to external links so SOT markdown renders identically to the legacy
 * hardcoded JSX which used those attributes everywhere.
 */

import type { Components } from 'react-markdown';

export const mdxLinkComponents: Components = {
  a: ({ href, children, ...rest }) => {
    const isExternal = href?.startsWith('http://') || href?.startsWith('https://');
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
          {children}
        </a>
      );
    }
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  },
};
