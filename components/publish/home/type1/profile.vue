<script setup lang="ts">
import type { ProfileType, ContentEditMode } from '@/types/content'

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()
const {
  contentTitle,
  profileRef,
  onLoad,
  onCreate,
  onUpdate,
  onRemove,
  onUpdateTitleSetting,
  onUpdateImageSetting,
  loading,
} = useProfileActions(customerId)

const editModal = ref(false)
const updatingData = ref<ProfileType | null>(null)
const editMode = ref<ContentEditMode>('update')
const onEditMode = (mode: ContentEditMode) => {
  if (mode === 'new') {
    updatingData.value = null
  } else {
    updatingData.value = profileRef.value
  }
  editMode.value = mode
}

const bodyPlainString = computed(
  () =>
    profileRef.value?.captionBody?.replace(
      /<("[^"]*"|'[^']*'|[^'">])*>/g,
      ''
    ) ?? ''
)

await onLoad()
</script>

<template>
  <CommonContentWrap :loading="loading">
    <CommonContentCard>
      <PublishContentDetailItem
        v-model:modal="editModal"
        :item="profileRef"
        :content-title="contentTitle"
        :can-edit="canEdit"
        @edit-mode="onEditMode"
        @update-title-setting="onUpdateTitleSetting"
        @update-image-setting="onUpdateImageSetting"
      >
        <template #bodyEditActivator>
          <CommonContentEditActivator
            v-model:modal="editModal"
            edit-mode="captionBody"
            content-title="説明"
            @update:modal="onEditMode('captionBody')"
          />
        </template>
        <template #body>
          <div v-if="bodyPlainString">
            <CommonWysiwygViewer :value="profileRef?.captionBody" />
          </div>
          <div v-else class="no-items">
            <p>説明がありません</p>
            <div v-if="canEdit" class="d-flex align-center">
              <CommonContentEditActivator
                v-if="profileRef"
                v-model:modal="editModal"
                edit-mode="captionBody"
                content-title="説明"
                @update:modal="onEditMode('captionBody')"
              />
              <p class="ml-2">このボタンから説明を登録してください。</p>
            </div>
          </div>
          <div v-if="bodyPlainString" class="mt-6 text-center">
            <BaseButtonNavButton width="14rem" to="/profiles/detail"
              >詳しく見る</BaseButtonNavButton
            >
          </div>
        </template>
      </PublishContentDetailItem>
    </CommonContentCard>
  </CommonContentWrap>
  <ManageContentProfile
    v-model:modal="editModal"
    :content-title="contentTitle"
    :edit-mode="editMode"
    :profile-data="updatingData"
    @create="onCreate"
    @update="onUpdate"
    @remove="onRemove"
  />
</template>
