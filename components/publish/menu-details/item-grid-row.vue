<script setup lang="ts">
import type { MenuDetailType } from '@/types/content'

defineProps<{ item: MenuDetailType }>()
defineEmits<{ select: [menuDetail: MenuDetailType] }>()
</script>

<template>
  <div class="menuDetail-list-item" :class="{ 'mb-4': !!item.image }">
    <section
      v-if="item.image"
      class="eyecatcher-col item-link"
      @click="$emit('select', item)"
    >
      <CommonEyecatchImage :url="item.image.url" class="eyecatcher" />
    </section>
    <section v-else class="blank-col" />

    <section class="caption-col">
      <div class="caption-base">
        <div class="title-price">
          <h5 class="title">
            {{ item.title }}
          </h5>
          <p>
            {{ item.price }}
          </p>
        </div>
        <CommonWysiwsgViewer :value="item.caption" class="caption" />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.menuDetail-list-item {
  $titile-border-color: color-mix(in srgb, currentColor 40%, transparent);
  $caption-border-color: color-mix(in srgb, currentColor 30%, transparent);
  $caption-color: color-mix(in srgb, currentColor 75%, transparent);

  display: flex;
  justify-content: center;
  width: 90%;
  margin: 0 auto;

  .eyecatcher-col {
    flex: 0 0 240px;

    .eyecatcher {
      width: 100%;
      aspect-ratio: 5 / 3;
    }
  }

  .caption-col {
    flex: 1 1 auto;

    .caption-base {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      padding-left: 1rem;

      .title-price {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid $titile-border-color;

        .title {
          font-weight: bold;
          font-size: 1.1rem;
          margin: 0;
        }
      }

      .caption {
        color: $caption-color;
      }
    }
  }

  .blank-col {
    display: block;
    flex: 0 0 14px;
    margin-left: 1rem;
    background-color: $caption-border-color;
  }

  .item-link {
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
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .menuDetail-list-item {
    display: block;
    width: 75%;

    .eyecatcher-col {
      width: 100%;

      .eyecatcher {
        width: 80%;
        aspect-ratio: 2 / 1;
      }
    }

    .caption-col {
      width: 100%;
      margin-top: 0.5rem;

      .caption-base {
        padding-left: 0;

        .caption {
          margin-top: 0.4rem;
        }
      }
    }

    .blank-col {
      display: none;
    }
  }
}
</style>
