<script setup lang="ts">
import type { ContentKind } from '@/types/content'

type DefineHomeSections = {
  type: string
  kind: ContentKind
  order: number
  title?: string
}
const homeSections: DefineHomeSections[] = [
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
      <ScreenHomeType1Eyecatcher />
    </div>

    <section
      v-for="section in homeSections"
      :id="`index-position-${section.kind}`"
      class="section-margin"
    >
      <template v-if="section.type === 'type1'">
        <ScreenHomeType1SectionTitle
          v-if="section.title?.length"
          :title="section.title"
        />
        <ScreenHomeType1Information v-if="section.kind === 'infomation'" />
        <ScreenHomeType1Newses v-if="section.kind === 'news'" />
        <ScreenHomeType1Services v-if="section.kind === 'services'" />
        <ScreenHomeType1Contact v-if="section.kind === 'contact'" />
      </template>
    </section>
  </article>
</template>

<style lang="scss" scoped>
.section-margin {
  padding-top: calc($nav-header-height + 3rem);
  margin-bottom: 3rem;
}
</style>
