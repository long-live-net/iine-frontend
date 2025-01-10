<script setup lang="ts">
const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()

const {
  contactRef,
  onLoad,
  onCreate,
  onUpdate,
  onRemove,
  onUpdateTitleSetting,
  onUpdateImageSetting,
  loading,
} = useContactActions(customerId)
await onLoad()
</script>

<template>
  <CommonContentWrap :loading="loading">
    <CommonContentCard class="type1-contact">
      <template v-if="contactRef?.image">
        <CommonContentItemAnimation
          :thresholds="[0.5]"
          animation-name="gFadeIn"
          animation-duration="2s"
        >
          <CommonEyecatchImage
            :url="contactRef?.image?.url"
            :settings="contactRef?.imageSettings"
            class="eyecatcher"
          >
            <template #default>
              <CommonEyecatchTitleSettingPosition
                :settings="contactRef?.titleSettings"
                :can-edit="canEdit"
                class="g-block-lg"
                @update="onUpdateTitleSetting"
              >
                <template #default>
                  <CommonContentItemAnimation
                    :thresholds="[0.5]"
                    animation-name="gFadeInRight"
                    animation-duration="1.25s"
                  >
                    <CommonEyecatchTitle
                      place="section"
                      :title="contactRef?.title"
                      :subtitle="contactRef?.subtitle"
                      :settings="contactRef?.titleSettings"
                      text-no-wrap
                    />
                  </CommonContentItemAnimation>
                </template>
                <template #sideSettings>
                  <CommonEyecatchTitleSetting
                    :settings="contactRef?.titleSettings"
                    @update="onUpdateTitleSetting"
                  />
                </template>
                <template v-if="contactRef?.subtitle" #topSettings>
                  <CommonEyecatchTitleSettingAlign
                    :settings="contactRef?.titleSettings"
                    @update="onUpdateTitleSetting"
                  />
                </template>
              </CommonEyecatchTitleSettingPosition>
            </template>
            <template v-if="canEdit && contactRef" #settings>
              <CommonEyecatchImageSetting
                :settings="contactRef.imageSettings"
                @update="onUpdateImageSetting"
              />
            </template>
          </CommonEyecatchImage>
        </CommonContentItemAnimation>
      </template>
      <PublishCustomerServiceLinks class="type1-contact__service-links" />
      <CommonContentItemAnimation
        :thresholds="[0.5]"
        animation-name="gFadeIn"
        animation-duration="1.5s"
        class="g-block-sm"
      >
        <CommonContentCardTitle
          :title="contactRef?.title ?? ''"
          :subtitle="contactRef?.subtitle"
          class="g-block-sm type1-contact__title"
        />
      </CommonContentItemAnimation>
      <CommonContentCardBody class="type1-contact__body">
        <div v-if="contactRef?.body">
          <CommonWysiwsgViewer :value="contactRef?.body" />
          <div class="inquire-activator">
            <PublishInquire />
          </div>
        </div>
        <div v-else class="no-items">
          <p>データがありません</p>
          <div v-if="canEdit">
            <ManageContentContact
              activator-label="コンテンツを登録してください"
              @create="onCreate"
            />
          </div>
        </div>
      </CommonContentCardBody>
      <div v-if="canEdit && contactRef?.id" class="edit-activator">
        <ManageContentContact
          :contact-data="contactRef"
          @update="onUpdate"
          @remove="onRemove"
        />
      </div>
    </CommonContentCard>
  </CommonContentWrap>
</template>

<style scoped lang="scss">
.type1-contact {
  position: relative;

  .edit-activator {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
  }

  .inquire-activator {
    margin-top: 1.5rem;
    text-align: center;
  }

  &__service-links {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.25rem;
    margin-right: 1rem;
  }
  &__title {
    padding-top: 0;
    padding-bottom: 0;
  }
  &__body {
    padding-top: 0.5rem;
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
  min-height: calc($eyecatcher-height * 0.7);

  @media only screen and (max-width: $grid-breakpoint-md) {
    height: 50vw;
    max-height: $eyecatcher-height-sm;
    min-height: calc($eyecatcher-height-sm * 0.5);
  }
}
</style>
