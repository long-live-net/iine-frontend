<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    page: number
    limit: number
    total: number
    totalVisible?: number
  }>(),
  { totalVisible: 6 }
)
const emit = defineEmits<{
  'update:page': [page: number]
}>()

const myPage = computed({
  get: () => props.page,
  set: (page) => {
    emit('update:page', page)
  },
})

const pageLength = computed(() =>
  Math.ceil((props.total ?? 1) / (props.limit < 0 ? 1 : props.limit))
)

const windowWidth = ref(768)
const isWidtLesshMd = ref(false)
const getWindowWidth = () => {
  if (import.meta.client) {
    windowWidth.value = window.innerWidth
    isWidtLesshMd.value = windowWidth.value < 768
  }
}
onMounted(() => {
  getWindowWidth()
  window.addEventListener('resize', getWindowWidth)
})
</script>

<template>
  <v-pagination
    v-model="myPage"
    :length="pageLength"
    :total-visible="totalVisible"
    :density="isWidtLesshMd ? 'compact' : 'default'"
    size="small"
    rounded="circle"
  />
</template>
