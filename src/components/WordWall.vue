<template>
  <div class="relative w-full max-w-2xl mx-auto space-y-4">
    <Timer />
    <div class="grid grid-cols-4 gap-2">
      <div v-for="(word, index) in shuffledWords" :key="word.word" @click="!isAnimating && selectWord(index)" :class="[
        'w-24 h-24 flex items-center justify-center cursor-pointer text-center transition-colors',
        getCellClass(index),
        { 'pointer-events-none': isAnimating }
      ]" :style="getCellStyle(index)">
        {{ word.word }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { WordGroup, WordItem } from '../types';
import Timer from './Timer.vue';

const props = defineProps<{
  wordGroup: WordGroup[];
  onComplete: () => void;
}>();

const selectedIndices = ref<number[]>([]);
const correctWords = ref<Set<string>>(new Set());
const animatingIndices = ref<number[]>([]);
const isAnimating = ref(false);
const finalPositions = ref<number[]>([]);

const allWords = computed(() => {
  return props.wordGroup.flatMap((group) =>
    group.words.map((word) => ({ word, group: group.groupName }))
  );
});

const shuffledWords = ref<WordItem[]>([]);

const shuffleWords = () => {
  shuffledWords.value = [...allWords.value].sort(() => Math.random() - 0.5);
};

shuffleWords();

const selectWord = (index: number) => {
  if (correctWords.value.has(shuffledWords.value[index].word) || isAnimating.value) return;

  if (selectedIndices.value.includes(index)) {
    selectedIndices.value = selectedIndices.value.filter((i) => i !== index);
  } else {
    selectedIndices.value.push(index);
  }

  if (selectedIndices.value.length === 4) {
    checkSelection();
  }
};

const checkSelection = () => {
  const selectedWords = selectedIndices.value.map((index) => shuffledWords.value[index]);
  const allSameGroup = selectedWords.every((word) => word.group === selectedWords[0].group);

  if (allSameGroup) {
    isAnimating.value = true;
    animatingIndices.value = [...selectedIndices.value];

    // Add selected words to correctWords
    selectedWords.forEach(word => correctWords.value.add(word.word));

    // Calculate final positions
    const newCorrectIndices = shuffledWords.value
      .map((word, index) => correctWords.value.has(word.word) ? index : -1)
      .filter(index => index !== -1);
    const remainingIndices = shuffledWords.value
      .map((_, i) => i)
      .filter(i => !newCorrectIndices.includes(i));
    finalPositions.value = [...newCorrectIndices, ...remainingIndices];

    setTimeout(() => {
      selectedIndices.value = [];
      animatingIndices.value = [];

      // Update shuffledWords to reflect the new order
      shuffledWords.value = finalPositions.value.map(i => shuffledWords.value[i]);

      isAnimating.value = false;

      if (correctWords.value.size === shuffledWords.value.length) {
        props.onComplete();
      }
    }, 500);
  } else {
    // Add a 200ms delay before unselecting incorrect words
    isAnimating.value = true;
    setTimeout(() => {
      selectedIndices.value = [];
      isAnimating.value = false;
    }, 200);
  }
};

const getCellClass = (index: number) => {
  const word = shuffledWords.value[index];
  if (correctWords.value.has(word.word)) {
    return 'bg-green-500 text-white';
  }
  if (selectedIndices.value.includes(index)) {
    return 'bg-yellow-300 text-gray-900';
  }
  return 'bg-gray-200 dark:bg-gray-500';
};

const getCellStyle = (index: number) => {
  if (!isAnimating.value || !animatingIndices.value.length) return {};

  const currentPosition = index;
  const newPosition = finalPositions.value.indexOf(index);

  const currentRow = Math.floor(currentPosition / 4);
  const currentCol = currentPosition % 4;
  const newRow = Math.floor(newPosition / 4);
  const newCol = newPosition % 4;

  return {
    transform: `translate(${(newCol - currentCol) * 100}%, ${(newRow - currentRow) * 100}%)`,
    zIndex: animatingIndices.value.includes(index) ? '10' : '1',
    transition: 'transform 0.5s ease-in-out',
  };
};
</script>