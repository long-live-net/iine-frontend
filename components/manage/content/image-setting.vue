<script setup lang="ts">
import type { ImageSettings } from '@/types/content'

const props = withDefaults(defineProps<{ settings?: ImageSettings }>(), {
  settings: () => ({
    lgSize: 'cover',
    smSize: 'cover',
    lgPosition: 'center',
    smPosition: 'center',
    lgParallax: 'scroll',
    smParallax: 'scroll',
  }),
})
const emit = defineEmits<{
  update: [partOfSettings: Partial<ImageSettings>]
}>()

const parallaxLg = computed<boolean>({
  get: () => props.settings.lgParallax === 'fixed',
  set: (value) => {
    if (value) {
      emit('update', { lgParallax: 'fixed' })
    } else {
      emit('update', { lgParallax: 'scroll' })
    }
  },
})
const autoLg = computed<boolean>({
  get: () => props.settings.lgSize === 'cover',
  set: (value: boolean) => {
    if (value) {
      emit('update', { lgSize: 'cover', lgPosition: 'center' })
    } else {
      emit('update', {
        lgSize: `${sizeLg.value.toString()}%`,
        lgPosition: `${pxLg.value.toString()}% ${pyLg.value.toString()}%`,
      })
    }
  },
})
const sizeLg = computed<number>({
  get: () => {
    if (props.settings.lgSize === 'cover') {
      return 100
    } else {
      const matched = props.settings.lgSize?.match(/^(?<size>\d+)%$/)
      return parseInt(matched?.groups?.size ?? '100')
    }
  },
  set: (value: number) => {
    if (autoLg.value) return
    emit('update', { lgSize: `${value.toString()}%` })
  },
})
const pxLg = computed<number>({
  get: () => {
    if (props.settings.lgPosition === 'center') {
      return 50
    } else {
      const matched = props.settings.lgPosition?.match(
        /^(?<posx>\d+)%\s+(?<posy>\d+)%$/
      )
      return parseInt(matched?.groups?.posx ?? '50')
    }
  },
  set: (value: number) => {
    if (autoLg.value) return
    const positionLg = `${value.toString()}% ${pyLg.value.toString()}%`
    emit('update', { lgPosition: positionLg })
  },
})
const pyLg = computed<number>({
  get: () => {
    if (props.settings.lgPosition === 'center') {
      return 50
    } else {
      const matched = props.settings.lgPosition?.match(
        /^(?<posx>\d+)%\s+(?<posy>\d+)%$/
      )
      return parseInt(matched?.groups?.posy ?? '50')
    }
  },
  set: (value: number) => {
    if (autoLg.value) return
    const positionLg = `${pxLg.value.toString()}% ${value.toString()}%`
    emit('update', { lgPosition: positionLg })
  },
})

const parallaxSm = computed<boolean>({
  get: () => props.settings.smParallax === 'fixed',
  set: (value) => {
    if (value) {
      emit('update', { smParallax: 'fixed' })
    } else {
      emit('update', { smParallax: 'scroll' })
    }
  },
})
const autoSm = computed<boolean>({
  get: () => props.settings.smSize === 'cover',
  set: (value: boolean) => {
    if (value) {
      emit('update', { smSize: 'cover', smPosition: 'center' })
    } else {
      emit('update', {
        smSize: `${sizeSm.value.toString()}%`,
        smPosition: `${pxSm.value.toString()}% ${pySm.value.toString()}%`,
      })
    }
  },
})
const sizeSm = computed<number>({
  get: () => {
    if (props.settings.smSize === 'cover') {
      return 100
    } else {
      const matched = props.settings.smSize?.match(/^(?<size>\d+)%$/)
      return parseInt(matched?.groups?.size ?? '100')
    }
  },
  set: (value: number) => {
    if (autoSm.value) return
    emit('update', { smSize: `${value.toString()}%` })
  },
})
const pxSm = computed<number>({
  get: () => {
    if (props.settings.smPosition === 'center') {
      return 50
    } else {
      const matched = props.settings.smPosition?.match(
        /^(?<posx>\d+)%\s+(?<posy>\d+)%$/
      )
      return parseInt(matched?.groups?.posx ?? '50')
    }
  },
  set: (value: number) => {
    if (autoSm.value) return
    const positionSm = `${value.toString()}% ${pySm.value.toString()}%`
    emit('update', { smPosition: positionSm })
  },
})
const pySm = computed<number>({
  get: () => {
    if (props.settings.smPosition === 'center') {
      return 50
    } else {
      const matched = props.settings.smPosition?.match(
        /^(?<posx>\d+)%\s+(?<posy>\d+)%$/
      )
      return parseInt(matched?.groups?.posy ?? '50')
    }
  },
  set: (value: number) => {
    if (autoSm.value) return
    const positionSm = `${pxSm.value.toString()}% ${value.toString()}%`
    emit('update', { smPosition: positionSm })
  },
})
</script>

<template>
  <!-- Large画面 -->
  <div class="image-setting g-block-lg">
    <BaseImagePlacer
      v-model:parallax="parallaxLg"
      v-model:auto="autoLg"
      v-model:size="sizeLg"
      v-model:position-x="pxLg"
      v-model:position-y="pyLg"
    />
  </div>
  <!-- Small画面 -->
  <div class="image-setting g-block-sm">
    <BaseImagePlacer
      v-model:parallax="parallaxSm"
      v-model:auto="autoSm"
      v-model:size="sizeSm"
      v-model:position-x="pxSm"
      v-model:position-y="pySm"
    />
  </div>
</template>

<style scoped lang="scss">
.image-setting {
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
}
</style>

<style deep lang="scss">
.image-setting {
  small {
    color: $gray-darken3;
  }
}
</style>
