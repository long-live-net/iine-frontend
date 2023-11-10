<script setup lang="ts">
import type { InquireMail } from '@/types/inquire'

defineProps<{ inquire: InquireMail | null }>()
defineEmits<{ input: []; send: [] }>()
</script>

<template>
  <section class="inquire-email-confirm">
    <p>以下の内容で送信します。よろしいですか？</p>
    <ul class="mt-2">
      <li>
        <p class="head">お名前</p>
        <p class="value">{{ inquire?.name ?? `` }}</p>
      </li>
      <li>
        <p class="head">メールアドレス</p>
        <p class="value">{{ inquire?.email ?? '' }}</p>
      </li>
      <li>
        <p class="head">電話番号</p>
        <p class="value">{{ inquire?.phone?.length ? inquire.phone : '-' }}</p>
      </li>
      <li>
        <p class="head">お問合せ内容</p>
        <p class="inquire">{{ inquire?.inquiry ?? '' }}</p>
      </li>
    </ul>
    <div class="d-flex justify-end mt-5">
      <v-btn
        prepend-icon="mdi-pencil"
        color="primary"
        variant="outlined"
        width="7.5rem"
        @click="$emit('input')"
      >
        編集する
      </v-btn>
      <v-btn
        prepend-icon="mdi-email-fast"
        color="primary"
        width="7.5rem"
        class="ml-2"
        @click="$emit('send')"
      >
        送信する
      </v-btn>
    </div>
  </section>
</template>

<style scoped lang="scss">
.inquire-email-confirm {
  padding: 0 1.5rem;
  ul {
    li {
      display: flex;
      margin: 1rem 0;
      p {
        padding: 1rem;
      }
      p.head {
        width: 9rem;
        min-width: 9rem;
        color: $dimgray;
        text-align: right;
      }
      p.value {
        background-color: $indigo-lighten4;
        font-weight: bolder;
        overflow-x: hidden;
        white-space: nowrap;
        flex-grow: 1;
      }
      p.inquire {
        background-color: $indigo-lighten4;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    }
  }
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .inquire-email-confirm {
    padding: 0;
    ul {
      li {
        flex-direction: column;
        p {
          padding: 0;
        }
        p.head {
          width: auto;
          min-width: auto;
          text-align: left;
        }
        p.value {
          padding: 1rem;
        }
        p.inquire {
          padding: 1rem;
        }
      }
    }
  }
}
</style>
