import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { PropertyQuickInfo } from '@/components/property-quick-info';
import { PropertyWelcome } from '@/components/property-welcome';
import { CriticalInfoBase } from '@/components/critical-info-base';
import { AppliancePage, ApplianceSet } from '@/components/appliance-page';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    PropertyQuickInfo,
    PropertyWelcome,
    CriticalInfoBase,
    AppliancePage,
    ApplianceSet,
    ...components,
  };
}
