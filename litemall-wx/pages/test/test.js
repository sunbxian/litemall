var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    bannerHeight: 200,       // banner高度
    categoryHeight: 0,      // 分类列表高度
    isFixed: false,         // 是否固定分类
    fixedTop: 0,            // 固定定位的top值
    scrollTop: 0,           // 滚动位置
    activeCategory: 0,      // 当前选中分类
    isLoading: false,       // 是否正在加载 
    // 分类数据
    categories: [], 

    goodsList: [],

    page: 1,
    limit: 10,
    pages: 1, // 总页数
    banner: [], // 添加 banner 数据
    coupon: [], // 添加 coupon 数据
    showCouponFloat: true // 控制悬浮优惠券的显示
  },
  
  onLoad() {
    // 获取系统信息
    wx.getSystemInfo({
      success: (res) => { 
        this.setData({
          fixedTop: 0, // 导航栏高度
          categoryHeight: res.windowHeight  
        });
      }
    });

    this.getCatalog(); // 获取分类数据
    this.getBanner(); // 获取 banner 数据
    this.getCouponList(); // 获取 coupon 数据
  },

  getCatalog: function() {
    let that = this;
    wx.showLoading({ title: '加载中...' });
    util.request(api.CatalogList).then(function(res) {
      let currentSubCategoryList = res.data.currentSubCategory;
      let all = {
        id: 0,
        pid: res.data.categoryList[0].id,
        name: "全部",
        level: "L2"
      };
      currentSubCategoryList.unshift(all);
      that.setData({
        categories: currentSubCategoryList
      });
      wx.hideLoading();
      that.getGoodsList();
    });
  },

  getBanner: function() {
    let that = this;
    util.request(api.IndexUrl).then(function(res) {
      if (res.errno === 0) {
        that.setData({
          banner: res.data.banner
        });
      }
    });
  },

  getCouponList: function() {
    let that = this;
    util.request(api.IndexUrl).then(function(res) {
      if (res.errno === 0) {
        that.setData({
          coupon: res.data.couponList
        });
      }
    });
  },

  getCoupon(e) {
    let couponId = e.currentTarget.dataset.index;
    util.request(api.CouponReceive, {
      couponId: couponId
    }, 'POST').then(res => {
      if (res.errno === 0) {
        wx.showToast({
          title: "领取成功"
        });
      } else {
        util.showErrorToast(res.errmsg);
      }
    });
  },

  getGoodsList: function() {
    let categoryId = this.data.categories[this.data.activeCategory].id
    console.log(categoryId)
    let that = this;
    util.request(api.GoodsList, {
      categoryId: categoryId,
      page: that.data.page,
      limit: that.data.limit
    }).then(function(res) {
      let arr1 = that.data.goodsList;
      let arr2 = res.data.list;
      arr1 = arr1.concat(arr2);
      that.setData({
        goodsList: arr1,
        pages: res.data.pages
      });
    });
  },

  onScroll(e) {
    const scrollTop = e.detail.scrollTop;
    const bannerHeight = this.data.bannerHeight;
    
    // 判断是否应该固定分类列表
    const shouldFix = scrollTop >= bannerHeight; 
    this.setData({
      // scrollTop: scrollTop,
      isFixed: shouldFix
    });
    
    // 模拟加载更多
    if (scrollTop > 320 && !this.data.isLoading) {
      console.log('scrollTop ', scrollTop)
      this.loadMoreData();
    }
  },
  
  // 切换分类
  switchCategory(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      isLoading: false, // 切换分类时显示加载中
      activeCategory: index,
      page:1, //从第一页开始查
      goodsList:[]
    });
    this.getGoodsList();
  },
  
  // 加载更多数据
  loadMoreData() {
    if (this.data.page >= this.data.pages) {
      // 已经是最后一页，不显示加载中
      this.setData({ isLoading: false });
      return;
    }

    this.setData({ 
      isLoading: true,
      page: this.data.page + 1 // 更新到下一页
    });
    console.log("loadMoreData")
    this.getGoodsList();
  },

  closeCouponFloat() {
    this.setData({
      showCouponFloat: false
    });
  }
});