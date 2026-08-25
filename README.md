# OP Analysis Release

这是 OP Analysis 的公开展示与发行仓库。仓库只包含静态网站、虚构交互演示、公开版本信息和发行说明。

不得提交桌面端源码、真实炉次或生产数据、模型文件、训练和回测数据、拟合脚本、源码映射或程序安装包。大型程序文件仅作为 GitHub Releases 资产分发。

## 公开 Beta 发布

1. 在私有工程中更新使用许可、版本说明和桌面端程序包。
2. 运行 `npm run check`，并通过桌面端迁移回归和发行包扫描。
3. 运行 `scripts/publish-github-release.ps1 -Repository Reyppp/op-analysis-release -PublishPublic`。
4. 脚本更新 Release 资产及 `release.js`、`release.json`。GitHub Pages 自动重新部署。

公开 Beta 允许在网页上启用下载链接，但必须清晰说明未签名状态，并提供 SHA-256 校验值。
