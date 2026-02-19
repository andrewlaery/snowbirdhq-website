import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { PropertyQuickInfo } from '@/components/property-quick-info';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    PropertyQuickInfo,
    ...components,
  };
}
