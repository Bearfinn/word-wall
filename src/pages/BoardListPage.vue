<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Available Boards</h1>
      <button @click="createNewBoard"
        class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-600 transition duration-150 ease-in-out">
        Create New Board </button>
    </div>
    <div v-if="loading" class="text-center">
      <p class="text-gray-400">Loading boards...</p>
    </div>
    <div v-else-if="boards.length > 0" class="-ml-4">
      <ul class="divide-y divide-y-gray-200">
        <li v-for="board in paginatedBoards" :key="board.path" class="bg-white">
          <RouterLink v-if="board.path" :to="{ name: 'Board', params: { boardId: board.path } }"
            class="p-4 hover:bg-gray-50 transition duration-150 ease-in-out flex justify-between items-center rounded-lg">
            <div>
              <div>
                {{ board.name }}
              </div>
              <div class="text-gray-500 text-sm">/{{ board.path }}</div>
            </div>
            <div class="flex flex-col items-end">
              <div v-if="board.updatedAt" class="text-sm text-gray-500">created {{ new Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium', timeStyle: 'short'
              }).format(board.updatedAt) }}</div>
              <div class="text-sm">by anonymous</div>
            </div>
          </RouterLink>
        </li>
      </ul>
      <div class="mt-6 flex justify-between items-center">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50">
          < </button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50">
              >
            </button>
      </div>
    </div>
    <p v-else class="text-gray-400">No boards available.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { getBoardList } from '../data/list';
import { Board } from "../types"

const boards = ref<Board[]>([]);
const loading = ref(true);
const router = useRouter();
const currentPage = ref(1);
const itemsPerPage = 10;

const fetchBoards = async () => {
  try {
    loading.value = true;
    const data = await getBoardList();
    console.log(data)
    boards.value = [...data];
  } catch (error) {
    console.error('Error fetching boards:', error);
  } finally {
    loading.value = false;
  }
};

const totalPages = computed(() => Math.ceil(boards.value.length / itemsPerPage));

const paginatedBoards = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const result = boards.value.slice(start, end);
  console.log(result.length)
  return result;
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const createNewBoard = () => {
  router.push({ name: 'Add Board' });
};

onMounted(() => {
  fetchBoards();
});
</script>