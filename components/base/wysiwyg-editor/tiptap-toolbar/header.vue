<script setup lang="ts">
import type { HeaderLebel } from '~/utils/wysiwyg-editor/tip-tap'

const props = defineProps<{ level: HeaderLebel }>()
const emit = defineEmits<{ 'update:level': [value: HeaderLebel] }>()

const inputLevel = ref<HeaderLebel>(null)
watch(
  () => props.level,
  () => {
    if (inputLevel.value !== props.level) {
      inputLevel.value = props.level
    }
  },
  { immediate: true }
)
watch(inputLevel, (cur, pre) => {
  if (cur === props.level) {
    return
  }
  if (cur) {
    emit('update:level', cur)
  } else if (pre) {
    emit('update:level', pre)
  }
})

const menuValue = ref(false)
</script>

<template>
  <v-menu
    v-model="menuValue"
    activator="parent"
    location="top"
    :close-on-content-click="false"
  >
    <div class="sub-input-header">
      <div class="controller">
        <v-btn-toggle
          :model-value="inputLevel"
          color="primary"
          variant="outlined"
          divided
          @update:model-value="inputLevel = $event ?? null"
        >
          <v-btn icon="mdi-format-header-1" :value="1" />
          <v-btn icon="mdi-format-header-2" :value="2" />
          <v-btn icon="mdi-format-header-3" :value="3" />
          <v-btn icon="mdi-format-header-4" :value="4" />
          <v-btn icon="mdi-format-header-5" :value="5" />
        </v-btn-toggle>
      </div>
      <div class="actions">
        <div>
          <v-btn
            v-if="level"
            color="black"
            icon="mdi-delete"
            size="x-small"
            class="mr-2"
            @click="$emit('update:level', level)"
          />
        </div>
        <div>
          <v-btn
            variant="outlined"
            color="black"
            icon="mdi-close"
            size="x-small"
            @click="menuValue = false"
          />
        </div>
      </div>
    </div>
  </v-menu>
</template>

<style scoped lang="scss">
.sub-input-header {
  padding: 0;
  color: $black;
  background-color: $white;
  border-radius: 4px;

  .actions {
    padding: 0.5rem 1rem;
    display: flex;
    justify-content: space-between;
  }
}
</style>
