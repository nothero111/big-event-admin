<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { artDelChannelsService, artGetChannelsService } from '@/api/article.js'
import { Delete, Edit } from '@element-plus/icons-vue'
import channelEdit from './components/ChannelEdit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const channelList = ref([])
const loading = ref(false)
const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  loading.value = false
}
getChannelList()
const onEditChannel = (row) => {
  dialog.value.open(row)
}
const onDelChannel = async (row) => {
  await ElMessageBox.confirm('确定删除该分类吗？', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDelChannelsService(row.id)
  ElMessage.success('删除成功')
  await getChannelList()
}
const onAddChannel = () => {
  dialog.value.open({})
}
const dialog = ref()
const onSuccess = () => {
  getChannelList()
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra
      ><el-button @click="onAddChannel"> 添加文章 </el-button></template
    >
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row, $index }">
          <el-button
            :icon="Edit"
            circle
            type="primary"
            plain
            @click="onEditChannel(row, $index)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            type="danger"
            plain
            @click="onDelChannel(row, $index)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据"></el-empty>
      </template>
    </el-table>
    <channelEdit ref="dialog" @success="onSuccess"></channelEdit>
  </page-container>
</template>

<style lang="scss" scoped></style>
