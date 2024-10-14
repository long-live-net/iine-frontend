<script setup lang="ts">
withDefaults(defineProps<{ forceIcon?: boolean }>(), {
  forceIcon: false,
})

const { snsLinks, getSnsTitle, getSnsIcon, getSnsColor, onClickLink } =
  useCustomerSnsLinks()
</script>
<template>
  <div>
    <template v-if="forceIcon">
      <v-btn
        v-for="link in snsLinks"
        :key="link.serviceName"
        icon
        variant="text"
        @click="onClickLink(link.serviceName)"
      >
        <v-icon :color="getSnsColor(link.serviceName)">
          {{ getSnsIcon(link.serviceName) }}
        </v-icon>
      </v-btn>
    </template>
    <template v-else>
      <div class="g-block-lg">
        <v-btn
          v-for="link in snsLinks"
          :key="link.serviceName"
          :prepend-icon="getSnsIcon(link.serviceName)"
          variant="text"
          class="text-capitalize"
          @click="onClickLink(link.serviceName)"
        >
          <template #prepend>
            <v-icon :color="getSnsColor(link.serviceName)" />
          </template>
          {{ getSnsTitle(link.serviceName) }}
        </v-btn>
      </div>
      <div class="g-block-sm">
        <v-btn
          v-for="link in snsLinks"
          :key="link.serviceName"
          icon
          variant="text"
          @click="onClickLink(link.serviceName)"
        >
          <v-icon :color="getSnsColor(link.serviceName)">
            {{ getSnsIcon(link.serviceName) }}
          </v-icon>
        </v-btn>
      </div>
    </template>
  </div>
</template>
