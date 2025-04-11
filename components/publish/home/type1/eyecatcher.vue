<script setup lang="ts">
import type { ContentEditMode } from '@/types/content'

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()
const {
  contentTitle,
  eyecatchRef,
  onLoad,
  onCreate,
  onUpdate,
  onRemove,
  onUpdateTitleSetting,
  onUpdateImageSetting,
  loading,
} = useEyecatchActions(customerId)

const editModal = ref(false)
const editMode = ref<ContentEditMode>('update')

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
            v-if="eyecatchRef?.id"
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
            <template v-if="eyecatchRef?.titleSettings" #sideSettings>
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
            <template #editActions>
              <CommonContentEditActivator
                v-model:modal="editModal"
                edit-mode="title"
                content-title="タイトル"
                size="small"
                @update:modal="editMode = 'title'"
              />
            </template>
          </CommonEyecatchTitleSettingPositionEyecatcher>
        </template>
      </CommonEyecatchImage>
    </CommonContentItemAnimation>
    <div v-if="canEdit" class="edit-activator">
      <div v-if="eyecatchRef?.id" class="activators">
        <CommonContentEditActivator
          v-model:modal="editModal"
          edit-mode="image"
          :content-title="contentTitle"
          @update:modal="editMode = 'image'"
        />
        <CommonEyecatchImageSetting
          :settings="eyecatchRef.imageSettings"
          @update="onUpdateImageSetting"
        />
        <CommonContentEditActivator
          v-model:modal="editModal"
          edit-mode="delete"
          :content-title="contentTitle"
          @update:modal="editMode = 'delete'"
        />
      </div>
      <div v-else class="activators">
        <CommonContentEditActivator
          v-model:modal="editModal"
          :content-title="contentTitle"
          edit-mode="new"
          @update:modal="editMode = 'new'"
        />
        <p>このボタンから{{ contentTitle }}を登録してください。</p>
      </div>
    </div>
  </CommonContentWrap>
  <ManageContentEyecatcher
    v-model:modal="editModal"
    :eyecatch-data="eyecatchRef"
    :content-title="contentTitle"
    :edit-mode="editMode"
    @update="onUpdate"
    @remove="onRemove"
    @create="onCreate"
  />
</template>

<style lang="scss" scoped>
.type1-eyecatcher {
  position: relative;

  .edit-activator {
    position: absolute;
    top: 8.5rem;
    left: 0.5rem;

    @media only screen and (max-width: $grid-breakpoint-md) {
      top: 0.5rem;
    }

    .activators {
      display: flex;
      align-items: center;
      column-gap: 0.5rem;

      p {
        font-weight: bold;
        color: var(--warning-color);
        background-color: white;
        margin-right: 0.5rem;
        padding: 4px 10px;
      }
    }
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
