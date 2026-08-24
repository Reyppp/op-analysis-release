# OP Analysis Release

这是 OP Analysis 的公开展示与发行仓库模板，只允许包含网站静态文件和公开发行说明。

禁止提交桌面端源码、真实炉次或生产数据、模型文件、训练/回测数据、拟合脚本、源码映射和程序安装包。大型程序文件只上传到 GitHub Releases。

## 发布

1. 将本目录复制为独立公开仓库 `op-analysis-release`。
2. 把 `index.html` 中 Open Graph 图片地址的 `USERNAME` 改为实际 GitHub 账号。
3. 在仓库 Settings → Pages 中选择 GitHub Actions。
4. 正式版签名和内部验收通过后，由私有工程中的 `scripts/publish-github-release.ps1` 创建 Release，并更新 `release.js`、`release.json` 和下载链接。

`0.2.0-beta.1` 是内部测试版，公开下载按钮保持关闭。
