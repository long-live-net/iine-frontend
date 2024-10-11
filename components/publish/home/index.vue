<script setup lang="ts">
import type { DesignTheme, PageSection } from '@/types/customer-setting'

const { customerId } = useCustomer()
const { customerSetting } = useCustomerSetting()
const { domidPrefix, homeSections } = useHomeLayoutRead(customerId)

const designTheme = computed<DesignTheme>(
  () => customerSetting.value?.designTheme ?? 'type1'
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
      <template v-if="designTheme === 'type1'">
        <PublishHomeType1SectionTitle
          v-if="sectionTitle(section).length"
          :title="sectionTitle(section)"
        />
        <PublishHomeType1Information v-if="section.kind === 'information'" />
        <PublishHomeType1Newses v-if="section.kind === 'news'" />
        <PublishHomeType1Services v-if="section.kind === 'service'" />
        <PublishHomeType1Contact v-if="section.kind === 'contact'" />
        <PublishHomeType1Access v-if="section.kind === 'access'" />
        <PublishHomeType1MenuImage v-if="section.kind === 'menu-image'" />
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
