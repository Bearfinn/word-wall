<template>
  <div class="relative w-full max-w-2xl mx-auto">
    <div class="flex h-screen items-center justify-center">
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl text-left font-bold">
              {{ board.name }}
            </h2>
            <p class="text-center text-gray-500 dark:text-gray-400">
              {{ board.description }}
            </p>
          </div>
          <Timer />
        </div>
        <WordWall :word-group="board.wordGroups" @complete="console.log('complete')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Board } from '../types';
import Timer from './Timer.vue';
import WordWall from './WordWall.vue';

defineProps<{
  board: Board;
}>()
</script>