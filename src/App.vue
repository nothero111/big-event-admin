<script setup>
import NiHao from '@/components/NiHao.vue'
import router from '@/router/index.js'
</script>

<template>
  <router-view></router-view>
  <hr />
  <hr />

  <div>hello</div>
  <el-button @click="router.push('home')">跳home</el-button>
  <NiHao></NiHao>
</template>

<style scoped></style>
