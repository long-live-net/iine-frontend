<script setup lang="ts">
import type { InformationForm } from '@/types/content'

const customerId = 1 // TODO: 適当！！

const {
  nextKey,
  getInformation,
  informationRef,
  loading: readLoading,
} = useInformationRead(customerId)

const {
  createInformation,
  updateInformation,
  loading: writeLoading,
} = useInformationWrite(customerId)

const onCreate = async (formData: InformationForm) => {
  await createInformation(formData)
  nextKey()
  getInformation()
}

const onUpdate = async (formData: InformationForm) => {
  if (informationRef.value === null) return

  await updateInformation(informationRef.value.id, formData)
  nextKey()
  getInformation()
}

const loading = computed(() => readLoading.value || writeLoading.value)

await getInformation()
</script>

<template>
  <GuiContentWrap :loading="loading">
    <GuiContentCard class="type1-information">
      <GuiEyecatchImage
        v-if="informationRef?.image"
        :url="informationRef?.image?.url"
        :settings="informationRef?.image?.settings"
        class="eyecatcher"
      >
        <GuiEyecatchTitles
          place="section"
          :title="informationRef?.title"
          :subtitle="informationRef?.subtitle"
          class="eyecatcher__titles"
        />
        <div class="image-settings">
          <div>イメージセッティグ</div>
        </div>
      </GuiEyecatchImage>
      <GuiContentCardBody class="body">
        {{ informationRef?.body ?? '' }}
      </GuiContentCardBody>
      <div class="edit-activator">
        <SectionsEditInformation
          :information-data="informationRef"
          @create="onCreate"
          @update="onUpdate"
        />
      </div>
    </GuiContentCard>
  </GuiContentWrap>
</template>

<style scoped lang="scss">
$eyecatcher-height: 500px;
$eyecatcher-height-sm: 600px;

.type1-information {
  position: relative;
  .edit-activator {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
  .eyecatcher {
    position: relative;
    height: 30vh;
    min-height: 400px;
    max-height: $eyecatcher-height;
    min-height: calc($eyecatcher-height * 0.5);
    &__titles {
      position: absolute;
      top: 50%;
      left: 50%;
    }
    .image-settings {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      background-color: rgba(255, 255, 255, 0.5);
    }
  }
  .body {
    min-height: calc($eyecatcher-height * 0.3);
  }
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .type1-information {
    .eyecatcher {
      height: 50vh;
      max-height: $eyecatcher-height-sm;
      min-height: calc($eyecatcher-height-sm * 0.5);
    }
  }
}
</style>
