<template>
  <div class="detail-form">
    <div class="detail-body">
      <el-form
        ref="form"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 400px;"
        class="box-center"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" placeholder="客户名称" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="temp.address" placeholder="客户地址" />
        </el-form-item>
      </el-form>
      <detail-section
        key="1"
        ref="sectionContacts"
        title="联系人"
        :fields="contactsFields"
        :data-list="contactsData"
      />
      <detail-section
        key="2"
        ref="sectionInvoice"
        title="开票信息"
        :fields="invoiceFields"
        :data-list="invoiceData"
        style="margin-top: 40px"
      />
      <detail-section
        key="3"
        ref="sectionBank"
        title="银行账户"
        :fields="bankFields"
        :data-list="settleData"
        style="margin-top: 40px"
      />
    </div>
  </div>
</template>

<script>
import DetailSection from './DetailSection'
export default {
  name: 'DetailForm',
  components: {
    DetailSection
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      temp: {
        name: '',
        address: ''
      },
      rules: {},
      syncCount: 3,
      contacts: null,
      banks: null,
      invoices: null
    }
  },
  computed: {
    contactsFields() {
      return [
        {
          name: '姓名',
          key: 'name'
        },
        {
          name: '职位',
          key: 'position'
        },
        {
          name: '性别',
          key: 'gender'
        },
        {
          name: '手机号',
          key: 'phone'
        },
        {
          name: '邮箱',
          key: 'email'
        },
        {
          name: '操作',
          key: 'operation'
        }
      ]
    },
    invoiceFields() {
      return [
        {
          name: '开票名称',
          key: 'name'
        },
        {
          name: '纳税人识别号',
          key: 'tin'
        },
        {
          name: '地址、电话',
          key: 'address_phone'
        },
        {
          name: '开户行及账号',
          key: 'bank_account'
        },
        {
          name: '操作',
          key: 'operation'
        }
      ]
    },
    bankFields() {
      return [
        // {
        //   name: '结算账户',
        //   key: 'name'
        // },
        {
          name: '账户名称',
          key: 'bank_name'
        },
        {
          name: '开户行',
          key: 'bank_name'
        },
        {
          name: '银行账号',
          key: 'bank_account'
        },
        {
          name: '操作',
          key: 'operation'
        }
      ]
    },
    contactsData() {
      return (this.item && this.item.row.contacts) || []
    },
    settleData() {
      return (this.item && this.item.row.settle) || []
    },
    invoiceData() {
      return (this.item && this.item.row.invoice) || []
    }
  },
  methods: {
    reloadData() {
      this.$nextTick(() => {
        this.$refs['sectionContacts'].reloadData()
        this.$refs['sectionBank'].reloadData()
        this.$refs['sectionInvoice'].reloadData()
        this.temp.name = this.item && this.item.row.name
        this.temp.address = this.item && this.item.row.address
      })
    },
    commitData(fn) {
      const data = {
        name: this.temp.name,
        address: this.temp.address,
        contacts: this.contacts,
        invoice: this.invoices,
        settle: this.banks
      }
      fn(data)
    },
    submitData(fn) {
      this.count = 3
      this.$refs['sectionContacts'].submitData(data => {
        this.contacts = data
        this.count--
        if (this.count === 0) {
          this.commitData(fn)
        }
      })
      this.$refs['sectionBank'].submitData(data => {
        this.banks = data
        this.count--
        if (this.count === 0) {
          this.commitData(fn)
        }
      })
      this.$refs['sectionInvoice'].submitData(data => {
        this.invoices = data
        this.count--
        if (this.count === 0) {
          this.commitData(fn)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.detail-form {
  width: 100%;
  height: calc(100vh - 180px);
  position: relative;
  overflow: auto;
  .detail-body {
    width: 60%;
    margin: 0 auto;
    // overflow: auto;
  }
}
</style>
