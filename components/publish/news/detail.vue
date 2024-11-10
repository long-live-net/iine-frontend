<script setup lang="ts">
import { formatLocalDate } from '@/utils/misc'

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()
const {
  newsRef,
  newsPreNextIdRefRef,
  loading,
  onLoad,
  onCreate,
  onUpdate,
  onRemove,
  onUpdateTitleSetting,
  onUpdateImageSetting,
} = useNewsActions(customerId)

const route = useRoute()
const contentId = parseInt(
  Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
)
await onLoad(contentId)
</script>

<template>
  <CommonContentWrap :loading="loading">
    <CommonContentCard class="news-detail">
      <template #default>
        <CommonContentCardTitle
          :title="newsRef?.title ?? ''"
          class="g-block-sm"
        />
        <CommonEyecatchImage
          v-if="newsRef?.image"
          :url="newsRef?.image?.url"
          :settings="newsRef?.imageSettings"
          class="eyecatcher"
        >
          <template #default>
            <CommonEyecatchTitleSettingPosition
              :settings="newsRef?.titleSettings"
              :can-edit="canEdit"
              class="g-block-lg"
              @update="onUpdateTitleSetting"
            >
              <template #default>
                <CommonEyecatchTitle
                  place="section"
                  :title="newsRef?.title"
                  :settings="newsRef?.titleSettings"
                  text-no-wrap
                />
              </template>
              <template #sideSettings>
                <CommonEyecatchTitleSetting
                  :settings="newsRef?.titleSettings"
                  @update="onUpdateTitleSetting"
                />
              </template>
            </CommonEyecatchTitleSettingPosition>
          </template>
          <template v-if="canEdit && newsRef" #settings>
            <CommonEyecatchImageSetting
              :settings="newsRef.imageSettings"
              @update="onUpdateImageSetting"
            />
          </template>
        </CommonEyecatchImage>
        <CommonContentCardTitle
          v-else
          :title="newsRef?.title ?? ''"
          class="g-block-lg"
        />
        <div class="nav-pre-next-link">
          <div v-if="newsPreNextIdRefRef?.preId" class="nav-pre">
            <nuxt-link :to="`/news/${newsPreNextIdRefRef.preId}`">
              <v-icon icon="mdi-arrow-left-drop-circle" size="x-large" />
            </nuxt-link>
          </div>
          <div v-else />
          <div v-if="newsPreNextIdRefRef?.nextId" class="nav-next">
            <nuxt-link :to="`/news/${newsPreNextIdRefRef.nextId}`">
              <v-icon icon="mdi-arrow-right-drop-circle" size="x-large" />
            </nuxt-link>
          </div>
          <div v-else />
        </div>
        <CommonContentCardBody class="news-detail__body">
          <div v-if="newsRef?.id" class="news-detail__body--header">
            <PublishNewsCategoryBadge :category="newsRef.category" small />
            <p>
              <small>{{
                formatLocalDate(newsRef.publishOn, 'YYYY/MM/DD')
              }}</small>
            </p>
          </div>
          <div v-if="newsRef?.body" class="news-detail__body--body">
            <CommonWysiwsgViewer :value="newsRef?.body" />
          </div>
          <div v-else class="no-items">
            <p>データがありません</p>
            <div v-if="canEdit">
              <ManageContentNews
                activater-label="コンテンツを登録してください"
                @create="onCreate"
              />
            </div>
          </div>
        </CommonContentCardBody>
        <div v-if="canEdit && newsRef?.id" class="edit-activator">
          <ManageContentNews
            :news-data="newsRef"
            @update="onUpdate"
            @remove="onRemove"
          />
        </div>
      </template>
    </CommonContentCard>
  </CommonContentWrap>
</template>

<style scoped lang="scss">
.news-detail {
  position: relative;
  &__body {
    padding-top: 0;
    padding-bottom: 3rem;
    &--header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &--body {
      margin-top: 1.4rem;
    }
  }

  .edit-activator {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
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
}

$eyecatcher-height: 480px;
$eyecatcher-height-sm: 300px;

.eyecatcher {
  height: 30vh;
  max-height: $eyecatcher-height;
  min-height: calc($eyecatcher-height * 0.6);

  @media only screen and (max-width: $grid-breakpoint-md) {
    height: 30vw;
    max-height: $eyecatcher-height-sm;
    min-height: calc($eyecatcher-height-sm * 0.5);
  }
}

.nav-pre-next-link {
  display: flex;
  justify-content: space-between;
  margin: 1rem 1.5rem;
}
</style>
