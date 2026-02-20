import type { PageTree } from 'fumadocs-core/server';
import { canAccessPath, type UserAccess } from './roles';

function filterNodes(
  nodes: PageTree.Node[],
  access: UserAccess
): PageTree.Node[] {
  const filtered: PageTree.Node[] = [];

  for (const node of nodes) {
    if (node.type === 'separator') {
      filtered.push(node);
      continue;
    }

    if (node.type === 'page') {
      if (canAccessPath(access, node.url)) {
        filtered.push(node);
      }
      continue;
    }

    // Folder
    const children = filterNodes(node.children, access);
    const index =
      node.index && canAccessPath(access, node.index.url)
        ? node.index
        : undefined;

    if (children.length > 0 || index) {
      filtered.push({ ...node, children, index });
    }
  }

  return cleanSeparators(filtered);
}

function cleanSeparators(nodes: PageTree.Node[]): PageTree.Node[] {
  const result: PageTree.Node[] = [];

  for (const node of nodes) {
    if (node.type === 'separator') {
      // Skip if first, or previous was also a separator
      if (
        result.length === 0 ||
        result[result.length - 1].type === 'separator'
      ) {
        continue;
      }
    }
    result.push(node);
  }

  // Remove trailing separator
  if (result.length > 0 && result[result.length - 1].type === 'separator') {
    result.pop();
  }

  return result;
}

export function filterPageTree(
  tree: PageTree.Root,
  access: UserAccess
): PageTree.Root {
  if (access.role === 'staff') return tree;

  return {
    ...tree,
    children: filterNodes(tree.children, access),
  };
}
