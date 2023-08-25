<script setup lang="ts">
import type { ContentKind } from '@/types/content'

type DefinePageSections = {
  type: string
  kind: ContentKind
  order: number
  title?: string
}
const pageSections: DefinePageSections[] = [
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
  },
  {
    type: 'type1',
    kind: 'services',
    order: 3,
    title: 'Services',
  },
  {
    type: 'type1',
    kind: 'contact',
    order: 4,
    title: 'Contact',
  },
]
</script>

<template>
  <article>
    <div id="index-position-top">
      <SectionsType1Eyecatcher />
    </div>

    <section
      v-for="section in pageSections"
      :id="`index-position-${section.kind}`"
      class="section-margin"
    >
      <template v-if="section.type === 'type1'">
        <SectionsType1SectionTitle
          v-if="section.title?.length"
          :title="section.title"
        />
        <SectionsType1Information v-if="section.kind === 'infomation'" />
        <SectionsType1Newses v-if="section.kind === 'news'" />
        <SectionsType1Services v-if="section.kind === 'services'" />
        <SectionsType1Contact v-if="section.kind === 'contact'" />
      </template>
    </section>
  </article>
</template>

<style lang="scss" scoped>
.section-title {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
  span {
    background: linear-gradient(transparent 75%, orange 75%);
    font-weight: bold;
  }
}

.section-margin {
  padding-top: calc($nav-header-height + 3rem);
  margin-bottom: 4rem;
}
</style>
