<template>
  <div class="grid grid-cols-4 gap-2 relative">
    <WordWallCell v-for="(word, index) in shuffledWords" :key="word.word" @click="!isAnimating && selectWord(index)"
      :word="word.word" :index="index" :is-selected="selectedIndices.includes(index)"
      :is-correct="correctWords.has(word.word)" :is-animating="animatingIndices.includes(index)"
      :target-index="finalPositions.indexOf(index)" />
    <div v-for="group, groupIndex in correctGroupNames" :key="group" class="absolute inset-x-0 flex justify-center"
      :style="{ top: `calc(${25 * groupIndex}% - 16px)` }">
      <div
        :class="['text-center w-fit font-bold rounded-full bg-white border-2 px-2 py-1 min-w-16', colorSet[groupIndex].border]">
        {{ group }}
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { WordGroup, WordItem } from '../types';
import { colorSet } from '../constants/colorSet';
import WordWallCell from './WordWallCell.vue';

const props = defineProps<{
  wordGroup: WordGroup[];
  onComplete: () => void;
}>();

const selectedIndices = ref<number[]>([]);
const correctWords = ref<Set<string>>(new Set());
const correctGroupNames = ref<string[]>([]);
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

    // Add selected groups to correctGroups
    correctGroupNames.value.push(selectedWords[0].group)

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

</script>