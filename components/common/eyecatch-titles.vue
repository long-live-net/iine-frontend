<script setup lang="ts">
withDefaults(
  defineProps<{
    place: 'top' | 'section'
    title?: string
    subtitle?: string
    titleBackgroundTranparent?: number
    textNoWrap?: boolean
  }>(),
  {
    title: '',
    subtitle: '',
    titleBackgroundTranparent: 0.25,
    textNoWrap: false,
  }
)
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
    <h2
      v-show="title?.length"
      class="maintitle"
      :class="{ 'text-no-wrap': textNoWrap }"
    >
      {{ title }}
    </h2>
    <p
      v-show="subtitle?.length"
      class="subtitle"
      :class="{ 'text-no-wrap': textNoWrap }"
    >
      {{ subtitle }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.eyecatch-title {
  transform: translate(-50%, -50%);
  max-width: 90%;
  h2,
  p {
    padding: 0;
    margin: 0;
    max-width: 100%;
  }
  .text-no-wrap {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.top-title {
  font-weight: bold;
  color: rgb(255 255 255);
  text-shadow: 1px 1px 5px rgb(255 255 255 / 0.5);
  text-align: center;
  .maintitle {
    font-size: 2.25rem;
  }
  .subtitle {
    font-size: 1.5rem;
    margin-top: 1rem;
  }
}

.section-title {
  color: white;
  font-weight: bold;
  padding: 0.75rem;
  background-color: v-bind('`rgb(0 0 0 / ${titleBackgroundTranparent})`');
  .maintitle {
    font-size: 1.5rem;
  }
  .subtitle {
    font-size: 1.25rem;
    margin-top: 0.5rem;
  }
}

@media only screen and (max-width: $grid-breakpoint-lg) {
  .top-title {
    font-weight: bolder;
    .maintitle {
      font-size: 2rem;
    }
    .subtitle {
      font-size: 1.25rem;
    }
  }
  .section-title {
    .maintitle {
      font-size: 1.3rem;
    }
    .subtitle {
      font-size: 1.1rem;
    }
  }
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .top-title {
    font-weight: bolder;
    .maintitle {
      font-size: 1.5rem;
    }
    .subtitle {
      font-size: 1.2rem;
    }
  }
  .section-title {
    .maintitle {
      font-size: 1.25rem;
    }
    .subtitle {
      font-size: 1rem;
    }
  }
}
</style>
