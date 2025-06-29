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
    categories: [
      { id: 1, name: "热门推荐" },
      { id: 2, name: "手机数码" },
      { id: 3, name: "家用电器" },
      { id: 4, name: "食品生鲜" },
      { id: 5, name: "酒水饮料" },
      { id: 6, name: "服饰鞋包" },
      { id: 7, name: "美妆个护" },
      { id: 8, name: "运动户外" },
      { id: 9, name: "图书文具" },
      { id: 10, name: "家居家装" }
    ],
    
    // 商品数据
    allProducts: [
      // 热门推荐
      [
        { id: 101, name: "无线蓝牙耳机 高音质降噪", price: 299, sales: 1254, image: "https://via.placeholder.com/100/FFA07A/FFFFFF?text=耳机" },
        { id: 102, name: "智能手表 多功能运动款", price: 599, sales: 892, image: "https://via.placeholder.com/100/98FB98/FFFFFF?text=手表" },
        { id: 103, name: "便携式充电宝 10000mAh", price: 129, sales: 3567, image: "https://via.placeholder.com/100/ADD8E6/FFFFFF?text=充电宝" },
        { id: 104, name: "全面屏智能手机 6+128GB", price: 1999, sales: 567, image: "https://via.placeholder.com/100/D3D3D3/FFFFFF?text=手机" },
        { id: 105, name: "无线机械键盘 青轴", price: 399, sales: 1289, image: "https://via.placeholder.com/100/FFD700/FFFFFF?text=键盘" },
        { id: 106, name: "4K高清电视 55英寸", price: 2999, sales: 342, image: "https://via.placeholder.com/100/87CEFA/FFFFFF?text=电视" },
        { id: 107, name: "智能扫地机器人", price: 1599, sales: 789, image: "https://via.placeholder.com/100/FFB6C1/FFFFFF?text=机器人" },
        { id: 108, name: "降噪头戴式耳机", price: 899, sales: 456, image: "https://via.placeholder.com/100/BC8F8F/FFFFFF?text=耳机" },
        { id: 109, name: "笔记本电脑 轻薄本", price: 4999, sales: 234, image: "https://via.placeholder.com/100/A9A9A9/FFFFFF?text=笔记本" },
        { id: 110, name: "家用投影仪 1080P", price: 1299, sales: 678, image: "https://via.placeholder.com/100/FF6347/FFFFFF?text=投影仪" }
      ],
      // ...其他分类商品...
    ],
    
    currentProducts: []
  },
  
  onLoad() {
    // 初始化数据
    this.setData({
      currentProducts: this.data.allProducts[0]
    });
    
    // 获取系统信息
    wx.getSystemInfo({
      success: (res) => {
        const systemInfo = res;
        this.setData({
          fixedTop: res.statusBarHeight + 44, // 导航栏高度
          categoryHeight: res.windowHeight - (res.statusBarHeight + 44)
        });
      }
    });
  },
  
  onScroll(e) {
    const scrollTop = e.detail.scrollTop;
    const bannerHeight = this.data.bannerHeight;
    
    // 判断是否应该固定分类列表
    const shouldFix = scrollTop >= bannerHeight;
    
    this.setData({
      scrollTop: scrollTop,
      isFixed: shouldFix
    });
    
    // 模拟加载更多
    if (scrollTop > 500 && !this.data.isLoading) {
      this.loadMoreData();
    }
  },
  
  // 切换分类
  switchCategory(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeCategory: index,
      currentProducts: this.data.allProducts[index] || []
    });
    
    // 滚动到顶部
    this.setData({
      scrollTop: 0,
      isFixed: false
    });
  },
  
  // 加载更多数据
  loadMoreData() {
    this.setData({ isLoading: true });
    
    setTimeout(() => {
      const newProducts = [...this.data.currentProducts, ...this.getRandomProducts()];
      this.setData({
        currentProducts: newProducts,
        isLoading: false
      });
    }, 1000);
  },
  
  // 生成随机商品
  getRandomProducts() {
    const products = [];
    for (let i = 0; i < 3; i++) {
      products.push({
        id: Math.floor(Math.random() * 10000),
        name: "新品上市 " + (i + 1),
        price: Math.floor(Math.random() * 900) + 100,
        sales: Math.floor(Math.random() * 1000),
        image: `https://via.placeholder.com/100/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=新品`
      });
    }
    return products;
  }
});