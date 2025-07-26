<template>

  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.nickname"
        clearable
        class="filter-item"
        style="width: 160px;"
        :placeholder="$t('mall_order.placeholder.filter_nickname')"
      />
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

    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      style="width: 100%"
    >
      <el-table-column prop="order_date" label="日期" width="100" />
      <el-table-column prop="order_count" label="订单数" />
      <el-table-column prop="user_count" label="下单用户" />
      <el-table-column prop="normal_amount" label="实际收入" />
      <el-table-column prop="refund_amount" label="退款金额" />
      <el-table-column prop="total_water_count" label="订水量（桶）" />
      <el-table-column align="center" :label="$t('mall_order.table.actions')" width="150" class-name="oper">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDetail(scope.row)">{{
            $t('app.button.detail')
          }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

  </div>
</template>

<script>
import { statOrder } from '@/api/stat'
import Pagination from '@/components/Pagination/index.vue'

export default {
  components: { Pagination },
  data() {
    return {
      total: 0,
      listLoading: true,
      dateRange: null, // [开始时间, 结束时间]
      list: [],
      timeArray: [],
      listQuery: {
        page: 1,
        limit: 20,
        nickname: undefined
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
      this.listLoading = true
      if (this.timeArray && this.timeArray.length === 2) {
        this.listQuery.start = this.timeArray[0]
        this.listQuery.end = this.timeArray[1]
      } else {
        this.listQuery.start = null
        this.listQuery.end = null
      }
      statOrder(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    handleDetail(row) {
      this.$router.push({ path: '/mall/order', query: { order_date: row.order_date }})
    }
  }
}
</script>

