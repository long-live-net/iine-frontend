<script setup lang="ts">
const { customerId, canEdit } = useFoundation()
const {
  newsRef,
  onLoad,
  onCreate,
  onUpdate,
  onRemove,
  onUpdateImageSetting,
  loading,
} = useNewsActions(customerId)

const route = useRoute()
const contentId = route.params.id
await onLoad(contentId)
</script>

<template>
  <CommonContentCard class="news-detail">
    <CommonContentWrap :loading="loading">
      <CommonEyecatchImage
        v-if="newsRef?.image"
        :url="newsRef?.image?.url"
        :settings="newsRef?.image?.settings"
        class="eyecatcher"
      >
        <div v-if="canEdit && newsRef?.image?.settings" class="image-settings">
          <ManageContentImageSetting
            :settings="newsRef.image.settings"
            @update="onUpdateImageSetting"
          />
        </div>
      </CommonEyecatchImage>
      <CommonContentCardBody>
        <template v-if="newsRef?.id">
          <div class="news-detail__header">
            <CommonNewsCategoryBadge :category="newsRef.category" small />
            <p>
              <small>{{
                formatLocalDate(newsRef.publishOn, 'YYYY/MM/DD')
              }}</small>
            </p>
          </div>
          <h5 class="g-text-cl news-detail__title">
            <span>{{ newsRef?.title ?? '' }}</span>
          </h5>
          <div v-if="newsRef?.body" class="ql-editor">
            <div v-html="htmlSanitizer(newsRef?.body)" />
            <div class="inquire-activator">
              <PublishInquire />
            </div>
          </div>
        </template>
        <div v-else class="no-items">
          <p>データがありません</p>
          <div v-if="canEdit">
            <ManageContentNews
              activaterLabel="コンテンツを登録してください"
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
    </CommonContentWrap>
  </CommonContentCard>
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
  .inquire-activator {
    margin-top: 1.5rem;
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
