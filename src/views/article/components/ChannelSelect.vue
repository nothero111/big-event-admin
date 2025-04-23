<script setup>
import { artGetChannelsService } from '@/api/article.js'
import { ref } from 'vue'
const ChannelList = ref([])
const getChannelList = async () => {
  const res = await artGetChannelsService()
  ChannelList.value = res.data.data
}
getChannelList()
defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: { type: String }
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :width="width"
  >
    <!--           label是展示给用户，value提交到后台-->
    <el-option
      v-for="channel in ChannelList"
      :label="channel.cate_name"
      :value="channel.id"
      :key="channel.id"
    ></el-option>
  </el-select>
</template>

<style scoped></style>
