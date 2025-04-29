<script setup lang="ts" generic="T extends ContentType">
import type { ContentType } from '@/types/content'

withDefaults(
  defineProps<{
    item: T
    seeDetailPath?: string | null
    seeDetailActionLabel?: string
    itemShape?: 'circle' | 'round' | null
    isCurrent?: boolean
    noCaption?: boolean
    captionHeight?: string
  }>(),
  {
    seeDetailPath: null,
    seeDetailActionLabel: '詳しく見る',
    itemShape: null,
    isCurrent: false,
    noCaption: false,
    captionHeight: '260px',
  }
)
defineEmits<{ select: [item: T] }>()
</script>

<template>
  <div class="content-grid-item">
    <section
      class="eyecatch-part"
      :class="[isCurrent ? 'current-item' : 'item-link']"
      @click="
        seeDetailPath ? $router.push(seeDetailPath) : $emit('select', item)
      "
    >
      <h5 v-if="noCaption" class="title">
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
            class="eyecatcher"
            :class="{
              circle: itemShape === 'circle',
              round: itemShape === 'round' && !noCaption,
              'round-nocaption': itemShape === 'round' && noCaption,
            }"
          />
        </CommonContentItemAnimation>
      </template>
    </section>
    <section
      v-if="!noCaption"
      class="caption-part"
      :class="[isCurrent ? 'current-item' : 'item-link']"
    >
      <CommonContentItemAnimation
        animation-name="gFadeIn"
        animation-duration="2s"
        :thresholds="[0.5]"
        :disabled="$route.name !== 'index'"
      >
        <div
          class="caption g-theme-contents-grid-row-caption"
          :class="{
            circle: itemShape === 'circle',
            round: itemShape === 'round',
          }"
        >
          <h5 class="title">
            {{ item.title }}
          </h5>
          <CommonWysiwygViewer :value="item.caption" class="caption-text" />
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
    font-size: 1rem;
    font-weight: bold;
    margin: 0;
  }

  .eyecatch-part {
    .eyecatcher {
      margin-top: 1rem;
      aspect-ratio: 5 / 4;

      @media only screen and (max-width: $grid-breakpoint-md) {
        aspect-ratio: 4 / 3;
      }
    }

    .circle {
      clip-path: inset(0 round 50%);
    }

    .round {
      clip-path: inset(0 round 12px 12px 0 0);
    }

    .round-nocaption {
      clip-path: inset(0 round 12px);
    }
  }

  .caption-part {
    .caption {
      position: relative;
      padding: 1.5rem;
      padding-bottom: 62px;
      min-height: v-bind('captionHeight');

      .title {
        font-size: 1.1rem;
        margin-bottom: 1rem;
      }

      .caption-text {
        text-align: left;
      }

      .see-detail {
        position: absolute;
        bottom: 1.25rem;
        right: 1.5rem;
      }
    }

    .circle {
      border-radius: 12px;
      transform: translate3d(0, -1rem, 0);
    }

    .round {
      border-radius: 0 0 12px 12px;
    }
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

    .round {
      &:hover {
        clip-path: inset(0 round 12px);
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
