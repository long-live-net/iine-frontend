<script setup lang="ts">
withDefaults(defineProps<{ isTable?: boolean }>(), {
  isTable: false,
})
defineEmits<{
  'table:add': []
  'table:delete': []
  'tr:add:before': []
  'tr:add:after': []
  'tr:delete': []
  'tr:toggle:header': []
  'td:add:before': []
  'td:add:after': []
  'td:delete': []
  'td:toggle:header': []
}>()

const menuValue = ref(false)
</script>

<template>
  <v-menu
    v-model="menuValue"
    activator="parent"
    location="top"
    :close-on-content-click="false"
  >
    <div class="sub-input-table">
      <div class="controller">
        <div class="setting">
          <p>表</p>
          <div>
            <v-btn-group variant="outlined" divided>
              <v-btn
                icon="mdi-table-plus"
                :disabled="isTable"
                @click="$emit('table:add')"
              />
              <v-btn
                icon="mdi-table-remove"
                :disabled="!isTable"
                @click="$emit('table:delete')"
              />
            </v-btn-group>
          </div>
        </div>
        <div class="setting">
          <p>行</p>
          <div>
            <v-btn-group variant="outlined" divided>
              <v-btn
                icon="mdi-table-row-plus-before"
                :disabled="!isTable"
                @click="$emit('tr:add:before')"
              />
              <v-btn
                icon="mdi-table-row-plus-after"
                :disabled="!isTable"
                @click="$emit('tr:add:after')"
              />
              <v-btn
                icon="mdi-table-row-remove"
                :disabled="!isTable"
                @click="$emit('tr:delete')"
              />
              <v-btn
                icon="mdi-table-headers-eye"
                :disabled="!isTable"
                @click="$emit('tr:toggle:header')"
              />
            </v-btn-group>
          </div>
        </div>
        <div class="setting">
          <p>列</p>
          <div>
            <v-btn-group variant="outlined" divided>
              <v-btn
                icon="mdi-table-column-plus-before"
                :disabled="!isTable"
                @click="$emit('td:add:before')"
              />
              <v-btn
                icon="mdi-table-column-plus-after"
                :disabled="!isTable"
                @click="$emit('td:add:after')"
              />
              <v-btn
                icon="mdi-table-column-remove"
                :disabled="!isTable"
                @click="$emit('td:delete')"
              />
              <v-btn
                icon="mdi-table-headers-eye"
                :disabled="!isTable"
                @click="$emit('td:toggle:header')"
              />
            </v-btn-group>
          </div>
        </div>
      </div>
      <div class="actions">
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
.sub-input-table {
  padding: 1rem;
  color: $black;
  background-color: $white;
  border-radius: 4px;

  .controller {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .setting {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }

  .actions {
    display: flex;
    justify-content: end;
    margin-top: 0.75rem;
  }
}
</style>
