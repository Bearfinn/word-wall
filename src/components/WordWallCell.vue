<template>
  <div @click="handleClick('click')" :class="[
    'w-24 h-24 flex items-center justify-center cursor-pointer text-center transition-colors',
    getCellClass(index),
    { 'pointer-events-none': props.isAnimating }
  ]" :style="getCellStyle(index)">
    {{ props.word }}
  </div>
</template>

<script setup lang="ts">
import { colorSet } from '../constants/colorSet';

const props = defineProps<{ word: string; index: number; isSelected: boolean; isCorrect: boolean; isAnimating: boolean; groupIndex?: number; targetIndex?: number; }>()
const handleClick = defineEmits<{ click: [] }>()

const getCellClass = (index: number) => {
  if (props.isCorrect) {
    const setIndex = Math.floor(index / 4);
    return `${colorSet[setIndex].bg} ${colorSet[setIndex].text}`;
  }
  if (props.isSelected) {
    return 'bg-gray-300 text-gray-900';
  }
  return 'bg-gray-500 text-white';
};

const getCellStyle = (index: number) => {
  if (!props.isAnimating) return {};

  const currentPosition = index;
  const newPosition = props.targetIndex;

  if (!newPosition) return {};

  const currentRow = Math.floor(currentPosition / 4);
  const currentCol = currentPosition % 4;
  const newRow = Math.floor(newPosition / 4);
  const newCol = newPosition % 4;

  return {
    transform: `translate(${(newCol - currentCol) * 100}%, ${(newRow - currentRow) * 100}%)`,
    zIndex: props.isAnimating ? '10' : '1',
    transition: 'transform 0.5s ease-in-out',
  };
};
</script>