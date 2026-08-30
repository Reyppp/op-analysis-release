(() => {
  "use strict";

  const metrics = [
    ["Delta CW", "-0.48", "-1.50-0.20"], ["BW@0.3dB", "4.82", "≥4.60"],
    ["Ripple", "0.11", "≤0.14"], ["Max IL", "0.52", "≤0.80"],
    ["ISO Left", "31.2", "≥28.0"], ["ISO Right", "30.8", "≥28.0"],
    ["Center Wavelength", "演示", "演示"], ["Passband", "通过", "目标"], ["Point Result", "PASS", "PASS"]
  ];
  const metricsBody = document.getElementById("demoMetrics");
  metricsBody.innerHTML = metrics.map(([name, value, spec]) => `<tr><td>${name}</td><td>${value}</td><td>${spec}</td></tr>`).join("");

  const tabs = [...document.querySelectorAll("[data-demo-tab]")];
  const panels = [...document.querySelectorAll("[data-demo-panel]")];
  const setTab = name => {
    tabs.forEach(button => {
      const active = button.dataset.demoTab === name;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    panels.forEach(panel => {
      const active = panel.dataset.demoPanel === name;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
    if (name === "data") requestAnimationFrame(drawAllCharts);
  };
  tabs.forEach(button => button.addEventListener("click", () => setTab(button.dataset.demoTab)));
  tabs.forEach((button, index) => button.addEventListener("keydown", event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const target = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
    tabs[target].focus();
    setTab(tabs[target].dataset.demoTab);
  }));

  const fileButtons = [...document.querySelectorAll("[data-demo-file]")];
  const activeDemoFile = document.getElementById("activeDemoFile");
  fileButtons.forEach(button => button.addEventListener("click", () => {
    fileButtons.forEach(item => item.classList.toggle("selected", item === button));
    activeDemoFile.textContent = button.dataset.demoFile === "匹配度"
      ? "匹配度 · 中心波长对齐 / 0.1 dB 间隔"
      : `${button.dataset.demoFile} · 9 / 9 合格`;
    drawAllCharts();
  }));

  function getCanvasContext(canvas) {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    if (!rect.width || !rect.height) return null;
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    const context = canvas.getContext("2d");
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    return { context, width: rect.width, height: rect.height };
  }

  function drawGrid(context, width, height) {
    context.strokeStyle = "#e7ecf2";
    context.lineWidth = 1;
    for (let y = 18; y < height; y += Math.max(25, height / 3)) {
      context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke();
    }
    for (let x = 24; x < width; x += Math.max(42, width / 4)) {
      context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke();
    }
  }

  function drawCurve(canvas, points, secondary = false) {
    const frame = getCanvasContext(canvas);
    if (!frame) return;
    const { context, width, height } = frame;
    context.clearRect(0, 0, width, height);
    drawGrid(context, width, height);
    const plot = values => {
      context.beginPath();
      values.forEach((value, index) => {
        const x = index / (values.length - 1) * width;
        const y = height * value;
        index ? context.lineTo(x, y) : context.moveTo(x, y);
      });
      context.stroke();
    };
    context.lineWidth = 2.1;
    context.strokeStyle = "#175fe8";
    plot(points);
    if (secondary) {
      context.lineWidth = 1.1;
      context.strokeStyle = "#98a8ba";
      plot(points.map((value, index) => Math.min(.9, Math.max(.1, value + Math.sin(index * .9) * .12 + .07))));
    }
  }

  function drawOffset(canvas) {
    const frame = getCanvasContext(canvas);
    if (!frame) return;
    const { context, width, height } = frame;
    context.clearRect(0, 0, width, height);
    drawGrid(context, width, height);
    const failY = height * .74;
    context.strokeStyle = "#d95d5d";
    context.lineWidth = 1;
    context.setLineDash([4, 4]);
    context.beginPath(); context.moveTo(0, failY); context.lineTo(width, failY); context.stroke();
    context.setLineDash([]);
    context.strokeStyle = "#175fe8";
    context.lineWidth = 2.1;
    context.beginPath();
    for (let index = 0; index <= 70; index += 1) {
      const x = index / 70 * width;
      const y = height * (.48 + Math.sin(index * .25) * .11 + Math.sin(index * .57) * .035);
      index ? context.lineTo(x, y) : context.moveTo(x, y);
    }
    context.stroke();
  }

  function drawAllCharts() {
    drawCurve(document.getElementById("waveCanvas"), [.86,.84,.81,.73,.54,.22,.17,.3,.56,.61,.44,.24,.2,.38,.69,.8,.83], true);
    drawOffset(document.getElementById("deltaCanvas"));
    drawCurve(document.getElementById("capabilityCanvas"), [.72,.67,.49,.28,.18,.31,.53,.72,.68,.47,.26,.19,.34,.56,.7,.64]);
    drawCurve(document.getElementById("guideWaveCanvas"), [.86,.84,.81,.73,.54,.22,.17,.3,.56,.61,.44,.24,.2,.38,.69,.8,.83], true);
    drawOffset(document.getElementById("guideDeltaCanvas"));
  }

  const observer = new ResizeObserver(drawAllCharts);
  ["waveCanvas", "deltaCanvas", "capabilityCanvas", "guideWaveCanvas", "guideDeltaCanvas"].forEach(id => observer.observe(document.getElementById(id)));
  requestAnimationFrame(drawAllCharts);

  const guideFeatures = {
    "import-folder": ["开始分析", "导入炉次文件夹", "一次读取该炉次目录中的 Par 与光谱文件。", "开始分析新炉次时使用。", "点击后选择对应炉次文件夹，等待测试数据页自动生成。", "网页仅演示操作；真实文件只在桌面端本机读取。", "data"],
    "choose-files": ["补充数据", "选择文件", "单独导入一个或多个 Par、光谱文件。", "只需补充少量文件，或文件没有放在同一目录时使用。", "点击后多选文件，程序会与当前已导入数据合并整理。", "应选择同一炉次、同一产品的数据。", "data"],
    "current-spec": ["规格判断", "当前规格", "选择本炉次用于标红和合格率判断的产品规格。", "导入后自动匹配不正确，或需要切换规格复核时使用。", "在顶部规格列表选择正确项目，再核对测试指标与合格率。", "规格变化会重新计算显示结果，应先核对再判断产出。", "overview"],
    "spec-manager": ["规格判断", "规格管理", "维护带宽、Ripple、隔离度等规格目标，并整理规格系列。", "新增产品规格、工程要求变化，或需要清理已停用系列时使用。", "新增或修改规格后保存；清理时勾选一个或多个规格系列，再执行批量删除。", "批量删除会移除所选系列下的全部规格；单条规格仍可独立删除，操作前应确认选择范围。", "data"],
    "clear": ["数据管理", "清空", "移除当前炉次的已导入数据和页面结果。", "准备分析下一炉，或误导入文件时使用。", "确认当前结果已记录后点击清空，再导入新炉次。", "清空不会删除电脑中的原始测试文件。", "data"],
    "check-update": ["版本管理", "检查更新", "使用系统默认浏览器打开 OP Analysis 官网，查看是否有新版本。", "需要核对当前版本或手动下载安装新版时使用。", "先记录标题栏版本，再点击检查更新，与官网最新版本比较。", "该操作只打开官网，不上传炉次、规格或分析结果；应用不会在后台自动更新。", "data"],
    "tab-data": ["页面导航", "测试数据", "查看点位文件、九项指标、光谱波形和 Delta CW。", "导入后首先核对数据完整性和超限项目时使用。", "切换到测试数据，再选择 EXP 或全部点位查看。", "红色异常需要结合对应规格和点位位置判断。", "data"],
    "exp-filter": ["点位筛选", "EXP 数据", "只显示用于分区判断的 EXP 点位文件。", "核对内圈、监控点、外圈指标和面积约束时使用。", "点击 EXP，再逐个选择左侧点位文件。", "三点与五点测试的分区位置不同，程序会自动识别。", "data"],
    "all-filter": ["点位筛选", "所有数据", "恢复显示当前炉次的全部测试点位。", "需要检查整片分布或查找非 EXP 异常时使用。", "点击全部，再从文件列表选择目标点位。", "普通点位参与整体分析，但不套用 EXP 专家硬约束。", "data"],
    "point-file": ["点位检查", "点位文件", "切换当前表格和曲线对应的测试点位。", "定位某个位置的带宽、Ripple 或波形异常时使用。", "选择一个点位，右侧指标和曲线会同步更新。", "先确认文件命名与片号、点位号对应。", "data"],
    "matching": ["EXP 对比", "匹配度", "把第一片的内圈、监控点和外圈指标及波形集中到同一视图；横向以监控点中心波长对齐，纵向按内圈、监控点、外圈每层0.1 dB错层显示。", "需要快速判断三圈形态差异、定位明显更差的指标或留存对比截图时使用。", "在 EXP 列表选择第一行“匹配度”；查看三列值@CW、黄色差异提示和中心对齐波形，需要留档时点击测试指标区域的“截图”。", "错层后的内圈最高点距纵轴上界0.2 dB。截图包含完整指标矩阵和三圈波形；对齐和错层不修改原始波长、IL、指标或规格判断。", "data"],
    "metrics-table": ["测试判断", "九项测试指标", "集中显示当前点位的测试值、规格和通过状态。", "判断带宽、Ripple 或隔离度是否超出规格时使用。", "优先查看标红行，再结合光谱波形确认异常形态。", "薄片阶段带宽或 Ripple 不合格通常缺少后续补救空间。", "data"],
    "spectrum": ["测试判断", "光谱波形", "查看当前点位的原始波形形态与带内稳定性。", "表格异常、Ripple 偏大或需要复核曲线形态时使用。", "选择点位后查看曲线，可使用桌面端截图或复制功能留档。", "波形需要与规格目标及同炉其他点位一起比较。", "data"],
    "one-db-mode": ["波形显示", "0～−1 dB", "使用原始 IL 值显示 1 dB 高度窗口，曲线最高点距纵轴上界保持 0.2 dB。", "比较不同点位顶部形态、Ripple 和平台差异时使用。", "点击 0～−1 dB 后再切换点位；当前会话会保持该显示模式。", "该模式只改变视图范围，不修改测试值或规格判断。", "data"],
    "zoom-mode": ["波形显示", "Zoom", "恢复完整数据范围，便于查看通带之外的整体波形。", "需要离开 1 dB 局部视图或查看完整曲线时使用。", "点击 Zoom，或在桌面端双击光谱图；切换下一个文件时仍保持该模式。", "应用重启后显示模式回到默认值，Delta CW 的恢复操作不受影响。", "data"],
    "delta-cw": ["均匀性", "Delta CW", "显示各点位相对目标波长的偏移及 Fail 范围。", "判断整片波长分布、可烘烤区域和外圈偏移时使用。", "查看曲线、Fail 线和波长面积合格率，定位偏低或偏高区域。", "Fail 线是工程筛选范围，不等于单独决定最终颗粒良率。", "data"],
    "tab-overview": ["页面导航", "炉次概览", "集中核对炉次输入、三阶段产出和风险详情。", "测试数据检查完成后，用于形成产出判断。", "切换到炉次概览，先核对片数、规格和外观，再查看结果。", "外观描述为空时不会计算产出。", "overview"],
    "lot-id": ["基础信息", "炉号", "显示程序从文件中识别的当前炉次编号，支持最多 8 个字符。", "核对导入内容是否属于目标炉次时使用。", "将炉号与原始文件夹、生产记录进行比对。", "公开教程使用 8 字符 DEMO 编号，不代表真实生产数据。", "overview"],
    "slice-count": ["基础信息", "薄片数量", "显示自动识别的薄片数，并支持桌面端手动修改。", "文件缺失或实际片数与识别结果不一致时使用。", "核对自动值；需要时手动输入，恢复默认可重新采用识别值。", "理论满面颗粒数会随片数直接变化。", "overview"],
    "appearance": ["必要输入", "外观描述", "将 60-40、量化缺陷和未量化外观影响纳入可用面积判断。", "每次产出分析都必须填写。", "按生产记录输入外观等级、占比、发蒙、分散大亮点等描述，并核对自动列出的未量化影响。", "无法识别的原文片段会完整保留并按2%默认影响显示；括号内容作为一个片段处理，所有影响均可在桌面端手动调整。", "overview"],
    "high-risk": ["结果解释", "高风险", "表示当前炉次存在较强约束或较大的预测不确定性，不代表整炉一定不合格。", "", "", "", "overview", ["可能来源", "对结果的影响", "建议核对", "正确理解"], ["指标可用面积受限、烘烤确认不良区域、Delta CW 与 Ripple 组合异常，或外观后段与整片风险。", "可能限制测试合格数、增加烘烤损失，并扩大预测区间；不会自动把三项产出全部清零。", "先核对当前规格、EXP 点位和异常分区，再检查外观描述与薄片数量，同时阅读中心值和预测区间。", "这是工程复核提示，不是最终质量结论；实际结果以颗粒测试和人工复核为准。"]],
    "cut-result": ["产出结果", "预估划切颗粒数", "估算外观可用面积内可进入后续测试的颗粒数。", "评估本炉可划切规模时查看。", "读取中心值和预测区间，并结合外观可用率复核。", "该结果不受 EXP 烘烤硬约束直接清零。", "overview"],
    "test-result": ["核心结果", "预估测试合格数", "估算满足正式测试要求的颗粒数，是当前模型优先优化的结果。", "完成外观和测试数据核对后重点查看。", "同时阅读中心值、区间、指标上限和烘烤损失说明。", "预测用于工程参考，最终数量以颗粒复测结果为准。", "overview"],
    "ship-result": ["产出结果", "预估出库数", "估算经过测试与后段损失后的可出库数量。", "需要形成完整三阶段判断时查看。", "与测试合格数和预测区间一起使用。", "出库预测不会超过最终测试合格数。", "overview"],
    "output-report": ["报告输出", "输出分析报告", "把当前外观、均匀性、指标和产出写入报告。", "当前炉次判断完成、准备归档或沟通时使用。", "点击后程序生成报告并自动切换到分析报告页。", "生成前先核对规格、片数、外观和手动修改项。", "overview"],
    "restore-default": ["数据恢复", "恢复默认", "撤销片数、报告内容和影响参数的手动调整。", "需要回到自动识别和默认算法口径时使用。", "点击恢复默认，等待结果重新计算。", "该操作不会删除原始文件。", "overview"],
    "algorithm-model": ["模型说明", "算法模型如何计算产出", "模型分别计算划切、测试合格和出库三个阶段，再结合工程约束给出中心值与预测区间。", "", "", "", "overview", ["输入", "基准", "预测与约束", "输出"], ["薄片数量、外观描述、EXP 及整片测试指标、分区位置和当前规格。", "以“薄片数 × 3200”形成理论总量，再根据外观可用面积建立三阶段计算基准。", "波长、BW@0.3dB、Ripple 及分区风险综合参与条件良率预测；指标面积和烘烤损失再作为安全约束。各合格率口径不同，不能直接连续相乘；Fail 范围也不单独决定最终颗粒良率。", "测试合格数不得超过指标及烘烤约束，出库数不得超过测试合格数。预测区间表达不确定性，区间校准参考不覆盖正式预测；最终结果以实际颗粒测试和人工复核为准。"]],
    "tab-report": ["页面导航", "分析报告", "预览并复制当前炉次的标准化分析结论。", "完成产出判断后用于输出结果。", "先从概览输出报告，再进入该页检查内容。", "报告只保留正式预测，不显示区间校准参考值。", "report"],
    "refresh-report": ["报告输出", "生成 / 刷新报告", "根据当前数据重新生成报告预览。", "修改外观、片数、规格或报告文字后使用。", "点击刷新，再检查日期、炉号、指标和预估产出。", "刷新会采用当前页面最新数据。", "report"],
    "copy-report": ["报告输出", "复制报告", "将当前炉次复制为一行五列：日期/产品、炉号/PN、预估产出/薄片、合成图、分析内容。", "报告内容确认无误、准备粘贴到既有 Excel 模板时使用。", "先在 Excel 选中任意目标起始单元格，再回到软件点击复制报告并粘贴；内容从所选单元格开始占用一行五列。", "软件不限定 A2，也不主动修改模板行高和列宽。D 列采用 4 倍像素密度、480 DPI 的高清合成图，文字使用微软雅黑 10 号。", "report"],
    "report-images": ["报告校对", "报告图片", "依次展示 Delta CW、内圈、监控点、外圈和匹配度五张图；四张详情图采用更宽的画布和报告列宽，光谱截图跟随测试页当前的 0～−1 dB 或 Zoom 模式。", "需要在复制前检查曲线、坐标范围、指标截图或匹配度细节时使用。", "先在测试页选好波形模式，再生成或刷新报告；在桌面端点击任意报告图片可放大，按 Esc、点击遮罩或关闭按钮退出。", "匹配度图例已分开排列。软件预览保留五张独立图片；复制到 Excel 时会合成为一张高清图片，避免重叠和跨行。", "report"],
    "report-table": ["报告校对", "报告预览", "显示即将复制的五列报告内容，包括外观、均匀性、指标和预估产出。", "复制前进行最后一次人工核对时使用。", "依次检查炉号、PN、薄片数、产出、五张图片和分析文字；需要时先刷新报告。", "公开页面展示的日期、炉号、指标和数量均为虚构数据。", "report"]
  };
  const guideTabs = [...document.querySelectorAll("[data-guide-screen]")];
  const guidePanels = [...document.querySelectorAll("[data-guide-panel]")];
  const guideFeatureNodes = [...document.querySelectorAll("[data-guide-feature]")];
  const guideDetail = document.getElementById("guideDetail");
  const showGuideScreen = name => {
    guideTabs.forEach(tab => {
      const active = tab.dataset.guideScreen === name;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    guidePanels.forEach(panel => {
      const active = panel.dataset.guidePanel === name;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
    if (name === "data") requestAnimationFrame(drawAllCharts);
  };
  const showGuideFeature = key => {
    const data = guideFeatures[key];
    if (!data) return false;
    showGuideScreen(data[6]);
    guideFeatureNodes.forEach(node => node.classList.remove("is-guide-active"));
    const visibleTarget = guideFeatureNodes.find(node => node.dataset.guideFeature === key && node.offsetParent !== null);
    visibleTarget?.classList.add("is-guide-active");
    document.getElementById("guideDetailKicker").textContent = data[0];
    document.getElementById("guideDetailTitle").textContent = data[1];
    document.getElementById("guideDetailCopy").textContent = data[2];
    const detailLabels = data[7] || ["作用", "什么时候用", "操作方法", "注意事项"];
    const detailValues = data[8] || data.slice(2, 6);
    [...document.querySelectorAll("#guideDetailList dt")].forEach((item, index) => item.textContent = detailLabels[index]);
    [...document.querySelectorAll("#guideDetailList dd")].forEach((item, index) => item.textContent = detailValues[index]);
    if (window.matchMedia("(max-width: 900px)").matches) requestAnimationFrame(() => {
      guideDetail.focus({ preventScroll: true });
      guideDetail.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    });
    return true;
  };
  guideFeatureNodes.forEach(node => {
    node.addEventListener("click", () => showGuideFeature(node.dataset.guideFeature));
    node.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); showGuideFeature(node.dataset.guideFeature); }
    });
  });
  guideTabs.forEach((tab, index) => tab.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const target = event.key === "Home" ? 0 : event.key === "End" ? guideTabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : guideTabs.length - 1)) % guideTabs.length;
    guideTabs[target].focus();
    showGuideFeature(guideTabs[target].dataset.guideFeature);
  }));
  document.querySelectorAll("[data-guide-jump]").forEach(button => button.addEventListener("click", () => showGuideFeature(button.dataset.guideJump)));
  document.getElementById("guideSearch").addEventListener("submit", event => {
    event.preventDefault();
    const query = document.getElementById("guideSearchInput").value.trim().toLowerCase();
    const entries = Object.entries(guideFeatures);
    const match = entries.find(([key, data]) => `${key} ${data[1]}`.toLowerCase().includes(query)) || entries.find(([key, data]) => `${key} ${data.flat().join(" ")}`.toLowerCase().includes(query));
    if (query && match) showGuideFeature(match[0]);
    else {
      document.getElementById("guideDetailKicker").textContent = "搜索结果";
      document.getElementById("guideDetailTitle").textContent = query ? "没有找到对应功能" : "请输入功能名称";
      document.getElementById("guideDetailCopy").textContent = query ? "可尝试搜索导入、规格、匹配度、Zoom、Delta CW、风险、模型或复制报告。" : "输入按钮名称或分析任务即可快速定位。";
    }
  });

  document.getElementById("copyDemoReport").addEventListener("click", async () => {
    const report = "①外观：30-15，占比 94%\n②均匀性：合格率 88.4%\n③指标：内圈、监控点、外圈数据已汇总\n预估产出：20,730";
    const status = document.getElementById("copyStatus");
    try {
      await navigator.clipboard.writeText(report);
      status.textContent = "演示报告已复制";
    } catch {
      status.textContent = "当前浏览器未允许复制，请手动选择报告内容";
    }
  });

  const release = window.OP_RELEASE || {};
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("releaseVersion").textContent = release.version || "0.3.0-beta.11";
  if (release.public) {
    ["installerDownload", "installerDownloadSecondary"].forEach(id => {
      const link = document.getElementById(id);
      link.href = release.installerUrl;
      link.download = "";
    });
    const portable = document.getElementById("portableDownload");
    portable.href = release.portableUrl;
    portable.download = "";
    document.getElementById("releaseHint").textContent = "适用于功能评估。当前版本未进行代码签名，安装时可能出现 Windows 安全提示。";
    document.getElementById("shaValue").textContent = release.sha256;
    document.getElementById("releaseState").textContent = "可下载";
  } else {
    ["installerDownload", "installerDownloadSecondary", "portableDownload"].forEach(id => document.getElementById(id).classList.add("disabled"));
    document.getElementById("releaseState").textContent = "准备中";
  }
})();
