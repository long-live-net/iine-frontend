<script setup lang="ts">
import type { DesignTheme, PageLayout } from '@/types/customer-setting'

const { domidPrefix, customerSetting } = useCustomerSetting()

const designTheme = computed<DesignTheme>(
  () => customerSetting.value?.designTheme ?? 'type1'
)

const sectionTitle = (section: PageLayout): string =>
  section.menuTitle ?? section.title
</script>

<template>
  <article>
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
        <PublishHomeType1Contact v-if="section.kind === 'contact'" />
        <PublishHomeType1Access v-if="section.kind === 'access'" />
        <PublishHomeType1MenuImage v-if="section.kind === 'menu-image'" />
      </template>
    </section>
  </article>
</template>

<style lang="scss" scoped>
article {
  .section-margin-top {
    padding-top: 0;

    @media only screen and (max-width: $grid-breakpoint-md) {
      padding-top: $nav-header-height;
    }
  }

  .section-margin {
    padding-top: calc($nav-header-height + 1rem);
    margin-top: -40px;
  }
}
</style>
