<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelSelect from '@/views/article/components/ChannelSelect.vue'
import { artGetListService } from '@/api/article.js'
import { formatTime } from '@/utils/format.js'
const params = ref({
  pagenum: 1, // 当前页
  pagesize: 5, // 当前生效页条数
  cate_id: '',
  state: ''
})
const articleList = ref([123])
const total = ref(0) // 默认总条数为0
const loading = ref(false) // 默认加载状态为false
// 获取文章列表
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total

  loading.value = false
}
getArticleList()
const onEditArticle = (row) => {
  console.log(row)
}
const onDeleteArticle = (row) => {
  console.log(row)
}

// 处理分页逻辑
const onSizeChange = (val) => {
  // 条数发生变化,原本访问的当前页的数据可能对不上号
  // 所以从新从第一页渲染即可
  params.value.pagenum = 1
  params.value.pagesize = val
  // 基于新的数据来渲染
  getArticleList()
}
const onCurrentChange = (val) => {
  params.value.pagenum = val
  getArticleList()
}
// 搜索逻辑
const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}

//重置逻辑
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra><el-button> 添加文章 </el-button></template>
    <!--    表单区域-->
    <el-form inline>
      <el-form-item label="文章分类：">
        <ChannelSelect v-model="params.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select v-model="params.state">
          <!--          后台标记发布状态，就是通过中文标记，已发布/草稿-->
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!--    表格区域-->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            circle
            plain
            type="primary"
            :icon="Edit"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            circle
            plain
            type="danger"
            :icon="Delete"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页区域-->
    <el-pagination
      :current-page="params.pagenum"
      :page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      layout="jumper, total, sizes, prev, pager, next"
      :total="articleList.length"
      style="margin-top: 20px; justify-content: flex-end"
    />
  </page-container>
</template>

<style scoped></style>
