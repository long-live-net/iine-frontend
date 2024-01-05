<script setup lang="ts">
definePageMeta({ layout: 'simple' })
</script>

<template>
  <div class="logout-wrap">
    <div class="logout-card">
      <h4>管理ユーザをログアウトしました</h4>
      <p class="text-center">ページの閲覧は可能です</p>
      <div class="mt-10 text-center">
        <v-btn color="primary" block @click="$router.push('/')">
          ホームに戻る
        </v-btn>
      </div>
      <div class="mt-8 text-center">
        <nuxt-link to="./login">再度ログインする</nuxt-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logout-wrap {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.logout-card {
  background-color: white;
  padding: 3rem;
  border-radius: 12px;
}
</style>
