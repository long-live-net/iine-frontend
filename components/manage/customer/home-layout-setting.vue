<script setup lang="ts">
import draggable from 'vuedraggable'

const settingModal = defineModel<boolean>('modal', { required: true })
const titleData = {
  title: 'ホームレイアウト変更',
  titleIcon: 'mdi-view-split-horizontal',
  titleColor: 'accent',
}
const {
  baseSections,
  editSections,
  initialLoading,
  loading,
  init,
  chengeHomeLayouts,
} = useHomeLayoutEdit()

const formMounting = ref(false)
watch(settingModal, async () => {
  if (settingModal.value) {
    await init()
    formMounting.value = true
  } else {
    // Note:
    // フォームコンポーネントは少しだけ遅れて unmount する
    // ダイアログが閉じる時にチラチラするため
    setTimeout(() => {
      formMounting.value = false
    }, 300)
  }
})

const onUpdate = async () => {
  await chengeHomeLayouts()
  settingModal.value = false
}
</script>

<template>
  <CommonModalDialog
    v-model:modal="settingModal"
    :title="titleData.title"
    :title-icon="titleData.titleIcon"
    :title-icon-color="titleData.titleColor"
    :loading="initialLoading"
    theme="white"
  >
    <ClientOnly>
      <div v-if="formMounting" class="home-layout-editor">
        <div class="layout-setting base">
          <h4 class="mb-2">テンプレート</h4>
          <draggable
            :list="baseSections"
            group="home-layouts"
            item-key="baseId"
            handle=".home-layout-draggable"
            class="drag-group"
          >
            <template #item="{ element }">
              <div class="drag-group__item home-layout-draggable">
                <p class="drag-group__item--icon">
                  <v-icon icon="mdi-apps" color="accent" />
                </p>
                <p>{{ element.menuTitle || element.title }}</p>
              </div>
            </template>
          </draggable>
        </div>

        <div class="layout-setting page">
          <h4 class="mb-2">レイアウト</h4>
          <draggable
            :list="editSections"
            group="home-layouts"
            item-key="baseId"
            handle=".home-layout-draggable"
            class="drag-group"
          >
            <template #item="{ element }">
              <div class="drag-group__item home-layout-draggable">
                <p class="drag-group__item--icon">
                  <v-icon icon="mdi-apps" color="accent" />
                </p>
                <p>{{ element.menuTitle || element.title }}</p>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </ClientOnly>
    <div class="mt-3">
      <p class="font-weight-bold">
        <small class="text-blue-darken-1">
          テンプレートからレイアウトに要素をドラッグドロップして設定できます
        </small>
      </p>
    </div>
    <div class="d-flex justify-end mt-6">
      <div>
        <v-btn
          prepend-icon="mdi-content-save"
          color="accent"
          variant="flat"
          width="8rem"
          :loading="loading"
          @click="onUpdate"
        >
          変更する
        </v-btn>
      </div>
    </div>
  </CommonModalDialog>
</template>

<style scoped lang="scss">
.home-layout-editor {
  display: flex;
  justify-content: space-between;
  width: 600px;
  max-width: 100%;

  .layout-setting {
    width: calc(50% - 0.4rem);

    .drag-group {
      min-height: 240px;
      padding: 0.6rem;
      display: flex;
      flex-direction: column;
      row-gap: 0.3rem;
      border-radius: 6px;
      &__item {
        position: relative;
        line-height: 3.25rem;
        padding: 0 0.5rem;
        &--icon {
          position: absolute;
          top: 0;
          right: 6px;
        }
      }
    }
  }

  .base {
    h4,
    h5 {
      color: $blue-darken1;
    }
    .drag-group {
      background-color: $blue-darken1;
      &__item {
        background-color: $gray-lighten4;
        color: $gray-darken3;
        border: 2px dashed $blue-darken3;
      }
    }
  }
  .page {
    h4,
    h5 {
      color: $accent;
    }
    .drag-group {
      background-color: $accent;
      &__item {
        background-color: #ffffcc;
        color: $black;
        border: 2px dashed $orange;
      }
    }
  }
}

.home-layout-draggable {
  cursor: grab;
}
</style>
