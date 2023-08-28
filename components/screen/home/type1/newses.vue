<script setup lang="ts">
import type { NewsType, NewsForm } from '@/types/content'
import type { ListFilter, ListSort, ListPager } from '@/types/content-api'

const customerId = 1 // TODO: 適当！！
const canEdit = true // TODO: 適当

const {
  nextKey,
  getNewsList,
  newsListRef,
  loading: readLoading,
} = useNewsRead(customerId)

const {
  createNews,
  updateNews,
  removeNews,
  loading: writeLoading,
} = useNewsWrite(customerId)

const getNewsListWithPageCondition = async () => {
  const filter: ListFilter = { publishOn: false } // Todo: ログインしていれば false にすること後で忘れない様に！
  const sort: ListSort = { publishOn: -1 }
  const pager: ListPager = { page: 1, limit: 6 }
  await getNewsList(filter, sort, pager)
}

const onCreate = async (formData: NewsForm) => {
  await createNews(formData)
  nextKey()
  getNewsListWithPageCondition()
}

const onUpdate = async ({
  id,
  formData,
}: {
  id: number
  formData: NewsForm
}) => {
  if (!id) return

  await updateNews(id, formData)
  nextKey()
  getNewsListWithPageCondition()
}

const onRemove = async (id: number) => {
  await removeNews(id)
  nextKey()
  getNewsListWithPageCondition()
}

const loading = computed(() => readLoading.value || writeLoading.value)

await getNewsListWithPageCondition()

const dateString = (pdate: Date) => formatLocalDate(pdate, 'YYYY/MM/DD')
</script>

<template>
  <GuiContentWrap :loading="loading">
    <GuiContentCard class="type1-news-list">
      <GuiContentCardBody>
        <GuiContentList v-if="newsListRef?.length" :contents="newsListRef">
          <template #default="{ content }">
            <div class="news-item">
              <div class="news-item__header g-theme-contets-item__header">
                <span>
                  {{ dateString((content as NewsType).publishOn) }}
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
          <div v-if="canEdit">
            <ScreenFormNews
              activaterLabel="ニュースを登録してください"
              @create="onCreate"
            />
          </div>
        </div>
      </GuiContentCardBody>
      <div class="type1-news-list__action">
        <NuxtLink to="/news">and more ...</NuxtLink>
      </div>
      <div v-if="canEdit && newsListRef?.length" class="create-activator">
        <ScreenFormNews @create="onCreate" />
      </div>
    </GuiContentCard>
  </GuiContentWrap>
</template>

<style lang="scss" scoped>
.type1-news-list {
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
