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
    <CommonEyecatchImage
      :url="eyecatchRef?.image?.url"
      :settings="eyecatchRef?.imageSettings"
      class="eyecatcher"
    >
      <template #default>
        <CommonEyecatchTitleSettingPositionFrame
          :settings="eyecatchRef?.titleSettings"
          :can-edit="canEdit"
          @update="onUpdateTitleSetting"
        >
          <template #default>
            <CommonEyecatchTitle
              place="top"
              :title="eyecatchRef?.title"
              :subtitle="eyecatchRef?.subtitle"
              :settings="eyecatchRef?.titleSettings"
              text-no-wrap
            />
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
        </CommonEyecatchTitleSettingPositionFrame>
      </template>
      <template v-if="canEdit && eyecatchRef" #settings>
        <CommonEyecatchImageSetting
          :settings="eyecatchRef.imageSettings"
          @update="onUpdateImageSetting"
        />
      </template>
    </CommonEyecatchImage>
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
        activater-label="トップ画像を登録してください"
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
  height: 100vh;
  min-height: 400px;

  @media only screen and (max-width: $grid-breakpoint-md) {
    height: 75vh;
    min-height: auto;
  }
}
</style>
