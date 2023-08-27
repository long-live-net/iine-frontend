<script setup lang="ts">
const props = defineProps<{
  parallax: boolean
  auto: boolean
  size: number
  positionX: number
  positionY: number
}>()
const emit = defineEmits<{
  'update:parallax': [parallax: boolean]
  'update:auto': [auto: boolean]
  'update:size': [size: number]
  'update:positionX': [positionX: number]
  'update:positionY': [positionY: number]
}>()

const parallaxComp = computed<boolean>({
  get: () => props.parallax,
  set: (value) => {
    emit('update:parallax', value)
  },
})
const autoComp = computed<boolean>({
  get: () => props.auto,
  set: (value) => {
    emit('update:auto', value)
  },
})
const sizeComp = computed<number>({
  get: () => props.size,
  set: (value) => {
    emit('update:size', value)
  },
})
const positionXComp = computed<number>({
  get: () => props.positionX,
  set: (value) => {
    emit('update:positionX', value)
  },
})
const positionYComp = computed<number>({
  get: () => props.positionY,
  set: (value) => {
    emit('update:positionY', value)
  },
})
</script>

<template>
  <ul class="image-placer">
    <li>
      <div>
        <v-switch
          v-model="parallaxComp"
          color="primary"
          density="compact"
          hide-details
        >
          <template v-slot:label>
            <small><b>固定表示</b></small>
          </template>
        </v-switch>
      </div>
      <div>
        <v-switch
          v-model="autoComp"
          color="primary"
          density="compact"
          hide-details
        >
          <template v-slot:label>
            <small><b>自動調整</b></small>
          </template>
        </v-switch>
      </div>
    </li>
    <li>
      <p class="label mr-1">
        <v-label :disabled="autoComp">
          <small><b>サイズ</b></small>
        </v-label>
      </p>
      <div class="input">
        <v-slider
          v-model="sizeComp"
          color="primary"
          density="compact"
          hide-details
          min="100"
          max="400"
          step="1"
          :disabled="autoComp"
        >
        </v-slider>
      </div>
    </li>
    <li>
      <p class="label mr-1">
        <v-label>
          <small><b>横位置</b></small>
        </v-label>
      </p>
      <div class="input">
        <v-slider
          v-model="positionXComp"
          color="primary"
          density="compact"
          hide-details
          min="1"
          max="99"
          step="1"
          :disabled="autoComp"
        >
        </v-slider>
      </div>
    </li>
    <li>
      <p class="label mr-1">
        <v-label>
          <small><b>縦位置</b></small>
        </v-label>
      </p>
      <div class="input">
        <v-slider
          v-model="positionYComp"
          color="primary"
          density="compact"
          hide-details
          min="1"
          max="99"
          step="1"
          :disabled="autoComp"
        >
        </v-slider>
      </div>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
ul.image-placer {
  padding: 0.5rem 1.25rem 0.75rem 1.25rem;
  li {
    width: 14rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .label {
      width: 2.5rem;
    }
    .input {
      flex-grow: 1;
    }
  }
}
</style>
