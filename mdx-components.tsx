import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { PropertyQuickInfo } from '@/components/property-quick-info';
import { PropertyWelcome } from '@/components/property-welcome';
import { CriticalInfoBase } from '@/components/critical-info-base';
import { HouseRulesBase } from '@/components/house-rules-base';
import { AppliancePage, ApplianceSet } from '@/components/appliance-page';
import {
  PropertyHazards,
  PropertyHouseRulesDeltas,
  PropertyAccessInstructions,
  PropertyOperationalNotes,
  PropertyUsageSections,
} from '@/components/property-exceptions';
import { QueenstownEssentials } from '@/components/queenstown-essentials';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    PropertyQuickInfo,
    PropertyWelcome,
    CriticalInfoBase,
    HouseRulesBase,
    AppliancePage,
    ApplianceSet,
    PropertyHazards,
    PropertyHouseRulesDeltas,
    PropertyAccessInstructions,
    PropertyOperationalNotes,
    PropertyUsageSections,
    QueenstownEssentials,
    ...components,
  };
}
