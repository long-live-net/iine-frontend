<script setup lang="ts">
const { customerId, canEdit } = useFoundation()
const {
  informationRef,
  onLoad,
  onCreate,
  onUpdate,
  onRemove,
  onUpdateImageSetting,
  loading,
} = useInformationActions(customerId)
await onLoad()
</script>

<template>
  <CommonContentWrap :loading="loading">
    <CommonContentCard class="type1-information">
      <CommonEyecatchImage
        v-if="informationRef?.image"
        :url="informationRef?.image?.url"
        :settings="informationRef?.image?.settings"
        class="eyecatcher"
      >
        <CommonEyecatchTitles
          place="section"
          :title="informationRef?.title"
          :subtitle="informationRef?.subtitle"
          class="eyecatcher__titles"
        />
        <div
          v-if="canEdit && informationRef?.image?.settings"
          class="image-settings"
        >
          <ManageContentImageSetting
            :settings="informationRef.image.settings"
            @update="onUpdateImageSetting"
          />
        </div>
      </CommonEyecatchImage>
      <CommonContentCardBody>
        <div v-if="informationRef?.body">
          <CommonWysiwsgViewer :value="informationRef?.body" />
          <div class="inquire-activator">
            <PublishInquire />
          </div>
        </div>
        <div v-else class="no-items">
          <p>データがありません</p>
          <div v-if="canEdit">
            <ManageContentInformation
              activater-label="コンテンツを登録してください"
              @create="onCreate"
            />
          </div>
        </div>
      </CommonContentCardBody>
      <div v-if="canEdit && informationRef?.id" class="edit-activator">
        <ManageContentInformation
          :information-data="informationRef"
          @update="onUpdate"
          @remove="onRemove"
        />
      </div>
    </CommonContentCard>
  </CommonContentWrap>
</template>

<style scoped lang="scss">
$eyecatcher-height: 500px;
$eyecatcher-height-sm: 600px;

.type1-information {
  position: relative;
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
