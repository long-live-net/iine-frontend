<script setup lang="ts">
import type { NewsType } from '@/types/content'
import { formatLocalDate } from '@/utils/misc'

const { customerId, canEdit } = useFoundation()
const {
  filter,
  sort,
  pager,
  newsListRef,
  newsTotalRef,
  loading,
  onLoad,
  getList,
  onCreate,
  onUpdate,
  onRemove,
  setListQueries,
} = useNewsListActions(customerId)

const page = ref(1)
const pageLimit = ref(20)
const isWholeData = ref(false)
const getNewses = async () => {
  filter.value = { publishOn: !isWholeData.value }
  sort.value = { publishOn: -1 }
  pager.value = { page: page.value, limit: pageLimit.value }
  await getList()
  setListQueries({
    filter: filter.value,
    sort: sort.value,
    pager: pager.value,
  })
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
            <div class="news-item">
              <div class="news-item__header g-theme-contents-item__header">
                <span>
                  {{
                    formatLocalDate(
                      (content as NewsType).publishOn,
                      'YYYY/MM/DD'
                    )
                  }}
                </span>
                <PublishNewsCategoryBadge
                  :category="(content as NewsType).category"
                  style="margin-left: 0.5rem"
                />
              </div>
              <div class="news-item__title">
                <nuxt-link :to="`/news/${content.id}`">
                  {{ content.title }}
                </nuxt-link>
              </div>
              <div v-if="canEdit" class="edit-activator">
                <ManageContentNews
                  :news-data="content as NewsType"
                  activater-size="x-small"
                  @update="onUpdate"
                  @remove="onRemove"
                />
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
        <ManageContentNews @create="onCreate" />
      </div>
    </CommonContentCard>
  </CommonContentWrap>
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
      color: $accent;
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
    padding: 0.2rem;
    text-align: center;
    width: 14rem;
    min-width: 14rem;
  }
  &__title {
    padding: 0.5rem;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .edit-activator {
    position: absolute;
    top: 3px;
    left: -25px;
  }
}
@media only screen and (max-width: $grid-breakpoint-md) {
  .news-item {
    flex-flow: column;
    align-items: stretch;
    padding: 0 0 0.6rem 1rem;
    .edit-activator {
      top: 0;
      left: -22px;
    }
  }
}
</style>
