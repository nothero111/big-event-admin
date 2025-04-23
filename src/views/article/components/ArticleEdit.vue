<script setup>
import { ref } from 'vue'
import ChannelSelect from '@/views/article/components/ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artEditService,
  artGetDetailService,
  artPublishService
} from '@/api/article.js'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request.js'
import axios from 'axios'

const visibleDrawer = ref(false)
const emit = defineEmits(['success'])
const defaultForm = {
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
}
// 准备数据
const formModel = ref({
  ...defaultForm
})

const editorRef = ref(null)

//提交

const onPublish = async (state) => {
  formModel.value.state = state
  // 要将对象转为formData对象
  const fd = new FormData()
  for (const key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  // 发请求
  if (formModel.value.id) {
    await artEditService(fd)
    ElMessage.success('编辑成功')
    visibleDrawer.value = false
    // 添加成功后通知父组件
    emit('success', 'edit')
  } else {
    await artPublishService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    // 添加成功后通知父组件
    emit('success', 'add')
  }
}

// 图片上传的相关逻辑
const imgUrl = ref('')
const onselectFile = (file) => {
  imgUrl.value = URL.createObjectURL(file.raw) // 预览图片
  formModel.value.cover_img = file.raw // 将图片文件保存到表单数据中
}
// 有组件向外暴露一个方法open，根据open的参数，来区分是添加还是编辑
// open({})=> 表单无需渲染，说明是添加
// open({id，...,...})=> 表单需要渲染，说明是编辑
// open调用后可以打开弹窗
const open = async (row) => {
  visibleDrawer.value = true
  if (row.id) {
    //如果id存在可以根据id去发送请求详情
    const res = await artGetDetailService(row.id)
    console.log(res)
    formModel.value = res.data.data
    imgUrl.value = baseURL + formModel.value.cover_img
    //  图片提交给后台需要是file对象格式，
    //  需要把网络图片地址转为file对象存储起来
    formModel.value.cover_img = await imageUrlFileObject(
      imgUrl.value,
      formModel.value.cover_img
    )
  } else {
    // 如果id不存在，说明是添加
    formModel.value = { ...defaultForm }
    // 图片上传，富文本没有重置
    imgUrl.value = ''
    editorRef.value.setHTML('')
  }
}

async function imageUrlFileObject(imageUrl, filename) {
  // 使用Axios下载图片数据
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
  // 将下载的数据转换为Blob对象
  const blob = new Blob([response.data], {
    type: response.headers['content-type']
  })
  // 创建file对象
  return new File([blob], filename, { type: blob.type })
}

defineExpose({
  open
})
</script>
<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!--  发表文章-->
    <el-form v-model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入文章标题" />
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <!--        下面封装成组件，属性变成了数据，需要对数据进行逻辑处理才能实现想要的功能-->
        <channel-select
          v-model="formModel.cate_id"
          width="150px"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <!--        此处需要关闭element的自动上传-->
        <!--        此处仅需要做预览即可-->
        <!--        语法 URL.createObjectURL(...)创建本地预览的地址-->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onselectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" alt="" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="edit">
          <quill-editor
            ref="editorRef"
            v-model:content="formModel.content"
            contentType="html"
            theme="snow"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">存入草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style scoped lang="scss">
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.edit {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
