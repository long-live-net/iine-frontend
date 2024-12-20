<script setup lang="ts">
import type { NewsType } from '@/types/content'
import { formatLocalDate } from '@/utils/misc'

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()
const {
  filter,
  sort,
  pager,
  newsListRef,
  onLoad,
  getList,
  onCreate,
  onUpdate,
  onRemove,
  loading,
} = useNewsListActions(customerId)

const isWholeData = ref(false)
filter.value = { publishOn: true }
sort.value = { publishOn: -1 }
pager.value = { page: 1, limit: 6 }

const getNewses = async () => {
  filter.value = { publishOn: !isWholeData.value }
  await getList()
}
watch(isWholeData, async () => {
  await getNewses()
})

const isAppear = ref(false)
const onIntersectImage = async (isIntersecting: boolean) => {
  if (isIntersecting) {
    isAppear.value = isIntersecting
  }
}
await onLoad()
</script>

<template>
  <CommonContentWrap :loading="loading">
    <CommonContentCard class="type1-news-list">
      <CommonContentCardBody>
        <CommonContentList
          v-if="newsListRef?.length"
          v-intersect="{
            handler: onIntersectImage,
            options: {
              threshold: [0.5],
            },
          }"
          :contents="newsListRef"
        >
          <template #default="{ content, index }">
            <div class="news-item">
              <div
                class="news-item__header g-theme-contents-item__header"
                :class="{ 'g-animation-initial-effect': !canEdit }"
                :style="{
                  'animation-name': canEdit || !isAppear ? 'none' : 'gFadeIn',
                  'animation-duration': '1.5s',
                  'animation-delay': `${index * 0.1}s`,
                }"
              >
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
                  class="ml-2"
                />
              </div>
              <div
                class="news-item__title"
                :class="{ 'g-animation-initial-effect': !canEdit }"
                :style="{
                  'animation-name':
                    canEdit || !isAppear ? 'none' : 'gFadeInLeft',
                  'animation-duration': '1.5s',
                  'animation-delay': `${index * 0.1}s`,
                }"
              >
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
          <div v-if="canEdit">
            <ManageContentNews
              activater-label="ニュースを登録してください"
              @create="onCreate"
            />
          </div>
        </div>
        <div v-if="canEdit" class="whole-switch">
          <ManageContentNewsWholeSwitch v-model="isWholeData" />
        </div>
      </CommonContentCardBody>
      <div class="type1-news-list__action">
        <NuxtLink to="/news">and more ...</NuxtLink>
      </div>
      <div v-if="canEdit && newsListRef?.length" class="create-activator">
        <ManageContentNews @create="onCreate" />
      </div>
    </CommonContentCard>
  </CommonContentWrap>
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
