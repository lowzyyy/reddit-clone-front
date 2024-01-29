<template>
  <div
    v-if="data && data.data"
    class="mx-auto mt-6 flex max-w-[94%] items-start justify-center border border-none border-white bg-slate-950 md:gap-8 lg:max-w-[80%] lg:justify-between xl:max-w-[70%] 2xl:max-w-[65%]"
  >
    <PostList :data="data.data" type="home" />
    <HomeSide :top-communities="data.topCommunities" class="hidden md:block" />
  </div>
</template>

<script setup lang="ts">
import { toRaw } from 'vue'
import { useFetchAllPosts } from '@/components/Composables/HomeComp/useFetchAllPosts'
import { watch } from 'vue'
import PostList from '@/components/CommunityView/PostList/PostList.vue'
import HomeSide from '@/components/HomeView/HomeSide.vue'

const { data } = useFetchAllPosts()
// watch(data, () => console.log(toRaw(data.value)))
</script>
