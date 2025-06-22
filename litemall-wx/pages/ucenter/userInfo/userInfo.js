var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
Page({
  data: {
    avatar: '',
    nickName: '', // 默认值
    gender: 0, // 默认值 
    genderList: [
      { id: 0, name: '未知' },
      { id: 1, name: '男' },
      { id: 2, name: '女' }
    ],
    genderIndex: 0
  },

  onLoad: function() {
    this.loadUserInfo();
  },

  // 加载用户信息
  loadUserInfo: function() {
    let that = this;
    util.request(api.AuthInfo).then(function(res) {
      if (res.errno === 0) {
        const userData = res.data;
        const genderIndex = that.data.genderList.findIndex(item => item.id === userData.gender);
        
        that.setData({
          avatar: userData.avatar,
          nickName: userData.nickName, 
          gender: userData.gender,
          genderIndex: genderIndex >= 0 ? genderIndex : 0
        });
      } else {
        wx.showToast({ title: res.errmsg, icon: 'none' });
      } 
    });  
  },

  // 选择头像
  chooseAvatar: function() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          avatar: res.tempFiles[0].tempFilePath
        });
        // 这里应该上传图片到服务器
      }
    });
  },

  // 性别选择
  genderChange: function(e) {
    const genderIndex = e.detail.value;
    this.setData({
      genderIndex,
      gender: this.data.genderList[genderIndex].id
    });
  },

  // 表单提交
  formSubmit: function(e) {
    const formData = e.detail.value;
    
    // 准备提交的数据（完全匹配接口字段）
    const submitData = {
      avatar: this.data.avatar,
      nickname: formData.nickName,
      gender: this.data.gender,
 
    };
    
    wx.showLoading({ title: '保存中...' });  
    util.request(api.AuthProfile, submitData , 'POST').then(function(res) {
      if (res.errno === 0) { 
        let userInfo = wx.getStorageSync('userInfo');
  
        userInfo.nickName = submitData.nickname
        userInfo.avatarUrl = submitData.avatar
        userInfo.gender = submitData.gender

        wx.setStorageSync('userInfo', userInfo); 

        wx.hideLoading();
        wx.navigateBack();
      }
    }).catch(function(res) {
      wx.hideLoading();
      util.showErrorToast('保存粗我');
    }); 
  }
});