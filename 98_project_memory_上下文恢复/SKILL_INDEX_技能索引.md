# 奥斯翰项目 Skill 索引

本文件用于恢复上下文时提醒 Codex：奥斯翰项目常用技能已经同步到全局 Codex 技能目录，可以在任务中直接点名使用。

## 生效位置

| Root | 用途 |
| --- | --- |
| `C:\Users\Administrator\.codex\skills` | Codex 主要技能目录，`SKILL.md` 在这里才最容易被当前会话发现。 |
| `C:\Users\Administrator\.agents\skills` | 上游共享技能目录，用于同步和备份。 |

## 为什么会跳过技能

技能不会每次自动全文加载。Codex 会先看技能的 `name` 和 `description`，只有任务匹配或用户点名时，才读取对应 `SKILL.md`。

如果必须使用某个技能，请在任务里直接写技能名，例如：

```text
用 brochure-design-generation 和 pdf-design 做这版招生宣传册。
```

## 奥斯翰项目常用技能

| 技能 | 适用任务 |
| --- | --- |
| `brochure-design-generation` | 招生宣传册、教育类宣传册结构、版式、内容页规划。 |
| `pdf-design` | 高级 PDF 视觉设计、打印版式、预览迭代、交付文件。 |
| `frontend-design` | HTML 预览稿、网页式视觉稿、交互页面。 |
| `ui-ux-pro-max` | UI/UX 细化、控件、信息架构、界面体验优化。 |
| `document-skills` | 综合文档制作、文档转换、交付物整理。 |
| `docx` | Word 文档、招生文案、说明文件、正式交付文档。 |
| `pdf` | PDF 拆解、合并、检查、导出、页面处理。 |
| `pptx` | 演示文稿、路演材料、汇报材料。 |
| `xlsx` | 表格、清单、排期、预算和数据整理。 |
| `lark-doc` | 飞书云文档创建和编辑。 |
| `lark-base` | 飞书多维表格 Base。 |
| `lark-sheets` | 飞书电子表格。 |
| `lark-im` | 飞书消息、群聊、通知。 |
| `lark-workflow-meeting-summary` | 会议纪要整理。 |
| `planning-with-files-zh` | 需要长期执行、断点恢复、文件化计划的任务。 |

## 已补齐的顶层技能

2026-06-05 已把以下 `.agents` 顶层技能同步到 `.codex` 顶层技能目录：

`brochure-design-generation`, `pdf-design`, `lark-approval`, `lark-attendance`, `lark-base`, `lark-calendar`, `lark-contact`, `lark-doc`, `lark-drive`, `lark-event`, `lark-im`, `lark-mail`, `lark-markdown`, `lark-minutes`, `lark-okr`, `lark-openapi-explorer`, `lark-shared`, `lark-sheets`, `lark-skill-maker`, `lark-slides`, `lark-task`, `lark-vc`, `lark-vc-agent`, `lark-whiteboard`, `lark-wiki`, `lark-workflow-meeting-summary`, `lark-workflow-standup-report`.

同时已规范化 `.codex` 副本中 `pdf-design` 和 `lark-*` 的 `SKILL.md` frontmatter，移除或收拢当前 Codex 校验器不接受的顶层字段。`.agents` 上游原件未改动。
