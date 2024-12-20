<script setup lang="ts">
import type { MenuImageType } from '@/types/content'

withDefaults(
  defineProps<{
    item: MenuImageType
    isCurrent?: boolean
    noCaption?: boolean
  }>(),
  {
    isCurrent: false,
    noCaption: false,
  }
)
defineEmits<{
  select: [menuImage: MenuImageType]
}>()
const route = useRoute()
</script>

<template>
  <div class="menu-image-list-item">
    <section
      :class="[isCurrent ? 'current-item' : 'item-link']"
      @click="$emit('select', item)"
    >
      <h5 class="title">
        {{ item.title }}
      </h5>
      <template v-if="item.image">
        <CommonContentItemAnimation
          animation-name="gFadeInUp"
          :thresholds="[0.25]"
          :disabled="route.name !== 'index'"
        >
          <CommonEyecatchImage :url="item.image.url" round class="eyecatcher" />
        </CommonContentItemAnimation>
      </template>
    </section>
    <template v-if="!noCaption">
      <CommonContentItemAnimation
        animation-name="gFadeIn"
        animation-duration="2s"
        :thresholds="[0.5]"
        :disabled="route.name !== 'index'"
      >
        <CommonWysiwsgViewer :value="item.caption" class="caption" />
      </CommonContentItemAnimation>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.menu-image-list-item {
  .title {
    text-align: center;
    font-weight: bold;
    font-size: 1.1rem;
    margin: 0;
  }

  .eyecatcher {
    margin-top: 1rem;
    aspect-ratio: 5 / 4;
    @media only screen and (max-width: $grid-breakpoint-md) {
      aspect-ratio: 4 / 3;
    }
  }

  .caption {
    text-align: left;
    margin-top: 1rem;
  }

  section.item-link {
    cursor: pointer;
    &:hover {
      color: $link-active;
    }

    .eyecatcher {
      transition: transform 0.4s;
      &:hover {
        background-color: rgba(255 255 255 / 0.25);
        background-blend-mode: overlay;
        transform: scale(1.1);
      }
    }
  }

  section.current-item {
    color: $dimgray;
    .eyecatcher {
      background-color: rgba(0 0 0 / 0.5);
      background-blend-mode: overlay;
    }
  }
}
</style>
