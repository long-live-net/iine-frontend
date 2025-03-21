<script setup lang="ts">
import type { MenuDetailType } from '@/types/content'
const props = defineProps<{ item: MenuDetailType }>()

const captionPlainString = computed(
  () => props.item?.caption?.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '') ?? ''
)

const imageViewModal = ref(false)
const imageViewTitle = ref('')
const imageViewFileUrl = ref('')
const onClickEyecatch = (item: MenuDetailType) => {
  if (import.meta.client && item.image?.url) {
    imageViewModal.value = true
    imageViewTitle.value = item.title
    imageViewFileUrl.value = item.image.url
  }
}
</script>

<template>
  <div class="detail-list-item" :class="{ 'mb-4': !!item.image }">
    <div class="detail-title-price">
      <h5 class="title">
        {{ item.title }}
      </h5>
      <p class="price">
        {{ item.price }}
      </p>
    </div>

    <div v-if="captionPlainString || item.image" class="detail-body">
      <div class="caption-col">
        <CommonWysiwygViewer
          v-if="captionPlainString"
          :value="item.caption"
          class="caption"
        />
      </div>

      <div
        v-if="item.image"
        class="eyecatcher-col item-link"
        @click="onClickEyecatch(item)"
      >
        <CommonEyecatchImage :url="item.image.url" class="eyecatcher" />
      </div>
    </div>
  </div>
  <CommonModalDialog
    v-model:modal="imageViewModal"
    :title="imageViewTitle"
    title-icon="mdi-silverware"
    title-icon-color="orange"
    theme="auto"
    width="90vw"
    max-width="880px"
  >
    <div class="image-viewer">
      <img :src="imageViewFileUrl" />
    </div>
  </CommonModalDialog>
</template>

<style lang="scss" scoped>
.detail-list-item {
  $title-border-color: color-mix(in srgb, currentColor 20%, transparent);
  $title-background-color: color-mix(in srgb, currentColor 10%, transparent);

  width: 85%;
  margin: 0 auto;

  .detail-title-price {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 0.25rem 1.5rem;
    border-bottom: 1px solid $title-border-color;

    .title {
      font-weight: bold;
      font-size: 1.1rem;
      margin: 0;
    }

    .price {
      font-weight: bold;
      white-space: nowrap;
      margin-left: auto;
      padding-left: 0.25rem;
    }
  }

  .detail-body {
    display: flex;
    justify-content: center;
    margin-top: 0.5rem;
    padding: 0 1.5rem;

    .caption-col {
      flex: 1 1 auto;
      padding-right: 1rem;
    }

    .eyecatcher-col {
      flex: 0 0 45%;

      .eyecatcher {
        width: 100%;
        aspect-ratio: 2 / 1;
        margin-top: 0.5rem;
      }
    }
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

  @media only screen and (max-width: $grid-breakpoint-md) {
    width: 85%;

    .detail-title-price {
      padding: 0.25rem 1rem;
      // border-bottom: none;
      background-color: $title-background-color;
    }

    .detail-body {
      display: block;
      margin-top: 0.25rem;
      padding: 0;

      .caption-col {
        flex: 1 0 auto;
        padding-right: 0;
        padding-bottom: 0.5rem;
      }

      .eyecatcher-col {
        flex: 1 0 auto;
        padding-bottom: 0.5rem;

        .eyecatcher {
          width: 100%;
          max-width: 280px;
          margin-top: 0;
          margin-left: auto;
        }
      }
    }
  }
}

.image-viewer {
  width: 100%;

  img {
    width: 100%;
  }
}
</style>
