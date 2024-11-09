<script setup lang="ts">
import type { ImageSettings } from '@/types/content'

type EyeCatchImageProps = {
  url?: string
  settings?: ImageSettings
  circle?: boolean
  round?: boolean
}
const props = withDefaults(defineProps<EyeCatchImageProps>(), {
  url: '',
  settings: () => ({
    lgSize: 'cover',
    smSize: 'cover',
    lgPosition: 'center',
    smPosition: 'center',
    lgParallax: 'scroll',
    smParallax: 'scroll',
  }),
  circle: false,
  round: false,
})

const noImage = '/images/no-image-g.png'
const bkImage = computed(() => `url(${props.url.length ? props.url : noImage})`)
</script>

<template>
  <div class="eyecatch-image" :class="{ circle: circle, round: round }">
    <slot />
    <div v-if="$slots.settings" class="settings">
      <slot name="settings" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.eyecatch-image {
  position: relative;
  background-repeat: no-repeat;
  background-image: v-bind('bkImage');
  background-size: v-bind('settings.lgSize');
  background-position: v-bind('settings.lgPosition');
  background-attachment: v-bind('settings.lgParallax');

  .settings {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
  }
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .eyecatch-image {
    background-size: v-bind('settings.smSize');
    background-position: v-bind('settings.smPosition');
    background-attachment: v-bind('settings.smParallax');

    // .settings {
    //   bottom: 0.5rem;
    //   right: 0.5rem;
    // }
  }
}

.circle {
  border-radius: 50%;
  overflow: hidden;
}

.round {
  border-radius: 12px;
  overflow: hidden;
}
</style>
