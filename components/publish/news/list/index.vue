<script setup lang="ts">
import type { NewsType, ContentEditMode } from '@/types/content'
import { formatLocalDate } from '@/utils/misc'

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()

const {
  contentTitle,
  filter,
  sort,
  pager,
  newsListRef,
  newsTotalRef,
  loading,
  onLoad,
  onGetList,
  onCreate,
  onUpdate,
  onRemove,
} = useNewsListActions(customerId)

const editModal = ref(false)
const updatingData = ref<NewsType | null>(null)
const editMode = ref<ContentEditMode>('update')

const page = ref(1)
const pageLimit = ref(20)
const isWholeData = ref(false)
const getNewses = async () => {
  filter.value = { publishOn: !isWholeData.value }
  sort.value = { publishOn: -1 }
  pager.value = { page: page.value, limit: pageLimit.value }
  await onGetList()
}

watch(isWholeData, async () => {
  page.value = 1
  await getNewses()
})

const route = useRoute()
const router = useRouter()
watch(page, () => {
  router.push({
    query: {
      page: page.value,
      limit: pageLimit.value,
    },
  })
})
watch(
  () => route.query,
  async () => {
    const quaryPageString = Array.isArray(route.query?.page)
      ? route.query.page[0]?.toString()
      : route.query?.page?.toString()
    const quaryPage = quaryPageString ? parseInt(quaryPageString) : 1
    if (page.value != quaryPage) {
      page.value = quaryPage
    }
    const quaryLimitString = Array.isArray(route.query?.limit)
      ? route.query.limit[0]?.toString()
      : route.query?.limit?.toString()
    const quaryLimit = quaryLimitString ? parseInt(quaryLimitString) : 20
    if (pageLimit.value != quaryLimit) {
      pageLimit.value = quaryLimit
    }
    await getNewses()
  }
)

filter.value = { publishOn: !isWholeData.value }
sort.value = { publishOn: -1 }
pager.value = { page: page.value, limit: pageLimit.value }
await onLoad()
</script>

<template>
  <CommonContentWrap :loading="loading">
    <CommonContentCard class="news-list">
      <CommonContentCardBody>
        <CommonContentList v-if="newsListRef?.length" :contents="newsListRef">
          <template #default="{ content }">
            <div class="news-item" :class="{ 'news-item-can-edit': canEdit }">
              <div class="news-item__header g-theme-contents-item__header">
                <p>
                  {{ formatLocalDate(content.publishOn, 'YYYY/MM/DD') }}
                </p>
                <PublishNewsCategoryBadge
                  :category="content.category"
                  class="ml-3"
                />
              </div>
              <div class="news-item__title">
                <nuxt-link :to="`/news/${content.id}`">
                  {{ content.title }}
                </nuxt-link>
              </div>
              <div v-if="canEdit" class="edit-activator">
                <div class="activators">
                  <CommonContentEditActivator
                    v-model:modal="editModal"
                    :content-title="contentTitle"
                    edit-mode="caption"
                    size="x-small"
                    no-tooltip
                    @update:modal="
                      ((updatingData = content), (editMode = 'caption'))
                    "
                  />
                  <CommonContentEditActivator
                    v-model:modal="editModal"
                    :content-title="contentTitle"
                    edit-mode="delete"
                    size="x-small"
                    no-tooltip
                    @update:modal="
                      ((updatingData = content), (editMode = 'delete'))
                    "
                  />
                </div>
              </div>
            </div>
          </template>
        </CommonContentList>
        <div v-else class="no-items">
          <p>データがありません</p>
        </div>
        <div v-if="canEdit" class="whole-switch">
          <ManageContentNewsWholeSwitch v-model="isWholeData" />
        </div>
      </CommonContentCardBody>
      <div class="news-list__action">
        <BasePagination
          v-model:page="page"
          :limit="pageLimit"
          :total="newsTotalRef ?? 1"
          :total-visible="7"
        />
      </div>
      <div v-if="canEdit && newsListRef?.length" class="create-activator">
        <CommonContentEditActivator
          v-model:modal="editModal"
          :content-title="contentTitle"
          edit-mode="new"
          @update:modal="((updatingData = null), (editMode = 'new'))"
        />
      </div>
    </CommonContentCard>
  </CommonContentWrap>
  <ManageContentNews
    v-model:modal="editModal"
    :content-title="contentTitle"
    :edit-mode="editMode"
    :news-data="updatingData"
    @create="onCreate"
    @update="onUpdate"
    @remove="onRemove"
  />
</template>

<style lang="scss" scoped>
.news-list {
  position: relative;
  min-height: 16rem;
  &__action {
    margin: 1.5rem 0;
    text-align: center;
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

  .whole-switch {
    margin-top: 1rem;
  }

  .create-activator {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
}

.news-item {
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding-left: 1rem;
  gap: 0.5rem;
  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem;
    text-align: center;
    width: 14.5rem;
    min-width: 14.5rem;
  }
  &__title {
    padding: 0.5rem;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media only screen and (max-width: $grid-breakpoint-md) {
    flex-flow: column;
    align-items: stretch;
    padding: 0 0 0.6rem 1rem;
  }
}

.news-item-can-edit {
  padding-left: 2.5rem;

  .edit-activator {
    position: absolute;
    top: 3px;
    left: -30px;

    .activators {
      display: flex;
      gap: 1px;
    }
  }

  @media only screen and (max-width: $grid-breakpoint-md) {
    padding-left: 2rem;

    .edit-activator {
      top: 0;
      left: -8px;

      .activators {
        flex-direction: column;
        gap: 4px;
      }
    }
  }
}
</style>
