<template>
  <form @submit.prevent="submitBoard" class="space-y-6 max-w-2xl mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">Add New Board</h2>

    <div class="space-y-4">
      <input v-model="newBoard.path" placeholder="Board Path" class="w-full p-2 border rounded"
        :class="{ 'border-red-500': errors.path }" />
      <ErrorMessage :error="errors.path" />

      <input v-model="newBoard.name" placeholder="Board Name" class="w-full p-2 border rounded"
        :class="{ 'border-red-500': errors.name }" />
      <ErrorMessage :error="errors.name" />

      <textarea v-model="newBoard.description" placeholder="Board Description" class="w-full p-2 border rounded"
        rows="3" :class="{ 'border-red-500': errors.description }"></textarea>
      <ErrorMessage :error="errors.description" />
    </div>

    <div class="space-y-6">
      <h3 class="text-xl font-semibold">Word Groups</h3>
      <div v-for="(group, groupIndex) in newBoard.wordGroups" :key="groupIndex" class="p-4 border rounded space-y-3">
        <div class="font-medium">Group {{ groupIndex + 1 }}</div>
        <input v-model="group.groupName" :placeholder="`Group ${groupIndex + 1} Name`" class="w-full p-2 border rounded"
          :class="{ 'border-red-500': errors[`wordGroups.${groupIndex}.groupName`] }" />
        <ErrorMessage :error="errors[`wordGroups.${groupIndex}.groupName`]" />

        <div class="grid grid-cols-2 gap-2">
          <div v-for="(_word, wordIndex) in group.words" :key="wordIndex">
            <input v-model="group.words[wordIndex]" :placeholder="`Word ${wordIndex + 1}`"
              class="w-full p-2 border rounded"
              :class="{ 'border-red-500': errors[`wordGroups.${groupIndex}.words.${wordIndex}`] }" />
            <ErrorMessage :error="errors[`wordGroups.${groupIndex}.words.${wordIndex}`]" />
          </div>
        </div>
      </div>
    </div>

    <button type="submit" class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Add
      Board</button>
  </form>
</template>

<script setup lang="ts">
import ErrorMessage from "../components/ErrorMessage.vue"
import { array, flatten, length, maxLength, minLength, object, pipe, regex, safeParse, string } from 'valibot';
import { onMounted, ref } from 'vue';
import { addBoard } from '../data/list';
import { Board } from '../types';

const boardSchema = object({
  path: pipe(string(), minLength(1, 'Path is required'), maxLength(50, 'Path must be 50 characters or less'), regex(/^[a-z0-9-]+$/, 'Path can only contain lowercase letters, numbers, and hyphens')),
  name: pipe(string(), minLength(1, 'Name is required'), maxLength(100, 'Name must be 100 characters or less')),
  description: pipe(string(), maxLength(500, 'Description must be 500 characters or less')),
  wordGroups: pipe(
    array(
      object({
        groupName: pipe(string(), minLength(1, 'Group name is required'), maxLength(50, 'Group name must be 50 characters or less')),
        words: pipe(
          array(pipe(string(), minLength(1, 'Word is required'), maxLength(30, 'Word must be 30 characters or less'))),
          length(4, 'Each group must have 4 words'),
        )
      })
    ),
    minLength(4, 'There must be 4 word groups'),
    maxLength(4, 'There must be 4 word groups')
  )
});

const newBoard = ref<Omit<Board, 'createdAt' | 'updatedAt'>>({
  path: '',
  name: '',
  description: '',
  wordGroups: [],
});

const errors = ref<Record<string, string[] | undefined>>({});

onMounted(() => {
  newBoard.value.wordGroups = Array(4).fill(null).map(() => ({
    groupName: '',
    words: Array(4).fill('')
  }));
});

async function submitBoard() {
  const result = safeParse(boardSchema, newBoard.value);

  if (!result.success) {
    errors.value = flatten(result.issues).nested ?? {}
    return;
  }

  errors.value = {};  // Clear any previous errors


  const success = await addBoard(newBoard.value);
  if (success) {
    console.log('Board added successfully');
    alert('Board added successfully!');
    // Reset form
    newBoard.value = {
      path: '',
      name: '',
      description: '',
      wordGroups: Array(4).fill(null).map(() => ({
        groupName: '',
        words: Array(4).fill('')
      }))
    };
  } else {
    console.error('Failed to add board');
    alert('Failed to add board. Please try again.');
  }
}
</script>