<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-width="300px">
      <el-form-item :label="$t('config_gift.form.ticket')" prop="litemall_gift_ticket">
        <el-input v-model="dataForm.litemall_gift_ticket" />
      </el-form-item>
      <el-form-item :label="$t('config_gift.form.referrer_count')" prop="litemall_gift_referrer_count">
        <el-input v-model="dataForm.litemall_gift_referrer_count" />
      </el-form-item>
      <el-form-item :label="$t('config_gift.form.new_user_count')" prop="litemall_gift_new_user_count">
        <el-input v-model="dataForm.litemall_gift_new_user_count" />
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">{{ $t('app.button.cancel') }}</el-button>
        <el-button type="primary" @click="update">{{ $t('app.button.confirm') }}</el-button>
      </el-form-item>
    </el-form></div>
</template>

<script>
import { listGift, updateGift } from '@/api/config'

export default {
  name: 'ConfigGift',
  data() {
    return {
      dataForm: {
        litemall_gift_ticket: 0,
        litemall_gift_referrer_count: 0,
        litemall_gift_new_user_count: 0
      },
      rules: {
        litemall_gift_ticket: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        litemall_gift_referrer_count: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        litemall_gift_new_user_count: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init: function() {
      listGift().then(response => {
        this.dataForm = response.data.data
      })
    },
    cancel() {
      this.init()
    },
    update() {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.doUpdate()
      })
    },
    doUpdate() {
      updateGift(this.dataForm)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '贈送参数配置成功'
          })
        })
        .catch(response => {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg
          })
        })
    }
  }
}
</script>
<style scoped>
  .input-width {
    width: 50%;
  }
  .info {
    margin-left: 15px;
  }
</style>
