<script setup lang="ts">
const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()
const {
  eyecatchRef,
  onLoad,
  onCreate,
  onUpdate,
  onRemove,
  onUpdateTitleSetting,
  onUpdateImageSetting,
  loading,
} = useEyecatchActions(customerId)
await onLoad()
</script>

<template>
  <CommonContentWrap
    class="type1-eyecatcher"
    :loading="loading"
    loading-size="large"
  >
    <CommonContentItemAnimation
      :thresholds="[0]"
      animation-name="gFadeIn"
      animation-duration="2s"
    >
      <CommonEyecatchImage
        :url="eyecatchRef?.image?.url"
        :settings="eyecatchRef?.imageSettings"
        class="eyecatcher"
      >
        <template #default>
          <CommonEyecatchTitleSettingPositionEyecatcher
            :settings="eyecatchRef?.titleSettings"
            :can-edit="canEdit"
            @update="onUpdateTitleSetting"
          >
            <template #default>
              <CommonContentItemAnimation
                :thresholds="[0.5]"
                animation-name="gZoomIn"
                animation-duration="1.25s"
              >
                <CommonEyecatchTitle
                  place="top"
                  :title="eyecatchRef?.title"
                  :subtitle="eyecatchRef?.subtitle"
                  :settings="eyecatchRef?.titleSettings"
                  text-no-wrap
                />
              </CommonContentItemAnimation>
            </template>
            <template #sideSettings>
              <CommonEyecatchTitleSetting
                :settings="eyecatchRef?.titleSettings"
                @update="onUpdateTitleSetting"
              />
            </template>
            <template v-if="eyecatchRef?.subtitle" #topSettings>
              <CommonEyecatchTitleSettingAlign
                :settings="eyecatchRef?.titleSettings"
                @update="onUpdateTitleSetting"
              />
            </template>
          </CommonEyecatchTitleSettingPositionEyecatcher>
        </template>
        <template v-if="canEdit && eyecatchRef" #settings>
          <CommonEyecatchImageSetting
            :settings="eyecatchRef.imageSettings"
            @update="onUpdateImageSetting"
          />
        </template>
      </CommonEyecatchImage>
    </CommonContentItemAnimation>
    <div v-if="canEdit" class="edit-activator">
      <ManageContentEyecatcher
        v-if="eyecatchRef?.id"
        :eyecatch-data="eyecatchRef"
        @update="onUpdate"
        @remove="onRemove"
      />
      <ManageContentEyecatcher
        v-else
        :eyecatch-data="eyecatchRef"
        activator-label="トップ画像を登録してください"
        @create="onCreate"
      />
    </div>
  </CommonContentWrap>
</template>

<style lang="scss" scoped>
.type1-eyecatcher {
  position: relative;

  .edit-activator {
    position: absolute;
    top: 8.5rem;
    right: 0.5rem;
  }
}

.eyecatcher {
  height: 100dvh;
  min-height: 400px;

  @media only screen and (max-width: $grid-breakpoint-md) {
    height: 75dvh;
    min-height: auto;
  }
}
</style>
