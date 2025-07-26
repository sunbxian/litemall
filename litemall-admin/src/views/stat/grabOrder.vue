<template>

  <div class="app-container">
    <el-date-picker
      v-model="timeArray"
      type="datetimerange"
      value-format="yyyy-MM-dd HH:mm:ss"
      class="filter-item"
      :range-separator="$t('mall_order.text.date_range_separator')"
      :start-placeholder="$t('mall_order.placeholder.filter_time_start')"
      :end-placeholder="$t('mall_order.placeholder.filter_time_end')"
      :picker-options="pickerOptions"
    />

    <el-button
      v-permission="['GET /admin/order/list']"
      class="filter-item"
      type="primary"
      icon="el-icon-search"
      @click="handleFilter"
    >{{ $t('app.button.search') }}
    </el-button>

    <el-table
      :data="users"
      border
      style="width: 100%"
    >
      <el-table-column prop="grab_user_id" label="用户 ID" width="100" />
      <el-table-column prop="nickname" label="配送员" />
      <el-table-column prop="total_grab_orders" label="接单数" />
      <el-table-column prop="total_water_delivered" label="送水量（桶）" />
      <el-table-column align="center" :label="$t('mall_order.table.actions')" width="200" class-name="oper">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDetail(scope.row)">{{ $t('app.button.detail') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { statGrabOrder } from '@/api/stat'

export default {
  data() {
    return {
      dateRange: null, // [开始时间, 结束时间]
      users: [],
      timeArray: [],
      listQuery: {

      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleFilter() {
      this.getList()
    },
    getList() {
      if (this.timeArray && this.timeArray.length === 2) {
        this.listQuery.start = this.timeArray[0]
        this.listQuery.end = this.timeArray[1]
      } else {
        this.listQuery.start = null
        this.listQuery.end = null
      }
      statGrabOrder(this.listQuery).then(response => {
        this.users = response.data.data.rows
      })
    },
    handleDetail(row) {
      this.$router.push({ path: '/stat/grabOrderDetail', query: { id: row.grab_user_id }})
    }
  }
}
</script>

