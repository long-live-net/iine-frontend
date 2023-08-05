<script setup lang="ts">
import type { ContactForm } from '@/types/content'

const customerId = 1 // TODO: 適当！！

const {
  nextKey,
  getContact,
  contactRef,
  loading: readLoading,
} = useContactRead(customerId)

const {
  createContact,
  updateContact,
  loading: writeLoading,
} = useContactWrite(customerId)

const onCreate = async (formData: ContactForm) => {
  await createContact(formData)
  nextKey()
  getContact()
}

const onUpdate = async (formData: ContactForm) => {
  if (contactRef.value === null) return

  await updateContact(contactRef.value.id, formData)
  nextKey()
  getContact()
}

const loading = computed(() => readLoading.value || writeLoading.value)

getContact()
</script>

<template>
  <GuiContentWrap :loading="loading">
    <GuiContentCard class="type1-contact">
      <GuiEyecatchImage
        v-if="contactRef?.image"
        :url="contactRef?.image?.url"
        :settings="contactRef?.image?.settings"
        class="eyecatcher"
      >
        <GuiEyecatchTitles
          place="section"
          :title="contactRef?.title"
          :subtitle="contactRef?.subtitle"
          class="eyecatcher__titles"
        />
        <div class="image-settings">
          <div>イメージセッティグ</div>
        </div>
      </GuiEyecatchImage>
      <GuiContentCardBody>
        {{
          contactRef
            ? contactRef.body
              ? contactRef.body
              : ''
            : 'コンテンツが登録されていません'
        }}
      </GuiContentCardBody>
      <div class="edit-activator">
        <SectionsEditContact
          :contact-data="contactRef"
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

.type1-contact {
  position: relative;
  .edit-activator {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
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

@media only screen and (max-width: $grid-breakpoint-md) {
  .type1-contact {
    .eyecatcher {
      height: 50vh;
      max-height: $eyecatcher-height-sm;
      min-height: calc($eyecatcher-height-sm * 0.5);
    }
  }
}
</style>
