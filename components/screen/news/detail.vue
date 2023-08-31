<script setup lang="ts">
const customerId = 1 // TODO: 適当！！
const canEdit = true // TODO: 適当

const route = useRoute()
const contentId = route.params.id

const {
  newsRef,
  onLoad,
  onCreate,
  onUpdate,
  onRemove,
  onUpdateImageSetting,
  loading,
} = useNewsActions(customerId)

await onLoad(contentId)
</script>

<template>
  <GuiContentCard class="news-detail">
    <GuiContentWrap :loading="loading">
      <GuiEyecatchImage
        v-if="newsRef?.image"
        :url="newsRef?.image?.url"
        :settings="newsRef?.image?.settings"
        class="eyecatcher"
      >
        <div v-if="canEdit && newsRef?.image?.settings" class="image-settings">
          <GuiImageSetting
            :settings="newsRef.image.settings"
            @update="onUpdateImageSetting"
          />
        </div>
      </GuiEyecatchImage>
      <GuiContentCardBody>
        <template v-if="newsRef?.id">
          <div class="news-detail__header">
            <p>
              <small>{{
                formatLocalDate(newsRef.publishOn, 'YYYY/MM/DD')
              }}</small>
            </p>
            <GuiNewsCategoryBadge :category="newsRef.category" small />
          </div>
          <h5 class="g-text-cl news-detail__title">
            <span>{{ newsRef?.title ?? '' }}</span>
          </h5>
          <div v-if="newsRef?.body" v-html="htmlSanitizer(newsRef?.body)" />
        </template>
        <div v-else class="no-items">
          <p>データがありません</p>
          <div v-if="canEdit">
            <ScreenFormNews
              activaterLabel="コンテンツを登録してください"
              @create="onCreate"
            />
          </div>
        </div>
      </GuiContentCardBody>
      <div v-if="canEdit && newsRef?.id" class="edit-activator">
        <ScreenFormNews
          :news-data="newsRef"
          @update="onUpdate"
          @remove="onRemove"
        />
      </div>
    </GuiContentWrap>
  </GuiContentCard>
</template>

<style scoped lang="scss">
$eyecatcher-height: 500px;
$eyecatcher-height-sm: 600px;

.news-detail {
  position: relative;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1.8rem;
  }
  .edit-activator {
    position: absolute;
    top: 1rem;
    right: 1rem;
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
}
.eyecatcher {
  position: relative;
  height: 30vh;
  min-height: 400px;
  max-height: $eyecatcher-height;
  min-height: calc($eyecatcher-height * 0.5);
  &__titles {
    position: absolute;
    top: 50%;
    left: 50%;
  }
  .image-settings {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
  }
}
@media only screen and (max-width: $grid-breakpoint-md) {
  .eyecatcher {
    height: 50vh;
    max-height: $eyecatcher-height-sm;
    min-height: calc($eyecatcher-height-sm * 0.5);
    .image-settings {
      bottom: 0.5rem;
      right: 0.5rem;
    }
  }
}
</style>
