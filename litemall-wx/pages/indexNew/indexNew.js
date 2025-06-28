var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    bannerHeight: 200, // banner 的高度，单位 rpx
    containerHeight: 0, // container 的动态高度
    banner: [],
    categoryList: [],
    currentCategory: {}, 
    navList: [],
    goodsList: [],  
    page: 1,
    limit: 30,
    pages: 1, // 总页数
  },
  onLoad: function(options) {
    this.calculateContainerHeight();
    this.getCatalog();
    this.getBanner();
  },
  calculateContainerHeight: function() {
    const that = this;
    wx.getSystemInfo({
      success: function(res) {
        const windowHeight = res.windowHeight; // 获取屏幕高度，单位 px
        const bannerHeightPx = that.data.bannerHeight / 750 * res.windowWidth; // 将 rpx 转换为 px
        const containerHeightPx = windowHeight - bannerHeightPx; // 减去 banner 的高度
        that.setData({
          containerHeight: containerHeightPx
        });
      }
    });
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
        categoryList: res.data.categoryList, 
        navList: currentSubCategoryList, 
        currentCategory: all
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
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏
  },
  //触底开始下一页
  onReachBottom: function () {
    var that=this;

    var pagenum = that.data.page + 1; //获取当前页数并+1
    if(pagenum <=that.data.pages){
      that.setData({
        page: pagenum, //更新当前页数
      })
      that.getGoodsList();//重新调用请求获取下一页数据
    }else{
      // util.showErrorToast("已经是最后一页了");
    }
  },

  getGoodsList: function() {
    let that = this;
    util.request(api.GoodsList, {
      categoryId: that.data.currentCategory.id,
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
  loadMoreData: function() {
    if (this.data.page >= this.data.pages) {
      // util.showErrorToast("已经是最后一页了");
      return;
    }

    this.setData({
      page: this.data.page + 1 // 更新到下一页
    });

    this.getGoodsList(); // 获取下一页数据
  },
  onUnload: function() {
    // 页面关闭
  },
  switchCate: function(event) {
    if (this.data.currentCategory.id == event.currentTarget.dataset.id) {
      return false;
    }
     
    this.setData({
      currentCategory: event.currentTarget.dataset,
      page:1, //从第一页开始查
      goodsList:[]
    });

    this.getGoodsList();
  }
});
