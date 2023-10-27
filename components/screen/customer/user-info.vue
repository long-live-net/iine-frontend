<script setup lang="ts">
const props = defineProps<{ modal: boolean }>()
const emit = defineEmits<{
  'update:modal': [modal: boolean]
}>()

const dialog = computed({
  get: () => props.modal,
  set: (modal: boolean) => {
    emit('update:modal', modal)
  },
})

const titleData = {
  title: 'ユーザ情報',
  titleIcon: 'mdi-account',
  titleColor: 'info',
}

const { user, customer } = useFoundation()
</script>

<template>
  <CommonModalDialog
    v-model:modal="dialog"
    :max-width="640"
    :title="titleData.title"
    :title-icon="titleData.titleIcon"
    :title-icon-color="titleData.titleColor"
  >
    <div class="user-info-wrap">
      <dl>
        <dt>お名前</dt>
        <dd>{{ user?.name ?? 'NA' }}</dd>
        <dt>メールアドレス</dt>
        <dd>{{ user?.email ?? 'NA' }}</dd>
        <dt>所属</dt>
        <dd>{{ customer?.name ?? 'NA' }}</dd>
      </dl>
    </div>
  </CommonModalDialog>
</template>

<style scoped lang="scss">
.user-info-wrap {
  dl {
    display: grid;
    grid-template-columns: 11rem auto;
    gap: 4px;
    dt {
      padding: 0.5rem 1rem;
      background-color: $gray-lighten2;
      font-weight: bold;
      text-align: right;
    }
    dd {
      padding: 0.5rem 1rem;
      background-color: $gray-lighten4;
    }
  }
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .user-info-wrap {
    dl {
      display: block;
      dt {
        text-align: center;
      }
      dd {
        padding-left: 1.25rem;
        margin-bottom: 12px;
      }
    }
  }
}
</style>
