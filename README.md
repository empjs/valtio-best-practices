# valtio-best-practices

基于 [Valtio](https://github.com/pmndrs/valtio) 的增强状态库与最佳实践：在保留 Valtio 细粒度响应式与快照语义的前提下，提供更少的样板代码和开箱即用的高级能力（历史、派生、持久化、嵌套更新等）。

## 仓库结构

- **`packages/valtio`** — 核心包 `@empjs/valtio`，增强的 createStore / useStore、createMap / createSet 及配套方法。
- **`apps/valtio-offical`** — 文档站应用，包含安装说明、API 说明与可运行示例（createStore、useStore、collections、subscribe、performance 等）。
- **`docs/`** — 设计说明与对比文档（如 `improvements.md`、`compare.md`）。

## 快速开始

```bash
# 安装依赖
pnpm install

# 构建核心包
pnpm --filter @empjs/valtio build

# 启动文档站
pnpm dev
```

在项目中使用增强库：

```bash
pnpm add @empjs/valtio
```

使用方式见 **[packages/valtio/README.md](./packages/valtio/README.md)**（安装、快速上手、API 概览与文档链接）。

## 脚本说明

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动文档站开发服务器 |
| `pnpm lint` | 运行 Biome 检查并自动修复 |
| `pnpm --filter @empjs/valtio build` | 构建 `@empjs/valtio` |
| `pnpm --filter @empjs/valtio test` | 运行 valtio 包测试 |

## 技术栈

- **状态**：Valtio + derive-valtio + valtio-history，封装为 `@empjs/valtio`
- **文档站**：React + Wouter + Tailwind CSS，Emp 构建
- **代码质量**：TypeScript、Biome

## 相关链接

- [官网 / 文档站](https://valtio.empjs.dev/)
- [Valtio](https://github.com/pmndrs/valtio)
- [仓库](https://github.com/empjs/valtio-best-practices)
- [推文 / 宣传稿](docs/promo-tweet.md)

## License

MIT
