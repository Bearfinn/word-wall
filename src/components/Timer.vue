<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const time = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

onMounted(() => {
  timer = setInterval(() => {
    time.value++;
  }, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div class="text-2xl font-bold dark:bg-gray-800 text-right bg-opacity-80 p-2 rounded-md">
    {{ formatTime(time) }}
  </div>
</template>