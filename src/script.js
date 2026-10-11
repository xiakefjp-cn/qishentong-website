const workflowStates = {
  review: {
    kicker: "批量合同审核",
    title: "整组合同，关键条款一眼看清",
    description: "按版本提取条款、聚合同类文件、定位异常表达，每条判断都能回到原文。",
    tags: ["版本隔离", "条款提取", "来源引用", "批量任务"],
    context: "合同集 / 供应商框架协议",
    caption: "合同风险评分",
    progress: "12 / 12 已完成",
    type: "review",
    bars: [["A01", 42], ["A02", 68], ["A03", 55], ["A04", 86], ["A05", 63], ["A06", 91]],
    rows: [["责任限制", "3 份偏离", "高风险", "red"], ["付款与验收", "5 项待核", "需确认", "amber"], ["签署主体", "12 份通过", "已通过", "green"]]
  },
  risk: {
    kicker: "风险条款定位",
    title: "风险在哪，证据就落在哪",
    description: "语义检索发现异常，规则库识别偏差，结论与原文一起保存。",
    tags: ["RAG", "规则检索", "条款偏差", "证据回链"],
    context: "风险扫描 / 设备采购合同",
    caption: "风险类别 × 严重程度",
    progress: "8 项已定位",
    type: "risk",
    totals: [["高", 2, "red"], ["中", 3, "amber"], ["低", 3, "green"]],
    matrix: [["责任限制", 2, 1, 0], ["数据合规", 0, 1, 1], ["争议解决", 0, 1, 2]]
  },
  qa: {
    kicker: "版本内合同问答",
    title: "答案不离开原文",
    description: "在确定的租户和版本内回答，引用来源可复核、可追踪。",
    tags: ["自然语言问答", "来源引用", "版本绑定", "上下文隔离"],
    context: "合同问答 / 当前版本 V3",
    caption: "答案与原文来源",
    progress: "3 / 3 有引用",
    type: "qa",
    coverage: 100,
    questions: [["可以提前解约吗？", "满足重大违约条件时可以", "第 12.3 条", "amber"], ["质保期多久？", "验收通过后 24 个月", "第 8.1 条", "green"], ["是否自动续期？", "两处表述冲突，建议复核", "第 3.2、11.4 条", "red"]]
  },
  obligation: {
    kicker: "履约事项提取",
    title: "把履约条件变成行动节点",
    description: "模型识别候选事项，程序工具校验日期、金额、付款与验收。",
    tags: ["日期计算", "金额校验", "付款条件", "验收节点"],
    context: "履约台账 / 采购项目",
    caption: "关键履约时间轴",
    progress: "6 个节点",
    type: "obligation",
    timeline: [["10-18", "首付款", "财务", "待确认", "amber"], ["11-20", "到货验收", "采购", "已校验", "green"], ["12-05", "尾款支付", "财务", "待执行", "purple"], ["2027-11", "续期通知", "法务", "窗口偏短", "red"]]
  },
  approval: {
    kicker: "候选成果治理",
    title: "模型提建议，授权人定事实",
    description: "成果先成为候选；RBAC 审批通过后，才写入正式记录。",
    tags: ["Candidate", "RBAC", "HITL", "事务写入"],
    context: "审批中心 / 候选成果",
    caption: "审批状态与待办队列",
    progress: "5 项待处理",
    type: "approval",
    approvalCounts: [["待审批", 5], ["已批准", 12], ["已驳回", 2]],
    queue: [["审核报告", "王法务", "待审批", "amber"], ["风险条目", "李经理", "需确认", "red"], ["履约节点", "陈主管", "可批准", "green"]]
  }
};

const demoScenes = [
  {
    kicker: "步骤 01 · 输入",
    title: "合同先变成可追踪数据",
    description: "上传文件后完成解析、切分与字段识别，为后续审核建立稳定输入。",
    visual: `<div class="demo-upload"><div class="demo-file"><span>DOCX</span><div><b>设备采购合同.docx</b><small>2.8 MB · 38 页</small></div><em>解析完成</em></div><div class="demo-processing"><span><i style="--w:100%"></i></span><div><b>186</b><small>条款片段</small></div><div><b>24</b><small>关键字段</small></div><div><b>12</b><small>附件引用</small></div></div></div>`
  },
  {
    kicker: "步骤 02 · 边界",
    title: "审核始终绑定确定版本",
    description: "租户、合同与版本共同限定数据边界，避免不同版本和项目相互污染。",
    visual: `<div class="demo-version"><div class="version-path"><span>华东采购项目</span><i>→</i><span>设备采购合同</span><i>→</i><strong>V3 当前版本</strong></div><div class="version-list"><article><span>V3</span><div><b>第三次修订</b><small>今天 14:32 · 责任限制已调整</small></div><em>审核中</em></article><article><span>V2</span><div><b>法务修订版</b><small>昨天 18:06 · 已归档</small></div><em>只读</em></article><article><span>V1</span><div><b>供应商初稿</b><small>10 月 6 日 · 已归档</small></div><em>只读</em></article></div></div>`
  },
  {
    kicker: "步骤 03 · 发现",
    title: "语义检索定位风险线索",
    description: "系统聚合规则与相似条款，快速找出偏离企业标准的合同表达。",
    visual: `<div class="demo-risk"><div class="risk-score"><strong>72</strong><div><b>综合风险</b><small>2 项高风险 · 3 项需确认</small></div></div><div class="risk-bars"><article><span>责任限制</span><i><b style="--w:88%"></b></i><em>高</em></article><article><span>付款验收</span><i><b style="--w:67%"></b></i><em>中</em></article><article><span>数据合规</span><i><b style="--w:42%"></b></i><em>中</em></article><article><span>争议解决</span><i><b style="--w:19%"></b></i><em>低</em></article></div></div>`
  },
  {
    kicker: "步骤 04 · 校验",
    title: "关键数字交给程序复核",
    description: "日期、金额、付款与验收条件通过确定性工具计算，不让模型凭空判断。",
    visual: `<div class="demo-checks"><div class="check-formula"><small>付款到期日</small><b>签署日 + 10 个工作日</b><strong>2026-10-24</strong></div><div class="check-list"><article><i>✓</i><span><b>金额合计</b><small>¥ 2,480,000.00</small></span><em>一致</em></article><article><i>✓</i><span><b>验收前置</b><small>到货验收单 + 发票</small></span><em>已关联</em></article><article class="is-warning"><i>!</i><span><b>续期通知</b><small>仅提前 15 日，低于规则值</small></span><em>需复核</em></article></div></div>`
  },
  {
    kicker: "步骤 05 · 隔离",
    title: "成果先进入候选区",
    description: "报告、风险与履约节点通过结构和证据预检后保存，但暂不改变正式记录。",
    visual: `<div class="demo-candidates"><article><span>审核报告</span><strong>1</strong><small>证据覆盖 100%</small><em>候选</em></article><article><span>风险条目</span><strong>8</strong><small>2 项高风险</small><em>候选</em></article><article><span>履约节点</span><strong>6</strong><small>日期已校验</small><em>候选</em></article><div class="candidate-gate"><i>◇</i><span><b>正式记录保持不变</b><small>等待授权审批</small></span></div></div>`
  },
  {
    kicker: "步骤 06 · 决策",
    title: "授权人决定最终写入",
    description: "审批人查看原文证据与校验结果，批准后才以事务方式写入正式记录。",
    visual: `<div class="demo-approval"><div class="approval-card"><header><span><i>王</i><b>王法务</b><small>合同审批人</small></span><em>待决策</em></header><div><b>设备采购合同 · V3</b><small>8 项风险 · 6 个履约节点 · 证据预检通过</small></div><footer><button type="button" tabindex="-1">驳回</button><button type="button" tabindex="-1">批准并写入</button></footer></div><p><i>✓</i> 审批动作、操作者与写入结果进入审计链</p></div>`
  }
];

const flowStates = [
  ["确定输入边界", "文件先变成可追踪版本", "解析、切分并持久化合同版本；后续审核只读取确定的租户和版本。", ["解析队列", "PostgreSQL", "pgvector"]],
  ["生成受控计划", "目标、规则和预算进入同一计划", "Runtime 读取身份、目标与规则，并确定工具范围、预算和停止条件。", ["Plan-and-Execute", "Identity", "Budget"]],
  ["执行真实工具", "语义发现，程序复核", "RAG 发现线索；日期、金额、付款与验收由程序工具计算。", ["Tool allowlist", "RAG", "Deterministic checks"]],
  ["提交可恢复状态", "每一步都有真实结果", "步骤、调用与来源一起持久化，支持长任务恢复。", ["Step", "ToolCall", "Source"]],
  ["隔离候选成果", "预检通过，再进入候选区", "候选成果通过 Schema 与证据校验后保存，不直接改变合同事实。", ["Schema", "Evidence", "candidate_*"]],
  ["控制正式写入", "授权审批是最后一道门", "RBAC 决定批准或驳回；批准后才写入正式记录。", ["RBAC", "Approve / Reject", "Transaction"]]
];

const header = document.querySelector(".site-header");
let lastScrollY = window.scrollY;
let navigationLockUntil = 0;
window.addEventListener("scroll", () => {
  const current = window.scrollY;
  header.classList.toggle("is-scrolled", current > 12);
  const navigationIsActive = performance.now() < navigationLockUntil;
  header.classList.toggle("is-hidden", !navigationIsActive && current > 96 && current > lastScrollY + 3);
  lastScrollY = current;
}, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px" });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const workflowPanel = document.querySelector("#workflow-panel");
const miniProduct = document.querySelector("#mini-product");

const statusRow = ([title, detail, status, color]) => `<div class="mini-row"><i class="${color}"></i><span><b>${title}</b><small>${detail}</small></span><em>${status}</em></div>`;

const renderMiniView = (state) => {
  if (state.type === "review") {
    const bars = state.bars.map(([label, value]) => `<div class="score-bar"><span style="--score:${value}%"><b>${value}</b></span><small>${label}</small></div>`).join("");
    return `<div class="review-chart" aria-label="六份合同风险评分">${bars}</div><div class="mini-list">${state.rows.map(statusRow).join("")}</div>`;
  }
  if (state.type === "risk") {
    const totals = state.totals.map(([label, value, color]) => `<div><i class="${color}"></i><span>${label}风险</span><b>${value}</b></div>`).join("");
    const rows = state.matrix.map(([label, high, medium, low]) => `<div class="matrix-row"><b>${label}</b><span class="heat heat--high">${high || "—"}</span><span class="heat heat--mid">${medium || "—"}</span><span class="heat heat--low">${low || "—"}</span></div>`).join("");
    return `<div class="risk-totals">${totals}</div><div class="risk-matrix"><div class="matrix-head"><span>风险类别</span><span>高</span><span>中</span><span>低</span></div>${rows}</div>`;
  }
  if (state.type === "qa") {
    const cards = state.questions.map(([question, answer, source, color]) => `<div class="qa-card"><i class="${color}">?</i><div><b>${question}</b><span>${answer}</span><small>↳ 来源：${source}</small></div></div>`).join("");
    return `<div class="qa-summary"><div class="coverage-ring" style="--coverage:${state.coverage * 3.6}deg"><strong>${state.coverage}%</strong><small>来源覆盖</small></div><p>每个答案绑定当前版本<br><b>可回到原文复核</b></p></div><div class="qa-list">${cards}</div>`;
  }
  if (state.type === "obligation") {
    const items = state.timeline.map(([date, title, owner, status, color]) => `<div class="timeline-row"><time>${date}</time><i class="${color}"></i><span><b>${title}</b><small>责任人：${owner}</small></span><em>${status}</em></div>`).join("");
    return `<div class="obligation-head"><span>日期</span><span>履约事项</span><span>状态</span></div><div class="timeline-list">${items}</div>`;
  }
  const total = state.approvalCounts.reduce((sum, [, value]) => sum + value, 0);
  const legend = state.approvalCounts.map(([label, value], index) => `<span><i class="legend-${index}"></i>${label} ${value}</span>`).join("");
  const queue = state.queue.map(([artifact, owner, status, color]) => `<div class="queue-row"><span><b>${artifact}</b><small>审批人：${owner}</small></span><em class="${color}">${status}</em></div>`).join("");
  return `<div class="approval-summary"><div class="approval-donut"><strong>${total}</strong><small>全部成果</small></div><div class="approval-legend">${legend}</div></div><div class="queue-head"><span>候选成果</span><span>审批状态</span></div><div class="approval-queue">${queue}</div>`;
};

const updateMiniProduct = (state) => {
  document.querySelector("#mini-context").textContent = state.context;
  document.querySelector("#mini-progress").textContent = state.progress;
  document.querySelector("#mini-caption").textContent = state.caption;
  document.querySelector("#mini-view").innerHTML = renderMiniView(state);
};

updateMiniProduct(workflowStates.review);

document.querySelectorAll(".workflow-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const state = workflowStates[tab.dataset.workflow];
    if (!state || tab.classList.contains("is-active")) return;
    document.querySelectorAll(".workflow-tab").forEach((item) => {
      item.classList.toggle("is-active", item === tab);
      item.setAttribute("aria-selected", String(item === tab));
    });
    miniProduct.classList.add("is-changing");
    window.setTimeout(() => {
      document.querySelector("#workflow-kicker").textContent = state.kicker;
      document.querySelector("#workflow-title").textContent = state.title;
      document.querySelector("#workflow-description").textContent = state.description;
      document.querySelector("#workflow-tags").innerHTML = state.tags.map((tag) => `<span>${tag}</span>`).join("");
      miniProduct.dataset.mode = tab.dataset.workflow;
      miniProduct.setAttribute("aria-label", `${state.kicker}示意数据`);
      updateMiniProduct(state);
      miniProduct.classList.remove("is-changing");
    }, 150);
    workflowPanel.focus?.({ preventScroll: true });
  });
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const principleSection = document.querySelector("#principles");
const principleStack = document.querySelector(".principle-stack");
const principleCards = [...document.querySelectorAll(".principle-card")];
let principleIndex = 0;
let principleTimer = null;
let principlesInView = false;

const setPrinciple = (index) => {
  principleIndex = (index + principleCards.length) % principleCards.length;
  principleCards.forEach((card, cardIndex) => {
    const isActive = cardIndex === principleIndex;
    card.classList.toggle("is-active", isActive);
    if (isActive) card.setAttribute("aria-current", "step");
    else card.removeAttribute("aria-current");
  });
  document.querySelector("#principle-status").textContent = `${String(principleIndex + 1).padStart(2, "0")} / ${String(principleCards.length).padStart(2, "0")}`;
};

const stopPrinciples = () => {
  window.clearInterval(principleTimer);
  principleTimer = null;
  principleStack?.classList.add("is-paused");
};

const startPrinciples = () => {
  if (!principlesInView || prefersReducedMotion.matches || principleCards.length < 2) return;
  if (principleStack?.matches(":hover") || principleStack?.contains(document.activeElement)) return;
  window.clearInterval(principleTimer);
  principleStack?.classList.remove("is-paused");
  principleTimer = window.setInterval(() => setPrinciple(principleIndex + 1), 3200);
};

principleCards.forEach((card, index) => {
  const selectCard = () => {
    setPrinciple(index);
    startPrinciples();
  };
  card.addEventListener("click", selectCard);
  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    selectCard();
  });
});

principleStack?.addEventListener("mouseenter", stopPrinciples);
principleStack?.addEventListener("mouseleave", startPrinciples);
principleStack?.addEventListener("focusin", stopPrinciples);
principleStack?.addEventListener("focusout", () => window.setTimeout(startPrinciples, 0));

if (principleSection) {
  const principleObserver = new IntersectionObserver(([entry]) => {
    principlesInView = entry.isIntersecting;
    if (principlesInView) startPrinciples();
    else stopPrinciples();
  }, { threshold: .35 });
  principleObserver.observe(principleSection);
}

const topNavLinks = [...document.querySelectorAll(".site-nav-link")];
const navigationGroups = {
  workflow: "workflow",
  flow: "flow",
  scenarios: "scenarios",
  principles: "scenarios",
  evidence: "security",
  security: "security",
  faq: "security",
  contact: "security"
};
const trackedSections = [...document.querySelectorAll("main > section[id]")];

const updateActiveNavigation = () => {
  const marker = window.scrollY + header.offsetHeight + Math.min(window.innerHeight * .28, 220);
  let visibleSectionId = "";
  trackedSections.forEach((section) => {
    if (section.offsetTop <= marker) visibleSectionId = section.id;
  });
  const activeId = navigationGroups[visibleSectionId] || "";
  topNavLinks.forEach((link) => {
    const isActive = link.hash === `#${activeId}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
};

const scrollToHash = (hash, updateHistory = true) => {
  if (!hash || hash === "#") return;
  const target = document.querySelector(hash);
  if (!target) return;
  const headerOffset = header.offsetHeight + 16;
  const top = target.id === "hero" ? 0 : Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerOffset);
  navigationLockUntil = performance.now() + 1000;
  header.classList.remove("is-hidden");
  window.scrollTo({ top, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
  if (updateHistory && window.location.hash !== hash) history.pushState(null, "", hash);
  window.setTimeout(updateActiveNavigation, prefersReducedMotion.matches ? 0 : 520);
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetMode = link.dataset.workflowTarget;
    if (targetMode) document.querySelector(`.workflow-tab[data-workflow="${targetMode}"]`)?.click();
    if (!document.querySelector(link.hash)) return;
    event.preventDefault();
    scrollToHash(link.hash);
  });
});

window.addEventListener("scroll", updateActiveNavigation, { passive: true });
window.addEventListener("resize", updateActiveNavigation);
window.addEventListener("popstate", () => scrollToHash(window.location.hash, false));
window.addEventListener("load", () => {
  if (window.location.hash) window.setTimeout(() => scrollToHash(window.location.hash, false), 60);
  updateActiveNavigation();
});
updateActiveNavigation();

document.querySelectorAll(".flow-step").forEach((step) => {
  step.addEventListener("click", () => {
    const index = Number(step.dataset.step);
    const [kicker, title, text, tags] = flowStates[index];
    document.querySelectorAll(".flow-step").forEach((item) => item.classList.toggle("is-active", item === step));
    document.querySelector("#flow-detail-icon").textContent = String(index + 1).padStart(2, "0");
    document.querySelector("#flow-detail-kicker").textContent = kicker;
    document.querySelector("#flow-detail-title").textContent = title;
    document.querySelector("#flow-detail-text").textContent = text;
    document.querySelector("#flow-detail-tags").innerHTML = tags.map((tag) => `<span>${tag}</span>`).join("");
  });
});

document.querySelectorAll(".faq-list details").forEach((details) => {
  details.addEventListener("toggle", () => {
    if (!details.open) return;
    document.querySelectorAll(".faq-list details").forEach((other) => {
      if (other !== details) other.open = false;
    });
  });
});

const demoDialog = document.querySelector("#demo-dialog");
const demoOpen = document.querySelector("#demo-open");
const demoPlay = document.querySelector("#demo-play");
let demoIndex = 0;
let demoTimer = null;
let demoPlaying = false;
let demoEnded = false;

const renderDemoScene = (index) => {
  demoIndex = Math.max(0, Math.min(index, demoScenes.length - 1));
  const scene = demoScenes[demoIndex];
  document.querySelector("#demo-kicker").textContent = scene.kicker;
  document.querySelector("#demo-title").textContent = scene.title;
  document.querySelector("#demo-description").textContent = scene.description;
  document.querySelector("#demo-visual").innerHTML = scene.visual;
  document.querySelector("#demo-counter").textContent = `${String(demoIndex + 1).padStart(2, "0")} / ${String(demoScenes.length).padStart(2, "0")}`;
  document.querySelector("#demo-progress-fill").style.width = `${((demoIndex + 1) / demoScenes.length) * 100}%`;
  document.querySelectorAll("[data-demo-step]").forEach((button, buttonIndex) => {
    button.classList.toggle("is-active", buttonIndex === demoIndex);
    button.setAttribute("aria-current", buttonIndex === demoIndex ? "step" : "false");
  });
  document.querySelector("#demo-prev").disabled = demoIndex === 0;
  document.querySelector("#demo-next").disabled = demoIndex === demoScenes.length - 1;
};

const stopDemo = (ended = false) => {
  window.clearInterval(demoTimer);
  demoTimer = null;
  demoPlaying = false;
  demoEnded = ended;
  demoPlay.innerHTML = ended ? "<span>↻</span> 重播" : "<span>▶</span> 继续";
};

const startDemo = () => {
  window.clearInterval(demoTimer);
  demoPlaying = true;
  demoEnded = false;
  demoPlay.innerHTML = "<span>Ⅱ</span> 暂停";
  demoTimer = window.setInterval(() => {
    if (demoIndex >= demoScenes.length - 1) {
      stopDemo(true);
      return;
    }
    renderDemoScene(demoIndex + 1);
  }, 4000);
};

const openDemo = (startIndex = 0) => {
  renderDemoScene(startIndex);
  demoDialog.showModal();
  startDemo();
};

demoOpen?.addEventListener("click", () => openDemo(0));

document.querySelectorAll("[data-demo-open-step]").forEach((button) => {
  button.addEventListener("click", () => openDemo(Number(button.dataset.demoOpenStep)));
});

document.querySelector("#demo-close")?.addEventListener("click", () => demoDialog.close());
demoDialog?.addEventListener("close", () => stopDemo());
demoDialog?.addEventListener("click", (event) => {
  if (event.target === demoDialog) demoDialog.close();
});
demoDialog?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" && demoIndex < demoScenes.length - 1) renderDemoScene(demoIndex + 1);
  if (event.key === "ArrowLeft" && demoIndex > 0) renderDemoScene(demoIndex - 1);
});
document.querySelectorAll("[data-demo-step]").forEach((button) => {
  button.addEventListener("click", () => {
    renderDemoScene(Number(button.dataset.demoStep));
    if (demoPlaying) startDemo();
  });
});
document.querySelector("#demo-prev")?.addEventListener("click", () => {
  renderDemoScene(demoIndex - 1);
  if (demoPlaying) startDemo();
});
document.querySelector("#demo-next")?.addEventListener("click", () => {
  renderDemoScene(demoIndex + 1);
  if (demoPlaying) startDemo();
});
demoPlay?.addEventListener("click", () => {
  if (demoPlaying) {
    stopDemo();
  } else {
    if (demoEnded || demoIndex === demoScenes.length - 1) renderDemoScene(0);
    startDemo();
  }
});

renderDemoScene(0);
