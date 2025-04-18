<script setup lang="ts" generic="T extends ContentType">
import type { ContentType } from '@/types/content'

withDefaults(
  defineProps<{
    item: T
    seeDetailPath?: string | null
    seeDetailActionLabel?: string
    eyecatchShape?: 'circle' | 'round' | null
    isCurrent?: boolean
    noCaption?: boolean
  }>(),
  {
    seeDetailPath: null,
    seeDetailActionLabel: '詳しく見る',
    eyecatchShape: null,
    isCurrent: false,
    noCaption: false,
  }
)
defineEmits<{ select: [item: T] }>()
</script>

<template>
  <div class="content-grid-item">
    <section
      :class="[isCurrent ? 'current-item' : 'item-link']"
      @click="
        seeDetailPath ? $router.push(seeDetailPath) : $emit('select', item)
      "
    >
      <h5 class="title">
        {{ item.title }}
      </h5>
      <template v-if="item.image">
        <CommonContentItemAnimation
          animation-name="gFadeInUp"
          :thresholds="[0.3]"
          :disabled="$route.name !== 'index'"
        >
          <CommonEyecatchImage
            :url="item.image.url"
            :circle="eyecatchShape === 'circle'"
            :round="eyecatchShape === 'round'"
            class="eyecatcher"
          />
        </CommonContentItemAnimation>
      </template>
    </section>
    <section
      v-if="!noCaption"
      :class="[isCurrent ? 'current-item' : 'item-link']"
    >
      <CommonContentItemAnimation
        animation-name="gFadeIn"
        animation-duration="2s"
        :thresholds="[0.5]"
        :disabled="$route.name !== 'index'"
      >
        <div class="caption-base">
          <CommonWysiwygViewer :value="item.caption" class="caption" />
          <div class="see-detail">
            <BaseButtonNavButton
              small
              color="inherit"
              width="160px"
              :to="seeDetailPath"
              @click="$emit('select', item)"
              >{{ seeDetailActionLabel }}</BaseButtonNavButton
            >
          </div>
        </div>
      </CommonContentItemAnimation>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.content-grid-item {
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
    margin-top: 0.4rem;
    text-align: right;
  }

  .caption {
    text-align: left;
    margin-top: 1rem;
  }

  section.item-link {
    .eyecatcher {
      cursor: pointer;
      transition: transform 0.4s;
      &:hover {
        background-color: rgba(255 255 255 / 0.25);
        background-blend-mode: overlay;
        transform: scale(1.1);
      }
    }
  }

  section.current-item {
    color: $blue-lighten2;

    .eyecatcher {
      background-color: rgba(128 192 255 / 0.75);
      background-blend-mode: overlay;
    }
  }
}
</style>
