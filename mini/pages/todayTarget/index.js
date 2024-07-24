// pages/todayTarget/index.js
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
        type: 'getTodayTargets',
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
  doneItem(e) {
    let data = e.currentTarget.dataset.item;
    let subId = e.currentTarget.dataset.subid;
    data.list = data.list.map(e => {
      let obj = {
        ...e
      };
      if (e.id == subId) {
        obj.isDone = true;
      }
      return obj;
    })
    this.editItem(data);
  },
  failItem(e) {
    let data = e.currentTarget.dataset.item;
    let subId = e.currentTarget.dataset.subid;
    data.list = data.list.map(e => {
      let obj = {
        ...e
      };
      if (e.id == subId) {
        obj.isDone = false;
      }
      return obj;
    })
    this.editItem(data);
  },

  // 修改目标
  async editItem(item) {
    let params = {
      ...item
    };
    try {
      const res = await app.call({
        name: 'wishes-520',
        data: {
          type: 'updateTargets',
          _id: params._id,
          name: params.name,
          startDate: params.startDate,
          endDate: params.endDate,
          list: params.list
        }
      })
      if (res.success == true) {
        wx.showToast({
          title: '更新成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          this.Listdata();
        }, 500)
      }
    } catch (error) {
      wx.showToast({
        title: '更新失败，请重试',
        icon: 'success',
        duration: 2000
      })
    }
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