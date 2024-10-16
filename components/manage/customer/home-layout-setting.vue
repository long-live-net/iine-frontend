<script setup lang="ts">
import draggable from 'vuedraggable'
import type { SectionKind, PageLayout } from '@/types/customer-setting'

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

const clone = (data: PageLayout): PageLayout => ({
  kind: data.kind,
  title: data.title,
  menuTitle: data.menuTitle ?? null,
})

const onUpdate = async () => {
  await chengeHomeLayouts()
}

const hasAssigned = (kind: SectionKind) =>
  editSections.value.some((ec) => ec.kind === kind)

const removeItem = (kind: SectionKind) => {
  editSections.value = editSections.value.filter((ec) => ec.kind !== kind)
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
            :clone="clone"
            :group="{ name: 'home-layouts', pull: 'clone', put: false }"
            item-key="baseId"
            handle=".home-layout-draggable"
            class="drag-group"
          >
            <template #item="{ element }">
              <div
                class="drag-group__item"
                :class="{
                  'home-layout-draggable': !hasAssigned(element.kind),
                }"
              >
                <p class="drag-group__item--icon">
                  <v-icon v-if="hasAssigned(element.kind)" icon="mdi-cancel" />
                  <v-icon v-else icon="mdi-apps" color="accent" />
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
                <p class="drag-group__item--action">
                  <v-btn
                    color="grey-darken-1"
                    icon="mdi-close"
                    size="small"
                    density="comfortable"
                    flat
                    @click="removeItem(element.kind)"
                  />
                </p>
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
      min-height: 316px;
      padding: 0.6rem;
      display: flex;
      flex-direction: column;
      row-gap: 0.3rem;
      border-radius: 6px;
      &__item {
        position: relative;
        line-height: 3.25rem;
        padding: 0 0.5rem;
        background-color: $gray-lighten1;
        color: $gray-lighten4;
        border: 2px solid $blue-darken2;
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
        &--icon {
          position: absolute;
          top: 0;
          right: 6px;
        }
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
        &--icon {
          position: absolute;
          top: 0;
          right: 32px;
        }
        &--action {
          position: absolute;
          top: 0px;
          right: 3px;
        }
      }
    }
  }
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .home-layout-editor {
    .page {
      .drag-group {
        &__item {
          &--icon {
            top: 14px;
            right: 6px;
          }
          &--action {
            top: -12px;
            right: 4px;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.home-layout-draggable {
  background-color: #ffffcc !important;
  color: $black !important;
  border: 2px dashed $orange !important;
  cursor: grab;
}
</style>
