const GLM_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

const TEMPLATE_PROMPTS: Record<string, string> = {
  headline: `你是2077日报的资深记者。用户会给你一个疯狂的未来事件创意，你需要将其扩写为一篇完整的新闻报道。

要求：
- 用最正经、最严肃的新闻通讯社笔法
- 包含：标题、副标题、正文（3段，每段2-3句话）
- 正文要包含虚构的具体数据、人物引述、背景信息
- 日期设定在2077年
- 风格参考新华社/路透社的正式报道语气
- 越荒诞的内容越要用严肃的语气写

返回JSON格式：
{"title": "...", "subtitle": "...", "content": "...", "news_date": "2077年X月X日"}`,

  flash: `你是2077日报的快讯编辑。用户给你一个疯狂的未来事件，你需要写成突发快讯。

要求：
- 简短紧凑，新闻快讯风格
- 包含：标题、3句话概要
- 最后加一句"本报将持续关注事态发展"
- 用最紧急的语气写最荒诞的事

返回JSON格式：
{"title": "【快讯】...", "subtitle": null, "content": "...", "news_date": "2077年X月X日"}`,

  obituary: `你是2077日报的讣告栏编辑。用户会告诉你一个在2077年已经"消亡"的事物（可以是概念、制度、物品等），你需要为它写一篇正式讣告。

要求：
- 用最庄重的讣告格式
- 包含：标题（"沉痛悼念XXX"）、生卒年份、"生平事迹"、"遗体告别"安排
- 把抽象概念当作一个"人"来写讣告
- 严肃中带荒诞

返回JSON格式：
{"title": "讣告：...", "subtitle": "...", "content": "...", "news_date": "2077年X月X日"}`,

  ad: `你是2077日报的广告设计。用户给你一个未来产品/服务的创意，你需要写成一则2077年的广告。

要求：
- 夸张的广告文案风格
- 包含：广告标题、卖点描述、价格（用2077年货币，如"0.001比特金"）、一条荒诞的免责声明
- 参考电视购物的热情语气

返回JSON格式：
{"title": "...", "subtitle": "限时优惠", "content": "...", "news_date": "2077年"}`,
};

export interface GeneratedArticle {
  title: string;
  subtitle: string | null;
  content: string;
  news_date: string;
}

export async function generateArticle(
  template: string,
  userInput: string
): Promise<GeneratedArticle> {
  const systemPrompt = TEMPLATE_PROMPTS[template];
  if (!systemPrompt) throw new Error(`Unknown template: ${template}`);

  const res = await fetch(GLM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: "glm-4-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput },
      ],
      temperature: 0.9,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GLM API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const text = data.choices[0].message.content;
  return JSON.parse(text) as GeneratedArticle;
}
