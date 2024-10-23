<template>
  <div v-if="error" class="text-red-500 text-sm">{{ error[0] }}</div>
</template>

<script setup lang="ts">
defineProps<{
  error: string[] | undefined
}>()
</script>