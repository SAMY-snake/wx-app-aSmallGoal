const targetsHandler = require('./targets/index');

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'userOpenid':
      return await targetsHandler.userOpenid(event, context);
    case 'getTodayTargets':
      return await targetsHandler.getTodayTargets(event, context);
    case 'getHistoryTargets':
      return await targetsHandler.getHistoryTargets(event, context);
    case 'getAllTargets':
      return await targetsHandler.getAllTargets(event, context);
    case 'addTargets':
      return await targetsHandler.add(event, context);
    case 'updateTargets':
      return await targetsHandler.update(event, context);
    case 'deleteTargets':
      return await targetsHandler.delete(event, context);
  }
};