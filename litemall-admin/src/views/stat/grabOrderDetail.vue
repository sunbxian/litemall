<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.nickname"
        clearable
        class="filter-item"
        style="width: 160px;"
        :placeholder="$t('mall_order.placeholder.filter_nickname')"
      />
      <el-input
        v-model="listQuery.grabName"
        clearable
        class="filter-item"
        style="width: 160px;"
        :placeholder="$t('mall_order.placeholder.filter_grab_name')"
      />
      <el-input
        v-model="listQuery.consignee"
        clearable
        class="filter-item"
        style="width: 160px;"
        :placeholder="$t('mall_order.placeholder.filter_consignee')"
      />
      <el-input
        v-model="listQuery.orderSn"
        clearable
        class="filter-item"
        style="width: 160px;"
        :placeholder="$t('mall_order.placeholder.filter_order_sn')"
      />
      <el-date-picker
        v-model="listQuery.timeArray"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        class="filter-item"
        :range-separator="$t('mall_order.text.date_range_separator')"
        :start-placeholder="$t('mall_order.placeholder.filter_time_start')"
        :end-placeholder="$t('mall_order.placeholder.filter_time_end')"
        :picker-options="pickerOptions"
      />
      <el-select
        v-model="listQuery.orderStatusArray"
        multiple
        style="width: 200px"
        class="filter-item"
        :placeholder="$t('mall_order.placeholder.filter_order_status')"
      >
        <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value" />
      </el-select>
      <el-select
        v-model="listQuery.typeArray"
        multiple
        style="width: 200px"
        class="filter-item"
        :placeholder="$t('mall_order.placeholder.filter_type')"
      >
        <el-option v-for="(key, value) in typeMap" :key="key" :label="key" :value="value" />
      </el-select>
      <el-input
        v-model="listQuery.ticketCount"
        clearable
        class="filter-item"
        style="width: 160px;"
        :placeholder="$t('mall_order.placeholder.filter_ticket_count')"
      />
      <el-button
        v-permission="['GET /admin/order/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >{{ $t('app.button.search') }}
      </el-button>
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >{{ $t('app.button.download') }}
      </el-button>
    </div>

    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="$t('app.message.list_loading')"
      border
      fit
      highlight-current-row
    >

      <el-table-column type="expand">
        <template slot-scope="props">
          <div v-for="item in props.row.goodsVoList" :key="item.id" class="order-goods">
            <div class="picture">
              <img :src="item.picUrl" width="40">
            </div>
            <div class="name">
              {{ $t('mall_order.text.expand_goods_name', {goods_name: item.goodsName}) }}
            </div>
            <div class="spec">
              {{ $t('mall_order.text.expand_specifications', {specifications: item.specifications.join('-')}) }}
            </div>
            <div class="price">
              {{ $t('mall_order.text.expand_unit_price', {price: item.price}) }}
            </div>
            <div class="num">
              {{ $t('mall_order.text.expand_number', {number: item.number}) }}
            </div>
            <div class="price">
              {{ $t('mall_order.text.expand_subtotal_price', {price: item.price * item.number}) }}
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="120" :label="$t('mall_order.table.order_sn')" prop="orderSn" />

      <el-table-column align="center" :label="$t('mall_order.table.avatar')" width="80">
        <template slot-scope="scope">
          <el-avatar :src="scope.row.userAvatar" />
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('mall_order.table.user_name')" prop="userName" />

      <el-table-column align="center" :label="$t('mall_order.table.add_time')" prop="addTime" min-width="100">
        <template slot-scope="scope">
          {{ (scope.row.addTime || '').substring(0, 10) }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('mall_order.table.order_status')" prop="orderStatus">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.orderStatus | orderStatusFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('mall_order.table.order_price')" prop="orderPrice">
        <template slot-scope="scope">
          {{ scope.row.orderPrice }} 元
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('mall_order.table.actual_price')" prop="actualPrice">
        <template slot-scope="scope">
          {{ scope.row.actualPrice }} 元
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('mall_order.table.pay_time')" prop="payTime" />
      <el-table-column align="center" :label="$t('mall_order.table.grabName')" prop="grabName" min-width="100" />
      <el-table-column align="center" min-width="90" :label="$t('mall_order.table.ship_time')" prop="shipTime" />
      <el-table-column align="center" :label="$t('mall_order.table.consignee')" prop="consignee">
        <template slot-scope="scope">
          <span style="color:red; font-weight:bold;">{{ scope.row.consignee }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('mall_order.table.mobile')" prop="mobile" min-width="100" />
      <el-table-column align="center" min-width="90" :label="$t('mall_order.table.confirm_time')" prop="confirmTime" />
      <!--      <el-table-column align="center" :label="$t('mall_order.table.ship_sn')" prop="shipSn" />-->

      <!--      <el-table-column align="center" :label="$t('mall_order.table.ship_channel')" prop="shipChannel" />-->
      <el-table-column align="center" :label="$t('mall_order.table.type')" prop="type">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('mall_order.table.actions')" width="250" class-name="oper">
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

    <!-- 订单详情对话框 -->
    <el-dialog :visible.sync="orderDialogVisible" :title="$t('mall_order.dialog.detail')" width="800">
      <section ref="print">
        <el-form :data="orderDetail" label-position="left">
          <el-form-item :label="$t('mall_order.form.detail_order_sn')">
            <span>{{ orderDetail.order.orderSn }}</span>
          </el-form-item>
          <el-form-item :label="$t('mall_order.form.detail_order_status')">
            <el-tag>{{ orderDetail.order.orderStatus | orderStatusFilter }}</el-tag>
          </el-form-item>
          <el-form-item :label="$t('mall_order.form.detail_user_nickname')">
            <span>{{ orderDetail.user.nickname }}</span>
          </el-form-item>
          <el-form-item :label="$t('mall_order.form.detail_message')">
            <span>{{ orderDetail.order.message }}</span>
          </el-form-item>
          <el-form-item :label="$t('mall_order.form.ticket_count')">
            <span>{{ orderDetail.order.ticketCount }}</span>
          </el-form-item>
          <el-form-item :label="$t('mall_order.form.detail_receiving_info')">
            <span>{{ $t('mall_order.text.detail_consigne', {consignee: orderDetail.order.consignee}) }}</span>
            <span>{{ $t('mall_order.text.detail_mobile', {mobile: orderDetail.order.mobile}) }}</span>
            <span>{{ $t('mall_order.text.detail_address', {address: orderDetail.order.address}) }}</span>
          </el-form-item>
          <el-form-item :label="$t('mall_order.form.detail_goods')">
            <el-table :data="orderDetail.orderGoods" border fit highlight-current-row>
              <el-table-column align="center" :label="$t('mall_order.table.detail_goods_name')" prop="goodsName" />
              <el-table-column align="center" :label="$t('mall_order.table.detail_goods_sn')" prop="goodsSn" />
              <el-table-column
                align="center"
                :label="$t('mall_order.table.detail_goods_specifications')"
                prop="specifications"
              />
              <el-table-column align="center" :label="$t('mall_order.table.detail_goods_price')" prop="price" />
              <el-table-column align="center" :label="$t('mall_order.table.detail_goods_number')" prop="number" />
              <el-table-column align="center" :label="$t('mall_order.table.detail_goods_pic_url')" prop="picUrl">
                <template slot-scope="scope">
                  <img :src="scope.row.picUrl" width="40">
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item :label="$t('mall_order.form.detail_price_info')">
            <span>
              {{
                $t('mall_order.text.detail_price_info', {
                  actual_price: orderDetail.order.actualPrice,
                  goods_price: orderDetail.order.goodsPrice,
                  freight_price: orderDetail.order.freightPrice,
                  coupon_price: orderDetail.order.couponPrice,
                  integral_price: orderDetail.order.integralPrice
                })
              }}
            </span>
          </el-form-item>
          <el-form-item :label="$t('mall_order.form.detail_pay_info')">
            <span>{{ $t('mall_order.text.detail_pay_channel', {pay_channel: '微信支付'}) }}</span>
            <span>{{ $t('mall_order.text.detail_pay_time', {pay_time: orderDetail.order.payTime}) }}</span>
          </el-form-item>
          <el-form-item :label="$t('mall_order.form.detail_ship_info')">
            <span>{{ $t('mall_order.text.detail_ship_channel', {ship_channel: orderDetail.order.shipChannel}) }}</span>
            <span>{{ $t('mall_order.text.detail_ship_sn', {ship_sn: orderDetail.order.shipSn}) }}</span>
            <span>{{ $t('mall_order.text.detail_ship_time', {ship_time: orderDetail.order.shipTime}) }}</span>
          </el-form-item>
          <el-form-item :label="$t('mall_order.form.detail_refund_info')">
            <span>{{
              $t('mall_order.text.detail_refund_amount', {refund_amount: orderDetail.order.refundAmount})
            }}</span>
            <span>{{ $t('mall_order.text.detail_refund_type', {refund_type: orderDetail.order.refundType}) }}</span>
            <span>{{
              $t('mall_order.text.detail_refund_content', {refund_content: orderDetail.order.refundContent})
            }}</span>
            <span>{{ $t('mall_order.text.detail_refund_time', {refund_time: orderDetail.order.refundTime}) }}</span>
          </el-form-item>
          <el-form-item :label="$t('mall_order.form.detail_receipt_info')">
            <span>{{ $t('mall_order.text.detail_confirm_time', {confirm_time: orderDetail.order.confirmTime}) }}</span>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisible = false">{{ $t('mall_order.button.detail_cancel') }}</el-button>
        <el-button type="primary" @click="printOrder">{{ $t('mall_order.button.detail_print') }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<style lang="scss" scoped>
.el-table--medium th, .el-table--medium td {
  padding: 3px 0;
}

.el-input-number--medium {
  width: 100%;
}

.oper .el-button--mini {
  padding: 7px 4px;
  width: 40px;
  font-size: 10px;
  margin-left: 1px;
}

::v-deep .el-table__expanded-cell {
  padding: 6px 80px;
}

.order-goods {
  display: flex;
  justify-content: space-around;
  justify-items: center;
  align-items: center;
  padding: 6px 0;
}

.name {
  width: 400px;
}

.spec {
  width: 180px;
}

.price {
  width: 120px;
}

.num {
  width: 120px;
}
</style>

<script>
import { deleteOrder, detailOrder, listChannel } from '@/api/order'
import { grabOrderDetail } from '@/api/stat'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import checkPermission from '@/utils/permission'

const statusMap = {
  101: '未付款',
  102: '用户取消',
  103: '系统取消',
  201: '已付款',
  202: '申请退款',
  203: '已退款',
  301: '已发货',
  401: '用户收货',
  402: '系统收货'
}

const typeMap = {
  0: '饮用水',
  1: '押桶',
  2: '水票'
}

export default {
  name: 'GrabOrderDetail',
  components: { Pagination },
  filters: {
    orderStatusFilter(status) {
      return statusMap[status]
    },
    typeFilter(type) {
      return typeMap[type]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        garbUserId: 0,
        page: 1,
        limit: 20,
        nickname: undefined,
        grabName: undefined,
        consignee: undefined,
        orderSn: undefined,
        timeArray: [],
        orderStatusArray: [],
        typeArray: [],
        ticketCount: '',
        sort: 'add_time',
        order: 'desc'
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
      },
      statusMap,
      typeMap,
      orderDialogVisible: false,
      orderDetail: {
        order: {},
        user: {},
        orderGoods: []
      },
      waterForm: {
        orderId: undefined,
        grabUserId: undefined,
        grabName: '',
        grabPhone: '',
        grabEmail: ''
      },
      userOptions: [],
      userSearchLoading: false,
      waterDialogVisible: false,
      shipForm: {
        orderId: undefined,
        shipChannel: undefined,
        shipSn: undefined
      },
      shipDialogVisible: false,
      payForm: {
        orderId: undefined,
        orderSn: '',
        oldMoney: 0,
        newMoney: 0,
        goodsList: []
      },
      payDialogVisible: false,
      refundForm: {
        orderId: undefined,
        refundMoney: undefined
      },
      refundDialogVisible: false,
      downloadLoading: false,
      channels: []
    }
  },
  created() {
    this.init()
    this.getList()
    this.getChannel()
  },
  methods: {
    init: function() {
      if (this.$route.query.id == null) {
        return
      }
      this.listQuery.garbUserId = this.$route.query.id
    },
    checkPermission,
    getList() {
      this.listLoading = true
      if (this.listQuery.timeArray && this.listQuery.timeArray.length === 2) {
        this.listQuery.start = this.listQuery.timeArray[0]
        this.listQuery.end = this.listQuery.timeArray[1]
      } else {
        this.listQuery.start = null
        this.listQuery.end = null
      }
      if (this.listQuery.orderId) {
        detailOrder(this.listQuery.orderId).then(response => {
          this.list = []
          if (response.data.data.order) {
            this.list.push(response.data.data.order)
            this.total = 1
            this.listLoading = false
          }
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      } else {
        grabOrderDetail(this.listQuery).then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      }
    },
    getChannel() {
      listChannel().then(response => {
        this.channels = response.data.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDetail(row) {
      detailOrder(row.id).then(response => {
        this.orderDetail = response.data.data
      })
      this.orderDialogVisible = true
    },
    handleDelete(row) {
      deleteOrder({ orderId: row.id }).then(response => {
        this.$notify.success({
          title: '成功',
          message: '订单删除成功'
        })
        this.getList()
      }).catch(response => {
        this.$notify.error({
          title: '失败',
          message: response.data.errmsg
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['订单ID', '订单编号', '用户ID', '订单状态', '是否删除', '收货人', '收货联系电话', '收货地址']
        const filterVal = ['id', 'orderSn', 'userId', 'orderStatus', 'isDelete', 'consignee', 'mobile', 'address']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '订单信息')
        this.downloadLoading = false
      })
    },
    printOrder() {
      this.$print(this.$refs.print)
      this.orderDialogVisible = false
    }
  }
}
</script>
