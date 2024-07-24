// pages/historyTarget/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: [0],
    list: []
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  async Listdata() {
    const that = this;
    const res = await app.call({
      name: 'wishes-520',
      data: {
        type: 'getHistoryTargets',
        data: {}
      }
    })
    let list = res.data.data.map(e => {
      let obj = {
        ...e
      };
      let total = e.list.length;
      let done = 0;
      e.list.forEach(e2 => {
        if (e2.isDone) {
          done += 1;
        }
      })
      obj["rate"] = total ? Number(done / total * 100).toFixed(0) : 0;
      return obj;
    })
    that.setData({
      list: list
    })
    wx.stopPullDownRefresh()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.Listdata();
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

  }
})