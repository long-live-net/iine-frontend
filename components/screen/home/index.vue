<script setup lang="ts">
const { domidPrefix, homeSections } = useHomePageSections()
</script>

<template>
  <article>
    <section :id="`${domidPrefix}-eyecatch`">
      <ScreenHomeType1Eyecatcher />
    </section>
    <section
      v-for="section in homeSections"
      :id="`${domidPrefix}-${section.kind}`"
      :key="section.order"
      class="section-margin"
    >
      <template v-if="section.type === 'type1'">
        <ScreenHomeType1SectionTitle
          v-if="section.title?.length"
          :title="section.title"
        />
        <ScreenHomeType1Information v-if="section.kind === 'infomation'" />
        <ScreenHomeType1Newses v-if="section.kind === 'news'" />
        <ScreenHomeType1Services v-if="section.kind === 'service'" />
        <ScreenHomeType1Contact v-if="section.kind === 'contact'" />
      </template>
    </section>
  </article>
</template>

<style lang="scss" scoped>
.section-margin {
  padding-top: calc($nav-header-height + 1rem);
}
</style>
