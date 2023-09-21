import type {
  SectionType,
  PageSection,
  BasePageSection,
  PageSectionEdit,
} from '@/types/page-section'

export const useHomeSectionsEdit = () => {
  const sectionTypes: {
    type: SectionType
    label: string
  }[] = [
    {
      type: 'type1',
      label: '標準',
    },
    {
      type: 'type2',
      label: 'シャープ',
    },
  ]
  const baseSections: BasePageSection[] = [
    {
      baseId: 'type1-information',
      type: 'type1',
      kind: 'information',
      title: 'Information',
    },
    {
      baseId: 'type1-news',
      type: 'type1',
      kind: 'news',
      title: 'News',
    },
    {
      baseId: 'type1-service',
      type: 'type1',
      kind: 'service',
      title: 'Service',
    },
    {
      baseId: 'type1-contact',
      type: 'type1',
      kind: 'contact',
      title: 'Contact',
    },
  ]

  const editSectionType = ref<SectionType | null>(null)
  const editSections = ref<PageSectionEdit[]>([])

  const resetSections = (sections: PageSection[]) => {
    if (!sections.length) {
      editSectionType.value = 'type1'
      editSections.value = []
      return
    }
    editSectionType.value = sections[0].type
    editSections.value = sections.map((s) => ({
      baseId: s.baseId,
      id: s.id,
      type: s.type,
      kind: s.kind,
      title: s.title,
      order: s.order,
      menuTitle: s.menuTitle,
    }))
  }

  return {
    sectionTypes,
    baseSections,
    editSectionType,
    editSections,
    resetSections,
  }
}

export const useHomeSectionsRead = () => {
  const domidPrefix = 'home-index'
  const homeSections = ref<PageSection[] | null>(null)

  homeSections.value = [
    {
      baseId: 'type1-information',
      id: 1,
      type: 'type1',
      kind: 'information',
      title: 'Message',
      order: 1,
    },
    {
      baseId: 'type1-news',
      id: 2,
      type: 'type1',
      kind: 'news',
      title: "What's New",
      menuTitle: 'News',
      order: 2,
    },
    {
      baseId: 'type1-service',
      id: 3,
      type: 'type1',
      kind: 'service',
      title: 'Service',
      order: 3,
    },
    {
      baseId: 'type1-contact',
      id: 4,
      type: 'type1',
      kind: 'contact',
      title: 'Contact',
      order: 4,
    },
  ]

  return {
    domidPrefix,
    homeSections,
  }
}
