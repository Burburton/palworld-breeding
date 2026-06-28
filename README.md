# Palworld 配种优化器 MVP

Palworld 1.0 帕鲁配种优化器的最小可用版本。属于非官方玩家工具，与 Pocketpair, Inc. 无任何关联。

## 功能

- 通过中文名、英文名或编号搜索目标帕鲁。
- 展示所有能直接配出目标帕鲁的父母组合。
- 维护“我拥有的帕鲁”列表，自动持久化到 localStorage。
- 根据拥有情况优先推荐：两个父母都有 > 一个父母有 > 都没有。
- 通过 `?target=<pal-key>` 分享目标帕鲁。
- 一键复制结果链接。
- 适配手机和桌面端（≥360px 宽度无横向溢出）。

## 当前数据状态

仓库默认携带 **demo 数据**（少量示例），仅用于本地调试和验证管线。

> 不要在未替换为社区确认的正式数据之前对外宣传任何完整数据。

替换数据：编辑 `public/data/pals.json`、`public/data/breeding.json`、`public/data/metadata.json`，然后运行 `npm run validate:data`。

## 本地开发

```bash
npm install
npm run dev
```

## 数据校验

```bash
npm run validate:data
```

## 测试

```bash
npm run test -- --run
```

## 类型检查与 Lint

```bash
npm run lint
```

## 生产构建

```bash
npm run build
```

构建产物输出到 `dist/`。

## GitHub Pages 部署

1. 在 GitHub 上创建仓库 `palworld-breeding`（或修改 `vite.config.ts` 中的 `base`，使其匹配仓库名）。
2. 推送 `main` 分支。
3. 仓库 `Settings → Pages → Build and deployment → Source` 选择 `GitHub Actions`。
4. 推送后 `Actions` 自动构建并部署。
5. 部署地址：`https://<user>.github.io/palworld-breeding/`

详细部署配置位于 `.github/workflows/deploy.yml`。

## 项目结构

```text
src/
├── components/      UI 组件
├── hooks/           自定义 Hook
├── lib/             纯业务逻辑（搜索、配种、存储、分享）
├── types/           类型定义
├── App.tsx          主页面
└── main.tsx         入口
public/data/         帕鲁与配种数据
scripts/             数据校验脚本
tests/               单元测试
```

## 免责声明

本项目为非官方玩家工具，与 Pocketpair, Inc. 无隶属或合作关系。Palworld 及相关名称、素材的权利归其各自权利人所有。