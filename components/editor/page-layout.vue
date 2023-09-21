<script setup lang="ts">
import draggable from 'vuedraggable'
import type { PageSection } from '@/types/page-section'

const props = defineProps<{
  sections: PageSection[] | null
}>()

const emit = defineEmits<{
  update: [{ homeSections: PageSection[] }]
}>()

const {
  editSectionType,
  sectionTypes,
  baseSections,
  editSections,
  resetSections,
} = useHomeSectionsEdit()

const modal = ref(false)

watch(modal, (current) => {
  if (current) {
    resetSections(props.sections ?? [])
  }
})

const clone = (data: PageSection) => {
  return data
}

const onCancel = () => {
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
    activatorIcon="mdi-view-dashboard-edit"
    activator-color="accent"
    activator-text="ページレイアウト変更"
  />
  <GuiPageLayoutDialog v-model:modal="modal" class="page-layout-editor">
    <div class="page-layout-editor__theme">
      <h4>レイアウトテーマ選択</h4>
      <div class="theme-selection">
        <v-radio-group v-model="editSectionType" inline>
          <v-radio
            v-for="st in sectionTypes"
            key="st.type"
            color="primary"
            :label="st.label"
            :value="st.type"
          ></v-radio>
        </v-radio-group>
      </div>
    </div>
    <ClientOnly>
      <div class="page-layout-editor__layout">
        <h4>ページレイアウト設定</h4>
        <p class="font-weight-bold">
          <small class="g-theme-contets-item__draggable--notion">
            テンプレートからレイアウトにドラッグドロップして設定します
          </small>
        </p>
        <div class="layout-selection">
          <div class="base-layout">
            <h5>テンプレート</h5>
            <draggable
              :list="baseSections"
              :clone="clone"
              :group="{ name: 'page-layouts', pull: 'clone', put: false }"
              item-key="baseId"
              handle=".draggable"
              class="drag-group base"
            >
              <template #item="{ element }">
                <div
                  class="drag-group__item"
                  :class="{ draggable: !hasAssigned(element.baseId) }"
                >
                  <p>{{ element.kind }}</p>
                </div>
              </template>
            </draggable>
          </div>

          <div class="page-layout">
            <h5>ページレイアウト</h5>
            <draggable
              :list="editSections"
              group="page-layouts"
              item-key="baseId"
              handle=".draggable"
              class="drag-group page"
            >
              <template #item="{ element }">
                <div class="drag-group__item page__item draggable">
                  <p>{{ element.kind }}</p>
                  <p class="page__item--remove">
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
      </div>
    </ClientOnly>
    <div class="d-flex justify-end mt-8">
      <div>
        <v-btn
          prepend-icon="mdi-content-save"
          color="accent"
          variant="flat"
          width="8rem"
          @click="$emit('update')"
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
  </GuiPageLayoutDialog>
</template>

<style scoped lang="scss">
.page-layout-editor {
  &__theme {
    .theme-selection {
      padding: 0;
    }
  }
  &__layout {
    .layout-selection {
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
      .base-layout {
        margin-top: 0.5rem;
        width: calc(50% - 0.5rem);
        h4,
        h5 {
          color: $blue-darken1;
        }
      }
      .page-layout {
        margin-top: 0.5rem;
        width: calc(50% - 0.5rem);
        h4,
        h5 {
          color: $accent;
        }
      }
    }
  }
  .drag-group {
    min-height: 14.5rem;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
    border-radius: 6px;
    &__item {
      line-height: 3rem;
      padding: 0 0.5rem;
      background-color: $gray-lighten1;
      color: $gray-lighten3;
    }
  }
  .base {
    background-color: $blue-darken1;
    border: 3px solid $blue-darken1;
  }
  .page {
    background-color: $accent;
    border: 3px dashed $orange;
    &__item {
      position: relative;
      &--remove {
        position: absolute;
        top: 1px;
        right: 6px;
      }
    }
  }
  .draggable {
    background-color: #ffffcc;
    color: $black;
    cursor: pointer;
  }
}
</style>
