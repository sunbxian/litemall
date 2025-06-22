var api = require('../../../config/api.js');
var check = require('../../../utils/check.js');

var app = getApp();
Page({
  data: {
    mobile: '',
    code: '',
    password: '',
    confirmPassword: '',
    countdown: 0, // 添加倒计时状态
    countdownText: '获取验证码' // 添加倒计时文本
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成

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

  sendCode: function() {
    let that = this;

    // 如果倒计时未结束，不允许再次发送
    if (this.data.countdown > 0) {
      return;
    }

    if (this.data.mobile.length == 0) {
      wx.showModal({
        title: '错误信息',
        content: '手机号不能为空',
        showCancel: false
      });
      return false;
    }

    wx.request({
      url: api.AuthRegisterCaptcha,
      data: {
        mobile: that.data.mobile
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.errno == 0) {
          // 开始倒计时
          that.startCountdown();
          
          wx.showModal({
            title: '发送成功',
            content: '验证码已发送',
            showCancel: false
          });
        } else {
          wx.showModal({
            title: '错误信息',
            content: res.data.errmsg,
            showCancel: false
          });
        }
      },
      fail: function() {
        wx.showModal({
          title: '错误信息',
          content: '网络请求失败，请重试',
          showCancel: false
        });
      }
    });
  },
    
  startCountdown: function() {
    let that = this;
    let countdown = 60;
    
    this.setData({
      countdown: countdown,
      countdownText: countdown + '秒后重试'
    });
    
    this.timer = setInterval(function() {
      countdown--;
      
      if (countdown <= 0) {
        clearInterval(that.timer);
        that.timer = null;
        that.setData({
          countdown: 0,
          countdownText: '获取验证码'
        });
      } else {
        that.setData({
          countdown: countdown,
          countdownText: countdown + '秒后重试'
        });
      }
    }, 1000);
  },
 
  startReset: function() {
    var that = this;

    if (this.data.mobile.length == 0 || this.data.code.length == 0) {
      wx.showModal({
        title: '错误信息',
        content: '手机号和验证码不能为空',
        showCancel: false
      });
      return false;
    }

    if (this.data.password.length < 3) {
      wx.showModal({
        title: '错误信息',
        content: '用户名和密码不得少于3位',
        showCancel: false
      });
      return false;
    }

    if (this.data.password != this.data.confirmPassword) {
      wx.showModal({
        title: '错误信息',
        content: '确认密码不一致',
        showCancel: false
      });
      return false;
    }

    wx.request({
      url: api.AuthReset,
      data: {
        mobile: that.data.mobile,
        code: that.data.code,
        password: that.data.password
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.errno == 0) {
          wx.navigateBack();
        } else {
          wx.showModal({
            title: '密码重置失败',
            content: res.data.errmsg,
            showCancel: false
          });
        }
      }
    });
  },
  bindPasswordInput: function(e) {

    this.setData({
      password: e.detail.value
    });
  },
  bindConfirmPasswordInput: function(e) {

    this.setData({
      confirmPassword: e.detail.value
    });
  },
  bindMobileInput: function(e) {

    this.setData({
      mobile: e.detail.value
    });
  },
  bindCodeInput: function(e) {

    this.setData({
      code: e.detail.value
    });
  },
  clearInput: function(e) {
    switch (e.currentTarget.id) {
      case 'clear-password':
        this.setData({
          password: ''
        });
        break;
      case 'clear-confirm-password':
        this.setData({
          confirmPassword: ''
        });
        break;
      case 'clear-mobile':
        this.setData({
          mobile: ''
        });
        break;
      case 'clear-code':
        this.setData({
          code: ''
        });
        break;
    }
  }
})