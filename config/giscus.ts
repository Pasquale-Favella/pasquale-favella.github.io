import { GiscusProps } from '@giscus/react'
import GitOwner from './owner'

export const GISCUS_CONFIG: GiscusProps = {
  repo:  `${GitOwner.owner}/${GitOwner.repo}`,
  repoId:  `${GitOwner.repo_node_id}`,
  category : "Blog",
  categoryId : 'DIC_kwDOIwHgl84CTwhC',
  mapping: 'title',
  reactionsEnabled: '1',
  emitMetadata: '1',
  inputPosition: 'bottom',
  lang: 'en',
  loading: 'eager',
}