<script setup lang="ts">
import type { NewsType } from '@/types/content'

const { customerId, canEdit } = useFoundation()
const {
  filter,
  sort,
  pager,
  newsListRef,
  newsTotalRef,
  onLoad,
  onCreate,
  onUpdate,
  onRemove,
} = useNewsListActions(customerId)

const page = ref(1)
const pageLimit = ref(20)
const isWholeData = ref(false)
const loadNewses = async () => {
  filter.value = { publishOn: !isWholeData.value }
  sort.value = { publishOn: -1 }
  pager.value = { page: page.value, limit: pageLimit.value }
  await onLoad()
}

watch(isWholeData, () => {
  page.value = 1
  loadNewses()
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
  () => {
    if (page.value != route.query?.page) {
      page.value = route.query?.page ?? 1
    }
    if (pageLimit.value != route.query?.limit) {
      pageLimit.value = route.query?.limit ?? 20
    }
    loadNewses()
  }
)
await loadNewses()
</script>

<template>
  <GuiContentCard class="news-list">
    <GuiContentCardBody>
      <GuiContentList v-if="newsListRef?.length" :contents="newsListRef">
        <template #default="{ content }">
          <div class="news-item">
            <div class="news-item__header g-theme-contets-item__header">
              <span>
                {{
                  formatLocalDate((content as NewsType).publishOn, 'YYYY/MM/DD')
                }}
              </span>
              <GuiNewsCategoryBadge
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
              <ScreenFormNews
                :newsData="content as NewsType"
                activaterSize="x-small"
                @update="onUpdate"
                @remove="onRemove"
              />
            </div>
          </div>
        </template>
      </GuiContentList>
      <div v-else class="no-items">
        <p>データがありません</p>
      </div>
      <div v-if="canEdit" class="whole-switch">
        <EditorNewsWholeSwitch v-model="isWholeData" />
      </div>
    </GuiContentCardBody>
    <div class="news-list__action">
      <BasePagination
        v-model:page="page"
        :limit="pageLimit"
        :total="newsTotalRef ?? 1"
        :total-visible="7"
      />
    </div>
    <div v-if="canEdit && newsListRef?.length" class="create-activator">
      <ScreenFormNews @create="onCreate" />
    </div>
  </GuiContentCard>
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
      color: $warning;
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
