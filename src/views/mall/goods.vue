<template>
  <div class="app-container">
    <search
      :status-hidden="true"
      :export-hidden="false"
      :export-model="'goods'"
      @search="fetchData"
    />
    <el-row>
      <el-col>
        <el-button
          v-if="!isSelect"
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-plus"
          @click="handlerCreate"
        >
          添加商品
        </el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @current-change="selectCurrentRow"
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="商品名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="商品分类">
        <template slot-scope="scope">
          {{ scope.row.category_name }}
        </template>
      </el-table-column>
      <el-table-column label="成本价">
        <template slot-scope="scope">
          {{ scope.row.low_price }}
        </template>
      </el-table-column>
      <el-table-column label="原价">
        <template slot-scope="scope">
          {{ scope.row.raw_price }}
        </template>
      </el-table-column>
      <el-table-column label="现价">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="蛋壳价">
        <template slot-scope="scope">
          {{ scope.row.egg_price }}
        </template>
      </el-table-column>
      <!--<el-table-column class-name="status-col" label="状态" width="110" align="center">-->
      <!--<template slot-scope="scope">-->
      <!--<el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column align="center" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!isSelect" align="center" label="操作" width="200">
        <template slot-scope="scope">
          <div class="operation-buttons">
            <el-button type="primary" @click="edit(scope.row, scope.$index)">编辑</el-button>
            <el-button type="danger" @click="del(scope.row, scope.$index)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      class="text-left"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="fetchData"
    />

    <el-dialog
      :title="dialogStatus === 'create' ? '添加商品' : '编辑商品'"
      :visible.sync="dialogFormVisible"
      width="80%"
      @close="cancel"
    >
      <el-form
        :model="goods"
      >
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <div class="box-center">
              <el-upload
                ref="upload"
                :action="uploadApi"
                class="avatar-uploader tex-center"
                name="file"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :headers="headers"
              >
                <img v-if="goods.main_img" :src="goods.main_img" class="avatar" style="width: 100px;height: 100px;">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              <div class="text-center" style="margin-top:10px">
                上传商品方块图(像素:200 x 200)
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <div class="box-center">
              <el-upload
                :action="uploadApi"
                list-type="picture-card"
                :on-success="imgArrAdd"
                :on-remove="imgArrRemove"
                :file-list="goods.introduction_imgs"
                :headers="headers"
                :multiple="true"
              >
                <i class="el-icon-plus" />
              </el-upload>
              <div class="text-center" style="margin-top:10px">
                上传商品轮播图(像素:630 x 355)<br>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="商品名称" :label-width="formLabelWidth">
              <el-input v-model="goods.name" autocomplete="off" style="width: 195px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择商品分类" :label-width="formLabelWidth">
              <el-cascader
                v-model="goods.mall_category_id"
                :options="options"
                :props="{ expandTrigger: 'hover',value: 'id', label: 'name', checkStrictly: true,emitPath: false }"
                size="medium"
                @change="handleChange"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="成本价" :label-width="formLabelWidth">
              <el-input-number v-model="goods.low_price" :precision="2" :step="1" :min="0.00" style="width: 195px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品原价" :label-width="formLabelWidth">
              <el-input-number v-model="goods.raw_price" :precision="2" :step="1" :min="0.00" style="width: 195px;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="现价" :label-width="formLabelWidth">
              <el-input-number v-model="goods.price" :precision="2" :step="1" :min="0.00" style="width: 195px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="蛋壳价" :label-width="formLabelWidth">
              <el-input-number v-model="goods.egg_price" :precision="2" :step="1" :min="0.00" style="width: 195px;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="描述">
            <el-input v-model="goods.desc" type="textarea" />
          </el-form-item>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <div class="box-center">
              <el-upload
                :action="uploadApi"
                list-type="picture-card"
                :on-success="imgArrAddInfo"
                :on-remove="imgArrRemoveInfo"
                :file-list="goods.info_imgs"
                :headers="headers"
                :multiple="true"
              >
                <i class="el-icon-plus" />
              </el-upload>
              <div class="text-center" style="margin-top:10px">
                上传商品详情图组(像素:690 x N)<br>
              </div>
            </div>
          </el-col>
        </el-row>

        <!--<el-form-item label="商户LOGO" :label-width="formLabelWidth">-->
        <!--<el-input v-model="seller.logo" autocomplete="off"></el-input>-->
        <!--</el-form-item>-->

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="提醒 "
      :visible.sync="dialogHintVisible"
      class="text-center"
      center
      width="30%"
    >
      <span class="text-center">
        此操作会直接删除商品，可能会产生数据关联错误，确定删除吗？
      </span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogHintVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="delData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getList, postAdd, putEdit, delItem } from '@/api/mallGoods'
import { getList as categoryGetList } from '@/api/mallCategory'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Search from '@/components/Search'
import { getToken } from '@/utils/auth'

export default {
  // name: 'Goods',
  components: { Pagination, Search },
  props: {
    isSelect: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadApi: 'https://api.caidan888.com/admin/v1/upload',
      switchLoading: true,
      selectRow: {},
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        search_value: '',
        status: null,
        start_time: '',
        end_time: ''
      },
      options: null,
      sellers: null,
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogHintVisible: false,
      dialogVisible: false,
      dialogStatus: 'create',
      goods: {
        id: 0,
        name: '',
        mall_category_id: 0,
        raw_price: '0.00',
        price: '0.00',
        egg_price: '0.00',
        main_upload_id: 0,
        introduction_upload_ids: '',
        info_upload_ids: '',
        main_img: '',
        introduction_imgs: [],
        info_imgs: [],
        low_price: '0.00',
        desc: ''
      },
      tag: '',
      formLabelWidth: '120px'
    }
  },
  computed: {
    headers() {
      return {
        Authorization: `Bearer ${getToken()}`
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.data
        this.listLoading = false
        this.switchLoading = false
      })
    },
    // switchUp(id) {
    //   this.switchLoading = true
    //   upCheck({ id: id }).then(res => {
    //     this.switchLoading = false
    //   })
    // },
    cancel() {
      this.dialogFormVisible = false
      this.getList()
    },
    fetchData(query) {
      this.listQuery = Object.assign(this.listQuery, query)
      console.log(this.listQuery)
      this.getList()
    },
    fetchCategories() {
      categoryGetList().then(res => {
        this.options = res.data
      })
    },
    handlerCreate() {
      this.goods = {
        id: 0,
        name: '',
        mall_category_id: 0,
        raw_price: '0.00',
        price: '0.00',
        egg_price: '0.00',
        main_upload_id: 0,
        introduction_upload_ids: '',
        info_upload_ids: '',
        is_free_shipping: 0,
        main_img: '',
        introduction_imgs: [],
        info_imgs: [],
        low_price: '0.00',
        desc: ''
      }
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.fetchCategories()
    },
    createData() {
      this.goods.introduction_imgs = this.goods.introduction_imgs.map(img => {
        return img.upload_id
      })
      this.goods.info_imgs = this.goods.info_imgs.map(img => {
        return img.upload_id
      })
      console.log(this.goods)
      postAdd(this.goods).then(res => {
        if (res.code === 200) {
          this.dialogFormVisible = false
          this.getList()
        }
      })
    },
    edit(item, _index) {
      console.log(item, _index)
      this.dialogFormVisible = true
      this.dialogStatus = 'update'

      this.goods = item
      this.fetchCategories()
    },
    del(item, _index) {
      this.dialogHintVisible = true
      this.goods = item
    },
    updateData() {
      this.goods.introduction_imgs = this.goods.introduction_imgs.map(img => {
        return img.upload_id
      })
      this.goods.info_imgs = this.goods.info_imgs.map(img => {
        return img.upload_id
      })
      putEdit(this.goods).then(res => {
        if (res.code === 200) {
          this.dialogFormVisible = false
          this.getList()
        }
      })
    },
    delData() {
      delItem(this.goods).then(res => {
        if (res.code === 200) {
          this.dialogHintVisible = false
          this.getList()
        }
      })
    },
    handleAvatarSuccess(res) {
      this.$loading().close()
      console.log(res)
      this.goods.main_img = res.data.url
      this.goods.main_upload_id = res.data.id
    },
    handleChange(val) {
      this.goods.mall_category_id = val
    },
    imgArrAdd(res, file) {
      if (res.code === 200) {
        this.goods.introduction_imgs.push({ upload_id: res.data.id, url: res.data.url })
      }
      console.log(file)
      console.log(this.goods.introduction_imgs)
    },
    imgArrAddInfo(res, file) {
      if (res.code === 200) {
        this.goods.info_imgs.push({ upload_id: res.data.id, url: res.data.url })
      }
      console.log(file)
      console.log(this.goods.info_imgs)
    },
    imgArrRemove(file) {
      console.log(file)
      this.goods.introduction_imgs = this.goods.introduction_imgs.filter(ele => {
        return file.upload_id !== ele.upload_id
      })
      console.log(this.goods.introduction_imgs)
    },
    imgArrRemoveInfo(file) {
      console.log(file)
      this.goods.info_imgs = this.goods.info_imgs.filter(ele => {
        return file.upload_id !== ele.upload_id
      })
      console.log(this.goods.info_imgs)
    },
    selectCurrentRow(row) {
      this.$emit('select', row)
    },
    loadData() {
      this.getList()
    }

  }
}
</script>
<style lang="scss">
.box-center {
  margin: 0 auto;
  display: table;
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader .el-upload .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    // width: 178px;
    height: 178px;
    display: block;
    object-fit: cover;
  }
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
