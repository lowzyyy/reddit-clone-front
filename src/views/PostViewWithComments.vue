<template>
  <div v-if="postData === undefined" class="flex w-full justify-center p-10">
    <SpinnerStatus class="fill-teal-700" />
  </div>
  <PostItem v-if="postData?.data" :post-data="postData?.data" class="w-full"
    ><PostComment v-if="authStore.authenticated" :post-id="postId" class="mt-8"
  /></PostItem>
  <CommentSection v-if="postData?.data" :pruned="false" />
  <div v-if="postData !== undefined && !postData?.data" class="p-6 text-center text-2xl">
    Post does not exist!
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PostItem from '@/components/CommunityView/PostList/PostItem.vue'
import useFetchPostData from '@/components/Composables/PostViewComp/useFetchPostData'
import CommentSection from '@/components/PostView/CommentSection/CommentSection.vue'
import PostComment from '@/components/PostView/PostComment.vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import SpinnerStatus from '@/components/Spinner/SpinnerStatus.vue'

defineProps<{}>()

const authStore = useAuthStore()
const route = useRoute()

const postId = computed(() => route.params.postId as string)

const { data: postData } = useFetchPostData(postId)
</script>

<style scoped></style>
