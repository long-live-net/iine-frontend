<script setup lang="ts">
const parallax = defineModel<boolean>('parallax', { required: true })
const auto = defineModel<boolean>('auto', { required: true })
const size = defineModel<number>('size', { required: true })
const positionX = defineModel<number>('positionX', { required: true })
const positionY = defineModel<number>('positionY', { required: true })
</script>

<template>
  <ul class="image-placer">
    <li>
      <div class="pl-2">
        <v-switch
          v-model="parallax"
          color="primary"
          density="compact"
          hide-details
        >
          <template #label>
            <small><b>固定表示</b></small>
          </template>
        </v-switch>
      </div>
      <div>
        <v-switch v-model="auto" color="primary" density="compact" hide-details>
          <template #label>
            <small><b>自動調整</b></small>
          </template>
        </v-switch>
      </div>
    </li>
    <li>
      <p class="label mr-1">
        <v-label :disabled="auto">
          <small><b>サイズ</b></small>
        </v-label>
      </p>
      <div class="input">
        <v-slider
          v-model="size"
          color="primary"
          density="compact"
          hide-details
          min="100"
          max="400"
          step="1"
          :disabled="auto"
        />
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
          v-model="positionX"
          color="primary"
          density="compact"
          hide-details
          min="1"
          max="99"
          step="1"
          :disabled="auto"
        />
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
          v-model="positionY"
          color="primary"
          density="compact"
          hide-details
          min="1"
          max="99"
          step="1"
          :disabled="auto"
        />
      </div>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
ul.image-placer {
  padding-left: 0.5rem;
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
  small {
    color: $gray-darken3;
  }
}
</style>
