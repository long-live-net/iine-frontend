<script setup lang="ts">
const modal = defineModel<boolean>('modal', { required: true })
const props = withDefaults(
  defineProps<{
    icon?: boolean
    noTooltip?: boolean
    activatorIcon?: string
    activatorSize?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
    activatorColor?: string
    activatorText?: string
  }>(),
  {
    icon: false,
    noTooltip: false,
    activatorIcon: 'mdi-pencil',
    activatorSize: 'default',
    activatorColor: 'success',
    activatorText: 'tooltip',
  }
)

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
  <div v-if="icon">
    <v-btn
      v-if="noTooltip"
      :icon="true"
      :color="activatorColor"
      :size="activatorSize"
      elevation="4"
      @click="modal = true"
    >
      <v-icon :icon="activatorIcon" :size="iconSize" />
    </v-btn>
    <v-tooltip v-else :text="activatorText" location="top">
      <template #activator="{ props: bindProps }">
        <v-btn
          v-bind="bindProps"
          :icon="true"
          :color="activatorColor"
          :size="activatorSize"
          elevation="4"
          @click="modal = true"
        >
          <v-icon :icon="activatorIcon" :size="iconSize" />
        </v-btn>
      </template>
    </v-tooltip>
  </div>
  <div v-else>
    <v-btn
      :prepend-icon="activatorIcon"
      :color="activatorColor"
      :size="activatorSize"
      @click="modal = true"
    >
      {{ activatorText }}
    </v-btn>
  </div>
</template>
