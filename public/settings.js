// 生产配置  上线后替换 setting.js中的内容
const defaultSettings = {
  baseApi: "/ragapi", // 接口的base路径 开发为/api 生产可替换/ragapi
  token: "Bearer 60213cdbb3a340708081b4e89c5124e5",
  appFrontBase:"http://8.130.16.234/", // 智能应用前端根路径
  appBackChatUrl:'http://8.130.16.234/ragapi/local_application_chat',//  智能应用后端chat根路径
  defaultUser:'zzp', // 默认用户
  appChatParams:{
    application_id:'必填 智能应用的appkey',
    history:'选填 历史记录 数组格式[[问题1,回答1],[问题2,回答2]]，为模型问答提供上下文',
    question:'必填 当前询问的问题',
    streaming: '选填 true为流式返回，false非流式',
    user_id:'必填 用户的id',
  }, // chat参数说明
};