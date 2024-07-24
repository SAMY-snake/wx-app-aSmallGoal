// pages/adddream/index.js
const app = getApp()
const moment = require('moment')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentshow: 'true',
    modifyshow: false,
    buttonshow: false,
    bakData: {},
    showCalendar: false,
    showSubModal: false,
    name: '',
    params: {
      name: '',
      dateStr: '',
      startDate: '',
      endDate: ''
    },
    subList: [],
    subItem: {},
    content: '',
    isSubAdd: true
  },
  openCalendar() {
    this.setData({
      showCalendar: true
    });
  },
  closeCalendar() {
    this.setData({
      showCalendar: false
    });
  },
  formatDate(date) {
    return moment(date).format("YYYY.MM.DD");
  },
  confirmCalendar(event) {
    const [start, end] = event.detail;
    this.setData({
      showCalendar: false,
      "params.dateStr": `${this.formatDate(start)}~${this.formatDate(end)}`,
      "params.startDate": start,
      "params.endDate": end
    });
  },
  openSubModal(e) {
    let data = e.currentTarget.dataset.item;
    if (data) {
      this.setData({
        showSubModal: true,
        isSubAdd: false,
        subItem: data,
        content: data.content
      });
    } else {
      this.setData({
        showSubModal: true,
        isSubAdd: true,
        subItem: {},
        content: ''
      });
    }
  },
  closeSubModal() {
    this.setData({
      showSubModal: false
    });
  },
  changeSubItem() {
    let list = [...this.data.subList];
    if (this.data.isSubAdd) {
      list.push({
        id: `${this.data.bakData._id || 0}-${new Date().getTime()}`,
        content: this.data.content,
        isDone: false
      });
    } else {
      list = this.data.subList.map(e => {
        let obj = {
          ...e
        };
        if (obj.id == this.data.subItem.id) {
          obj.content = this.data.content;
        }
        return obj;
      })
    }
    this.setData({
      showSubModal: false,
      subList: list
    });
  },
  deleteSubItem(e) {
    let _this = this;
    wx.showModal({
      title: '是否删除这条目标内容？',
      success: (res) => {
        if (res.confirm) {
          let index = e.currentTarget.dataset.index;
          let list = [..._this.data.subList];
          list.splice(index, 1);
          _this.setData({
            showSubModal: false,
            subList: list
          });
        } else if (res.cancel) {
          _this.closeSubModal()
        }
      }
    })
  },
  openDelModal() {
    wx.showModal({
      title: '是否删除这条目标？',
      success: (res) => {
        if (res.confirm) {
          this.deleteItem();
        }
      }
    })
  },
  // 新增目标
  async addItem() {
    let params = this.data.params;
    params.name = this.data.name;
    if (params.name && params.dateStr) {
      try {
        let nickname = wx.getStorageSync('user').nickName;
        const res = await app.call({
          // 云函数名称
          name: 'wishes-520',
          // 传给云函数的参数
          data: {
            type: 'addTargets',
            data: [{
              creatorName: wx.getStorageSync('user').nickName,
              createTime: new Date().getTime(),
              name: params.name,
              startDate: params.startDate,
              endDate: params.endDate,
              list: this.data.subList
            }]
          }
        })
        wx.reLaunch({
          url: '/pages/myTargets/index',
        })
      } catch (error) {
        wx.showToast({
          title: '新增失败，请重试',
          icon: 'error',
          duration: 2000
        })
      }
    } else {
      wx.showToast({
        title: '请完善目标名称和日期',
        icon: 'error',
      })
    }
  },
  // 修改目标
  async editItem() {
    let params = this.data.params;
    params.name = this.data.name;
    try {
      const res = await app.call({
        // 云函数名称
        name: 'wishes-520',
        // 传给云函数的参数
        data: {
          type: 'updateTargets',
          _id: this.data.bakData._id,
          name: params.name,
          startDate: params.startDate,
          endDate: params.endDate,
          list: this.data.subList
        }
      })
      if (res.success == true) {
        wx.showToast({
          title: '更新成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/myTargets/index',
          })
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
  // 删除目标
  async deleteItem() {
    try {
      let that = this;
      const res = await app.call({
        // 云函数名称
        name: 'wishes-520',
        // 传给云函数的参数
        data: {
          type: 'deleteTargets',
          _id: this.data.bakData._id
        }
      })
      if (res.success == true) {
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/myTargets/index',
          })
        }, 500)
      }
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 2000
      })
    } catch (error) {
      wx.showToast({
        title: '删除失败，请重试',
        icon: 'error',
        duration: 2000
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.data) {
      let obj = JSON.parse(options.data)
      this.setData({
        bakData: obj,
      })
      this.setData({
        name: obj.name || "",
        "params.name": obj.name || "",
        "params.dateStr": `${this.formatDate(obj.startDate)}~${this.formatDate(obj.endDate)}`,
        "params.startDate": obj.startDate || "",
        "params.endDate": obj.endDate || "",
        subList: obj.list || []
      })
    }
    this.setData({
      contentshow: options.content || false,
      modifyshow: options.modifyshow || false,
      buttonshow: options.buttonshow || false
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