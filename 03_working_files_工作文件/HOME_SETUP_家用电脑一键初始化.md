# 家用电脑一键初始化说明

目标：在家里的电脑上尽快恢复与公司电脑一致的工作环境，能继续刘校长直播项目、读仓库恢复上下文、运行飞书脚本、继续使用 lark-cli 与项目脚本。

## 一、能自动恢复的部分

只要家里电脑具备以下条件，就能恢复大部分工作流：

- 安装 Git
- 安装 Node.js
- 安装 `lark-cli`
- 安装项目需要的 Codex skills
- `git clone` / `git pull` 拉取同一个 GitHub 仓库
- 读取仓库里的 `START_HERE_先读我.md` 和 `98_project_memory_上下文恢复`

## 二、不能真正一键的部分

以下动作通常仍需要你手动完成一次：

- 飞书账号授权 / `lark-cli auth login`
- 飞书开发者后台 scope 确认
- GitHub 首次登录或凭证确认
- 打开浏览器完成某些交互式授权

也就是说，**环境可以一键准备，身份授权不能完全无人值守**。

## 三、推荐家用电脑初始化顺序

### 1. 安装基础软件

- Git
- Node.js LTS
- Chromium / Edge
- 飞书桌面端（可选）

### 2. 克隆仓库

```powershell
git clone https://github.com/zhouyumi123-droid/codex--.git
```

如果已经克隆过：

```powershell
git pull
```

### 3. 安装或更新 lark-cli

```powershell
npm update -g @larksuite/cli
```

### 4. 安装本项目常用 skills

建议至少保证这些能力可用：

- `lark-cli`
- `lark-shared`
- `lark-base`
- `lark-doc`
- `lark-drive`
- `lark-im`
- `lark-sheets`
- `lark-calendar`
- `lark-task`

如果家里电脑新装，需要逐个确认。

### 5. 进入项目恢复入口

先读：

- `START_HERE_先读我.md`
- `projects/奥斯翰国际学校/98_project_memory_上下文恢复/START_HERE_恢复上下文.md`
- `projects/奥斯翰国际学校/98_project_memory_上下文恢复/CURRENT_STATE_当前状态.md`
- `projects/奥斯翰国际学校/98_project_memory_上下文恢复/TASK_LOG_执行日志.md`

### 6. 继续工作

新会话直接说：

```text
继续刘校直播项目，按 START_HERE_先读我.md 恢复上下文。
```

## 四、推荐“一键包”内容

如果要做成更接近一键的方式，建议准备一个家用电脑启动脚本，里面做这些事：

1. 检查 Git 是否存在。
2. 检查 Node.js 是否存在。
3. 检查 `lark-cli` 是否存在。
4. 执行 `git pull`。
5. 打开 `START_HERE_先读我.md`。
6. 提示你去执行 `lark-cli auth login`。

## 五、最稳的工作习惯

家里电脑和公司电脑都保持同一个仓库，所有关键节点都 commit + push。  
这样你回家后不需要“记住脑子里的内容”，只需要“恢复仓库里的上下文”。

