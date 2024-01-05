<script setup lang="ts">
defineProps<{
  place: 'top' | 'section'
  title?: string
  subtitle?: string
}>()
</script>

<template>
  <div
    v-if="title?.length || subtitle?.length"
    class="eyecatch-title"
    :class="{
      'top-title': place === 'top',
      'section-title': place === 'section',
    }"
  >
    <h2 v-show="title?.length" class="maintitle">
      {{ title }}
    </h2>
    <p v-show="subtitle?.length" class="subtitle">
      {{ subtitle }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.eyecatch-title {
  display: inline-block;
  transform: translate(-50%, -50%);
  text-align: center;
  white-space: nowrap;
  h2 {
    padding: 0;
    margin: 0;
  }
}

.top-title {
  color: rgba(255, 255, 255, 0.75);
  text-shadow: 1px 1px 4px rgba(255, 255, 255, 0.5);
  font-weight: bold;
  .maintitle {
    font-size: 2rem;
  }
  .subtitle {
    font-size: 1.4rem;
    margin-top: 1rem;
  }
}
.section-title {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 1.5rem 2.5rem;
  border-radius: 9999px;
  font-weight: bold;
  .maintitle {
    font-size: 1.25rem;
  }
  .subtitle {
    font-size: 1rem;
    margin-top: 0.25rem;
  }
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .top-title {
    font-weight: bolder;
    .maintitle {
      font-size: 1.8rem;
    }
    .subtitle {
      font-size: 1.2rem;
    }
  }
}
</style>
