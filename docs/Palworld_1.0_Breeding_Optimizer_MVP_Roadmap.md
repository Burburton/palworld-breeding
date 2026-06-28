# Palworld 1.0 配种优化器 MVP 执行方案

> 用途：直接交给 OpenCode 按阶段实现  
> 项目类型：纯静态 Web 应用  
> 部署目标：GitHub Pages  
> 仓库名建议：`palworld-breeding`

---

## 1. 项目目标

实现一个可直接部署到 GitHub Pages 的 Palworld 配种优化器 MVP。

用户选择一个目标帕鲁后，网站展示所有能直接配出该帕鲁的父母组合。用户可以维护“我拥有的帕鲁”列表，系统把两个父母都已拥有的组合排在最前面，其次是只拥有一个父母的组合，最后是两个父母都没有的组合。

MVP 的目标不是实现完整配种规划系统，而是尽快上线一个可用、可分享、可验证市场需求的版本。

---

## 2. MVP 核心价值

第一版只解决两个问题：

1. 用户选择目标帕鲁后，快速查看所有直接父母组合。
2. 根据用户已经拥有的帕鲁，优先推荐可以立即执行的配种组合。

成功标准：

- 用户最多经过“搜索、选择、查看”三步即可获得结果。
- 页面在手机和桌面端均可正常使用。
- 无需登录。
- 无需后端。
- 可以通过 URL 分享目标帕鲁。
- 可以直接部署到 GitHub Pages。

---

## 3. MVP 范围

### 3.1 必须实现

- 按中文名搜索帕鲁。
- 按英文名搜索帕鲁。
- 按编号搜索帕鲁。
- 英文搜索大小写不敏感。
- 支持部分匹配。
- 展示目标帕鲁的全部直接配种父母组合。
- 用户可添加、删除和清空“我拥有的帕鲁”。
- 拥有列表保存到 `localStorage`。
- 根据用户拥有情况对配种组合排序。
- URL 使用 `?target=<pal-key>` 保存目标帕鲁。
- 提供复制当前结果链接功能。
- 展示数据版本。
- 展示非官方免责声明。
- 支持 GitHub Actions 自动部署到 GitHub Pages。
- 提供基础单元测试。
- 提供数据校验脚本。

### 3.2 暂不实现

以下内容不属于 MVP：

- 被动技能继承概率。
- 个体值计算。
- 多代最短配种路径。
- 地图系统。
- 用户注册与登录。
- 云端同步。
- 后端服务器。
- 数据库。
- AI 推荐。
- 自动抓取游戏数据。
- 广告系统。
- 付费功能。
- 完整博客系统。
- 多语言管理框架。
- 完整 SEO 静态页面生成。

---

## 4. 技术栈

使用以下技术：

- Vite
- React
- TypeScript
- TypeScript strict mode
- Vitest
- localStorage
- GitHub Actions
- GitHub Pages
- 简单 CSS、CSS Modules 或 Tailwind CSS

不要使用：

- Node.js 后端
- Next.js
- Express
- 数据库
- Docker
- Redis
- Redux
- MobX
- 云函数
- 大型 UI 组件库
- 复杂状态管理框架

---

## 5. 页面设计

整个 MVP 只需要一个主页面。

建议页面结构：

```text
Header
├── 项目名称
├── 简短描述
└── 数据版本

目标帕鲁搜索区域
├── 搜索输入框
├── 搜索候选列表
└── 当前目标帕鲁

配种结果区域
├── 结果数量
├── 筛选与排序说明
├── 配种组合卡片
└── 显示更多

我拥有的帕鲁区域
├── 搜索添加
├── 已拥有列表
└── 清空按钮

分享区域
└── 复制当前结果链接

Footer
├── 数据版本
├── 数据说明
├── 免责声明
└── 反馈入口占位
```

### 5.1 配种组合卡片

每张卡片至少显示：

```text
父母 1
  +
父母 2

状态：
- 两个都拥有
- 缺少父母 1
- 缺少父母 2
- 两个都未拥有
```

### 5.2 排序规则

排序优先级：

1. 两个父母都已拥有。
2. 只拥有一个父母。
3. 两个父母都未拥有。

相同优先级下保持原始数据顺序，避免不必要的结果跳动。

---

## 6. 推荐项目结构

```text
palworld-breeding/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── favicon.svg
│   └── data/
│       ├── pals.json
│       ├── breeding.json
│       └── metadata.json
├── scripts/
│   └── validate-data.ts
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── PalSearch.tsx
│   │   ├── PalCard.tsx
│   │   ├── BreedingResult.tsx
│   │   ├── BreedingCombinationCard.tsx
│   │   └── OwnedPalSelector.tsx
│   ├── hooks/
│   │   └── useOwnedPals.ts
│   ├── lib/
│   │   ├── breeding.ts
│   │   ├── search.ts
│   │   ├── storage.ts
│   │   └── share.ts
│   ├── types/
│   │   └── pal.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tests/
│   ├── breeding.test.ts
│   ├── search.test.ts
│   └── validate-data.test.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 7. 数据模型

在 `src/types/pal.ts` 中定义：

```ts
export interface Pal {
  id: number;
  key: string;
  number: string;
  nameZh: string;
  nameEn: string;
  image?: string;
}

export interface BreedingRule {
  parent1: string;
  parent2: string;
  child: string;
}

export interface BreedingCombination {
  parent1: string;
  parent2: string;
}

export interface DataMetadata {
  gameVersion: string;
  dataVersion: string;
  lastUpdated: string;
  sourceDescription: string;
}
```

---

## 8. 数据文件

### 8.1 `public/data/pals.json`

示例：

```json
[
  {
    "id": 100,
    "key": "anubis",
    "number": "100",
    "nameZh": "阿努比斯",
    "nameEn": "Anubis"
  }
]
```

要求：

- `key` 必须稳定且唯一。
- `number` 使用字符串，兼容可能出现的特殊编号。
- 第一版可以不使用官方角色图片。
- 如未提供正式数据，只能创建明确标注为 demo 的少量示例数据。
- 不允许伪造完整游戏数据。

### 8.2 `public/data/breeding.json`

使用原始规则格式：

```json
[
  {
    "parent1": "penking",
    "parent2": "bushi",
    "child": "anubis"
  }
]
```

不要直接将数据存成按 child 分组的最终索引。应用启动后或构建阶段可生成查询索引。

### 8.3 `public/data/metadata.json`

```json
{
  "gameVersion": "1.0",
  "dataVersion": "2026-07-10",
  "lastUpdated": "2026-07-10",
  "sourceDescription": "Community verified breeding data"
}
```

页面底部必须展示：

- 游戏版本。
- 数据版本。
- 最后更新时间。
- 数据来源说明。

---

## 9. 数据校验

实现：

```text
scripts/validate-data.ts
```

校验内容：

- 所有 Pal 的 `key` 唯一。
- 所有 Pal 的 `id` 唯一。
- 所有 breeding rule 的 `parent1` 存在。
- 所有 breeding rule 的 `parent2` 存在。
- 所有 breeding rule 的 `child` 存在。
- 不允许重复配种组合。
- `A + B` 与 `B + A` 视为同一个组合。
- 检查空 key。
- 检查空名称。
- 检查不合法编号。
- 校验失败时输出明确错误并返回非零退出码。

标准化父母组合：

```ts
export function normalizePair(a: string, b: string): string {
  return [a, b].sort().join("::");
}
```

增加 npm script：

```json
{
  "scripts": {
    "validate:data": "tsx scripts/validate-data.ts"
  }
}
```

成功输出示例：

```text
Pals: 150
Breeding rules: 12345
Invalid parent IDs: 0
Invalid child IDs: 0
Duplicate rules: 0
Validation passed
```

---

## 10. 核心业务逻辑

### 10.1 搜索

在 `src/lib/search.ts` 实现。

要求：

- 中文名部分匹配。
- 英文名部分匹配。
- 英文大小写不敏感。
- 编号匹配。
- 去除输入首尾空格。
- 空输入返回空数组。
- 最多返回 10 个候选结果。

建议接口：

```ts
export function normalizeSearchText(value: string): string;

export function searchPals(
  pals: Pal[],
  query: string,
  limit?: number
): Pal[];
```

参考逻辑：

```ts
export function normalizeSearchText(value: string): string {
  return value.trim().toLowerCase();
}

export function searchPals(
  pals: Pal[],
  query: string,
  limit = 10
): Pal[] {
  const normalized = normalizeSearchText(query);
  const raw = query.trim();

  if (!normalized) {
    return [];
  }

  return pals
    .filter((pal) => {
      return (
        pal.nameZh.includes(raw) ||
        pal.nameEn.toLowerCase().includes(normalized) ||
        pal.number.includes(normalized)
      );
    })
    .slice(0, limit);
}
```

### 10.2 配种索引

在 `src/lib/breeding.ts` 实现。

建议接口：

```ts
export type BreedingIndex = Record<string, BreedingCombination[]>;

export function buildBreedingIndex(
  rules: BreedingRule[]
): BreedingIndex;

export function getBreedingCombinations(
  index: BreedingIndex,
  targetPalKey: string
): BreedingCombination[];
```

### 10.3 拥有状态评分

```ts
export function scoreCombination(
  combination: BreedingCombination,
  ownedPals: ReadonlySet<string>
): number {
  const hasParent1 = ownedPals.has(combination.parent1);
  const hasParent2 = ownedPals.has(combination.parent2);

  if (hasParent1 && hasParent2) {
    return 2;
  }

  if (hasParent1 || hasParent2) {
    return 1;
  }

  return 0;
}
```

### 10.4 结果排序

```ts
export function rankCombinations(
  combinations: BreedingCombination[],
  ownedPals: ReadonlySet<string>
): BreedingCombination[] {
  return combinations
    .map((combination, originalIndex) => ({
      combination,
      originalIndex,
      score: scoreCombination(combination, ownedPals)
    }))
    .sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      }

      return a.originalIndex - b.originalIndex;
    })
    .map((item) => item.combination);
}
```

要求：

- 不修改原数组。
- 排序稳定。
- 业务逻辑不要写在 React 组件中。

---

## 11. “我拥有的帕鲁”

使用 `localStorage`。

存储 key：

```ts
const STORAGE_KEY = "palworld-owned-pals-v1";
```

存储格式：

```json
["anubis", "penking", "bushi"]
```

实现 Hook：

```ts
export interface UseOwnedPalsResult {
  ownedPals: ReadonlySet<string>;
  addOwnedPal: (palKey: string) => void;
  removeOwnedPal: (palKey: string) => void;
  toggleOwnedPal: (palKey: string) => void;
  clearOwnedPals: () => void;
}
```

要求：

- 页面加载时恢复。
- 添加后立即保存。
- 删除后立即保存。
- 清空后立即保存。
- 数据损坏时回退为空集合。
- `localStorage` 不可用时应用仍可运行。
- 所有存储访问必须放在 `try/catch` 中。

---

## 12. URL 分享

使用查询参数：

```text
?target=anubis
```

页面初始化时读取：

```ts
const params = new URLSearchParams(window.location.search);
const target = params.get("target");
```

选择目标帕鲁后更新：

```ts
const url = new URL(window.location.href);
url.searchParams.set("target", palKey);
window.history.replaceState({}, "", url);
```

提供按钮：

```text
复制当前结果链接
```

复制失败时显示可理解的错误提示。

暂时不要将完整拥有列表写入 URL。

---

## 13. UI 与交互要求

### 13.1 搜索框

必须支持：

- 输入实时搜索。
- 键盘上下键选择。
- Enter 确认。
- Escape 关闭候选列表。
- 鼠标点击选择。
- 移动端触控。
- 无搜索结果提示。
- 输入框有明确 label。
- 候选列表有稳定 key。

### 13.2 结果展示

要求：

- 显示目标帕鲁名称与编号。
- 显示配种组合总数。
- 默认展示前 10 组。
- 提供“显示更多”。
- 拥有状态清晰。
- 数据为空时显示友好提示。
- 数据加载失败时显示错误状态。
- 数据加载中显示 loading 状态。

### 13.3 移动端

最低要求：

- 360px 宽度不横向溢出。
- 输入框可正常操作。
- 按钮尺寸适合触控。
- 卡片内容不重叠。
- Footer 不遮挡内容。

---

## 14. 测试要求

使用 Vitest。

### 14.1 搜索测试

至少覆盖：

- 中文精确匹配。
- 中文部分匹配。
- 英文精确匹配。
- 英文部分匹配。
- 英文大小写不敏感。
- 编号匹配。
- 空输入。
- 全空格输入。
- 无结果。
- 最多返回 10 项。

### 14.2 排序测试

至少覆盖：

- 两个父母都拥有时评分为 2。
- 拥有一个父母时评分为 1。
- 两个都未拥有时评分为 0。
- 两个父母都拥有的组合排第一。
- 只有一个父母的组合排中间。
- 两个都没有的组合排最后。
- 相同评分保持原始顺序。
- 排序函数不得修改输入数组。

### 14.3 数据校验测试

至少覆盖：

- Pal key 重复。
- Pal id 重复。
- 无效 parent1。
- 无效 parent2。
- 无效 child。
- A+B 与 B+A 被识别为重复。
- 正常数据通过校验。

---

## 15. 工程质量要求

- TypeScript 开启 strict。
- 禁止无理由使用 `any`。
- 组件职责清晰。
- 业务逻辑放在 `src/lib`。
- 存储逻辑放在 `src/lib/storage.ts` 或 Hook 内部。
- 不在组件中重复解析数据。
- 不引入不必要依赖。
- 所有列表使用稳定 key。
- 不使用数组下标作为可变列表 key。
- 不提交构建产物。
- README 说明开发、测试、构建和部署方式。
- 代码中不得包含真实密钥或 token。
- 不使用未经说明的数据抓取逻辑。
- 不过度设计。

---

## 16. SEO 最小配置

在 `index.html` 中至少包含：

```html
<title>Palworld 配种计算器 - 快速查询帕鲁配种组合</title>

<meta
  name="description"
  content="Palworld 帕鲁配种优化器。查询目标帕鲁的父母组合，并根据你已拥有的帕鲁优先推荐可立即使用的配种方案。"
/>
```

正文中真实显示：

```text
Palworld 配种计算器
帕鲁配种表
Palworld breeding calculator
根据已有帕鲁推荐配种组合
```

不要通过隐藏文字堆砌关键词。

---

## 17. 免责声明

Footer 加入：

```text
本站为非官方玩家工具，与 Pocketpair, Inc. 无隶属或合作关系。
Palworld 及相关名称和素材的权利归其各自权利人所有。
```

英文版本：

```text
This is an unofficial fan-made tool and is not affiliated with
Pocketpair, Inc. Palworld and related names are trademarks of
their respective owners.
```

第一版尽量不使用官方角色立绘，仅使用：

- 名称
- 编号
- 自制图标
- 自制颜色块

---

## 18. Vite 配置

仓库名暂定：

```text
palworld-breeding
```

`vite.config.ts`：

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/palworld-breeding/"
});
```

如果仓库名变化，必须同步修改 `base`。

---

## 19. GitHub Pages Workflow

创建：

```text
.github/workflows/deploy.yml
```

内容：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Validate data
        run: npm run validate:data

      - name: Lint
        run: npm run lint

      - name: Run tests
        run: npm run test -- --run

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    needs: build
    runs-on: ubuntu-latest

    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

GitHub Repository 设置：

```text
Settings
→ Pages
→ Build and deployment
→ Source
→ GitHub Actions
```

---

## 20. OpenCode 执行阶段

OpenCode 不得一次性完成全部修改。

每个阶段完成后：

1. 汇报修改内容。
2. 汇报新增文件。
3. 汇报执行的命令。
4. 汇报测试结果。
5. 如有失败，先修复再进入下一阶段。

### Phase 1：初始化工程

任务：

- 创建 Vite + React + TypeScript 项目。
- 配置 strict mode。
- 配置 ESLint。
- 配置 Vitest。
- 建立目录结构。
- 创建基础 README。

验收：

```bash
npm install
npm run build
```

必须通过。

### Phase 2：类型、示例数据和数据验证

任务：

- 定义 TypeScript 类型。
- 创建少量 demo 数据。
- 创建 metadata。
- 实现数据校验脚本。
- 增加 `validate:data` 命令。
- 编写数据验证测试。

验收：

```bash
npm run validate:data
npm run test -- --run
```

必须通过。

### Phase 3：搜索功能

任务：

- 实现搜索逻辑。
- 实现搜索组件。
- 支持中文、英文、编号。
- 支持键盘操作。
- 编写搜索测试。

验收：

```bash
npm run lint
npm run test -- --run
npm run build
```

必须通过。

### Phase 4：配种查询和结果展示

任务：

- 构建 breeding index。
- 根据目标查询父母组合。
- 实现结果卡片。
- 实现空结果。
- 实现显示更多。
- 编写核心逻辑测试。

验收：

```bash
npm run lint
npm run test -- --run
npm run build
```

必须通过。

### Phase 5：拥有列表和排序

任务：

- 实现 `useOwnedPals`。
- 实现 localStorage。
- 实现添加、删除、清空。
- 实现组合评分。
- 实现稳定排序。
- 编写排序测试。

验收：

```bash
npm run lint
npm run test -- --run
npm run build
```

必须通过。

### Phase 6：URL 分享

任务：

- 页面加载时读取 `target`。
- 选择目标时更新 URL。
- 实现复制链接。
- 实现无效 target 回退。
- 不将拥有列表写入 URL。

验收：

- 刷新页面后保持目标。
- 复制链接在新标签页中可恢复目标。
- 无效目标不会导致崩溃。

### Phase 7：UI 与移动端

任务：

- 完善响应式布局。
- 完善 loading、error、empty 状态。
- 检查 360px 宽度。
- 检查键盘操作。
- 增加 Footer 和免责声明。
- 增加 metadata 展示。

验收：

- Chrome 桌面端正常。
- Chrome 移动设备模拟正常。
- 无明显横向滚动。
- 无控制台错误。

### Phase 8：GitHub Pages

任务：

- 配置 Vite base。
- 创建 GitHub Actions workflow。
- 更新 README 部署说明。
- 确保构建输出为 `dist`。

验收：

```bash
npm run validate:data
npm run lint
npm run test -- --run
npm run build
```

全部通过。

### Phase 9：最终检查

最终必须执行：

```bash
npm run validate:data
npm run lint
npm run test -- --run
npm run build
```

最终报告必须包含：

- 命令是否成功。
- 测试数量。
- 构建结果。
- 已知限制。
- 使用 demo 数据还是正式数据。
- GitHub Pages 部署前还需人工完成的步骤。

---

## 21. MVP 发布门槛

只有全部满足以下条件才可发布：

- 数据校验通过。
- TypeScript 编译通过。
- ESLint 通过。
- 单元测试通过。
- 生产构建通过。
- Chrome 桌面端人工测试通过。
- 手机宽度人工测试通过。
- URL 分享通过。
- 页面刷新后拥有列表仍存在。
- 数据版本可见。
- 免责声明可见。
- 无控制台错误。
- 未伪造正式数据。
- 未使用不明确版权来源的角色图片。

---

## 22. 人工数据核对

正式上线前，人工检查：

- 10 个热门帕鲁。
- 5 个特殊配方。
- 5 个随机帕鲁。
- A+B 与 B+A。
- 无结果场景。
- 无效 URL target。
- localStorage 损坏场景。
- localStorage 禁用场景。
- 手机页面。
- GitHub Pages 子路径资源加载。
- 分享链接。

数据来源必须确认：

- 对应哪个游戏版本。
- 是否包含特殊配方。
- 父母顺序是否无关。
- Palworld 1.0 是否修改配种规则。
- 数据是否允许重新发布。
- 是否需要署名。

---

## 23. 第二阶段规划

MVP 有真实访问后，再按以下顺序增加：

1. 多代最短配种路径。
2. 指定父母反查后代。
3. 指定目标被动技能。
4. 配种路线图可视化。
5. 拥有列表导入导出。
6. 数据版本更新对比。
7. 热门帕鲁独立 SEO 页面。
8. 自定义域名。
9. 访问统计。
10. 广告或联盟变现。

第二阶段的核心差异化功能：

> 用户输入现有帕鲁集合和目标帕鲁，系统计算最少代数、最少缺失父母的完整配种路线。

该功能不属于当前 MVP。

---

# OpenCode 主执行指令

以下内容可作为 OpenCode 的主任务提示词。

---

你需要实现一个可直接部署到 GitHub Pages 的 Palworld 配种优化器 MVP。

## 产品目标

用户选择一个目标帕鲁后，网站展示所有能直接配出该帕鲁的父母组合。用户可以维护“我拥有的帕鲁”列表，系统需要把两个父母都已拥有的组合排在最前面，其次是拥有一个父母的组合，最后是两个父母都没有的组合。

这是纯静态前端项目，不允许添加后端、数据库、登录系统或云函数。

## 技术栈

- Vite
- React
- TypeScript strict mode
- Vitest
- localStorage
- GitHub Actions
- GitHub Pages
- 使用简单 CSS、CSS Modules 或 Tailwind
- 不引入大型 UI 框架
- 不使用 Redux、MobX 或其他复杂状态管理框架

## 必须实现的功能

1. 支持通过中文名、英文名和编号搜索目标帕鲁。
2. 搜索支持部分匹配和英文大小写不敏感。
3. 选择目标帕鲁后，展示全部直接父母组合。
4. 用户可以添加、删除和清空“我拥有的帕鲁”。
5. 拥有列表保存在 localStorage。
6. 配种组合根据用户拥有情况排序：
   - 两个父母都有。
   - 只有一个父母。
   - 两个父母都没有。
7. URL 使用 `?target=<pal-key>` 保存当前目标。
8. 提供复制结果链接按钮。
9. 页面必须适配手机和桌面。
10. 页面必须包含加载状态、数据加载失败状态和无结果状态。
11. 页面底部显示游戏数据版本和免责声明。
12. 添加 GitHub Pages 自动部署 workflow。

## 数据要求

数据放在：

```text
public/data/pals.json
public/data/breeding.json
public/data/metadata.json
```

不要伪造完整游戏数据。如果仓库中尚未提供正式数据，只创建一小组明确标注为 demo 的示例数据，并在 README 中说明替换方法。

## 数据验证

实现 `scripts/validate-data.ts`，检查：

- Pal key 是否唯一。
- Pal id 是否唯一。
- 所有 parent ID 是否存在。
- 所有 child ID 是否存在。
- 是否存在重复父母组合。
- A+B 和 B+A 必须视为同一个组合。
- 检查失败时返回非零退出码。

增加：

```json
{
  "scripts": {
    "validate:data": "tsx scripts/validate-data.ts"
  }
}
```

## 测试要求

至少为以下逻辑编写 Vitest 测试：

- 中文名搜索。
- 英文名大小写不敏感搜索。
- 编号搜索。
- 空查询。
- 无结果查询。
- 两个父母都拥有时排序最高。
- 一个父母拥有时排序居中。
- 没有父母时排序最低。
- 排序函数不得修改原数组。
- A+B 与 B+A 重复检测。

## 工程质量

- TypeScript 开启 strict。
- 禁止无理由使用 `any`。
- 组件职责清晰。
- 业务逻辑放在 `src/lib`。
- localStorage 访问必须捕获异常。
- 所有列表元素使用稳定 key。
- 避免不必要依赖。
- 不要过度设计。

## GitHub Pages

仓库名暂定为 `palworld-breeding`。

`vite.config.ts` 设置：

```ts
base: "/palworld-breeding/"
```

创建 `.github/workflows/deploy.yml`，在 push 到 main 时执行：

1. `npm ci`
2. `npm run validate:data`
3. `npm run lint`
4. `npm run test -- --run`
5. `npm run build`
6. 上传 `dist`
7. 部署到 GitHub Pages

## 执行方式

不要一次修改所有代码。

按以下阶段执行，并在每个阶段结束后汇报：

1. 初始化工程。
2. 建立类型、示例数据和数据验证。
3. 实现搜索。
4. 实现配种查询和结果卡片。
5. 实现拥有列表和排序。
6. 实现 URL 分享。
7. 编写和运行测试。
8. 配置 GitHub Pages。
9. 做最终构建检查。
10. 完善 README。

每个阶段都运行适用的命令。

最终必须运行并报告：

```bash
npm run validate:data
npm run lint
npm run test -- --run
npm run build
```

不要声称命令成功，除非实际执行并看到成功结果。

---

## 最终完成定义

项目完成时必须满足：

- 可本地启动。
- 可生产构建。
- 测试通过。
- 数据校验通过。
- 可部署到 GitHub Pages。
- 支持目标搜索。
- 支持直接配种组合展示。
- 支持拥有列表。
- 支持排序。
- 支持 URL 分享。
- 支持移动端。
- 使用 demo 数据时有明确标记。
- README 包含开发、测试、构建、数据替换和部署说明。
