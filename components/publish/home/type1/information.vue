<script setup lang="ts">
const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()
const {
  informationRef,
  onLoad,
  onCreate,
  onUpdate,
  onRemove,
  onUpdateTitleSetting,
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
        <CommonEyecatchTitleSettingPositionFrame
          :settings="informationRef?.titleSettings"
          :can-edit="canEdit"
          class="g-block-lg"
          @update="onUpdateTitleSetting"
        >
          <template #default>
            <CommonEyecatchTitle
              place="section"
              :title="informationRef?.title"
              :subtitle="informationRef?.subtitle"
              :settings="informationRef?.titleSettings"
              text-no-wrap
            />
          </template>
          <template #sideSettings>
            <CommonEyecatchTitleSetting
              :settings="informationRef?.titleSettings"
              @update="onUpdateTitleSetting"
            />
          </template>
          <template v-if="informationRef?.subtitle" #topSettings>
            <CommonEyecatchTitleSettingAlign
              :settings="informationRef?.titleSettings"
              @update="onUpdateTitleSetting"
            />
          </template>
        </CommonEyecatchTitleSettingPositionFrame>
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
      <CommonContentCardTitle
        :title="informationRef?.title ?? ''"
        :subtitle="informationRef?.subtitle"
        class="g-block-sm"
      />
      <CommonContentCardBody class="type1-information__body">
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

$eyecatcher-height: 480px;
$eyecatcher-height-sm: 300px;

.eyecatcher {
  position: relative;
  height: 30vh;
  max-height: $eyecatcher-height;
  min-height: calc($eyecatcher-height * 0.7);

  .image-settings {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
  }
}
@media only screen and (max-width: $grid-breakpoint-md) {
  .type1-information {
    &__body {
      padding-top: 0;
    }
  }

  .eyecatcher {
    height: 50vw;
    max-height: $eyecatcher-height-sm;
    min-height: calc($eyecatcher-height-sm * 0.5);

    .image-settings {
      bottom: 0.5rem;
      right: 0.5rem;
    }
  }
}
</style>
