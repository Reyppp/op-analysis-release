# OP Analysis

OP Analysis 是面向 Windows 的离线光学测试与产出分析工具，用于本机解析 Par 和光谱数据、核对规格、分析 EXP 分区，并生成三阶段产出预测与分析报告。

[访问官网](https://reyp.us) · [下载最新测试版](https://github.com/Reyppp/op-analysis-release/releases) · [提交问题](https://github.com/Reyppp/op-analysis-release/issues/new/choose)

当前公开测试版：`0.3.0-beta.7`（Windows 10/11 x64）。

> 本仓库只包含官方网站、虚构交互演示和公开发行资料，不包含桌面端源码、模型参数、训练或回测数据、真实炉次及生产文件。

## 核心功能

- 导入炉次文件夹或测试文件，集中查看测试指标与规格判断。
- 展示光谱波形、Delta CW、EXP 点位及内圈、监控点、外圈分区结果；提供三圈匹配度和中心对齐波形。
- 结合薄片数量、外观、规格和测试指标，输出预估划切颗粒数、预估测试合格数、预估出库数及预测区间。
- 生成可放大查看的分析报告；报告光谱截图与测试页当前的 `0～−1 dB` / `Zoom` 模式保持一致。
- 以一行五列复制到 Excel；粘贴位置跟随当前选中的目标单元格，D 列采用高像素密度合成图以便放大核对。
- 支持 8 字符炉号、规格系列多选删除、会话内保持的 Zoom / 0～−1 dB 波形模式和手动检查更新。
- 文件与预测均在本机完成，无账号、无遥测、无云端分析。

预测结果仅供工程分析参考，最终结果应以实际颗粒测试、正式规格和人工复核为准。

## 系统要求

- Windows 10 / 11 x64
- 建议分辨率 1366×768 或更高
- 软件可离线运行，不要求预装 WebView2

## 安装版与便携版

| 版本 | 适用场景 | 使用方式 |
| --- | --- | --- |
| 安装版 | 日常使用，推荐 | 运行 `OP-Analysis_<版本>_x64-setup.exe`，按向导完成当前用户安装 |
| 便携版 | 无安装权限或临时测试 | 解压完整 ZIP 后运行 `OP Analysis.exe`，不要只从压缩包内直接启动 |

公开 Beta 尚未进行代码签名，Windows 可能显示“未知发布者”或 SmartScreen 提示。请只从 [官网](https://reyp.us) 或本仓库的 [GitHub Releases](https://github.com/Reyppp/op-analysis-release/releases) 下载，并在运行前核对 SHA-256。

## 快速开始

1. 启动 OP Analysis，选择炉次文件夹或测试文件。
2. 在“测试数据”核对规格、九项指标、光谱波形和 Delta CW；需要三圈对比时选择 EXP 列表第一行“匹配度”。
3. 在“炉次概览”确认薄片数量与外观描述，查看三阶段预测和风险提示。
4. 在“分析报告”生成报告；可点击五张图片放大查看。截图会沿用测试页当前的波形显示模式。复制前先在 Excel 选择任意目标起始单元格，粘贴结果占用一行五列，且不会强制写入固定行列。

官网的交互界面使用虚构数据，仅用于展示操作方式，不执行真实解析或预测。

## 校验下载文件

每个 Release 都包含 `SHA256SUMS.txt`。在 PowerShell 中运行：

```powershell
Get-FileHash -Algorithm SHA256 .\OP-Analysis_<版本>_x64-setup.exe
```

输出值应与同一 Release 中 `SHA256SUMS.txt` 的对应记录完全一致。

## 文档与支持

- [使用许可](EULA_zh-CN.md)
- [隐私说明](PRIVACY.md)
- [支持说明](SUPPORT.md)
- [安全政策](SECURITY.md)
- [版本记录](CHANGELOG.md)
- [第三方组件声明](THIRD_PARTY_NOTICES.txt)

一般问题请使用 [GitHub Issues](https://github.com/Reyppp/op-analysis-release/issues/new/choose)，且只能提交脱敏信息。安全问题请使用 [私密漏洞报告](https://github.com/Reyppp/op-analysis-release/security/advisories/new)。

## 许可

Copyright © 2026 Reyppp. All Rights Reserved.

OP Analysis、网站内容及发行资料采用专有许可。公开可见不等于开源；除 GitHub 服务条款明确允许的查看与 Fork 外，本仓库不授予复制、修改、商业使用、品牌使用或再分发权利。详见 [LICENSE](LICENSE) 与 [EULA_zh-CN.md](EULA_zh-CN.md)。
