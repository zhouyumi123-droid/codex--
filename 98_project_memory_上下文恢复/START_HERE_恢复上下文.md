# 奥斯翰项目恢复入口

用途：如果 Codex、Cursor、电脑或电源意外关闭，下次继续奥斯翰项目时，先读取本文件，再读取同目录下的状态文件。

## 恢复顺序

1. 先读本文件。
2. 读 `CURRENT_STATE_当前状态.md`。
3. 读 `TASK_LOG_执行日志.md`。
4. 读 `SESSION_HISTORY_会话历史.md`，查看不可覆盖的长期过程记录。
5. 如需继续具体文件，按 `CURRENT_STATE_当前状态.md` 里的“关键文件”列表打开。
6. 每完成一个阶段，更新 `CURRENT_STATE_当前状态.md`，并追加 `TASK_LOG_执行日志.md` / `SESSION_HISTORY_会话历史.md`。

## 给 Codex 的恢复指令

如果用户说“继续奥斯翰项目”“恢复上次任务”“接着刘校直播方案做”，请先读取：

```text
d:\codex\cdx-IDE\projects\奥斯翰国际学校\98_project_memory_上下文恢复\START_HERE_恢复上下文.md
d:\codex\cdx-IDE\projects\奥斯翰国际学校\98_project_memory_上下文恢复\CURRENT_STATE_当前状态.md
d:\codex\cdx-IDE\projects\奥斯翰国际学校\98_project_memory_上下文恢复\TASK_LOG_执行日志.md
d:\codex\cdx-IDE\projects\奥斯翰国际学校\98_project_memory_上下文恢复\SESSION_HISTORY_会话历史.md
```

然后再根据当前任务继续执行，不要只依赖聊天窗口历史。

## 用户可直接说的恢复口令

```text
继续奥斯翰项目，先读 98_project_memory_上下文恢复 里的恢复入口和当前状态。
```

## 为什么这样做

聊天窗口、软件状态和电源都可能中断，但项目文件会保存在本地磁盘。把上下文写入项目目录后，下次任何会话只要能访问这个项目文件夹，就能恢复：

- 当前目标
- 已完成事项
- 未完成事项
- 关键文件路径
- 下一步执行顺序
- 重要业务判断
# 奥斯翰项目恢复入口

恢复本项目上下文时，先读取本目录下的关键文件：

- `CURRENT_STATE_当前状态.md`
- `TASK_LOG_执行日志.md`
- `SESSION_HISTORY_会话历史.md`
- `SKILL_INDEX_技能索引.md`

如果任务涉及招生宣传册、PDF 设计、HTML 预览、飞书或文档交付，优先查看 `SKILL_INDEX_技能索引.md`，并在任务中点名对应技能，例如 `brochure-design-generation`、`pdf-design`、`frontend-design`、`lark-doc`、`lark-base`。
