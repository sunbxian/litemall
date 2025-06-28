var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    banner: [], // 添加 banner 数据
    categoryList: [],
    currentCategory: {}, 
    navList: [],
    goodsList: [],  
    page: 1,
    limit: 30,
    pages: 1, // 总页数
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    }); 
    this.getCatalog();
    this.getBanner(); // 获取 banner 数据
  },
  getCatalog: function() {
    //CatalogList
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.CatalogList).then(function(res) {
 
    let currentSubCategoryList = res.data.currentSubCategory;
    // 添加一个全部的种类
    let all = {
      id: 0, 
      pid: res.data.categoryList[0].id,
      name: "全部",
      level: "L2"
    }
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
          banner: res.data.banner // 设置 banner 数据
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
    var that = this;
    console.log("getGoodsList");
    util.request(api.GoodsList, {
        categoryId: that.data.currentCategory.id,
        page: that.data.page,
        limit: that.data.limit
      })
      .then(function(res) {
        var arr1 = that.data.goodsList; //从data获取当前datalist数组
        var arr2 = res.data.list; //从此次请求返回的数据中获取新数组
        arr1 = arr1.concat(arr2); //合并数组
        that.setData({
          goodsList: arr1,
          pages: res.data.pages //得到总页数
        });
      });
  },
  loadMoreData: function() {
    if (this.data.page >= this.data.pages) {
      util.showErrorToast("已经是最后一页了");
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
})
