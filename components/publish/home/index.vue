<script setup lang="ts">
import type { LayoutTheme } from '@/types/customer'
import type { PageSection } from '@/types/customer-setting'

const { customerId, customer } = useFoundation()
const { domidPrefix, homeSections } = useHomeLayoutRead(customerId)

const layoutTheme = computed<LayoutTheme>(
  () => customer.value?.layoutTheme ?? 'type1'
)

const sectionTitle = (section: PageSection): string =>
  section.menuTitle ?? section.title
</script>

<template>
  <article>
    <section :id="`${domidPrefix}-eyecatch`">
      <PublishHomeType1Eyecatcher />
    </section>
    <section
      v-for="section in homeSections"
      :id="`${domidPrefix}-${section.kind}`"
      :key="section.id"
      class="section-margin"
    >
      <template v-if="layoutTheme === 'type1'">
        <PublishHomeType1SectionTitle
          v-if="sectionTitle(section).length"
          :title="sectionTitle(section)"
        />
        <PublishHomeType1Information v-if="section.kind === 'information'" />
        <PublishHomeType1Newses v-if="section.kind === 'news'" />
        <PublishHomeType1Services v-if="section.kind === 'service'" />
        <PublishHomeType1Contact v-if="section.kind === 'contact'" />
        <PublishHomeType1Access v-if="section.kind === 'access'" />
      </template>
    </section>
  </article>
</template>

<style lang="scss" scoped>
article {
  .section-margin {
    padding-top: calc($nav-header-height + 1rem);
  }
}
</style>
