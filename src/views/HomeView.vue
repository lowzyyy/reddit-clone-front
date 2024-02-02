<template>
  <div
    v-if="data?.data && !authStore.authenticated"
    class="mx-auto mt-2 flex max-w-[94%] gap-2 md:hidden"
  >
    <button
      @click="showFeed = true"
      class="rounded-md p-1"
      :class="`${showFeed ? 'bg-teal-600' : 'bg-teal-900'}`"
    >
      Feed
    </button>
    <button
      @click="showFeed = false"
      class="rounded-md p-1"
      :class="`${!showFeed ? 'bg-teal-600' : 'bg-teal-900'}`"
    >
      Top Communities
    </button>
  </div>
  <div
    v-if="data && data.data"
    class="mx-auto mt-6 flex max-w-[94%] items-start justify-center border border-none border-white bg-inherit md:gap-8 lg:max-w-[80%] lg:justify-between xl:max-w-[70%] 2xl:max-w-[65%]"
  >
    <PostList v-if="showFeed" :data="data.data" type="home" />
    <HomeSide v-if="!showFeed" :top-communities="data.topCommunities" class="w-full" />
    <HomeSide :top-communities="data.topCommunities" class="hidden md:block" />
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw } from 'vue'
import { useFetchAllPosts } from '@/components/Composables/HomeComp/useFetchAllPosts'
import { watch } from 'vue'
import PostList from '@/components/CommunityView/PostList/PostList.vue'
import HomeSide from '@/components/HomeView/HomeSide.vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const { data } = useFetchAllPosts()
const showFeed = ref(true)
// watch(data, () => console.log(toRaw(data.value)))
</script>
