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
    activeDemoFile.textContent = `${button.dataset.demoFile} · 9 / 9 合格`;
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
  }

  const observer = new ResizeObserver(drawAllCharts);
  ["waveCanvas", "deltaCanvas", "capabilityCanvas"].forEach(id => observer.observe(document.getElementById(id)));
  requestAnimationFrame(drawAllCharts);

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
  document.getElementById("releaseVersion").textContent = release.version || "0.2.0-beta.1";
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
