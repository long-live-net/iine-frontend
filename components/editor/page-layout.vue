<script setup lang="ts">
import draggable from 'vuedraggable'
import type { BasePageSection, PageSectionEdit } from '@/types/page-setting'

const titleData = {
  title: 'ページレイアウト変更',
  titleIcon: 'mdi-view-dashboard-edit',
  titleColor: 'accent',
}
const { customerId } = useFoundation()
const { baseSections, editSections, loading, onUpdateSections } =
  useHomeLayoutEdit(customerId)

const modal = ref(false)

const clone = (data: BasePageSection): PageSectionEdit => {
  return { ...data, customerId }
}

const onCancel = () => {
  modal.value = false
}

const onUpdate = async () => {
  await onUpdateSections()
  modal.value = false
}

const hasAssigned = (baseId: string) =>
  editSections.value.some((ec) => ec.baseId === baseId)

const removeItem = (baseId: string) => {
  editSections.value = editSections.value.filter((ec) => ec.baseId !== baseId)
}
</script>

<template>
  <BaseActivator
    v-model:modal="modal"
    :activator-icon="titleData.titleIcon"
    :activator-color="titleData.titleColor"
    :activator-text="titleData.title"
  />
  <CommonModalDialog
    v-model:modal="modal"
    :title="titleData.title"
    :title-icon="titleData.titleIcon"
    :title-icon-color="titleData.titleColor"
  >
    <ClientOnly>
      <div class="page-layout-editor">
        <div class="layout-setting base">
          <h4 class="mb-2">テンプレート</h4>
          <draggable
            :list="baseSections"
            :clone="clone"
            :group="{ name: 'page-layouts', pull: 'clone', put: false }"
            item-key="baseId"
            handle=".draggable"
            class="drag-group"
          >
            <template #item="{ element }">
              <div
                class="drag-group__item"
                :class="{ draggable: !hasAssigned(element.baseId) }"
              >
                <p class="drag-group__item--icon">
                  <v-icon
                    v-if="hasAssigned(element.baseId)"
                    icon="mdi-cancel"
                  />
                  <v-icon v-else icon="mdi-apps" color="accent" />
                </p>
                <p>{{ element.kind }}</p>
              </div>
            </template>
          </draggable>
        </div>

        <div class="layout-setting page">
          <h4 class="mb-2">レイアウト</h4>
          <draggable
            :list="editSections"
            group="page-layouts"
            item-key="baseId"
            handle=".draggable"
            class="drag-group"
          >
            <template #item="{ element }">
              <div class="drag-group__item draggable">
                <p class="drag-group__item--icon">
                  <v-icon icon="mdi-apps" color="accent" />
                </p>
                <p>{{ element.kind }}</p>
                <p class="drag-group__item--action">
                  <v-btn
                    color="grey-darken-1"
                    icon="mdi-close"
                    size="small"
                    density="comfortable"
                    flat
                    @click="removeItem(element.baseId)"
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
        <v-btn
          prepend-icon="mdi-cancel"
          color="secondary"
          variant="flat"
          width="8rem"
          class="ml-1"
          @click="onCancel"
        >
          キャンセル
        </v-btn>
      </div>
    </div>
  </CommonModalDialog>
</template>

<style scoped lang="scss">
.page-layout-editor {
  display: flex;
  justify-content: space-between;

  .layout-setting {
    width: calc(50% - 0.4rem);

    .drag-group {
      min-height: 316px;
      padding: 0.6rem;
      display: flex;
      flex-direction: column;
      row-gap: 0.5rem;
      border-radius: 6px;
      &__item {
        position: relative;
        line-height: 4rem;
        padding: 0 0.5rem;
        background-color: $gray-lighten1;
        color: $gray-lighten4;
        border: 2px solid $blue-darken2;
      }
      .draggable {
        background-color: #ffffcc;
        color: $black;
        border: 2px dashed $orange;
        cursor: grab;
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
  .page-layout-editor {
    .page {
      .drag-group {
        &__item {
          &--icon {
            top: 16px;
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
