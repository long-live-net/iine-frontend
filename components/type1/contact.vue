<script setup lang="ts">
import type { ContactType } from '@/types/content-types'

type ContactProps = {
  udata: ContactType
}
defineProps<ContactProps>()
</script>

<template>
  <GuiSectionWrap :loading="false" class="type1-contact">
    <GuiContentCard class="type1-contact__card">
      <GuiEyecatchImage :image="udata.image" class="eyecatcher">
        <GuiEyecatchTitles
          place="section"
          :title="udata.title"
          :subtitle="udata.subtitle"
          class="eyecatcher__titles"
        />
      </GuiEyecatchImage>
      <GuiContentCardBody v-show="udata.body?.length">
        {{ udata.body }}
      </GuiContentCardBody>
    </GuiContentCard>
  </GuiSectionWrap>
</template>

<style scoped lang="scss">
$eyecatcher-height: 500px;
$eyecatcher-height-sm: 600px;

.type1-contact {
  position: relative;
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
