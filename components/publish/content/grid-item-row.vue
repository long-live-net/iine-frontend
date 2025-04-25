<script setup lang="ts" generic="T extends ContentType">
import type { ContentType } from '@/types/content'

withDefaults(
  defineProps<{
    item: T
    seeDetailPath?: string | null
    seeDetailActionLabel?: string
    reverse?: boolean
    isCurrent?: boolean
    noCaption?: boolean
  }>(),
  {
    seeDetailPath: null,
    seeDetailActionLabel: '詳しく見る',
    reverse: false,
    isCurrent: false,
    noCaption: false,
  }
)
defineEmits<{ select: [item: T] }>()
</script>

<template>
  <div class="content-list-item" :class="{ reverse: reverse }">
    <section
      class="eyecatcher-part"
      :class="[isCurrent ? 'current-item' : 'item-link']"
      @click="
        seeDetailPath ? $router.push(seeDetailPath) : $emit('select', item)
      "
    >
      <template v-if="item.image">
        <CommonContentItemAnimation
          animation-name="gFadeInUp"
          :thresholds="[0.3]"
          :disabled="$route.name !== 'index'"
        >
          <CommonEyecatchImage :url="item.image.url" class="eyecatcher" round />
        </CommonContentItemAnimation>
      </template>
    </section>
    <section v-if="!noCaption" class="caption-part">
      <CommonContentItemAnimation
        animation-name="gFadeIn"
        animation-duration="3s"
        :thresholds="[0.5]"
        :disabled="$route.name !== 'index'"
      >
        <div class="caption-base">
          <div class="caption g-theme-contents-grid-row-caption">
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
        </div>
      </CommonContentItemAnimation>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.content-list-item {
  display: flex;
  justify-content: center;
  margin: 0 auto;

  .eyecatcher-part {
    flex: 1 0 auto;
    width: 50%;
    min-width: 626px;

    .eyecatcher {
      width: 100%;
      aspect-ratio: 21 / 10;
      clip-path: inset(0 round 12px);
    }
  }

  .caption-part {
    position: relative;
    flex: 1 1 auto;
    width: 50%;

    .caption-base {
      position: absolute;
      bottom: 5%;
      right: 0;

      .caption {
        position: relative;
        min-width: 626px;
        min-height: 180px;
        padding: 1.5rem;
        padding-bottom: 62px;
        border-radius: 12px;

        .title {
          text-align: center;
          font-weight: bold;
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
    }
  }

  .item-link {
    cursor: pointer;

    .eyecatcher {
      transition: transform 0.4s;
      &:hover {
        background-color: rgba(255 255 255 / 0.25);
        background-blend-mode: overlay;
        transform: scale(1.1);
      }
    }
  }

  .current-item {
    color: $blue-lighten2;

    .eyecatcher {
      background-color: rgba(128 255 255 / 0.75);
      background-blend-mode: overlay;
    }
  }
}

.reverse {
  flex-direction: row-reverse;

  .caption-base {
    right: auto !important;
    left: 0;
  }
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .content-list-item {
    display: block;
    padding: 0 1rem;

    .eyecatcher-part {
      width: 100%;
      min-width: auto;

      .eyecatcher {
        width: 90%;
      }
    }

    .caption-part {
      position: relative;
      width: 100%;

      .caption-base {
        position: relative;
        top: -1.5rem;
        bottom: auto !important;
        left: auto !important;
        right: auto !important;

        .caption {
          width: 90%;
          min-width: auto;
          margin: 0 0 0 auto;
        }
      }
    }
  }
}
</style>
