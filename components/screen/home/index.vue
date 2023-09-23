<script setup lang="ts">
import type { LayoutTheme } from '@/types/customer'
import type { PageSectionEdit } from '@/types/page-setting'

const { customerId, customer, canEdit } = useFoundation()
const { loading: writeLoading, replaceHomeLayout } =
  useHomeLayoutWrite(customerId)
const {
  domidPrefix,
  homeSections,
  loading: readLoading,
  nextKey,
  fetchHomeLayout,
} = useHomeLayoutRead(customerId)

const loading = computed(() => writeLoading.value || readLoading.value)
const layoutTheme = computed<LayoutTheme>(
  () => customer.value?.layoutTheme ?? 'type1'
)

const onUpdateSections = async (pageSections: PageSectionEdit[]) => {
  nextKey()
  await replaceHomeLayout(pageSections)
  await fetchHomeLayout()
}

homeSections.value ?? (await fetchHomeLayout())
</script>

<template>
  <article>
    <section :id="`${domidPrefix}-eyecatch`">
      <ScreenHomeType1Eyecatcher />
    </section>
    <template v-if="loading"> ページ読み込み中です </template>
    <template v-else>
      <section
        v-for="section in homeSections"
        :id="`${domidPrefix}-${section.kind}`"
        :key="section.id"
        class="section-margin"
      >
        <template v-if="layoutTheme === 'type1'">
          <ScreenHomeType1SectionTitle
            v-if="section.title?.length"
            :title="section.title"
          />
          <ScreenHomeType1Information v-if="section.kind === 'information'" />
          <ScreenHomeType1Newses v-if="section.kind === 'news'" />
          <ScreenHomeType1Services v-if="section.kind === 'service'" />
          <ScreenHomeType1Contact v-if="section.kind === 'contact'" />
        </template>
      </section>
    </template>
    <div v-if="canEdit" class="edit-activator">
      <EditorPageLayout :sections="homeSections" @update="onUpdateSections" />
    </div>
  </article>
</template>

<style lang="scss" scoped>
article {
  .section-margin {
    padding-top: calc($nav-header-height + 1rem);
  }
  .edit-activator {
    position: fixed;
    top: calc($nav-header-height + 1rem);
    left: 1rem;
  }
}
</style>
