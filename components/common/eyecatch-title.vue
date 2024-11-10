<script setup lang="ts">
import type { TitleSettings } from '@/types/content'

const props = withDefaults(
  defineProps<{
    place: 'top' | 'section'
    title?: string
    subtitle?: string
    settings?: TitleSettings | null
    titleBackgroundTranparent?: number
    textNoWrap?: boolean
  }>(),
  {
    title: '',
    subtitle: '',
    settings: null,
    titleBackgroundTranparent: 0.25,
    textNoWrap: false,
  }
)

const titleColor = computed(() => props.settings?.color ?? '#FFFFFF')
const titleShadow = computed(() =>
  props.settings?.color ? `${props.settings.color}44` : '#FFFFFF44'
)
const titleBgColor = computed(() => props.settings?.bgColor ?? 'transparent')
const fontFamily = computed(() => props.settings?.fontFamily ?? 'inherit')
const isNeedTransform = computed(() =>
  /M PLUS Rounded 1c/.test(props.settings?.fontFamily ?? '')
)
const titleAlign = computed(() => props.settings?.align ?? 'left')
</script>

<template>
  <div
    v-if="title?.length || subtitle?.length"
    class="eyecatch-title"
    :class="{
      'top-title': place === 'top',
      'section-title': place === 'section',
      'need-transform': isNeedTransform,
    }"
  >
    <h2 v-show="title?.length" :class="{ 'text-no-wrap': textNoWrap }">
      {{ title }}
    </h2>
    <p v-show="subtitle?.length" :class="{ 'text-no-wrap': textNoWrap }">
      {{ subtitle }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.eyecatch-title {
  padding: 1.25rem;
  color: v-bind('titleColor') !important;
  background-color: v-bind('titleBgColor');
  font-family: v-bind('fontFamily');
  border-radius: 0.75rem;

  h2,
  p {
    padding: 0;
    margin: 0;
    max-width: 100%;
    text-align: v-bind('titleAlign');
  }

  .text-no-wrap {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.top-title {
  font-weight: 900;
  text-shadow: 1px 1px 4px v-bind('titleShadow');

  @media only screen and (max-width: $grid-breakpoint-lg) {
    font-weight: bold;
  }

  h2 {
    font-size: 2.5rem;

    @media only screen and (max-width: $grid-breakpoint-lg) {
      font-size: 2.2rem;
    }
    @media only screen and (max-width: $grid-breakpoint-md) {
      font-size: 1.75rem;
    }
  }

  p {
    margin-top: 1rem;
    font-size: 1.75rem;

    @media only screen and (max-width: $grid-breakpoint-lg) {
      margin-top: 0.75rem;
      font-size: 1.5rem;
    }
    @media only screen and (max-width: $grid-breakpoint-md) {
      margin-top: 0.5rem;
      font-size: 1.1rem;
    }
  }
}

.section-title {
  font-weight: bold;

  @media only screen and (max-width: $grid-breakpoint-lg) {
    font-weight: bolder;
  }

  h2 {
    font-size: 1.5rem;

    @media only screen and (max-width: $grid-breakpoint-lg) {
      font-size: 1.4rem;
    }
    @media only screen and (max-width: $grid-breakpoint-md) {
      font-size: 1.25rem;
    }
  }
  p {
    margin-top: 0.5rem;
    font-size: 1.25rem;

    @media only screen and (max-width: $grid-breakpoint-lg) {
      font-size: 1.2rem;
    }
    @media only screen and (max-width: $grid-breakpoint-md) {
      margin-top: 0.3rem;
      font-size: 1rem;
    }
  }
}

.need-transform {
  transform: rotateZ(0.03deg);
}
</style>
