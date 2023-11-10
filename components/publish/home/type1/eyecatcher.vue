<script setup lang="ts">
const { customerId, canEdit } = useFoundation()
const {
  eyecatchRef,
  onLoad,
  onCreate,
  onUpdate,
  onRemove,
  onUpdateImageSetting,
  loading,
} = useEyecatchActions(customerId)
await onLoad()
</script>

<template>
  <CommonContentWrap
    class="type1-eyecatcher"
    :loading="loading"
    loadingSize="large"
  >
    <CommonEyecatchImage
      :url="eyecatchRef?.image?.url"
      :settings="eyecatchRef?.image?.settings"
      class="eyecatcher"
    >
      <CommonEyecatchTitles
        place="top"
        :title="eyecatchRef?.title"
        :subtitle="eyecatchRef?.subtitle"
        class="titles"
      />
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
        activaterLabel="トップ画像を登録してください"
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
  .titles {
    position: absolute;
    top: 70%;
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
    height: 100vh;
    min-height: auto;
    .image-settings {
      bottom: 0.5rem;
      right: 0.5rem;
    }
  }
}
</style>
