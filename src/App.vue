<script setup lang="ts">
import WordWall from './components/WordWall.vue'
import { WORD_GROUPS } from './data/list';
</script>

<template>
  <WordWall :wordGroup="WORD_GROUPS['BOARD_1']" @complete="console.log('complete')" />
</template>
