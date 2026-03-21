export interface CronTopic {
  template: "headline" | "flash" | "obituary" | "ad";
  input: string;
}

const TOPICS: CronTopic[] = [
  // 头条新闻
  { template: "headline", input: "火星第一家奶茶店开业，排队人数突破3000，太空快递瘫痪" },
  { template: "headline", input: "全球首例AI与人类离婚案宣判，AI获得房产和数字资产" },
  { template: "headline", input: "脑机接口公司推出'记忆共享'功能，情侣可以互看对方记忆" },
  { template: "headline", input: "科学家证实平行宇宙存在，发现另一个宇宙的自己是只猫" },
  { template: "headline", input: "量子计算机意外算出宇宙终极答案，结果是一个表情包" },
  { template: "headline", input: "全球首个AI国家宣布独立，申请加入联合国被拒" },
  { template: "headline", input: "月球发现远古外星文明遗迹，里面全是外卖盒子" },
  { template: "headline", input: "基因编辑婴儿长大后集体起诉父母，要求'退货重做'" },
  { template: "headline", input: "深海城市发现新物种，外形酷似人类快递员" },
  { template: "headline", input: "时间旅行实验成功，但旅行者带回了100年后的催债短信" },
  { template: "headline", input: "虚拟货币考古学家发现2024年比特币钱包，价值超过一颗行星" },
  { template: "headline", input: "全球第一家克隆人相亲平台上线，用户可以和自己的克隆体约会" },
  { template: "headline", input: "人造重力系统故障导致整座城市的人飘了起来" },
  { template: "headline", input: "AI写的小说获得诺贝尔文学奖，人类作家集体罢工" },
  { template: "headline", input: "太空电梯第一次故障，乘客在太空等了三天外卖" },

  // 快讯
  { template: "flash", input: "量子互联网全球断网15分钟，人类首次体验'数字死亡'" },
  { template: "flash", input: "火星殖民地第一起刑事案件：有人偷了隔壁的氧气" },
  { template: "flash", input: "AI气象员预测明天有'情感暴风雨'，建议全市居民准备纸巾" },
  { template: "flash", input: "元宇宙房价暴跌99%，虚拟房东连夜跑路" },
  { template: "flash", input: "脑机接口更新后出现bug，全城人梦到了同一个噩梦" },
  { template: "flash", input: "反物质餐厅爆炸，方圆十公里内所有食物变成了反物质" },
  { template: "flash", input: "全球脑网络延迟飙升，十亿人同时头疼" },
  { template: "flash", input: "太空垃圾撞击广告卫星，地球上空出现巨大的'404 Not Found'" },
  { template: "flash", input: "纳米机器人集体罢工，要求享受法定节假日" },
  { template: "flash", input: "时空裂缝出现在市中心，恐龙外卖员从中走出" },

  // 讣告
  { template: "obituary", input: "现金" },
  { template: "obituary", input: "密码" },
  { template: "obituary", input: "方向盘" },
  { template: "obituary", input: "996工作制" },
  { template: "obituary", input: "外卖骑手（人类）" },
  { template: "obituary", input: "隐私" },
  { template: "obituary", input: "手机充电器" },
  { template: "obituary", input: "传统考试制度" },
  { template: "obituary", input: "八小时睡眠" },
  { template: "obituary", input: "实体商店" },

  // 广告
  { template: "ad", input: "量子速溶咖啡，喝之前你就已经清醒了" },
  { template: "ad", input: "记忆橡皮擦：选择性删除尴尬回忆，今日买一送一" },
  { template: "ad", input: "AI陪聊机器人，保证比你的前任更懂你" },
  { template: "ad", input: "反重力拖鞋，让你在家也能体验太空漫步" },
  { template: "ad", input: "基因美容套餐：不满意可以ctrl+z" },
  { template: "ad", input: "时光回溯闹钟：让你回到迟到前的10分钟" },
  { template: "ad", input: "梦境录像机：把昨晚的梦导出为4K视频" },
  { template: "ad", input: "量子纠缠情侣手环：永远知道对方在想什么（是否是好事另说）" },
  { template: "ad", input: "AI替身出席无聊会议服务" },
  { template: "ad", input: "纳米减肥药：脂肪细胞自愿离职计划" },
];

export function getRandomTopics(count: number): CronTopic[] {
  const shuffled = [...TOPICS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
