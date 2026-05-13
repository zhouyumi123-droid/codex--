# 当前状态：奥斯翰国际学校项目

最后更新：2026-05-13 17:45  
当前主线：刘校长直播工作流 0-1 搭建与 6-7 月线上运营策略落地  
项目负责人语境：用户正在为奥斯翰市场部线上端搭建直播、新媒体、AI 工具、飞书自动化和招生线索闭环。

## 当前最重要目标

在 2026-06-01 前完成刘校长直播试运营的全部基础搭建，让 2026-06-01 到 2026-06-30 的直播试运营可以形成完整闭环：

选题 -> 脚本 -> 封面 -> 预约 -> 预热 -> 直播 -> 评论问题收集 -> 线索登记 -> 顾问跟进 -> 复盘 -> 切片 -> 二次分发 -> 下一场优化

## 已完成

1. 已读取并参考预算表：
   - `e:\Desktop\OXSTAND_软件费用申请表_2026线上端业务.xlsx`
   - 固定软件年度费用口径：25,870 元。
   - 不含千川、视频号广告、Dou+、薯条等消耗型投流预算。
   - 优先开通：飞书商业版/AI、Claude Max、剪映 SVIP、蝉妈妈专业版、Gemini Flash Image。

2. 已完成并重写刘校长直播搭建方案：
   - `d:\codex\cdx-IDE\projects\奥斯翰国际学校\00_brief_项目简述\刘校长直播工作流_0到1搭建方案.md`
   - 文件约 601 行。
   - 内容包括：5.13-6.1 搭建期、6 月试运营、7 月优化放量、飞书工作台 8 张表、自动化规则、账号与软件开通顺序、首批 30 个选题、SOP、团队分工、指标、周报模板、风险应对。

3. 已建立本上下文恢复机制：
   - `98_project_memory_上下文恢复/START_HERE_恢复上下文.md`
   - `98_project_memory_上下文恢复/CURRENT_STATE_当前状态.md`
   - `98_project_memory_上下文恢复/TASK_LOG_执行日志.md`
   - `98_project_memory_上下文恢复/CHECKPOINT_TEMPLATE_断点记录模板.md`

4. 已建立本地 Git 仓库：
   - 仓库路径：`d:\codex\cdx-IDE\projects\奥斯翰国际学校`
   - 首次提交：`ceda974 Initial commit for Oxstand project`
   - 远端仓库：`https://github.com/zhouyumi123-droid/codex--`
   - 当前分支：`main`
   - 远端跟踪：`origin/main`

## 当前未完成/可继续推进

下一步建议优先级：

1. 飞书开发者后台确认并发布 `base:app:create` 权限：
   - 权限链接：`https://open.feishu.cn/page/scope-apply?clientID=cli_a9763cda117a1bd7&scopes=base%3Aapp%3Acreate`
   - 当前 CLI 调用 `base +base-create` 返回：`App scope not enabled: required scope base:app:create [99991672]`
2. 权限生效后运行：
   - `node .\03_working_files_工作文件\create_feishu_live_base.mjs`
3. 继续生成首批 3 场直播脚本：
   - 北大校长视角：什么样的孩子适合读国际学校？
   - A-Level 到底难不难？家长最容易误解的 5 件事
   - 中考后再考虑国际路线，晚不晚？
4. 生成直播封面提示词/视觉模板说明。
5. 生成顾问承接 SOP 和 A/B/C 线索分级话术。
6. 如用户授权使用飞书 CLI，可进一步创建飞书文档、多维表格或任务。
7. 后续每完成重要文件变更，应执行 `git status`、`git add`、`git commit`、`git push`，同步到 GitHub。

## 关键文件

| 文件 | 用途 |
| --- | --- |
| `00_brief_项目简述\刘校长直播工作流_0到1搭建方案.md` | 当前主方案 |
| `e:\Desktop\OXSTAND_软件费用申请表_2026线上端业务.xlsx` | 软件预算和工具优先级依据 |
| `README.md` | 项目目录结构说明 |
| `98_project_memory_上下文恢复\START_HERE_恢复上下文.md` | 下次恢复入口 |
| `98_project_memory_上下文恢复\TASK_LOG_执行日志.md` | 已执行动作日志 |
| `03_working_files_工作文件\feishu_live_base_spec.json` | 飞书 Base 搭建规格 |
| `03_working_files_工作文件\create_feishu_live_base.mjs` | 飞书 Base 一键创建脚本 |
| `03_working_files_工作文件\飞书权限阻塞与继续执行说明.md` | 当前飞书权限阻塞说明 |

## 重要业务判断

- 直播不是单场活动，而是招生增长系统中的主工作流。
- 6 月重点是试运营和闭环，不应只追求单场爆发。
- 7 月再进行主题复用、矩阵短视频和小预算投流测试。
- 投流预算应与固定软件年费分开管理。
- 飞书应作为排期、任务、素材、线索、复盘、自动化的中枢。
- 刘校长直播定位建议使用“刘校长国际教育决策直播间”。

## 恢复后的第一动作

如果用户没有给新指令，默认继续做：

```text
把刘校长直播方案拆成飞书多维表格字段设计和首批执行任务清单。
```
