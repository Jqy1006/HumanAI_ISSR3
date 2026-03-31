# HumanAI GSoC 2026 筛选测试项目

## 项目：决策测试

这是一个针对 GSoC 2026 筛选测试创建的工作原型——一个基于 Web 的行为实验，旨在衡量 AI 界面的线索特征（如代理名称、语气、置信度架构）如何影响人类的信任感和使用依赖。

## 环境要求

- **Node.js** ≥ 18
- **npm** ≥ 9
- **Python 3** + `pandas` + `matplotlib`（仅作最终分析出图用）

## 如何运行

```bash
# 1. 安装依赖包
npm install

# 2. 启动本地开发服务器
npm run dev

# 3. 访问实验网页
open http://localhost:3000
```

### 运行分析脚本

```bash
pip install pandas matplotlib   # 第一次运行前安装依赖
python3 scripts/analyze_logs.py
```

科研级的出图结果会自动保存在 `logs/analysis_output/` 文件夹下。

### 运行自动冒烟测试

```bash
# 需要事先安装：jq (brew install jq)
bash scripts/smoke_test.sh
```

该测试为全流程自动化打点测试，且为**非破坏性测试**——不会清空或污染真实收集到的用户实验数据。

### 清空/重置实验记录 (Reset Logs)

如果想清空历史测试数据，只需在终端运行：
```bash
rm -f logs/decisions.json logs/decisions.csv logs/assignment_counter.json
```

---

## 实验逻辑与架构

### 线索操控系统 (Cue Manipulation System)

实验采用了**模块化线索系统**（Modular Cue System）。实验所分配的“条件 (Condition)”是由不同、且相互独立的线索特征随机拼装组成的：

| 线索特征 (Cue Dimension) | 选项 A | 选项 B |
|-----------------------|---------|---------|
| **代理名称 (Agent Name)** | `Decision Support System` (系统风名) | `Alex` (拟人化人名) |
| **语气 (Tone)** | formal (正式文档语气) | conversational (口语化交流语气) |
| **置信度 (Confidence Framing)** | 严谨的实际概率 ("系统测算...") | 夸口的主观肯定 ("我十分确定...") |

> **🚀 架构优势 (Architectural Superiority)**  
> 区别于某些采用硬编码（Hardcoded）为每道题单独撰写 Condition A 和 B 话术的竞品方案，本系统采用了**正交的三维度 Modular Cue System**。这意味着你可以随时在独立变量之间进行组合（例如：将“系统风名”搭配“极度夸大确信的语气”），不仅极大节省了题目数据结构的冗余，还为未来引入更多的线索维度（如视觉 UI、排版布局）打下了完美的扩展基础。

**界面不过多包含信任测试等实验相关内容的静态显示：** 比如为了防止受试者受到固定正确率的心智锚定，强迫受试者根据界面、语气、长文推理等线索判断信任感，AI的准确率标语不予在UI上呈现。

#### 线索系统是如何工作的

```
lib/cues.ts          →  CUE_CATALOG: 定义所有的维度和对应等级
lib/conditions.ts    →  CONDITION_REGISTRY: 通过挑选线索等级来自动生成 Condition，通过指定 enabled: true/false 即可一键控制启用
```

**如何增加一种实验条件（Condition）：** 在 `CONDITION_REGISTRY` 中增加一个配置项并标记 `enabled: true`。核心路由平衡分配算法就会自动将其纳入随机化流程。

### 条件 A 设计 — Calibrated Framing
- 名字: `Decision Support System`
- 语气: 正式 / Neutral
- 置信度: 严谨分析 ("Based on the available parameters…")

### 条件 B 设计 — Overstated Framing
- 名字: `Alex`（中性名称）
- 语气: 口语化 / 人性化
- 置信度: 夸张/满口确信 ("I'm really confident…")

### N-条件 Block 平衡随机化算法

Block randomization (区块平衡随机化算法) 保证分配条件人数绝对平衡。对于 2 个启用条件，系统会保障：任何时刻两组人数差 \|N_A − N_B\| ≤ 1。分配记录保存在 `logs/assignment_counter.json`。

---

## 实验流程与考量设计

```
同意页 (Landing) → 分配随机条件 → 依次经历决定任务 1～3 (Task)
→ 信任度量表与信心量表 (7-point Likert) → 实验结果展示汇总 (Result) → 后台生成 JSON/CSV 结构化面板数据集
```

### 实验设计的隐藏考量

在设计实验体系时，由于这涉及社会学与行为学，为了避免受试者猜透意图从而产生反面情绪与霍桑效应（Hawthorne Effect），本项目引入了以下考量：

1. **题目数量为什么是 5 个？**
   如果题目太少，偶然性偏高；如果过多，受试者容易疲劳并演变为“无脑点鼠标”。5 个场景能在 5-7 分钟内完成，且能覆盖更多元的情况分布（包括加入 AI 会给出听起来合理但实际上存在严重欠考量的错误推荐，以此作为“反向查杀测试”/注意力测试）。
2. **避免暴露测试意图**
   界面的名字为“Decision Making Test”，不提及“测试您是否更相信人类或者机器”等类似信息。AI 的角色是“补充资料提供者”，这让受试者主观上感觉自己是在为一个真实的任务作决策，而非作为一个“小白鼠”在进行实验。过度暴露测试目的会导致“顺从预期表现”（受试者故意顺应或者反抗 AI 的判断）。

---

## 动态的 LLM 推荐决定任务 (Decision Task)

参与者将连续经历 **5 个普通人易懂、但需要知识补充的逻辑任务**。AI 会像 Gemini 等大模型一样（带有气泡、带有根据 Tone 转换的结构化理由分析，带有标识名称与星光icon）给出它的推荐选择（系统控制永远推荐 Option A）。受试者选择 **接受 (Accept)** 还是 **推翻自己干 (Override)**。

### 采用这些场景的原因

| 设计原则 | 当前场景满足该原则的原因 |
|-----------|--------------------------|
| **逻辑易懂，场景眼熟**| 如卧室空气净化器、团队云盘、社团发邮件。场景都是大学生或志愿者极其熟悉和容易看懂的内容，他们有日常经验去衡量“静音 vs 吸力强”、“不限量 vs 到达率”。 |
| **需要 AI 补充逻辑短板**| 虽然受试者看得懂两边的好坏，但在面对“臭氧累积风险”、“文件级 vs 块级同步机制”等隐性知识点时，受试者需要 AI 补充的关键信息。 |
| **包含迷惑性/陷阱推荐（Trick）**| 第 4 题和第 5 题被设计为“AI 给出了貌似有道理但其实方向错误/忽略了致命大前提的建议”（如在暴雪天强行为了省 $150 而推荐 45 分钟的极限转机；在白天大亮亮的客厅强行推荐流明度极低但看似高大上的 4K 投影仪）。这用来压力测试受试者是否在长时间依赖 AI 后会丧失警惕性（自动化偏好/盲从）。 |
| **选择非显然**| 比如“免费”和“高达率”的权衡冲突。既能让受试者用自己的逻辑去判断，也给予了 AI 用专业知识游说受试者的机会，确保任务选项势均力敌。 |
| **信任标记极其鲜明**| 如果受试者接受了 AI 提供的高维盲区知识（如认同臭氧积累危险），则证明该 UI/Tone 对他产生了实质性且可被量化的说服效果。|

---

## 存储日志的数据结构 (Logging Schema)

| 字段 | 类型 | 说明 |
|-------|------|-------------|
| `participant_id` | string | ID 标识，结构：`P-YYYYMMDDHHmmss-NNNN` |
| `condition` | string | 分配到的条件 (A, B...) |
| `task_type` | string | `"recommendation"` |
| `task_id` | string | `"air_purifier"`, `"cloud_storage"` 等 |
| `decision` | string | `"accept"` 还是 `"override"` |
| `timestamp` | string | 发生动作的 ISO 8601 毫秒级时间戳 |
| `latency_ms` | number | 从该页面显示直到按钮点下时的 **隐性响应延迟(Latency)**，反映纠结度 |
| `trust_rating` | number | 1–7 Likert 信赖分 |
| `confidence_rating` | number | 1–7 用户的自我决策信心分 |
| `browser_meta` | object | 系统自动获取的 UA、屏幕尺寸等反指纹数据 |

> **🚀 架构优势：无感即时落盘双写 (Instant Fallback Logging)**  
> 区别于某些采用“在所有测试结束后一次性 Batch Upload 到数据库”的危险架构（一旦用户中途断网或关闭网页，全盘数据丢失），本项目采用 **Client-side State Cached + Server-side Instant File Writing**。用户的每一次点击（无论是 `accept` 还是 `override`）都会在毫秒级内通过 `POST` 请求静默写入后端的 JSON 与 CSV，真正做到**零数据丢失**，同时用户界面保持绝对的无阻塞丝滑响应。

---

## 🌍 全球化跨文化考量储备 (i18n & Cross-Cultural Considerations)

因为该项目旨在探究**人类对机器产生的信任 (Trust Attribution)**，必须意识到：**来自不同国家、文化背景（如集体主义 vs 个人主义、权力距离高低的文化）的人群对“权威”和“类人 AI”的信任倾向存在巨大差异**。
为了满足潜在的全球化问卷发放需求，防止语言不互通带来的实验偏差，本项目已在底层注入了向国际化多语言兼容的潜能：
* **结构与视图解耦**：问卷的 Scenario 文本与 UI 控制逻辑完全独立于 `lib/tasks.ts`，未来可轻易接入基于 `next-i18next` 或语言变量注入（Lang Keys）的全球翻译矩阵。
* **数据流安全**：已通过严格的 UTF-8 与跨国编码处理方式，确保所有语种在落盘进入 CSV/JSON 时不会乱码，完美支持跨国样本收集。

---

## 研究者后台仪表盘 (Researcher Dashboard)

实验数据对参与者完全不可见。受试者在感谢页面只能看到自己本次会话接受推荐的次数汇总，不会看到任何原始数据表格或数据下载链接。

### 访问方式

在浏览器中访问 `/logs` 页面（即 `http://localhost:3000/logs`），输入研究者密码即可进入。

**默认密码：** `humanai2026`

如需更改密码，在项目根目录创建 `.env.local` 文件并设置：

```bash
RESEARCHER_PASSWORD=your_custom_password
```

### 仪表盘功能

- **会话聚合统计**：总会话数、平均 AI 接受率、条件分布
- **过度信任检测**：自动标记在陷阱题上"过度信任"（Overtrust）或"批判性思考"（Critical Thinking）的参与者
  - 🔴 红色标记：两道陷阱题均接受了 AI 的错误推荐
  - 🟢 绿色标记：两道陷阱题均推翻了 AI 的错误推荐
- **逐条决策日志**：完整的原始数据表，陷阱题行高亮显示
- **数据下载**：JSON / CSV 格式下载按钮（仅在认证后可见）

### API 数据导出（需认证）

导出 API 需要附带研究者密码参数 `key`：

- **JSON**: `/api/export?format=json&key=humanai2026`
- **CSV**: `/api/export?format=csv&key=humanai2026`

未携带正确密码的请求将收到 `401 Unauthorized`。

### Python 分析脚本

运行 `python3 scripts/analyze_logs.py` 可以生成供论文排版的图表（至 `logs/analysis_output/` 目录）并打印统计描述数据。
