var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var user = require('../../../utils/user.js');

var app = getApp();
Page({
  data: {
    canIUseGetUserProfile: true,
    wxLoading: false,       // 微信登录加载状态
    accountLoading: false    // 账号登录加载状态
    
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  onReady: function() {

  },
  onShow: function() {
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭

  },
  wxLogin: function(e) {
    if (this.data.wxLoading) return; // 防止重复点击
    
    this.setData({
      wxLoading: true
    });
    
    if (this.data.canIUseGetUserProfile) {
      wx.getUserProfile({
        desc: '用于完善会员资料',
        success: (res) => {
          this.doLogin(res.userInfo)
        },
        fail: () => {
          this.setData({ wxLoading: false });
          util.showErrorToast('微信登录失败');
        }
      })
    }
    else {
      if (e.detail.userInfo == undefined) {
        app.globalData.hasLogin = false;
        this.setData({ wxLoading: false });
        util.showErrorToast('微信登录失败');
        return;
      }
      this.doLogin(e.detail.userInfo)
    }
  },

  doLogin: function(userInfo) {
    user.checkLogin().catch(() => {
      user.loginByWeixin(userInfo).then(res => {
        app.globalData.hasLogin = true;
        this.setData({ wxLoading: false });
        wx.navigateBack({
          delta: 1
        })
      }).catch((err) => {
        app.globalData.hasLogin = false;
        this.setData({ wxLoading: false });
        util.showErrorToast('微信登录失败');
      });
    });
  },
  doLoginPhone: function(phone) {
    user.checkLogin().catch(() => {
      user.loginByWxPhone(phone).then(res => {
        app.globalData.hasLogin = true;
        this.setData({ wxLoading: false });
        wx.navigateBack({
          delta: 1
        })
      }).catch((err) => {
        app.globalData.hasLogin = false;
        this.setData({ wxLoading: false });
        util.showErrorToast('微信登录手机失败');
      });
    });
  },
  accountLogin: function() {
    wx.navigateTo({
      url: "/pages/auth/accountLogin/accountLogin"
    });
  },
  phoneLogin: function(e) {
    if (e.detail.errMsg !== "getPhoneNumber:ok") {
      // 拒绝授权
      return;
    }
    console.log("获取手机号成功", e.detail);

    if (this.data.wxLoading) return; // 防止重复点击

    this.setData({
      wxLoading: true
    });

    this.doLoginPhone(e.detail)

  },
})