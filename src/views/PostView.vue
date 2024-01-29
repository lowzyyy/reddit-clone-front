<template>
  <div
    class="mx-auto mt-6 flex max-w-[94%] items-start gap-6 border border-none border-white bg-inherit lg:max-w-[85%] lg:justify-between xl:max-w-[70%] 2xl:max-w-[65%]"
  >
    <div class="w-full rounded-md bg-teal-950 xl:w-[800px]">
      <RouterView></RouterView>
    </div>
    <CommunityInfo v-if="communityData?.data" :data="communityData.data" class="hidden md:block" />
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
// components
import CommunityInfo from '@/components/CommunityView/CommunityInfo/CommunityInfo.vue'

// composables
import useFetchCommunityData from '@/components/Composables/CommunityViewComp/useFetchCommunityData'
import { postIdKey } from '@/helpers/globalHelpers'

const authStore = useAuthStore()
const route = useRoute()
const postId = computed(() => route.params.postId as string)
const community = computed(() => route.params.communityName as string)

const { data: communityData } = useFetchCommunityData(community)
provide(postIdKey, postId.value)
</script>

<style scoped></style>
