<script setup lang="ts">
import type { DesignTheme, PageLayout } from '@/types/customer-setting'

// Note: domidPrefix = 'home-index'
const { domidPrefix, customerSetting } = useCustomerSetting()

const designTheme = computed<DesignTheme>(
  () => customerSetting.value?.designTheme ?? 'type1'
)

const sectionTitle = (section: PageLayout): string =>
  section.menuTitle ?? section.title
</script>

<template>
  <article :id="`${domidPrefix}-top`">
    <section :id="`${domidPrefix}-eyecatch`" class="section-margin-top">
      <PublishHomeType1Eyecatcher />
    </section>
    <section
      v-for="section in customerSetting?.homeLayout ?? []"
      :id="`${domidPrefix}-${section.kind}`"
      :key="section.kind"
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
        <PublishHomeType1Features v-if="section.kind === 'feature'" />
        <PublishHomeType1Contact v-if="section.kind === 'contact'" />
        <PublishHomeType1Access v-if="section.kind === 'access'" />
        <PublishHomeType1Menu v-if="section.kind === 'menu'" />
        <PublishHomeType1MenuImage v-if="section.kind === 'menu-image'" />
      </template>
    </section>
  </article>
</template>

<style lang="scss" scoped>
article {
  padding: 0;
  padding-bottom: 4rem;

  .section-margin-top {
    padding-top: 0;

    @media only screen and (max-width: $grid-breakpoint-md) {
      padding-top: $nav-header-height;
    }
  }

  .section-margin {
    padding-top: calc($nav-header-height + 1rem);
    margin-top: -10px;
  }
}
</style>
