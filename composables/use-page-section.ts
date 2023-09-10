import type { PageSection } from '@/types/page-section'

export const useHomePageSections = () => {
  const domidPrefix = 'home-index'
  const homeSections = ref<PageSection[] | null>(null)

  homeSections.value = [
    {
      type: 'type1',
      kind: 'infomation',
      order: 1,
      title: 'Message',
    },
    {
      type: 'type1',
      kind: 'news',
      order: 2,
      title: "What's New",
      menuTitle: 'News',
    },
    {
      type: 'type1',
      kind: 'service',
      order: 3,
      title: 'Service',
    },
    {
      type: 'type1',
      kind: 'contact',
      order: 4,
      title: 'Contact',
    },
  ]

  return {
    domidPrefix,
    homeSections,
  }
}
