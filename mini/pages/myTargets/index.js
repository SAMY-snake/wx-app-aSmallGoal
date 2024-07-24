// pages/mtydream/index.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userinfo: wx.getStorageSync('user'),
    msgList: [],
    // 滑动的起始坐标
    startX: 0,
    startY: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.Listdata();
  },
  async Listdata() {
    const that = this;
    const res = await app.call({
      // 云函数名称
      name: 'wishes-520',
      // 传给云函数的参数
      data: {
        type: 'getAllTargets',
        data: {}
      }
    })
    that.setData({
      msgList: res.data.data
    })
    wx.stopPullDownRefresh()
  },
  addTarget() {
    wx.navigateTo({
      url: `../addTarget/index?content=${true}&modifyshow=${true}&buttonshow=${false}`,
    })
  },
  toDetail(e) {
    let data = e.currentTarget.dataset.item
    var queryBean = JSON.stringify(data)
    wx.navigateTo({
      url: `../addTarget/index?content=true&modifyshow=false&buttonshow=true&data=` + queryBean,
    })
  },
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/index',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      userinfo: wx.getStorageSync('user')
    })
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1 // 根据tab的索引值设置
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.Listdata();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '一个小目标'
    }
  }
})