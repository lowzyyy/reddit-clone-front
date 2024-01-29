<template>
  <div
    v-if="!topCommunities"
    class="relative w-[300px] rounded-md border border-teal-800 bg-teal-950 px-5 py-4 text-base"
  >
    <div
      :style="{ backgroundImage: 'url(/img/home_side_banner.png)' }"
      class="absolute left-0 top-0 h-8 w-full rounded-t-md bg-cover"
    ></div>

    <div class="flex items-end gap-4">
      <img src="/img/reddit_little_man.png" alt="reddit_little_man image" class="z-[5] h-16" />
      <h2 class="text-2xl">Home</h2>
    </div>

    <p class="mt-4 text-sm font-semibold">
      Your personal Reddit frontpage. Come here to check in with your favorite communities.
    </p>
  </div>
  <div
    v-else
    class="relative w-[300px] rounded-md border border-teal-800 bg-teal-950 px-5 py-4 text-base"
  >
    <h2 class="text-gray-200">POPULAR COMMUNITIES</h2>
    <ul class="mt-2 flex flex-col">
      <li
        v-for="(community, index) in topCommunities"
        :key="community.name"
        class="cursor-pointer hover:bg-teal-900"
      >
        <RouterLink
          :to="{ name: 'communityview', params: { communityName: community.name } }"
          class="flex items-center gap-4 p-2"
        >
          <span
            class="flex h-8 w-8 items-center justify-center rounded-full bg-rose-800 bg-cover bg-center"
            :style="{
              backgroundImage: `${
                validBackgrounds[index]
                  ? `url(${BACKEND_API}/getCommunityImage?term=${community.name}&type=icon)`
                  : 'url()'
              } `
            }"
            ><PhPlanet v-if="!validBackgrounds[index]" size="20"
          /></span>
          <div class="flex flex-col">
            <span class="text-gray-300">r/{{ community.name }}</span>
            <span class="text-xs text-gray-400"
              >{{ community.members }} {{ `${community.members > 1 ? 'members' : 'member'}` }}</span
            >
          </div>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { BACKEND_API, checkImage } from '@/helpers/globalHelpers'
import { PhPlanet } from '@phosphor-icons/vue'
import { onBeforeMount, ref, toRaw, watch } from 'vue'

const { topCommunities } = defineProps<{
  topCommunities: { name: string; members: number }[] | null
}>()

let validBackgrounds = ref<Array<boolean>>([])

onBeforeMount(async () => {
  if (topCommunities) {
    const tmpArr = new Array(topCommunities.length)
    await Promise.all(
      topCommunities.map(async (comm, index) => {
        tmpArr[index] = await checkImage(
          `${BACKEND_API}/getCommunityImage?term=${comm.name}&type=icon`
        )
      })
    )
    validBackgrounds.value = tmpArr
  }
})
</script>

<style scoped></style>
