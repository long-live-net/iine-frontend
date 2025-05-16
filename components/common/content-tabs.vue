<script setup lang="ts">
import type { UiTabItem } from '~/types/ui'
const tab = defineModel<UiTabItem['value']>('tab', { required: true })

withDefaults(
  defineProps<{
    tabItems: UiTabItem[]
    contentTitle: string
    alignTabs?: 'title' | 'end' | 'start' | 'center'
    showArrows?: boolean
    showBottomNavi?: boolean
    canEdit?: boolean
  }>(),
  {
    alignTabs: 'center',
    showArrows: false,
    showBottomNavi: false,
    canEdit: false,
  }
)
defineEmits<{
  edit: [item: UiTabItem]
  delete: [item: UiTabItem]
}>()

const tabTopTarget = ref<HTMLElement | null>(null)
const scrollToTabTarget = () => {
  if (import.meta.client) {
    nextTick().then(() => {
      tabTopTarget.value?.scrollIntoView()
    })
  }
}

const onClickBottomNavi = (item: UiTabItem) => {
  tab.value = item.value
  scrollToTabTarget()
}
</script>

<template>
  <div class="content-tabs g-theme-contents-tabs">
    <div ref="tabTopTarget" class="tab-top-target" />
    <v-tabs
      v-model="tab"
      :align-tabs="alignTabs"
      :show-arrows="showArrows"
      center-active
      selected-class="content-tabs-selected"
    >
      <template v-for="item in tabItems" :key="item.key">
        <v-tab :value="item.value"
          >{{ item.label }}
          <v-tooltip
            v-if="canEdit"
            :text="`${contentTitle}編集`"
            location="top"
          >
            <template #activator="{ props: bindProps }">
              <span
                v-bind="bindProps"
                class="tab-button edit-button elevation-4"
                @click.stop="$emit('edit', item)"
                ><v-icon class="icon">mdi-pencil</v-icon></span
              >
            </template>
          </v-tooltip>
          <v-tooltip
            v-if="canEdit"
            :text="`${contentTitle}削除`"
            location="top"
          >
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

      <div v-if="showBottomNavi" class="bottom-navi">
        <template v-for="item in tabItems" :key="item.key">
          <input
            v-model="tab"
            type="radio"
            name="tab-selector"
            :value="item.value"
            @click.stop="onClickBottomNavi(item)"
          />
        </template>
      </div>
    </v-tabs-window>
  </div>
</template>

<style lang="scss" scoped>
.content-tabs {
  position: relative;

  .tab-top-target {
    position: absolute;
    top: calc($nav-header-height * -1 - 60px);
  }

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

  .bottom-navi {
    display: flex;
    justify-content: center;
    padding-bottom: 1rem;
    column-gap: 14px;

    input[type='radio'] {
      appearance: none;
      display: inline-block;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--bottom-navi-input);
      cursor: pointer;

      &:checked {
        background: var(--bottom-navi-input-selected);
        cursor: auto;
      }
    }
  }
}
</style>
