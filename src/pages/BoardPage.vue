<template>
  <Board v-if="board" :board="board" />
</template>

<script setup lang="ts">
import { getBoardByPath } from '../db/turso';
import { onMounted, ref } from 'vue';
import Board from '../components/Board.vue';
import { Board as BoardType } from '../types';
import { useRoute } from 'vue-router';

const board = ref<BoardType | null>(null);

const route = useRoute()

onMounted(async () => {
  console.log(route)
  board.value = await getBoardByPath(route.params.boardId as string);
});
</script>