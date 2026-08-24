(() => {
  "use strict";
  const metrics = [
    ["Delta CW", "-0.48", "-1.50～0.20"], ["BW@0.3dB", "4.82", "≥4.60"],
    ["Ripple", "0.11", "≤0.14"], ["Max IL", "0.52", "≤0.80"],
    ["ISO Left", "31.2", "≥28.0"], ["ISO Right", "30.8", "≥28.0"],
    ["Center Wavelength", "演示", "演示"], ["Passband", "通过", "目标"], ["Point Result", "PASS", "PASS"]
  ];
  document.getElementById("demoMetrics").innerHTML = metrics.map(row =>
    `<tr><td>${row[0]}</td><td class="pass">${row[1]}</td><td>${row[2]}</td></tr>`
  ).join("");

  document.querySelectorAll("[data-demo-tab]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-demo-tab]").forEach(item => item.classList.toggle("active", item === button));
    document.querySelectorAll("[data-demo-panel]").forEach(panel =>
      panel.classList.toggle("active", panel.dataset.demoPanel === button.dataset.demoTab));
  }));

  const drawChart = (canvas, lines, minY, maxY, targets = []) => {
    const context = canvas.getContext("2d");
    const { width, height } = canvas;
    context.clearRect(0, 0, width, height);
    context.strokeStyle = "#263b4e"; context.lineWidth = 1;
    for (let x = 40; x < width; x += 80) { context.beginPath(); context.moveTo(x, 15); context.lineTo(x, height - 25); context.stroke(); }
    for (let y = 20; y < height; y += 45) { context.beginPath(); context.moveTo(35, y); context.lineTo(width - 12, y); context.stroke(); }
    const mapY = value => 15 + (maxY - value) / (maxY - minY) * (height - 40);
    targets.forEach(value => { context.setLineDash([7, 5]); context.strokeStyle = "#e19b50"; context.beginPath(); context.moveTo(35, mapY(value)); context.lineTo(width - 12, mapY(value)); context.stroke(); });
    context.setLineDash([]);
    lines.forEach((values, index) => {
      context.strokeStyle = ["#4fd1b6", "#5e8df6", "#d47ee8"][index]; context.lineWidth = 2;
      context.beginPath();
      values.forEach((value, point) => { const x = 35 + point / (values.length - 1) * (width - 50); const y = mapY(value); point ? context.lineTo(x, y) : context.moveTo(x, y); });
      context.stroke();
    });
  };
  const wave = Array.from({ length: 120 }, (_, index) =>
    -32 + 31 * Math.exp(-Math.pow((index - 59) / 13, 2))
  );
  drawChart(document.getElementById("waveCanvas"), [wave], -35, 2);
  drawChart(document.getElementById("deltaCanvas"), [
    [-.42,-.40,-.43,-.47,-.52,-.58,-.61,-.55,-.49,-.45],
    [-.55,-.52,-.50,-.46,-.44,-.47,-.53,-.60,-.65,-.62],
    [-.28,-.31,-.35,-.42,-.48,-.55,-.63,-.70,-.74,-.69]
  ], -1.7, .3, [-1.5,.2]);

  document.getElementById("copyDemoReport").addEventListener("click", async () => {
    const status = document.getElementById("copyStatus");
    try { await navigator.clipboard.writeText("OP Analysis 虚构演示报告\n不代表实际预测结果"); status.textContent = "演示报告已复制"; }
    catch { status.textContent = "浏览器未允许复制，请手动选择报告内容。"; }
  });

  const release = window.OP_RELEASE || {};
  const bindDownload = (id, url) => {
    const element = document.getElementById(id);
    if (!release.public || !url) return;
    element.href = url; element.classList.remove("disabled"); element.removeAttribute("aria-disabled");
  };
  bindDownload("installerDownload", release.installerUrl);
  bindDownload("portableDownload", release.portableUrl);
  if (release.public) document.getElementById("releaseHint").textContent = `当前版本 ${release.version}`;
  if (release.sha256) document.getElementById("shaValue").textContent = release.sha256;
  document.getElementById("year").textContent = new Date().getFullYear();
})();
