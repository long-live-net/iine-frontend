<script setup>
const error = useError()

const onClickBack = () => {
  clearError()
  if (import.meta.client) {
    window.location.href = '/'
  }
}
</script>

<template>
  <div class="error-wrap">
    <div class="error-card px-6 py-10 pa-sm-12 px-md-16 py-md-12">
      <h3>申し訳ありません。エラーが発生しました。</h3>
      <div class="error-field mt-3 pa-2">
        <template v-if="error?.statusCode && error?.message">
          <p>
            <small>
              {{ error?.statusCode }}
              {{ error?.statusMessage ?? '' }}
            </small>
          </p>
          <p>
            <b>{{ error?.message }}</b>
          </p>
        </template>
        <template v-else>
          <p>
            <b>{{ error }}</b>
          </p>
        </template>
      </div>
      <div class="action-field mt-5">
        <button @click="onClickBack">ホームに戻る</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.error-wrap {
  background-color: transparent;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .error-card {
    width: 90%;
    max-width: 800px;
    background-color: $white;
    border-radius: 1rem;
    .error-field {
      p {
        margin: 0.5rem 0;
        overflow: hidden;
        small {
          color: $gray;
        }
        b {
          color: $error;
        }
      }
    }
    .action-field {
      text-align: center;

      button {
        font-weight: bold;
        width: 18rem;
        color: $white;
        background-color: $gray-darken1;
        border: 1px solid;
        border-radius: 0.5rem;
        padding: 0.5rem 0;
        vertical-align: middle;
      }
      button:hover {
        background-color: $primary;
      }
      button:active {
        background-color: $blue-lighten2;
      }
    }
  }
}
</style>
