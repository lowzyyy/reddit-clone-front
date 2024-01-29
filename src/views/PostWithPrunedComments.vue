<template>
  <div v-if="postData === undefined" class="flex w-full justify-center p-10">
    <SpinnerStatus class="" />
  </div>
  <PostItem v-if="postData?.data" :post-data="postData?.data" class="w-full" />
  <CommentSection v-if="postData?.data" :pruned="true" />
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import useFetchPostData from '@/components/Composables/PostViewComp/useFetchPostData'
import PostItem from '@/components/CommunityView/PostList/PostItem.vue'
import CommentSection from '@/components/PostView/CommentSection/CommentSection.vue'
import SpinnerStatus from '@/components/Spinner/SpinnerStatus.vue'

defineProps<{}>()

const authStore = useAuthStore()
const route = useRoute()

const postId = computed(() => route.params.postId as string)

const { data: postData } = useFetchPostData(postId)
</script>

<style scoped></style>
