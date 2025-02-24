<script setup lang="ts" generic="T extends ContentType">
import type { ContentType, TitleSettings, ImageSettings } from '@/types/content'

const editModal = defineModel<boolean>('modal', { required: true })
const props = withDefaults(
  defineProps<{
    item: T | null
    canEdit?: boolean
    noImageParallax?: boolean
  }>(),
  {
    canEdit: false,
    noImageParallax: false,
  }
)
defineEmits<{
  create: []
  update: [item: T]
  updateTitleSetting: [settings: Partial<TitleSettings>]
  updateImageSetting: [settings: Partial<ImageSettings>]
}>()

const bodyPlainString = computed(
  () => props.item?.body?.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '') ?? ''
)
</script>

<template>
  <div class="content-detail-item">
    <CommonContentItemAnimation
      :thresholds="[0.5]"
      animation-name="gFadeIn"
      animation-duration="1.5s"
      class="g-block-sm"
    >
      <CommonContentCardTitle :title="item?.title ?? ''" class="g-block-sm" />
    </CommonContentItemAnimation>
    <template v-if="item?.image">
      <CommonContentItemAnimation
        :thresholds="[0.5]"
        animation-name="gFadeIn"
        animation-duration="1.5s"
      >
        <CommonEyecatchImage
          :url="item?.image?.url"
          :settings="item?.imageSettings"
          class="eyecatcher"
        >
          <template #default>
            <CommonEyecatchTitleSettingPosition
              :settings="item?.titleSettings"
              :can-edit="canEdit"
              class="g-block-lg"
              @update="$emit('updateTitleSetting', $event)"
            >
              <template #default>
                <CommonContentItemAnimation
                  :thresholds="[0.5]"
                  animation-name="gZoomIn"
                  animation-duration="1s"
                >
                  <CommonEyecatchTitle
                    place="section"
                    :title="item?.title"
                    :settings="item?.titleSettings"
                    text-no-wrap
                  />
                </CommonContentItemAnimation>
              </template>
              <template #sideSettings>
                <CommonEyecatchTitleSetting
                  :settings="item?.titleSettings"
                  @update="$emit('updateTitleSetting', $event)"
                />
              </template>
            </CommonEyecatchTitleSettingPosition>
          </template>
          <template v-if="canEdit && item" #settings>
            <CommonEyecatchImageSetting
              :settings="item.imageSettings"
              :no-parallax="noImageParallax"
              @update="$emit('updateImageSetting', $event)"
            />
          </template>
        </CommonEyecatchImage>
      </CommonContentItemAnimation>
    </template>
    <CommonContentCardTitle
      v-else
      :title="item?.title ?? ''"
      class="g-block-lg"
    />

    <slot name="middlenavi" />

    <CommonContentCardBody>
      <slot name="body">
        <div v-if="item">
          <div v-if="bodyPlainString">
            <CommonWysiwsgViewer :value="item?.body" />
          </div>
          <div v-else class="no-items">
            <p>データがありません</p>
            <div v-if="canEdit">
              <CommonContentEditActivator
                v-if="item"
                v-model:modal="editModal"
                is-update
                activator-label="本文を登録してください"
                @update:modal="$emit('update', item)"
              />
            </div>
          </div>
        </div>
        <div v-else class="no-items">
          <p>データがありません</p>
          <div v-if="canEdit && $route.name === 'index'">
            <CommonContentEditActivator
              v-model:modal="editModal"
              activator-label="コンテンツを登録してください"
              @update:modal="$emit('create')"
            />
          </div>
          <p v-else class="mt-9">
            <nuxt-link :to="{ name: 'index' }">HOMEに戻る</nuxt-link>
          </p>
        </div>
      </slot>
    </CommonContentCardBody>

    <slot name="footernavi" />

    <div v-if="canEdit && item?.id" class="edit-activator">
      <CommonContentEditActivator
        v-model:modal="editModal"
        is-update
        @update:modal="$emit('update', item)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.content-detail-item {
  position: relative;

  .edit-activator {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;

    @media only screen and (max-width: $grid-breakpoint-md) {
      top: 6rem;
    }
  }

  .no-items {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 1rem;

    p {
      font-weight: bold;
      color: $accent;
    }
  }
}

$eyecatcher-height: 480px;
$eyecatcher-height-sm: 300px;

.eyecatcher {
  height: 30vh;
  max-height: $eyecatcher-height;
  min-height: calc($eyecatcher-height * 0.65);

  @media only screen and (max-width: $grid-breakpoint-md) {
    height: 30vw;
    max-height: $eyecatcher-height-sm;
    min-height: calc($eyecatcher-height-sm * 0.5);
  }
}
</style>
