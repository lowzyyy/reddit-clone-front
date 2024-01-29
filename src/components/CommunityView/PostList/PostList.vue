<template>
  <div class="w-[600px] border-none border-white md:w-[600px] lg:w-[800px]">
    <PostItem
      v-for="post in data"
      :key="post.id"
      :post-data="post"
      :is-in-list="true"
      class="mt-6 block w-full first:mt-0"
    />
    <div
      v-if="data.length === 0 && type === 'subreddit'"
      class="rounded-md bg-teal-950 p-4 text-center text-lg"
    >
      There are no posts in this subreddit. <br />
      Be the first to post!
    </div>
    <div
      v-else-if="data.length === 0 && type === 'home'"
      class="rounded-md bg-teal-950 p-4 text-center text-lg"
    >
      Follow some communities to get the newest posts.
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TPost } from '@/components/Composables/CommunityViewComp/useFetchCommunityPosts'
import PostItem from './PostItem.vue'
defineProps<{ data: TPost[]; type: 'home' | 'subreddit' }>()
</script>

<style scoped></style>
