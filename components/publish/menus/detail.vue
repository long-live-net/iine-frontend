<script setup lang="ts">
import type { MenuForm } from '@/types/content'

const emit = defineEmits<{ 'update:data': [] }>()

const { customerId } = useCustomer()
const route = useRoute()
const contentId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id
const editModal = ref(false)

const { canEdit } = useCustomerPageContext()
const {
  menuRef,
  menuPreNextIdRefRef,
  loading: loadingMenu,
  onLoad: onLoadMenu,
  onUpdate: onUpdateMenu,
  onRemove: onRemoveMwnu,
  onUpdateTitleSetting,
  onUpdateImageSetting,
} = useMenuActions(customerId)

const onUpdateData = async (params: { id: string; formData: MenuForm }) => {
  await onUpdateMenu(params)
  emit('update:data')
}
const onRemoveData = async (id: string) => {
  await onRemoveMwnu(id)
  emit('update:data')
}
const preUrl = computed(() =>
  menuPreNextIdRefRef.value?.preId
    ? `/menus/${menuPreNextIdRefRef.value.preId}`
    : null
)
const nextUrl = computed(() =>
  menuPreNextIdRefRef.value?.nextId
    ? `/menus/${menuPreNextIdRefRef.value.nextId}`
    : null
)

// /**
//  * menu detail list
//  */
// const {
//   filter,
//   sort,
//   pager,
//   menuDetailListRef,
//   onLoad: onLoadMenuDetailList,
//   onCreate: onCreateMenuDetail,
//   onUpdate: onUpdateMenuDetail,
//   onRemove: onRemoveMenuDetail,
//   onUpdatePositions,
//   loading: loadingMenuDetailList,
// } = useMenuDetailListActions(customerId)

// filter.value = { menuId: contentId }
// sort.value = { position: 1 }
// pager.value = { page: 1, limit: 128 }

// const loading = computed(() => loadingMenu.value || loadingMenuDetailList.value)
// await Promise.all([onLoadMenu(contentId), onLoadMenuDetailList()])

const loading = computed(() => loadingMenu.value)
await onLoadMenu(contentId)
</script>

<template>
  <CommonContentWrap :loading="loading">
    <CommonContentSlidableNavigation :pre-url="preUrl" :next-url="nextUrl">
      <CommonContentCard>
        <PublishContentDetailItem
          v-model:modal="editModal"
          :item="menuRef"
          :can-edit="canEdit"
          @update-title-setting="onUpdateTitleSetting"
          @update-image-setting="onUpdateImageSetting"
        >
          <template #middlenavi>
            <CommonContentPreNextNagivation
              :pre-url="preUrl"
              :next-url="nextUrl"
            />
          </template>
        </PublishContentDetailItem>
      </CommonContentCard>
    </CommonContentSlidableNavigation>
  </CommonContentWrap>
  <ManageContentMenu
    v-model:modal="editModal"
    :menu-data="menuRef"
    @update="onUpdateData"
    @remove="onRemoveData"
  />
</template>
