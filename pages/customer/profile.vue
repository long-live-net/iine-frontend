<script setup lang="ts">
import type { CustomerUserForm } from '@/types/customer-user'
import type { CustomerForm } from '@/types/customer'
import type { SnsLinkForm, SeoTagForm } from '@/types/customer-setting'
useSeoMeta({ robots: 'noindex' })

type OperationMode = 'display' | 'edit'

// ユーザ情報
const userOperationMode = ref<OperationMode>('display')
const { authUser } = useCustomerPageContext()
const {
  customerUserRef,
  loadingRef: loadingUser,
  fetch: fetchUser,
  update: updateUser,
  checkEmail,
} = useCustomerUserActions()

const onUpdateUser = async (userForm: CustomerUserForm) => {
  if (!authUser.value?.id) {
    return
  }
  if (!(await checkEmail(authUser.value.id, userForm))) {
    return
  }
  await updateUser(authUser.value.id, userForm)
  userOperationMode.value = 'display'
}

// 顧客情報
const customerOperationMode = ref<OperationMode>('display')
const {
  fetch: fetchCustomer,
  customer,
  loading: loadingCustomer,
  update: updateCustomer,
} = useCustomerActions()

const onUpdateCUstomer = async (customerForm: CustomerForm) => {
  await updateCustomer(customerForm)
  customerOperationMode.value = 'display'
}

// SNS リンク設定情報
const snsLinksOperationMode = ref<OperationMode>('display')
const {
  fetch: fetchCustomerSetting,
  update: updateSnsLinks,
  customerSetting,
  loading: loadingCustomerSetting,
} = useCustomerSnsLinksActions()

const onUpdateCUstomerSnsLinks = async (snsLinkForm: SnsLinkForm) => {
  await updateSnsLinks(snsLinkForm)
  snsLinksOperationMode.value = 'display'
}

// SEO TAGS および favicon 設定情報
const seoTagsOperationMode = ref<OperationMode>('display')
const { update: updateSeoTags } = useCustomerSeoTagsActions()

const onUpdateCUstomerSeoTags = async (seoTagForm: SeoTagForm) => {
  await updateSeoTags(seoTagForm)
  seoTagsOperationMode.value = 'display'
}

onMounted(() => {
  // Note:
  // fetch すると Server と client で Hydration Error が生じるので
  // onMounted で watch して fetch すること
  watch(
    authUser,
    async (user) => {
      if (user?.id) {
        await Promise.all([
          fetchCustomer(),
          fetchUser(user.id),
          fetchCustomerSetting(),
        ])
      }
    },
    {
      immediate: true,
    }
  )
})

const { changeRouteKeyId } = useRouteKey()
onBeforeRouteLeave(() => {
  changeRouteKeyId()
})
</script>

<template>
  <div class="customer-profile">
    <CommonContentCard>
      <div v-if="userOperationMode === 'display'" class="user-info">
        <div class="header">
          <p><v-icon icon="mdi-account" /></p>
          <h3>ユーザ情報</h3>
        </div>
        <ManageCustomerProfileUserDisplay
          :customer-user="customerUserRef"
          :loading="loadingUser"
          @edit="userOperationMode = 'edit'"
        />
      </div>
      <div v-else-if="userOperationMode === 'edit'" class="user-info">
        <div class="header">
          <p><v-icon icon="mdi-account" /></p>
          <h3>ユーザ情報編集</h3>
        </div>
        <ManageCustomerProfileUserForm
          :customer-user="customerUserRef"
          :loading="loadingUser"
          @update="onUpdateUser"
          @cancel="userOperationMode = 'display'"
        />
      </div>
    </CommonContentCard>

    <CommonContentCard class="mt-12">
      <div v-if="customerOperationMode === 'display'" class="customer-info">
        <div class="header">
          <p><v-icon icon="mdi-domain" /></p>
          <h3>テナント情報</h3>
        </div>
        <ManageCustomerProfileCustomerDisplay
          :customer="customer"
          :loading="loadingCustomer"
          @edit="customerOperationMode = 'edit'"
        />
      </div>
      <div v-else-if="customerOperationMode === 'edit'" class="customer-info">
        <div class="header">
          <p><v-icon icon="mdi-domain" /></p>
          <h3>テナント情報編集</h3>
        </div>
        <ManageCustomerProfileCustomerForm
          :customer="customer"
          :loading="loadingCustomer"
          @update="onUpdateCUstomer"
          @cancel="customerOperationMode = 'display'"
        />
      </div>
    </CommonContentCard>

    <CommonContentCard class="mt-12">
      <div v-if="snsLinksOperationMode === 'display'" class="customer-info">
        <div class="header">
          <p><v-icon icon="mdi-link" /></p>
          <h3>テナント SNS ページ URL</h3>
        </div>
        <ManageCustomerProfileSnsLinksDisplay
          :customer-setting="customerSetting"
          :loading="loadingCustomerSetting"
          @edit="snsLinksOperationMode = 'edit'"
        />
      </div>
      <div v-else-if="snsLinksOperationMode === 'edit'" class="customer-info">
        <div class="header">
          <p><v-icon icon="mdi-link" /></p>
          <h3>テナント SNS ページ URL 編集</h3>
        </div>
        <ManageCustomerProfileSnsLinksForm
          :customer-setting="customerSetting"
          :loading="loadingCustomerSetting"
          @update="onUpdateCUstomerSnsLinks"
          @cancel="snsLinksOperationMode = 'display'"
        />
      </div>
    </CommonContentCard>

    <CommonContentCard class="mt-12">
      <div v-if="seoTagsOperationMode === 'display'" class="customer-info">
        <div class="header">
          <p><v-icon icon="mdi-cog" /></p>
          <h3>SEO タグ および Favicon icon 設定</h3>
        </div>
        <ManageCustomerProfileSeoTagsDisplay
          :customer-setting="customerSetting"
          :loading="loadingCustomerSetting"
          @edit="seoTagsOperationMode = 'edit'"
        />
      </div>
      <div v-else-if="seoTagsOperationMode === 'edit'" class="customer-info">
        <div class="header">
          <p><v-icon icon="mdi-cog" /></p>
          <h3>SEO タグ および Favicon icon 編集</h3>
        </div>
        <ManageCustomerProfileSeoTagsForm
          :customer-setting="customerSetting"
          :loading="loadingCustomerSetting"
          @update="onUpdateCUstomerSeoTags"
          @cancel="seoTagsOperationMode = 'display'"
        />
      </div>
    </CommonContentCard>
  </div>
</template>

<style scoped lang="scss">
.customer-profile {
  padding-top: calc($nav-header-height + 4rem);
  padding-bottom: 4rem;

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    h3 {
      margin-left: 0.5rem;
    }
  }

  .user-info {
    max-width: 960px;
    margin: 0 auto;
    padding: 4rem;

    @media only screen and (max-width: $grid-breakpoint-md) {
      padding: 1rem;
    }
  }

  .customer-info {
    max-width: 960px;
    margin: 0 auto;
    padding: 4rem;

    @media only screen and (max-width: $grid-breakpoint-md) {
      padding: 1rem;
    }
  }
}
</style>
