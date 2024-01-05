<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    drawer: boolean
    location?: 'top' | 'end' | 'bottom' | 'start' | 'left' | 'right'
    theme?: string
    color?: string
  }>(),
  {
    location: 'start',
  }
)

const emit = defineEmits<{
  'update:drawer': [drawer: boolean]
}>()

const navDrawer = computed({
  get: () => props.drawer,
  set: (drawer: boolean) => {
    emit('update:drawer', drawer)
  },
})
</script>

<template>
  <v-navigation-drawer
    v-model="navDrawer"
    :location="location"
    :temporary="true"
    :theme="theme"
    :color="color"
  >
    <div class="text-right">
      <v-btn variant="text" icon="mdi-close" @click="navDrawer = false" />
    </div>
    <slot />
  </v-navigation-drawer>
</template>
