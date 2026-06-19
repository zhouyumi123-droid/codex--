const pptxgen = require('pptxgenjs');
const path = require('path');

const outDir = __dirname;
const font = 'Microsoft YaHei';
const C = {
  blue: '1F6FB2',
  sky: 'EAF5FF',
  cyan: '4DB6E2',
  ink: '172A3A',
  gray: '5E6B78',
  line: 'D7E5F2',
  white: 'FFFFFF',
  green: '2E9D6F',
  amber: 'F5A623',
  red: 'D94A4A',
};

function deck() {
  const ppt = new pptxgen();
  ppt.layout = 'LAYOUT_WIDE';
  ppt.author = '奥斯翰国际学校';
  ppt.company = '奥斯翰国际学校';
  ppt.subject = '金校直播主播培训';
  ppt.theme = { headFontFace: font, bodyFontFace: font, lang: 'zh-CN' };
  return ppt;
}

function addTop(slide, title, sub, n) {
  slide.background = { color: C.white };
  slide.addShape('rect', { x: 0, y: 0, w: 13.333, h: 0.16, fill: { color: C.blue }, line: { color: C.blue } });
  slide.addText(title, { x: 0.62, y: 0.38, w: 9.4, h: 0.38, fontFace: font, fontSize: 19, bold: true, color: C.ink, margin: 0, fit: 'shrink' });
  if (sub) slide.addText(sub, { x: 0.64, y: 0.84, w: 8.7, h: 0.22, fontFace: font, fontSize: 8.5, color: C.gray, margin: 0, fit: 'shrink' });
  if (n) slide.addText(String(n).padStart(2, '0'), { x: 11.85, y: 0.38, w: 0.8, h: 0.32, fontFace: 'Arial', fontSize: 13, bold: true, color: C.blue, align: 'right', margin: 0 });
}

function cover(slide, title, sub, tag) {
  slide.background = { color: 'F7FBFF' };
  slide.addShape('rect', { x: 0, y: 0, w: 4.0, h: 7.5, fill: { color: C.blue }, line: { color: C.blue } });
  slide.addShape('rect', { x: 4.0, y: 0, w: 0.18, h: 7.5, fill: { color: C.cyan }, line: { color: C.cyan } });
  slide.addText('SAIS LIVE', { x: 0.62, y: 0.55, w: 2.4, h: 0.28, fontFace: 'Arial', fontSize: 10, bold: true, color: C.white, margin: 0 });
  slide.addText(tag, { x: 0.62, y: 5.9, w: 2.6, h: 0.5, fontFace: font, fontSize: 10.5, color: C.white, margin: 0 });
  slide.addText(title, { x: 4.85, y: 1.78, w: 7.1, h: 1.25, fontFace: font, fontSize: 31, bold: true, color: C.ink, fit: 'shrink' });
  slide.addShape('line', { x: 4.88, y: 3.25, w: 1.05, h: 0, line: { color: C.cyan, width: 4 } });
  slide.addText(sub, { x: 4.88, y: 3.58, w: 6.9, h: 0.8, fontFace: font, fontSize: 14, color: C.gray, fit: 'shrink' });
  slide.addText('奥斯翰国际部 | 视频号招生直播', { x: 4.88, y: 6.65, w: 4.4, h: 0.28, fontFace: font, fontSize: 9.5, color: C.gray, margin: 0 });
}

function section(slide, title, sub, n) {
  slide.background = { color: C.blue };
  slide.addText(String(n).padStart(2, '0'), { x: 0.7, y: 0.62, w: 1.05, h: 0.42, fontFace: 'Arial', fontSize: 20, bold: true, color: 'BFE8FF', margin: 0 });
  slide.addShape('line', { x: 0.74, y: 1.18, w: 1.15, h: 0, line: { color: C.white, width: 3 } });
  slide.addText(title, { x: 0.78, y: 2.35, w: 8.8, h: 0.9, fontFace: font, fontSize: 31, bold: true, color: C.white, margin: 0, fit: 'shrink' });
  slide.addText(sub, { x: 0.82, y: 3.35, w: 7.2, h: 0.45, fontFace: font, fontSize: 13, color: 'DDF2FF', margin: 0, fit: 'shrink' });
}

function box(slide, x, y, w, h, title, body, color = C.blue) {
  slide.addShape('roundRect', { x, y, w, h, rectRadius: 0.08, fill: { color: C.white }, line: { color: C.line, width: 1 } });
  slide.addShape('rect', { x, y, w: 0.08, h, fill: { color }, line: { color } });
  slide.addText(title, { x: x + 0.24, y: y + 0.18, w: w - 0.42, h: 0.26, fontFace: font, fontSize: 12.4, bold: true, color: C.ink, margin: 0, fit: 'shrink' });
  slide.addText(body, { x: x + 0.24, y: y + 0.55, w: w - 0.42, h: h - 0.7, fontFace: font, fontSize: 9.2, color: C.gray, fit: 'shrink', valign: 'top' });
}

function quote(slide, text, x, y, w, h, fill = C.sky) {
  slide.addShape('roundRect', { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: C.line } });
  slide.addText(text, { x: x + 0.3, y: y + 0.22, w: w - 0.6, h: h - 0.42, fontFace: font, fontSize: 14.5, bold: true, color: C.ink, fit: 'shrink', valign: 'mid' });
}

function bullets(slide, items, x = 1.0, y = 1.4, w = 10.8, fs = 15, gap = 0.52) {
  items.forEach((t, i) => {
    slide.addShape('ellipse', { x, y: y + i * gap + 0.08, w: 0.11, h: 0.11, fill: { color: C.cyan }, line: { color: C.cyan } });
    slide.addText(t, { x: x + 0.25, y: y + i * gap, w, h: 0.3, fontFace: font, fontSize: fs, color: C.ink, margin: 0, fit: 'shrink' });
  });
}

function timeline(slide, phases) {
  const y = 2.25, start = 0.95, gap = 2.38;
  slide.addShape('line', { x: start + 0.52, y: y + 0.28, w: 9.45, h: 0, line: { color: C.line, width: 2 } });
  phases.forEach((p, i) => {
    const x = start + i * gap;
    slide.addShape('ellipse', { x, y, w: 0.58, h: 0.58, fill: { color: p.color }, line: { color: p.color } });
    slide.addText(String(i + 1), { x, y: y + 0.14, w: 0.58, h: 0.2, fontFace: 'Arial', fontSize: 11, bold: true, color: C.white, align: 'center', margin: 0 });
    slide.addText(p.time, { x: x - 0.18, y: y + 0.82, w: 0.94, h: 0.24, fontFace: 'Arial', fontSize: 9, bold: true, color: p.color, align: 'center', margin: 0 });
    slide.addText(p.title, { x: x - 0.46, y: y + 1.16, w: 1.5, h: 0.3, fontFace: font, fontSize: 11, bold: true, color: C.ink, align: 'center', margin: 0, fit: 'shrink' });
    slide.addText(p.body, { x: x - 0.52, y: y + 1.58, w: 1.65, h: 0.65, fontFace: font, fontSize: 8.1, color: C.gray, align: 'center', margin: 0, fit: 'shrink' });
  });
}

function pills(slide, labels) {
  labels.forEach((p, i) => {
    const x = 1.05 + i * 2.0;
    slide.addShape('roundRect', { x, y: 1.5, w: 1.45, h: 0.42, rectRadius: 0.12, fill: { color: p.color }, line: { color: p.color } });
    slide.addText(p.text, { x, y: 1.6, w: 1.45, h: 0.18, fontFace: font, fontSize: 10, bold: true, color: C.white, align: 'center', margin: 0 });
  });
}

function save(ppt, file) {
  return ppt.writeFile({ fileName: path.join(outDir, file) });
}

async function buildJin() {
  const ppt = deck();
  let s = ppt.addSlide(); cover(s, '金校直播主播培训', '开播前理解路径：什么时候说什么，如何互动，如何承接', '给金校使用');
  s = ppt.addSlide(); section(s, '先把直播讲成咨询会', '不是表演，也不是招生宣讲', 1);

  s = ppt.addSlide(); addTop(s, '直播的核心定位', '家长先相信判断，再进入奥斯翰咨询', 2);
  quote(s, '用专业判断帮家长降低选择焦虑，再用奥斯翰的课程体系承接具体需求。', 0.85, 1.45, 11.6, 1.05);
  box(s, 0.9, 3.05, 3.55, 2.0, '不是', '不是照稿念学校介绍\n不是泛泛讲课程名词\n不是承诺录取结果', C.red);
  box(s, 4.9, 3.05, 3.55, 2.0, '而是', '像一场家长咨询会\n把路线、风险、适配条件讲清楚', C.blue);
  box(s, 8.9, 3.05, 3.55, 2.0, '最终', '引导家长做评估\n领取资料或预约到校', C.green);

  s = ppt.addSlide(); addTop(s, '金校的人设表达', '履历服务信任，不是先念简历', 3);
  quote(s, '我是奥斯翰国际部的金校长。这些年我主要做国际课程体系建设和学生升学路径规划。今天我不替家长做决定，而是把不同路线适合什么孩子、不适合什么孩子讲清楚。', 0.9, 1.35, 11.55, 1.35);
  box(s, 0.9, 3.15, 3.6, 1.6, '专业标签', '国际部校长\n国际课程体系建设者\n升学路径规划专家', C.blue);
  box(s, 4.9, 3.15, 3.6, 1.6, '表达重点', '先讲家长问题\n再讲判断标准\n最后讲奥斯翰方案', C.cyan);
  box(s, 8.9, 3.15, 3.6, 1.6, '避免', '一上来堆履历\n讲成学校广告\n对个体结果下绝对结论', C.amber);

  s = ppt.addSlide(); addTop(s, '上播前只记住6句话', '这是金校的直播底层规则', 4);
  ['不替家长做决定，是帮家长把路线讲清楚', '每场直播只解决一个核心问题', '每3-5分钟抛出一个家长问题', '先讲判断标准，再讲奥斯翰方案', '不承诺结果，只建议结合孩子基础评估', '最后一定引导“评估 / 资料 / 到校”'].forEach((r, i) => {
    const x = i % 2 === 0 ? 0.9 : 6.85, y = 1.3 + Math.floor(i / 2) * 1.35;
    const dark = i === 5;
    s.addShape('roundRect', { x, y, w: 5.45, h: 0.9, rectRadius: 0.08, fill: { color: dark ? C.blue : C.sky }, line: { color: dark ? C.blue : C.line } });
    s.addText(String(i + 1), { x: x + 0.18, y: y + 0.23, w: 0.3, h: 0.22, fontFace: 'Arial', fontSize: 11, bold: true, color: dark ? C.white : C.blue, margin: 0 });
    s.addText(r, { x: x + 0.62, y: y + 0.2, w: 4.55, h: 0.36, fontFace: font, fontSize: 12.2, bold: dark, color: dark ? C.white : C.ink, margin: 0, fit: 'shrink' });
  });

  s = ppt.addSlide(); addTop(s, '60分钟直播路径', '每一段都有明确任务', 5);
  timeline(s, [
    { time: '0-3', title: '开场留人', body: '主题、身份、关键词', color: C.blue },
    { time: '3-15', title: '问题拆解', body: '误区与判断标准', color: C.cyan },
    { time: '15-35', title: '路线讲解', body: '不同孩子怎么选', color: C.green },
    { time: '35-50', title: '评论答疑', body: '具体情况具体评估', color: C.amber },
    { time: '50-60', title: '收口转化', body: '总结、关键词、下场预告', color: C.red },
  ]);
  quote(s, '关键训练点：不要连续讲超过5分钟不互动。', 1.2, 5.95, 10.95, 0.62, 'F3F8FD');

  s = ppt.addSlide(); addTop(s, '首场主题与开场3分钟', '先告诉家长：今天值得听什么', 6);
  quote(s, '中考后转国际路线还来得及吗？金校长讲清楚3种选择', 0.9, 1.22, 11.55, 0.75);
  bullets(s, ['欢迎家长，说明自己身份', '明确今天只解决一个问题', '点出家长焦虑：怕选错课程、学校、方向', '引导评论：中考 / 评估'], 1.0, 2.45, 10.2, 15, 0.55);
  box(s, 1.0, 5.35, 11.35, 0.8, '开场句式', '今天不做大而全的学校介绍，只讲一个很现实的问题：中考后如果考虑国际路线，到底还来不来得及，孩子适不适合，应该怎么选。', C.blue);

  s = ppt.addSlide(); addTop(s, '3-15分钟：先讲判断，不讲卖点', '中考后不是不能转，但不能盲目转', 7);
  box(s, 0.9, 1.35, 3.8, 2.1, '抛问题', '中考后还能不能转国际路线？', C.blue);
  box(s, 4.85, 1.35, 3.8, 2.1, '给判断', '不是看时间来不来得及，而是看基础、语言、习惯、目标和家庭规划。', C.cyan);
  box(s, 8.8, 1.35, 3.8, 2.1, '做互动', '初三打1，高一高二打2，已经看国际学校打3。', C.green);
  quote(s, '直播不是连续讲课，是“问题 - 判断 - 互动 - 下一个问题”的循环。', 1.3, 4.65, 10.6, 0.8, 'F3F8FD');

  s = ppt.addSlide(); addTop(s, '15-35分钟：讲清三条路径', '让家长知道不是只有一种国际路线', 8);
  box(s, 0.9, 1.35, 3.6, 3.05, '继续普通高中', '适合体制内适应度高、成绩仍有竞争力、暂时没有明确海外目标的孩子。', C.blue);
  box(s, 4.85, 1.35, 3.6, 3.05, '进入国际课程', '适合家庭目标明确，愿意提前准备语言、课程和海外升学的孩子。', C.green);
  box(s, 8.8, 1.35, 3.6, 3.05, '日韩/港澳台/新加坡', '适合英语压力较大、预算和文化适配有特别考虑，或希望多一条路径的家庭。', C.cyan);
  quote(s, '互动：普通高中后转轨打1，国际课程打2，日韩或其他方向打3。', 1.2, 5.45, 10.9, 0.68);

  s = ppt.addSlide(); addTop(s, '家长最容易选错的地方', '不要只看课程名字', 9);
  bullets(s, ['只看课程名字：A-Level、OSSD、AP、DSE哪个更好', '只看学校环境和费用', '只听别人家孩子的结果', '只问能不能录取，不看过程管理', '不看孩子基础、语言能力和学习习惯'], 1.0, 1.55, 10.8, 15, 0.58);
  quote(s, '课程没有绝对好坏，关键是孩子适不适合。', 1.3, 5.35, 10.5, 0.7, 'F3F8FD');

  s = ppt.addSlide(); addTop(s, '35-50分钟：评论答疑怎么答', '不在直播间做一刀切结论', 10);
  box(s, 0.9, 1.28, 3.7, 2.3, '优先回答', '有孩子年级\n有成绩或英语基础\n有目标方向\n有入学时间', C.green);
  box(s, 4.85, 1.28, 3.7, 2.3, '谨慎回答', '能不能保证录取\n多久一定提升\n我家孩子一定行不行', C.amber);
  box(s, 8.8, 1.28, 3.7, 2.3, '统一口径', '直播间给方向判断\n具体到孩子要做评估', C.blue);
  quote(s, '这个问题我先给大方向判断，但具体到孩子个人，不建议直播间一刀切。', 1.05, 4.75, 11.1, 0.85);

  s = ppt.addSlide(); addTop(s, '50-60分钟：收口与转化', '每场直播最后都要落到三个动作', 11);
  pills(s, [{ text: '评估', color: C.blue }, { text: '资料', color: C.green }, { text: '到校', color: C.amber }]);
  bullets(s, ['总结：不是不能转，但不能盲目转', '提醒：先判断孩子，再判断路线，最后判断学校', '引导：打“评估 / 资料 / 到校”', '预告：下一场讲课程怎么选'], 1.05, 2.55, 10.5, 15, 0.56);
  box(s, 1.05, 5.55, 11.15, 0.72, '收口句', '如果你想判断孩子适不适合，可以打评估；想看课程资料，可以打资料；考虑今年入学，可以打到校。', C.blue);

  s = ppt.addSlide(); addTop(s, '不能说与替代表达', '避免过度承诺，保持专业边界', 12);
  [['我们保证孩子录取', '升学结果需要结合孩子基础和过程规划'], ['这个课程一定适合你孩子', '需要看孩子基础、目标方向和学习状态'], ['英语不好也没关系', '要评估提升周期和课程适配'], ['来我们学校一定能提升', '学校提供支持，孩子情况要具体评估']].forEach((p, i) => {
    const y = 1.35 + i * 1.15;
    box(s, 0.95, y, 5.1, 0.76, p[0], '不建议说', C.red);
    box(s, 6.55, y, 5.8, 0.76, p[1], '替代表达', C.green);
  });

  s = ppt.addSlide(); addTop(s, '周一现场练习', '练一遍，比讲十遍规则更重要', 13);
  bullets(s, ['30秒身份表达：自然，不像念简历', '3分钟开场：主题、价值、关键词', '3-5分钟讲一个小问题：英语一般能不能读国际课程', '模拟评论答疑：不乱承诺，不跑偏', '1分钟收口：总结、关键词、预告下一场'], 1.0, 1.35, 10.8, 15.2, 0.65);
  quote(s, '目标：金校知道直播中每个时间点该完成什么任务。', 1.25, 5.95, 10.7, 0.55);

  s = ppt.addSlide(); addTop(s, '上播前一页纸', '真正上播时只看这一页也够', 14);
  box(s, 0.9, 1.3, 3.65, 3.2, '不要做', '不要一上来讲学校介绍\n不要连续讲超过5分钟不互动\n不要回答没有孩子信息的绝对判断\n不要承诺结果', C.red);
  box(s, 4.85, 1.3, 3.65, 3.2, '固定结构', '开场：今天只解决一个问题\n判断：适合与不适合\n路线：三类选择\n答疑：具体评估\n收口：三个关键词', C.blue);
  box(s, 8.8, 1.3, 3.65, 3.2, '固定关键词', '评估：判断孩子适不适合\n资料：领取课程资料\n到校：预约校园参观和面谈', C.green);
  quote(s, '最后一句话：中考后不是不能转国际路线，但不能盲目转。', 1.2, 5.65, 10.95, 0.72);
  await save(ppt, '金校直播_给金校看的主播培训PPT.pptx');
}

async function buildTrainer() {
  const ppt = deck();
  let s = ppt.addSlide(); cover(s, '金校直播培训执行PPT', '培训者视角：怎么讲、怎么带练、怎么观察和纠偏', '给培训人使用');

  s = ppt.addSlide(); addTop(s, '本次培训的交付目标', '周一培训结束后要拿到的结果', 1);
  bullets(s, ['金校认可直播不是传统招生宣讲', '金校能讲出30秒身份表达', '金校能完成首场3分钟开场', '金校知道60分钟每段任务', '金校学会不承诺结果的安全表达', '后台明确控场提示与线索承接'], 1.05, 1.35, 10.8, 15, 0.55);
  quote(s, '培训不是讲理论，是把金校带进“可开播”的状态。', 1.25, 5.72, 10.8, 0.66);

  s = ppt.addSlide(); addTop(s, '培训前先统一战略口径', '先定性，再训练技巧', 2);
  box(s, 0.9, 1.35, 3.6, 2.2, '账号', '奥斯翰官方视频号\n承接微信私域和销售转化', C.blue);
  box(s, 4.85, 1.35, 3.6, 2.2, '人设', '金校长\n国际课程与升学路径规划专家', C.cyan);
  box(s, 8.8, 1.35, 3.6, 2.2, '内容', '70%专业判断\n20%奥斯翰方案\n10%转化动作', C.green);
  quote(s, '你要反复强调：金校不是主播化表演，而是专家咨询化表达。', 1.2, 5.05, 10.95, 0.78);

  s = ppt.addSlide(); addTop(s, '周一90分钟培训安排', '建议按这个顺序推进', 3);
  timeline(s, [
    { time: '0-10', title: '定位', body: '不是招生宣讲', color: C.blue },
    { time: '10-25', title: '人设', body: '身份表达', color: C.cyan },
    { time: '25-45', title: '路径', body: '首场60分钟', color: C.green },
    { time: '45-75', title: '练习', body: '开场/互动/答疑', color: C.amber },
    { time: '75-90', title: '模拟', body: '后台提示实战', color: C.red },
  ]);
  quote(s, '你的角色：不是审稿人，是直播教练。每一段都要让金校开口练。', 1.2, 5.9, 10.95, 0.62);

  s = ppt.addSlide(); addTop(s, '你开场怎么讲', '先消除金校对直播的压力', 4);
  quote(s, '这次不是让您做职业主播，也不是让您照稿念招生宣传。我们是把您平时给家长做规划的能力，整理成视频号直播的节奏。', 0.9, 1.35, 11.55, 1.05);
  bullets(s, ['告诉她：直播像家长咨询会', '告诉她：不需要表演，只需要有节奏', '告诉她：后台会帮她看评论、提醒节奏', '告诉她：每场只解决一个问题'], 1.05, 3.05, 10.6, 15, 0.58);

  s = ppt.addSlide(); addTop(s, '观察金校身份表达', '这一页用来训练自然感', 5);
  box(s, 0.9, 1.2, 5.55, 2.0, '合格表达', '我是奥斯翰国际部金校长，主要做国际课程体系建设和升学路径规划。今天我帮家长把路线讲清楚。', C.green);
  box(s, 6.9, 1.2, 5.55, 2.0, '需要纠偏', '一上来念完整履历\n把自己说成招生主播\n大量使用学校广告语', C.red);
  bullets(s, ['观察点1：是否30秒内进入家长问题', '观察点2：有没有专业边界', '观察点3：有没有自然引出课程与规划'], 1.05, 4.0, 10.8, 14.5, 0.55);

  s = ppt.addSlide(); addTop(s, '首场直播路径总控图', '培训时要反复回到这张图', 6);
  timeline(s, [
    { time: '0-3', title: '开场', body: '主题 + 关键词', color: C.blue },
    { time: '3-15', title: '判断', body: '能不能转轨', color: C.cyan },
    { time: '15-35', title: '路线', body: '三条选择', color: C.green },
    { time: '35-50', title: '答疑', body: '评估承接', color: C.amber },
    { time: '50-60', title: '收口', body: '转化 + 预告', color: C.red },
  ]);
  quote(s, '培训口径：每一段不是讲完内容，而是完成一个直播任务。', 1.2, 5.95, 10.9, 0.58);

  s = ppt.addSlide(); addTop(s, '开场3分钟训练卡', '让金校至少练两遍', 7);
  box(s, 0.9, 1.25, 3.55, 2.55, '必须出现', '我是金校长\n今天只讲一个问题\n家长焦虑是什么\n评论打中考/评估', C.blue);
  box(s, 4.9, 1.25, 3.55, 2.55, '训练提示', '语速放慢\n不要讲学校历史\n不要一开场讲课程清单', C.amber);
  box(s, 8.9, 1.25, 3.55, 2.55, '合格标准', '3分钟内家长知道：她是谁、今天讲什么、我能得到什么、怎么互动。', C.green);
  quote(s, '纠偏话术：先别讲奥斯翰多好，先讲家长为什么要留下来听。', 1.2, 5.42, 10.95, 0.72);

  s = ppt.addSlide(); addTop(s, '3-5分钟小段训练法', '避免金校连续讲课', 8);
  ['抛问题', '给判断', '分情况', '做互动', '引下段'].forEach((t, i) => {
    const x = 0.95 + i * 2.4;
    s.addShape('roundRect', { x, y: 2.0, w: 1.65, h: 0.78, rectRadius: 0.08, fill: { color: i % 2 ? C.cyan : C.blue }, line: { color: i % 2 ? C.cyan : C.blue } });
    s.addText(t, { x, y: 2.25, w: 1.65, h: 0.2, fontFace: font, fontSize: 12, bold: true, color: C.white, align: 'center', margin: 0 });
    if (i < 4) s.addText('→', { x: x + 1.78, y: 2.18, w: 0.28, h: 0.28, fontFace: 'Arial', fontSize: 18, color: C.gray, margin: 0 });
  });
  bullets(s, ['练习题：英语一般的孩子适不适合读国际课程？', '要求金校按五步讲3分钟', '你只观察：有没有互动、有没有分情况、有没有引导评估'], 1.05, 4.0, 10.8, 15, 0.56);

  s = ppt.addSlide(); addTop(s, '评论答疑训练', '训练金校别被评论带散', 9);
  box(s, 0.9, 1.25, 3.7, 2.7, '优先递给金校', '孩子年级\n成绩/英语基础\n目标方向\n入学时间\n到校意向', C.green);
  box(s, 4.85, 1.25, 3.7, 2.7, '不优先递', '国际学校好吗\n多少钱\n能不能上好大学\n没有孩子信息的问题', C.amber);
  box(s, 8.8, 1.25, 3.7, 2.7, '统一回答', '直播间给方向判断\n具体孩子做评估\n不承诺结果', C.blue);
  quote(s, '训练她反复回到：具体情况要看孩子基础。', 1.25, 5.35, 10.75, 0.68);

  s = ppt.addSlide(); addTop(s, '风险表达纠偏表', '听到这些话要立刻纠偏', 10);
  [['保证录取', '提供路径设计和过程支持'], ['一定适合', '看基础、目标和学习状态'], ['英语不好也没关系', '评估提升周期和课程适配'], ['一定能提升', '学校支持 + 孩子情况具体评估']].forEach((p, i) => {
    const y = 1.2 + i * 1.05;
    s.addText(p[0], { x: 1.0, y, w: 3.3, h: 0.3, fontFace: font, fontSize: 14, bold: true, color: C.red, margin: 0, fit: 'shrink' });
    s.addText('→', { x: 4.45, y, w: 0.32, h: 0.3, fontFace: 'Arial', fontSize: 15, color: C.gray, margin: 0 });
    s.addText(p[1], { x: 5.1, y, w: 6.6, h: 0.3, fontFace: font, fontSize: 14, bold: true, color: C.green, margin: 0, fit: 'shrink' });
    s.addShape('line', { x: 0.95, y: y + 0.56, w: 11.2, h: 0, line: { color: C.line, width: 1 } });
  });
  quote(s, '培训重点：不是让她少说，而是让她说得更专业、更安全。', 1.2, 5.8, 10.95, 0.58);

  s = ppt.addSlide(); addTop(s, '后台提示卡', '直播中你给金校看的提示要短', 11);
  ['重新说主题', '引导评估', '回答英语问题', '插入奥斯翰承接', '准备收口', '预告下一场'].forEach((t, i) => {
    const x = i % 3 === 0 ? 1.0 : i % 3 === 1 ? 4.75 : 8.5;
    const y = 1.45 + Math.floor(i / 3) * 1.5;
    s.addShape('roundRect', { x, y, w: 2.7, h: 0.9, rectRadius: 0.08, fill: { color: C.sky }, line: { color: C.line } });
    s.addText(t, { x, y: y + 0.28, w: 2.7, h: 0.22, fontFace: font, fontSize: 13, bold: true, color: C.ink, align: 'center', margin: 0, fit: 'shrink' });
  });
  quote(s, '原则：后台提示不写长句，不打断她，只给方向。', 1.2, 5.45, 10.95, 0.68);

  s = ppt.addSlide(); addTop(s, '线索承接提醒', '让金校知道为什么要引导关键词', 12);
  box(s, 0.9, 1.25, 3.6, 2.8, '评估', '判断孩子适不适合\n记录年级、成绩、英语基础、目标方向', C.blue);
  box(s, 4.85, 1.25, 3.6, 2.8, '资料', '发送课程资料包\n进入后续内容培育', C.green);
  box(s, 8.8, 1.25, 3.6, 2.8, '到校', '预约校园参观\n升学规划面谈\n优先A类线索', C.amber);
  quote(s, '金校只负责自然说出关键词，后台负责记录、分级、跟进。', 1.2, 5.4, 10.95, 0.68);

  s = ppt.addSlide(); addTop(s, '周一现场模拟题', '你扮演家长，连续抛问题', 13);
  bullets(s, ['孩子英语一般，可以读吗？', '现在初三还来得及吗？', 'A-Level和OSSD哪个更好？', '你们学校能保证录取吗？', '我想了解学费和名额。'], 1.05, 1.45, 10.5, 16, 0.62);
  quote(s, '观察：她能不能先给判断，再回到评估，而不是直接下绝对结论。', 1.25, 5.72, 10.8, 0.64);

  s = ppt.addSlide(); addTop(s, '培训结束前必须确认', '不确认这些，就不要进入正式开播', 14);
  bullets(s, ['首场主题是否确认', '金校是否接受直播身份表达', '哪些课程、案例、数据可以公开讲', '哪些承诺绝对不能讲', '直播时间、时长、频率是否确认', '关键词承接：评估 / 资料 / 到校是否确认'], 1.05, 1.3, 10.8, 15, 0.55);
  quote(s, '培训结束不是“讲完”，而是拿到能开播的明确口径。', 1.25, 5.7, 10.8, 0.66);

  s = ppt.addSlide(); addTop(s, '培训后下一步', '把训练结果转成首场开播资产', 15);
  box(s, 0.9, 1.25, 3.6, 2.7, '脚本', '首场逐字稿\n控场提示卡\n答疑安全口径', C.blue);
  box(s, 4.85, 1.25, 3.6, 2.7, '物料', '直播封面\n预约文案\n朋友圈预热', C.cyan);
  box(s, 8.8, 1.25, 3.6, 2.7, '后台', '线索表\nA/B/C分级\n销售承接话术', C.green);
  quote(s, '周一培训后，最好马上把首场直播稿定稿，不要拖到开播前。', 1.2, 5.42, 10.95, 0.68);
  await save(ppt, '金校直播_培训者自用执行PPT.pptx');
}

async function main() {
  await buildJin();
  await buildTrainer();
  console.log('created');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
