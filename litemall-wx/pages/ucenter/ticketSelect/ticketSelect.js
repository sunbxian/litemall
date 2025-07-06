var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    orderList: [],
    showType: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this
    try {
      var tab = wx.getStorageSync('tab');

      this.setData({
        showType: tab
      });
    } catch (e) {}

  },
  getOrderList() {
    let that = this;
    util.request(api.OrderListType, {
      showType: that.data.showType,
      type: 2,
      page: that.data.page,
      limit: that.data.limit
    }).then(function(res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          orderList: that.data.orderList.concat(res.data.list),
          totalPages: res.data.pages
        });
      }
    });
  },
  onReachBottom() {
    if (this.data.totalPages > this.data.page) {
      this.setData({
        page: this.data.page + 1
      });
      this.getOrderList();
    } else {
      wx.showToast({
        title: '没有更多订单了',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
  }, 
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    this.getOrderList();
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
  selectOrder: function (e) {
    try {
      console.log("e", e)
      wx.setStorageSync('orderId', e.currentTarget.dataset.id); 
    } catch (error) {

    }
    
    wx.navigateBack();
  },
  unselectOrder: function() {
    // 如果水票ID设置-1，则表示订单不使用水票
    try {
      wx.setStorageSync('orderId', -1);  
    } catch (error) {

    }

    wx.navigateBack();
  } 
})