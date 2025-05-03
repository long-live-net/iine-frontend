<script setup lang="ts">
import type { UiTabItem } from '~/types/ui'
const tab = defineModel<UiTabItem['value']>('tab', { required: true })

withDefaults(
  defineProps<{
    tabItems: UiTabItem[]
    contentTitle: string
    alignTabs?: 'title' | 'end' | 'start' | 'center'
    showArrows?: boolean
    canEdit?: boolean
  }>(),
  {
    alignTabs: 'center',
    showArrows: false,
    canEdit: false,
  }
)
defineEmits<{
  edit: [item: UiTabItem]
  delete: [item: UiTabItem]
}>()
</script>

<template>
  <v-tabs
    v-model="tab"
    :align-tabs="alignTabs"
    :show-arrows="showArrows"
    center-active
    selected-class="content-tabs-selected"
    class="content-tabs g-theme-contents-tabs"
  >
    <template v-for="item in tabItems" :key="item.key">
      <v-tab :value="item.value"
        >{{ item.label }}
        <v-tooltip v-if="canEdit" :text="`${contentTitle}編集`" location="top">
          <template #activator="{ props: bindProps }">
            <span
              v-bind="bindProps"
              class="tab-button edit-button elevation-4"
              @click.stop="$emit('edit', item)"
              ><v-icon class="icon">mdi-pencil</v-icon></span
            >
          </template>
        </v-tooltip>
        <v-tooltip v-if="canEdit" :text="`${contentTitle}削除`" location="top">
          <template #activator="{ props: bindProps }">
            <span
              v-bind="bindProps"
              class="tab-button delete-button elevation-4"
              @click.stop.prevent="$emit('delete', item)"
              ><v-icon class="icon">mdi-delete</v-icon></span
            >
          </template>
        </v-tooltip>
      </v-tab>
    </template>
  </v-tabs>
  <v-tabs-window v-model="tab">
    <v-tabs-window-item
      v-for="item in tabItems"
      :key="item.key"
      :value="item.value"
    >
      <slot :item="item" />
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<style lang="scss" scoped>
.content-tabs {
  .content-tabs-selected {
    background-color: var(--tab-selected-background-color);
  }

  .tab-button {
    display: inline-block;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: small;
    line-height: 28px;
    cursor: pointer;

    .icon {
      color: var(--tab-button-icon-color);
    }
  }

  .edit-button {
    margin-left: 8px;
    background-color: $success;

    &:hover {
      background-color: $green;
    }
  }

  .delete-button {
    margin-left: 2px;
    background-color: $gray;

    &:hover {
      background-color: $gray-darken1;
    }
  }

  :deep(.v-btn--variant-text) {
    font-weight: bold;
  }
}
</style>
