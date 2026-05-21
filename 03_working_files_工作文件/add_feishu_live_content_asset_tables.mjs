import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const cli = "C:\\Users\\Administrator\\AppData\\Roaming\\npm\\lark-cli.cmd";
const baseToken = "TlV5boVxna6LTLsdl5PcFbRunv4";
const as = process.argv.includes("--as-user") ? "user" : "bot";
const forceSeed = process.argv.includes("--force-seed");
const resultPath = "feishu_live_content_asset_tables_result.json";
const shouldSeed = process.argv.includes("--seed") && (forceSeed || !existsSync(resultPath));
const seedTableFilters = process.argv
  .filter(arg => arg.startsWith("--seed-table="))
  .map(arg => arg.slice("--seed-table=".length));

mkdirSync(".lark_tmp", { recursive: true });

function run(args) {
  const finalArgs = [...args, "--as", as];
  console.log(`\n> ${cli} ${finalArgs.join(" ")}`);
  const out = execFileSync(cli, finalArgs, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    shell: true
  });
  if (out.trim()) console.log(out.trim());
  return JSON.parse(out);
}

function writeJson(name, obj) {
  writeFileSync(name, JSON.stringify(obj, null, 2), "utf8");
  return `@${name}`;
}

function safeName(value) {
  return String(value).replace(/[\\/:*?"<>|\s]+/g, "_");
}

function getTableId(table) {
  return table?.id || table?.table_id;
}

function getCreatedTableId(res) {
  return res?.data?.table?.id || res?.data?.table?.table_id || res?.table?.id || res?.table?.table_id;
}

function listTables() {
  return run(["base", "+table-list", "--base-token", baseToken, "--offset", "0", "--limit", "100"]).data.tables;
}

function listFields(tableId) {
  return run(["base", "+field-list", "--base-token", baseToken, "--table-id", tableId, "--offset", "0", "--limit", "200"]).data.fields;
}

function listViews(tableId) {
  return run(["base", "+view-list", "--base-token", baseToken, "--table-id", tableId, "--offset", "0", "--limit", "200"]).data.views;
}

function ensureTable(existingTables, tableName) {
  const found = existingTables.find(t => t.name === tableName || t.table_name === tableName);
  if (found) return getTableId(found);
  const created = run(["base", "+table-create", "--base-token", baseToken, "--name", tableName]);
  return getCreatedTableId(created);
}

function ensureFields(tableId, tableName, fields) {
  const existingFields = listFields(tableId);
  const names = new Set(existingFields.map(f => f.name));
  for (const field of fields) {
    if (names.has(field.name)) continue;
    run([
      "base", "+field-create",
      "--base-token", baseToken,
      "--table-id", tableId,
      "--json", writeJson(`.lark_tmp/content_asset_field_${safeName(tableName)}_${safeName(field.name)}.json`, field)
    ]);
    names.add(field.name);
  }
}

function ensureViews(tableId, tableName, views) {
  const existingViews = listViews(tableId);
  const names = new Set(existingViews.map(v => v.name));
  for (const view of views || []) {
    if (names.has(view.name)) continue;
    run([
      "base", "+view-create",
      "--base-token", baseToken,
      "--table-id", tableId,
      "--json", writeJson(`.lark_tmp/content_asset_view_${safeName(tableName)}_${safeName(view.name)}.json`, view)
    ]);
    names.add(view.name);
  }
}

function seed(tableId, tableName, payload) {
  if (!shouldSeed || !payload) return false;
  if (seedTableFilters.length > 0 && !seedTableFilters.includes(tableName)) return false;
  run([
    "base", "+record-batch-create",
    "--base-token", baseToken,
    "--table-id", tableId,
    "--json", writeJson(`.lark_tmp/content_asset_seed_${safeName(tableName)}.json`, payload)
  ]);
  return true;
}

const courseOptions = [
  { name: "A-Level" },
  { name: "DSE" },
  { name: "日韩方向" },
  { name: "港澳台联考" },
  { name: "新加坡方向" },
  { name: "综合择校" }
];

const newTables = [
  {
    name: "总裁访谈记录表",
    fields: [
      { type: "auto_number", name: "访谈编号", style: { rules: [{ type: "text", text: "INT-" }, { type: "created_time", date_format: "yyyyMM" }, { type: "incremental_number", length: 3 }] } },
      { type: "text", name: "访谈主题" },
      { type: "datetime", name: "访谈日期", style: { format: "yyyy-MM-dd HH:mm" } },
      { type: "text", name: "访谈对象" },
      { type: "select", name: "访谈状态", multiple: false, options: [{ name: "待访谈" }, { name: "已访谈" }, { name: "待整理" }, { name: "已整理" }, { name: "已入库" }] },
      { type: "text", name: "录音/转写链接" },
      { type: "text", name: "核心结论" },
      { type: "text", name: "待追问问题" },
      { type: "text", name: "可生成内容" },
      { type: "text", name: "负责人" }
    ],
    views: [
      { name: "访谈总览", type: "grid" },
      { name: "待整理访谈", type: "grid" },
      { name: "访谈状态看板", type: "kanban" }
    ],
    seed: {
      fields: ["访谈主题", "访谈日期", "访谈对象", "访谈状态", "核心结论", "待追问问题", "可生成内容", "负责人"],
      rows: [
        ["6月视频号试播内容资产访谈", "2026-05-20 10:00:00", "刘校长/总裁", "待访谈", "围绕课程体系、学生画像、学校优势、家长问题、表达禁区完成结构化采集", "A-Level、DSE、日韩方向的准确口径；升学结果和招生承诺边界", "选题、脚本、顾问话术、切片、复盘", "卓"]
      ]
    }
  },
  {
    name: "课程内容资产表",
    fields: [
      { type: "select", name: "课程方向", multiple: false, options: courseOptions },
      { type: "text", name: "适合学生" },
      { type: "text", name: "不适合学生" },
      { type: "text", name: "入学基础" },
      { type: "text", name: "学习难点" },
      { type: "text", name: "升学出口" },
      { type: "text", name: "总裁表达原话" },
      { type: "text", name: "可直播角度" },
      { type: "text", name: "可切片角度" },
      { type: "checkbox", name: "是否可用于首场直播" },
      { type: "select", name: "内容状态", multiple: false, options: [{ name: "待访谈" }, { name: "待补充" }, { name: "可用" }, { name: "需审核" }] },
      { type: "text", name: "审核备注" }
    ],
    views: [
      { name: "课程资产总览", type: "grid" },
      { name: "首场可用资产", type: "grid" },
      { name: "按课程方向看板", type: "kanban" }
    ],
    seed: {
      fields: ["课程方向", "适合学生", "不适合学生", "入学基础", "学习难点", "升学出口", "总裁表达原话", "可直播角度", "可切片角度", "是否可用于首场直播", "内容状态", "审核备注"],
      rows: [
        ["A-Level", "待刘校补充：适合有明确英联邦方向、学科选择倾向、愿意做长期规划的学生", "待刘校补充", "英语、数学、学习习惯、目标国家", "学科英语、考试节奏、选科规划", "英联邦及多国本科申请方向，具体结果不做承诺", "待访谈原话", "什么样的孩子适合 A-Level", "A-Level到底难不难/家长最容易误解的5件事", true, "待访谈", "首场重点补齐"],
        ["DSE", "待刘校补充：适合关注香港方向、中文英文基础需综合判断的家庭", "待刘校补充", "中文、英文、学科基础、目标地区", "双语能力、科目组合、升学路径判断", "香港及其他可申请方向，需按学生情况判断", "待访谈原话", "A-Level 与 DSE 怎么选", "DSE是不是更稳/哪些孩子更适合DSE", false, "待访谈", "第二或第三场使用"],
        ["日韩方向", "待刘校补充：适合有日韩升学兴趣、能接受语言学习周期的学生", "待刘校补充", "语言兴趣、家庭预算、目标专业", "语言学习周期、文化适应、升学节奏", "日韩本科方向，需按语言与专业规划判断", "待访谈原话", "日韩方向是不是低成本选择", "日韩方向适合什么孩子", false, "待访谈", "看6月是否纳入直播"],
        ["港澳台联考", "待刘校补充", "待刘校补充", "身份条件、学科基础、目标院校", "政策条件、备考节奏、信息准确性", "按当年政策与学生条件判断", "待访谈原话", "港澳台联考是否适合转轨家庭", "家长最容易误解的港澳台联考", false, "待访谈", "需要严格审核政策口径"],
        ["新加坡方向", "待刘校补充", "待刘校补充", "英文、数学、目标阶段", "考试体系、适应能力、时间规划", "新加坡方向升学路径，需按学生基础判断", "待访谈原话", "新加坡方向适合哪些孩子", "新加坡方向和英联邦路径怎么选", false, "待访谈", "待决定是否作为直播选题"],
        ["综合择校", "路线不确定、需要先做孩子适配判断的家庭", "只想听保证结果、不愿意提供孩子真实情况的家庭", "孩子年级、成绩、英语、家庭目标、预算", "路线选择过早定死、信息不完整", "先做路径判断，再选课程和学校", "待访谈原话", "先判断孩子，再判断课程", "国际学校不是成绩不好才去", true, "待访谈", "首场可用"]
      ]
    }
  },
  {
    name: "学校优势资产表",
    fields: [
      { type: "select", name: "优势类型", multiple: false, options: [{ name: "管理优势" }, { name: "师资优势" }, { name: "课程优势" }, { name: "升学优势" }, { name: "费用和性价比" }, { name: "校园环境" }, { name: "住宿/安全/陪伴" }, { name: "过往案例" }] },
      { type: "text", name: "具体内容" },
      { type: "text", name: "家长关心点" },
      { type: "text", name: "支撑案例" },
      { type: "text", name: "直播表达方式" },
      { type: "text", name: "禁止夸大点" },
      { type: "text", name: "可切片角度" },
      { type: "select", name: "优先级", multiple: false, options: [{ name: "P0" }, { name: "P1" }, { name: "P2" }] },
      { type: "select", name: "状态", multiple: false, options: [{ name: "待访谈" }, { name: "待补充" }, { name: "可用" }, { name: "需审核" }] }
    ],
    views: [
      { name: "优势资产总览", type: "grid" },
      { name: "P0优先表达", type: "grid" },
      { name: "按优势类型看板", type: "kanban" }
    ],
    seed: {
      fields: ["优势类型", "具体内容", "家长关心点", "支撑案例", "直播表达方式", "禁止夸大点", "可切片角度", "优先级", "状态"],
      rows: [
        ["管理优势", "待刘校补充学校日常管理、学习监督、班级管理方式", "孩子会不会没人管、能不能稳定学习", "待补充匿名案例", "讲清楚学校如何帮助孩子建立节奏", "不能说保证每个孩子都自律、保证成绩提升", "国际学校是不是太轻松", "P0", "待访谈"],
        ["师资优势", "待刘校补充师资结构、课程团队、教研机制", "老师是否专业、是否懂国际课程", "待补充", "讲师资如何支持课程和升学，不堆头衔", "不能夸大单个老师或承诺师资结果", "家长怎么看国际学校师资", "P1", "待访谈"],
        ["课程优势", "待刘校补充 A-Level、DSE、日韩等路径设计", "孩子到底该选哪条路线", "待补充", "从学生适配和升学目标讲课程，而不是只介绍课程名", "不能说某条路线一定更容易", "先判断孩子再选路线", "P0", "待访谈"],
        ["升学优势", "待刘校补充升学支持流程和可公开案例", "读完能去哪里、是否值得", "需使用可公开且合规案例", "讲方法和路径，不讲保证结果", "不能保录、保名校、保排名", "升学不是承诺，是规划和执行", "P0", "需审核"],
        ["费用和性价比", "待刘校补充费用结构和价值点", "费用值不值、和其他学校怎么比", "待补充", "讲投入对应的课程、管理和升学支持", "不能贬低竞品或只打价格战", "国际学校费用到底值不值", "P1", "待访谈"],
        ["校园环境", "待刘校补充校区环境、功能空间、参观重点", "孩子学习生活是否安心", "待补充", "用到校参观视角讲具体细节", "不能过度包装", "到校看学校应该看什么", "P2", "待访谈"],
        ["住宿/安全/陪伴", "待刘校补充住宿管理、安全机制、生活支持", "住校是否安全、孩子是否被照顾", "待补充", "讲具体机制和日常细节", "不能说绝对不会出问题", "住校家长最该问的3件事", "P1", "待访谈"],
        ["过往案例", "待刘校补充可匿名讲述的学生转变案例", "别人家的孩子是否有参考价值", "必须匿名且可公开", "用案例讲判断标准，不做结果承诺", "不能透露隐私、不能把个案当普遍结果", "一个孩子转轨前后发生了什么", "P1", "需审核"]
      ]
    }
  },
  {
    name: "家长问题库",
    fields: [
      { type: "text", name: "问题原文" },
      { type: "select", name: "问题分类", multiple: false, options: [{ name: "课程选择" }, { name: "转轨时机" }, { name: "英语基础" }, { name: "学校管理" }, { name: "升学出口" }, { name: "费用价值" }, { name: "到校咨询" }, { name: "学校对比" }] },
      { type: "text", name: "家长焦虑" },
      { type: "text", name: "总裁回答" },
      { type: "text", name: "顾问补充回答" },
      { type: "checkbox", name: "是否适合直播" },
      { type: "checkbox", name: "是否适合切片" },
      { type: "text", name: "建议直播主题" },
      { type: "select", name: "状态", multiple: false, options: [{ name: "待访谈" }, { name: "待审核" }, { name: "可用" }, { name: "仅私聊使用" }] }
    ],
    views: [
      { name: "问题库总览", type: "grid" },
      { name: "可直播问题", type: "grid" },
      { name: "可切片问题", type: "grid" },
      { name: "按问题分类看板", type: "kanban" }
    ],
    seed: {
      fields: ["问题原文", "问题分类", "家长焦虑", "总裁回答", "顾问补充回答", "是否适合直播", "是否适合切片", "建议直播主题", "状态"],
      rows: [
        ["成绩不好才读国际学校吗？", "学校对比", "担心国际学校是退路，怕孩子被标签化", "待刘校补充", "先了解孩子成绩结构、英语和目标，不用简单用分数判断", true, true, "什么样的孩子适合国际学校", "待访谈"],
        ["国际学校会不会太轻松？", "学校管理", "担心孩子没人管、学习松散", "待刘校补充", "可以引导家长了解学校管理、作业、考试和反馈机制", true, true, "国际学校不是轻松，而是换一种学习要求", "待访谈"],
        ["初三转国际路线晚不晚？", "转轨时机", "中考后时间紧，怕错过窗口", "待刘校补充", "先判断英语、数学、学习习惯和目标国家，再判断方案", true, true, "中考后转国际路线晚不晚", "待访谈"],
        ["A-Level 和 DSE 怎么选？", "课程选择", "怕选错路线影响升学", "待刘校补充", "顾问可收集目标地区、英文中文基础、年级和预算后做初判", true, true, "A-Level 和 DSE 怎么选", "待访谈"],
        ["英语不好能不能读？", "英语基础", "担心孩子跟不上国际课程", "待刘校补充", "先看年级、词汇、阅读、学习意愿和可投入时间", true, true, "英语弱的孩子能不能转国际课程", "待访谈"],
        ["奥斯翰和其他学校差别在哪里？", "学校对比", "不知道为什么选择奥斯翰", "待刘校补充", "不贬低其他学校，围绕孩子适配和学校承接能力说明", true, false, "到校前应该如何比较国际学校", "待访谈"],
        ["读完以后能去哪些大学？", "升学出口", "担心结果不确定", "待刘校补充", "强调按学生基础、课程路径和申请执行判断，不做保证", true, true, "国际课程升学出口到底怎么看", "待审核"],
        ["学校管理严不严？", "学校管理", "怕孩子自律不够", "待刘校补充", "顾问可邀请家长到校看课堂、宿舍和管理机制", true, true, "国际学校管理到底看什么", "待访谈"],
        ["费用值不值？", "费用价值", "担心投入和结果不匹配", "待刘校补充", "从课程、管理、升学支持和孩子适配解释价值", true, true, "国际学校费用值不值", "待访谈"],
        ["什么时候适合到校咨询？", "到校咨询", "不知道是否已经到需要面谈的阶段", "待刘校补充", "年级窗口、路线不确定、孩子基础需要评估时建议到校", true, true, "什么情况建议尽快到校评估", "待访谈"]
      ]
    }
  },
  {
    name: "表达禁区清单",
    fields: [
      { type: "text", name: "禁区表达" },
      { type: "select", name: "风险类型", multiple: false, options: [{ name: "升学承诺" }, { name: "成绩承诺" }, { name: "招生逼单" }, { name: "竞品贬低" }, { name: "政策不确定" }, { name: "隐私风险" }, { name: "过度焦虑" }] },
      { type: "text", name: "风险原因" },
      { type: "text", name: "替代表达" },
      { type: "text", name: "适用场景" },
      { type: "text", name: "审核人" },
      { type: "select", name: "状态", multiple: false, options: [{ name: "待确认" }, { name: "已确认禁用" }, { name: "可谨慎使用" }, { name: "已替换" }] }
    ],
    views: [
      { name: "禁区总览", type: "grid" },
      { name: "待确认禁区", type: "grid" },
      { name: "按风险类型看板", type: "kanban" }
    ],
    seed: {
      fields: ["禁区表达", "风险类型", "风险原因", "替代表达", "适用场景", "审核人", "状态"],
      rows: [
        ["一定能录取", "升学承诺", "结果承诺过强，容易形成不实预期", "我们会根据孩子基础和目标，制定更匹配的申请和学习路径", "升学出口、顾问私信、直播答疑", "刘校长/总裁", "待确认"],
        ["保录某某学校", "升学承诺", "涉及保录承诺，风险高", "可以参考过往路径和申请方法，但最终结果取决于学生基础、过程投入和当年申请情况", "升学案例、家长咨询", "刘校长/总裁", "待确认"],
        ["低分也能轻松进名校", "成绩承诺", "夸大低分转轨结果，容易误导家长", "成绩只是一个维度，要看英语、学科能力、学习习惯和目标是否匹配", "低分转轨话题", "刘校长/总裁", "待确认"],
        ["不用努力也能出国", "过度焦虑", "弱化学习要求，不符合教育实际", "国际路线不是更轻松，而是换了一套评价体系和学习方法", "课程解释、家长答疑", "刘校长/总裁", "待确认"],
        ["现在不报名就没有名额", "招生逼单", "容易被理解为恐吓式逼单", "如果家长已经明确方向，建议尽早做评估和到校沟通，避免错过准备窗口", "直播 CTA、顾问跟进", "刘校长/总裁", "待确认"],
        ["其他学校都不适合你", "竞品贬低", "贬低竞品，影响专业可信度", "不同学校适合不同孩子，我们先看孩子目标和学习状态是否匹配", "学校对比问题", "刘校长/总裁", "待确认"],
        ["每个孩子都能明显提分", "成绩承诺", "个体差异大，不能承诺普遍结果", "学校会通过管理和课程支持帮助孩子建立学习节奏，但结果需要看孩子基础和投入", "管理优势、学习效果", "刘校长/总裁", "待确认"]
      ]
    }
  },
  {
    name: "内容资产自动化规则表",
    fields: [
      { type: "text", name: "规则名称" },
      { type: "select", name: "所属阶段", multiple: false, options: [{ name: "访谈" }, { name: "入库" }, { name: "选题" }, { name: "脚本" }, { name: "复盘" }] },
      { type: "text", name: "触发表/动作" },
      { type: "text", name: "触发条件" },
      { type: "text", name: "自动动作" },
      { type: "select", name: "执行方式", multiple: false, options: [{ name: "飞书自动化" }, { name: "飞书自动化+AI" }, { name: "人工确认+AI" }, { name: "后续API" }] },
      { type: "select", name: "优先级", multiple: false, options: [{ name: "P0" }, { name: "P1" }, { name: "P2" }] },
      { type: "select", name: "状态", multiple: false, options: [{ name: "待配置" }, { name: "测试中" }, { name: "已配置" }, { name: "暂停" }] },
      { type: "text", name: "负责人" },
      { type: "text", name: "配置备注" }
    ],
    views: [
      { name: "规则总览", type: "grid" },
      { name: "P0待配置", type: "grid" },
      { name: "按阶段看板", type: "kanban" }
    ],
    seed: {
      fields: ["规则名称", "所属阶段", "触发表/动作", "触发条件", "自动动作", "执行方式", "优先级", "状态", "负责人", "配置备注"],
      rows: [
        ["总裁访谈完成后生成内容资产", "访谈", "总裁访谈记录表", "访谈状态改为已访谈", "提醒运营使用AI整理指令，生成课程资产、优势资产、家长问题库和表达禁区", "人工确认+AI", "P0", "待配置", "卓", "首场前先半自动执行，确认质量后再配置自动化"],
        ["课程资产可用后生成选题", "选题", "课程内容资产表", "内容状态改为可用", "生成10-20个直播选题，写入选题库并标记试播建议", "飞书自动化+AI", "P0", "待配置", "卓", "优先生成首场和前3场主题"],
        ["选题进入排期后生成脚本任务", "脚本", "选题库", "是否进入排期勾选", "创建脚本生产表记录，带入访谈来源、顾问承接话术和切片角度", "飞书自动化", "P0", "待配置", "卓", "刘校只审核核心观点，不从零写脚本"],
        ["脚本定稿前检查表达禁区", "脚本", "脚本生产表", "脚本状态从初稿进入已审前", "对照表达禁区清单检查，确认后勾选表达禁区已检查", "人工确认+AI", "P0", "待配置", "卓", "所有直播脚本和顾问话术都要过一遍"]
      ]
    }
  }
];

const supplementalFields = {
  "选题库": [
    { type: "text", name: "来源内容资产" },
    { type: "text", name: "AI生成依据" },
    { type: "checkbox", name: "是否进入排期" },
    { type: "select", name: "试播建议", multiple: false, options: [{ name: "首场优先" }, { name: "第二周验证" }, { name: "第三周转化" }, { name: "后置" }] }
  ],
  "脚本生产表": [
    { type: "text", name: "访谈来源" },
    { type: "text", name: "顾问承接话术" },
    { type: "text", name: "切片角度" },
    { type: "checkbox", name: "表达禁区已检查" }
  ],
  "直播排期表": [
    { type: "text", name: "内容资产来源" },
    { type: "checkbox", name: "总裁已审核核心观点" },
    { type: "text", name: "首场试播验收口径" }
  ],
  "自动化规则清单": [
    { type: "select", name: "内容资产阶段", multiple: false, options: [{ name: "访谈" }, { name: "入库" }, { name: "选题" }, { name: "脚本" }, { name: "复盘" }] }
  ]
};

const automationSeed = {
  fields: ["规则名称", "触发表", "触发条件", "自动动作", "优先级", "实现方式", "状态", "负责人", "备注", "内容资产阶段"],
  rows: [
    ["总裁访谈完成后生成内容资产", "总裁访谈记录表", "访谈状态改为已访谈", "提醒运营用AI整理指令生成课程资产、优势资产、家长问题库和表达禁区", "P0", "飞书自动化 + AI", "待配置", "卓", "先半自动执行，AI输出后人工确认再入库", "访谈"],
    ["课程资产可用后生成选题", "课程内容资产表", "内容状态改为可用", "从课程资产生成直播选题并写入选题库", "P0", "飞书自动化 + AI", "待配置", "卓", "首批先生成10-20个选题", "选题"],
    ["选题进入排期后生成脚本任务", "选题库", "是否进入排期勾选", "创建脚本生产表记录并提醒刘校审核核心观点", "P0", "飞书自动化", "待配置", "卓", "脚本不让刘校从零写，只审核核心观点", "脚本"],
    ["脚本定稿前检查表达禁区", "脚本生产表", "脚本状态改为已审前", "要求勾选表达禁区已检查，并对照表达禁区清单修改", "P0", "人工检查 + AI辅助", "待配置", "卓", "降低直播话术风险", "脚本"]
  ]
};

const result = {
  baseToken,
  tables: {},
  updatedTables: {},
  as,
  seededInitialRecords: false,
  seededAutomationRules: false
};

let existingTables = listTables();

for (const table of newTables) {
  const tableId = ensureTable(existingTables, table.name);
  if (!tableId) throw new Error(`Table ${table.name} has no table id.`);
  result.tables[table.name] = tableId;
  existingTables = listTables();
  ensureFields(tableId, table.name, table.fields);
  ensureViews(tableId, table.name, table.views);
  if (seed(tableId, table.name, table.seed)) result.seededInitialRecords = true;
}

existingTables = listTables();
for (const [tableName, fields] of Object.entries(supplementalFields)) {
  const found = existingTables.find(t => t.name === tableName || t.table_name === tableName);
  const tableId = getTableId(found);
  if (!tableId) continue;
  result.updatedTables[tableName] = tableId;
  ensureFields(tableId, tableName, fields);
}

const automationTable = existingTables.find(t => t.name === "自动化规则清单" || t.table_name === "自动化规则清单");
const automationTableId = getTableId(automationTable);
if (automationTableId && seed(automationTableId, "自动化规则清单", automationSeed)) {
  result.seededAutomationRules = true;
}

writeFileSync(resultPath, JSON.stringify(result, null, 2), "utf8");
console.log("\nDONE");
console.log(JSON.stringify(result, null, 2));
