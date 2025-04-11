<script setup lang="ts" generic="T extends ContentType">
import type {
  ContentType,
  TitleSettings,
  ImageSettings,
  ContentEditMode,
} from '@/types/content'

const modal = defineModel<boolean>('modal', { required: true })
const props = withDefaults(
  defineProps<{
    item: T | null
    contentTitle: string
    canEdit?: boolean
    noImageParallax?: boolean
  }>(),
  {
    canEdit: false,
    noImageParallax: false,
  }
)
defineEmits<{
  editMode: [mode: ContentEditMode]
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
    <div v-if="item?.image" class="image-item">
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
              v-if="item?.id"
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
                    :subtitle="item?.subtitle"
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
              <template v-if="item?.subtitle" #topSettings>
                <CommonEyecatchTitleSettingAlign
                  :settings="item?.titleSettings"
                  @update="$emit('updateTitleSetting', $event)"
                />
              </template>
              <template #editActions>
                <CommonContentEditActivator
                  v-model:modal="modal"
                  edit-mode="title"
                  content-title="タイトル"
                  size="small"
                  @update:modal="$emit('editMode', 'title')"
                />
              </template>
            </CommonEyecatchTitleSettingPosition>
          </template>
        </CommonEyecatchImage>
      </CommonContentItemAnimation>

      <div v-if="canEdit && item?.id" class="edit-activator">
        <div class="activators">
          <CommonContentEditActivator
            v-model:modal="modal"
            edit-mode="image"
            content-title="画像"
            @update:modal="$emit('editMode', 'image')"
          />
          <CommonEyecatchImageSetting
            :settings="item.imageSettings"
            :no-parallax="noImageParallax"
            @update="$emit('updateImageSetting', $event)"
          />
          <CommonContentEditActivator
            v-model:modal="modal"
            edit-mode="delete"
            :content-title="contentTitle"
            @update:modal="$emit('editMode', 'delete')"
          />
        </div>
      </div>
    </div>
    <CommonContentCardTitle
      v-else
      :title="item?.title ?? ''"
      class="g-block-lg"
    />

    <slot name="middlenavi" />

    <div class="body-item">
      <CommonContentCardBody>
        <div v-if="canEdit && item?.id" class="edit-body-activator">
          <slot name="bodyEditActivator">
            <CommonContentEditActivator
              v-model:modal="modal"
              edit-mode="body"
              content-title="本文"
              @update:modal="$emit('editMode', 'body')"
            />
          </slot>
        </div>
        <div v-if="item">
          <slot name="body">
            <div v-if="bodyPlainString">
              <CommonWysiwygViewer :value="item?.body" />
            </div>
            <div v-else class="no-items">
              <p>本文がありません</p>
              <div v-if="canEdit" class="d-flex align-center">
                <CommonContentEditActivator
                  v-if="item"
                  v-model:modal="modal"
                  edit-mode="body"
                  content-title="本文"
                  @update:modal="$emit('editMode', 'body')"
                />
                <p class="ml-2">このボタンから本文を登録してください。</p>
              </div>
            </div>
          </slot>
        </div>
        <div v-else class="no-items">
          <p>データがありません</p>
          <div
            v-if="canEdit && $route.name === 'index'"
            class="d-flex align-center"
          >
            <CommonContentEditActivator
              v-model:modal="modal"
              :content-title="contentTitle"
              edit-mode="new"
              @update:modal="$emit('editMode', 'new')"
            />
            <p class="ml-2">
              このボタンから{{ contentTitle }}を登録してください。
            </p>
          </div>
          <p v-else class="mt-9">
            <nuxt-link :to="{ name: 'index' }">HOMEに戻る</nuxt-link>
          </p>
        </div>
      </CommonContentCardBody>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content-detail-item {
  position: relative;

  .no-items {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 0.25rem;

    p {
      font-weight: bold;
      color: var(--warning-color);
    }
  }
}

.image-item {
  position: relative;

  .edit-activator {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;

    @media only screen and (max-width: $grid-breakpoint-md) {
      top: 0.25rem;
      left: 0.25rem;
    }

    .activators {
      display: flex;
      column-gap: 0.5rem;
    }
  }
}

.edit-body-activator {
  margin: -1.5rem 0 1rem 25px;
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
