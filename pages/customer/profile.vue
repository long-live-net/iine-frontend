<script setup lang="ts">
import type { CustomerUserForm } from '@/types/customer-user'
import type { CustomerForm } from '@/types/customer'

type OperationMode = 'display' | 'edit'
const userOperationMode = ref<OperationMode>('display')
const customerOperationMode = ref<OperationMode>('display')

// ユーザ情報
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

watch(
  authUser,
  async (user) => {
    if (user?.id) {
      await Promise.all([fetchCustomer(), fetchUser(user.id)])
    }
  },
  {
    immediate: true,
  }
)
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
  }

  .customer-info {
    max-width: 960px;
    margin: 0 auto;
    padding: 4rem;
  }
}
</style>
