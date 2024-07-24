const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const $ = db.command;
// 获取当前OPENID
exports.userOpenid = async (event,context) => {
  try {
    let { OPENID } = cloud.getWXContext()
    return {
      success:true,
      data:OPENID
    }
  }catch{
    return {
      success: false,
      errMsg: e
    };
  }
}
// 获取我今日目标
exports.getTodayTargets = async (event, context) => {
  let {
    OPENID,
  } = cloud.getWXContext() // 这里获取到的 openId 和 appId 是可信的
  try {
    let currentDate = new Date();
    let list = await db.collection('targets').where({
      creatorOpenId: OPENID,
      startDate: $.lte(currentDate),
      endDate: $.gte(currentDate),
    }).get() || [];
    return {
      success: true,
      data: list,
    }
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};
// 获取我历史目标
exports.getHistoryTargets = async (event, context) => {
  let {
    OPENID,
  } = cloud.getWXContext() // 这里获取到的 openId 和 appId 是可信的
  try {
    let currentDate = new Date();
    let list = await db.collection('targets').where({
      creatorOpenId: OPENID,
      endDate: $.lte(currentDate),
    }).get() || [];
    return {
      success: true,
      data: list,
    }
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};
// 获取我全部的目标
exports.getAllTargets = async (event, context) => {
  let {
    OPENID,
  } = cloud.getWXContext() // 这里获取到的 openId 和 appId 是可信的
  try {
    let list = await db.collection('targets').where({
      creatorOpenId: OPENID
    }).get() || [];
    return {
      success: true,
      data: list,
    }
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};
// 新增目标
exports.add = async (event, context) => {
  const {
    data
  } = event
  let {
    OPENID,
  } = cloud.getWXContext() // 这里获取到的 openId 和 appId 是可信的
  try {
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      await db.collection('targets').add({
        data: {
          creatorOpenId: OPENID, // 创建用户 openid
          creatorName: item.creatorName, // 创建用户昵称
          createTime: item.createTime, // 创建时间
          updateTime: new Date(), // 修改时间
          name: item.name, // 目标名称
          startDate: new Date(item.startDate), // 目标开始时间
          endDate: new Date(item.endDate), // 目标结束时间
          list: item.list // 目标内容
        }
      })
    }
    return {
      success: true,
      data: event.data
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};
// 更新目标
exports.update = async (event, context) => {
  try {
    await db.collection('targets').doc(event._id).update({
      data: {
        updateTime: new Date(), // 修改时间
        name: event.name, // 目标名称
        startDate: new Date(event.startDate), // 目标开始时间
        endDate: new Date(event.endDate), // 目标结束时间
        list: event.list // 目标内容
      },
    })
    return {
      success: true,
      data: event.data
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};
// 删除目标
exports.delete = async (event, context) => {
  try {
    await db.collection('targets').doc(event._id).remove()
    return {
      success: true,
      data: event.data
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};