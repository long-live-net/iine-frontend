<script setup lang="ts">
import type { ContentEditMode } from '@/types/content'
import { formatLocalDate } from '@/utils/misc'

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()

const route = useRoute()
const contentId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id

const {
  contentTitle,
  newsRef,
  loading: detailLoading,
  onLoad: onDetailLoad,
  onCreate,
  onUpdate,
  onRemove,
  onUpdateTitleSetting,
  onUpdateImageSetting,
} = useNewsActions(customerId)

const {
  filter,
  sort,
  pager,
  newsListRef,
  loading: listLoading,
  onLoad: onListLoad,
} = useNewsListActions(customerId)

const editModal = ref(false)
const editMode = ref<ContentEditMode>('update')

const bodyPlainString = computed(
  () => newsRef.value?.body?.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '') ?? ''
)
const loading = computed(() => detailLoading.value || listLoading.value)
const preUrl = computed<string | null>(() => {
  const curIndex = newsListRef.value?.findIndex((c) => c.id === contentId) ?? -1
  const preId = newsListRef.value?.[curIndex + 1]?.id
  return preId ? `/news/${preId}` : null
})
const nextUrl = computed<string | null>(() => {
  const curIndex = newsListRef.value?.findIndex((c) => c.id === contentId) ?? -1
  const nextId = newsListRef.value?.[curIndex - 1]?.id
  return nextId ? `/news/${nextId}` : null
})

filter.value = { publishOn: true }
sort.value = { publishOn: -1 }
pager.value = { page: 1, limit: 1024 }
await Promise.all([onDetailLoad(contentId), onListLoad()])
</script>

<template>
  <CommonContentWrap :loading="loading">
    <CommonContentSlidableNavigation :pre-url="preUrl" :next-url="nextUrl">
      <CommonContentCard>
        <PublishContentDetailItem
          v-model:modal="editModal"
          :item="newsRef"
          :content-title="contentTitle"
          :can-edit="canEdit"
          no-image-parallax
          @edit-mode="editMode = $event"
          @update-title-setting="onUpdateTitleSetting"
          @update-image-setting="onUpdateImageSetting"
        >
          <template #body>
            <div class="news-detail">
              <div v-if="newsRef?.id" class="body-header">
                <PublishNewsCategoryBadge :category="newsRef.category" small />
                <p>
                  <small>{{
                    formatLocalDate(newsRef.publishOn, 'YYYY/MM/DD')
                  }}</small>
                </p>
              </div>
              <div v-if="bodyPlainString" class="body">
                <CommonWysiwygViewer :value="newsRef?.body" />
              </div>
              <div v-else class="no-items">
                <p>本文がありません</p>
                <div v-if="canEdit" class="d-flex align-center">
                  <CommonContentEditActivator
                    v-model:modal="editModal"
                    edit-mode="body"
                    content-title="本文"
                    @update:modal="editMode = 'body'"
                  />
                  <p class="ml-2">このボタンから本文を登録してください。</p>
                </div>
              </div>
            </div>
          </template>
          <template #middlenavi>
            <CommonContentPreNextNagivation
              :pre-url="preUrl"
              :next-url="nextUrl"
            />
          </template>
        </PublishContentDetailItem>
      </CommonContentCard>
    </CommonContentSlidableNavigation>
  </CommonContentWrap>
  <ManageContentNews
    v-model:modal="editModal"
    :content-title="contentTitle"
    :edit-mode="editMode"
    :news-data="newsRef"
    @create="onCreate"
    @update="onUpdate"
    @remove="onRemove"
  />
</template>

<style scoped lang="scss">
.news-detail {
  padding-top: 0;
  padding-bottom: 1rem;

  .body-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .body {
    margin-top: 0.75rem;
  }
}

.no-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 1rem;

  p {
    font-weight: bold;
    color: var(--warning-color);
  }
}
</style>
