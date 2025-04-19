<script setup lang="ts">
withDefaults(
  defineProps<{
    to?: string | null
    width?: string
    small?: boolean
    noCaret?: boolean
    color?: string | null
  }>(),
  {
    to: null,
    width: 'auto',
    small: false,
    noCaret: false,
    color: null,
  }
)
defineEmits<{ click: [] }>()
</script>

<template>
  <p
    class="nav-button"
    :class="{
      small,
      'color-inherit': color === 'inherit',
      'color-bind': !!color && color !== 'inherit',
    }"
  >
    <nuxt-link v-if="to?.length" :to="to" class="nav-link"
      ><slot /><span v-if="!noCaret && !small" class="caret"
    /></nuxt-link>
    <button v-else class="nav-link" @click.prevent.stop="$emit('click')">
      <slot /><span v-if="!noCaret && !small" class="caret" />
    </button>
  </p>
</template>

<style lang="scss" scoped>
.nav-button {
  display: inline-block;
  position: relative;
  width: v-bind('width');
  text-align: center;
  border: solid 1px var(--link-color);
  border-radius: 4px;
  margin: 0;
  padding: 0;
  z-index: 0;
  cursor: pointer;

  .nav-link {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 100%;
    line-height: 36px;
    font-size: 15px;
    user-select: none;
    transition: all 0.3s;

    .caret {
      position: absolute;
      top: 50%;
      right: 20px;
      width: 8px;
      height: 8px;
      border-top: 2px solid var(--link-color);
      border-right: 2px solid var(--link-color);
      transform: rotate(45deg) translateY(-50%);
      border-radius: 1px;
      transition: all 0.75s;
    }
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 0;
    display: inline-block;
    background-color: var(--link-active-color);
    transition: all 0.3s;
  }

  &:hover {
    border-color: var(--link-active-color);

    .nav-link {
      color: var(--link-text-color);
      font-weight: bold;
      text-decoration: none;

      .caret {
        width: 15px;
        height: 15px;
        border-width: 5px;
        border-color: var(--link-text-color);
      }
    }

    &:before {
      width: 100%;
      z-index: -1;
    }
  }
}

.small {
  .nav-link {
    font-size: 13px;
    line-height: 28px;
  }
}

.color-inherit {
  border-color: inherit;

  .nav-link {
    color: inherit;
  }
}

.color-bind {
  border-color: v-bind('color');

  .nav-link {
    color: v-bind('color');
  }
}
</style>
