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
      :settings="eyecatchRef?.image?.settings"
      class="eyecatcher"
    >
      <CommonContentItemMovable
        :position-string="eyecatchRef?.titleSettings?.position"
        :can-edit="canEdit"
        @update:position-string="
          onUpdateTitleSetting({ position: $event ?? '' })
        "
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
        <template #setting>
          <CommonEyecatchTitleSetting
            :settings="eyecatchRef?.titleSettings"
            @update="onUpdateTitleSetting"
          />
        </template>
      </CommonContentItemMovable>
      <div
        v-if="canEdit && eyecatchRef?.image?.settings"
        class="image-settings"
      >
        <ManageContentImageSetting
          :settings="eyecatchRef.image.settings"
          @update="onUpdateImageSetting"
        />
      </div>
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
    right: 2rem;
  }
}

.eyecatcher {
  position: relative;
  height: 100vh;
  min-height: 400px;

  .image-settings {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
  }
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .eyecatcher {
    height: 75vh;
    min-height: auto;

    .image-settings {
      bottom: 0.5rem;
      right: 0.5rem;
    }
  }
}
</style>
