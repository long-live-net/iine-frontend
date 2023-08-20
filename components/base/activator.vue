<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modal: boolean
    activatorIcon?: string
    activatorSize?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
    activatorColor?: string
    activatorText?: string
  }>(),
  {
    activatorIcon: 'mdi-pencil',
    activatorSize: 'large',
    activatorColor: 'success',
    activatorText: '',
  }
)
const emit = defineEmits<{
  'update:modal': [modal: boolean]
}>()

const iconSize = computed(() => {
  switch (props.activatorSize) {
    // なんか全部 x-large でいいみたい...
    case 'x-small':
      return 'x-large'
    case 'small':
      return 'x-large'
    case 'default':
      return 'x-large'
    default:
      return 'x-large'
  }
})
</script>

<template>
  <div>
    <v-btn
      v-if="activatorText?.length"
      :prepend-icon="activatorIcon"
      :color="activatorColor"
      :size="activatorSize"
      @click="$emit('update:modal', true)"
    >
      {{ activatorText }}
    </v-btn>
    <v-btn
      v-else
      icon
      :color="activatorColor"
      :size="activatorSize"
      elevation="8"
      @click="$emit('update:modal', true)"
    >
      <v-icon color="white" :icon="activatorIcon" :size="iconSize" />
    </v-btn>
  </div>
</template>
