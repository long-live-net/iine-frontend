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
          :thresholds="[0.3]"
          :disabled="route.name !== 'index'"
        >
          <CommonEyecatchImage :url="item.image.url" round class="eyecatcher" />
        </CommonContentItemAnimation>
      </template>
    </section>
    <section
      v-if="!noCaption"
      :class="[isCurrent ? 'current-item' : 'item-link']"
      @click="$emit('select', item)"
    >
      <CommonContentItemAnimation
        animation-name="gFadeIn"
        animation-duration="2s"
        :thresholds="[0.5]"
        :disabled="route.name !== 'index'"
      >
        <div class="caption-base">
          <CommonWysiwsgViewer :value="item.caption" class="caption" />
          <p class="see-detail">
            <v-btn variant="outlined" size="small">メニューを見る</v-btn>
          </p>
        </div>
      </CommonContentItemAnimation>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.menu-image-list-item {
  width: 90%;
  margin: 0 auto;

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

  .see-detail {
    margin-top: 0.3rem;
    text-align: right;
  }

  .caption {
    text-align: left;
    margin-top: 1rem;
  }

  section.item-link {
    cursor: pointer;

    .caption-base {
      &:hover {
        color: var(--link-active-color);
      }
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
