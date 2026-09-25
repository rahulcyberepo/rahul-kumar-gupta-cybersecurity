const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

document.getElementById("year").textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll(".reveal").forEach(el => {
  if (reducedMotion) {
    el.classList.add("visible");
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  observer.observe(el);
});

const canvas = document.getElementById("matrixCanvas");

if (canvas && !reducedMotion) {
  const ctx = canvas.getContext("2d");
  const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@%&+-<>[]{}アイウエオカキクケコサシスセソ";
  const fontSize = 15;
  let drops = [];
  let animationId = null;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const columns = Math.floor(rect.width / fontSize);
    drops = Array.from({ length: columns }, () => Math.random() * -60);
  };

  const draw = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    ctx.fillStyle = "rgba(5, 4, 8, 0.085)";
    ctx.fillRect(0, 0, width, height);
    ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      ctx.fillStyle = `rgba(185, 104, 255, ${0.38 + Math.random() * 0.46})`;
      ctx.fillText(char, x, y);

      if (y > height && Math.random() > 0.975) {
        drops[i] = Math.random() * -24;
      }

      drops[i] += 0.5 + Math.random() * 0.18;
    }

    animationId = requestAnimationFrame(draw);
  };

  resize();
  draw();

  window.addEventListener("resize", resize, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    } else if (!document.hidden && !animationId) {
      draw();
    }
  });
}

const projects = {
  lab: {
    title: "Cybersecurity Home Lab + Network Discovery",
    summary: "An isolated lab for understanding what discovery and enumeration tools are actually doing.",
    objective: "Discover hosts, observe ARP, scan ports, enumerate services, capture traffic and map the network.",
    evidence: "Network diagram, command notes, screenshots, PCAP, README and a short research note.",
    skills: "IP/MAC addressing, ARP, TCP/UDP, ports, services, Nmap and Wireshark.",
    relevance: "Foundation for internal assessment, troubleshooting and defensible enumeration."
  },
  linux: {
    title: "Linux Security + Hardening",
    summary: "Assess a Linux machine, make controlled improvements and show what changed after hardening.",
    objective: "Review users, groups, processes, services, SSH, permissions and firewall configuration, then retest.",
    evidence: "Before/after checklist, screenshots, configuration notes and a short hardening report.",
    skills: "Linux permissions, services, SSH, firewall basics and least privilege.",
    relevance: "Useful for penetration testing, server reviews and remediation verification."
  },
  pcap: {
    title: "Network Traffic Investigation",
    summary: "Reconstruct network activity from packet captures and explain the flow clearly.",
    objective: "Identify who communicated, which protocols were involved, what happened first and what looked unusual.",
    evidence: "Annotated PCAP, packet-flow diagram and mini incident analysis.",
    skills: "Wireshark, DNS, TCP, HTTP, packet analysis and timeline reconstruction.",
    relevance: "Supports pentesting, troubleshooting, incident investigation and protocol understanding."
  },
  va: {
    title: "Vulnerability Assessment + Manual Validation",
    summary: "Use scanners as starting points, then manually verify whether findings are real and meaningful.",
    objective: "Classify findings as confirmed vulnerability, false positive, misconfiguration or informational issue.",
    evidence: "Scanner output, validation notes, technical finding, executive summary and retest note.",
    skills: "Validation, evidence collection, risk thinking, false-positive analysis and reporting.",
    relevance: "Directly relevant to VAPT because real assessments cannot rely on scanners alone."
  },
  web: {
    title: "Web Application VAPT",
    summary: "Test an authorized deliberately vulnerable application with focus on root cause and remediation.",
    objective: "Assess authentication, authorization, access control, sessions, input handling and selected business-logic issues.",
    evidence: "Sanitized requests/responses, screenshots, findings, technical report and retest report.",
    skills: "HTTP, Burp Suite, authentication, authorization, manual validation and remediation.",
    relevance: "Direct preparation for junior VAPT, web-security and application-security roles."
  },
  automation: {
    title: "VAPT Workflow Automation",
    summary: "Build a small tool that removes repetitive assessment work instead of another generic port scanner.",
    objective: "Automate a practical task such as parsing Nmap XML, organizing evidence or tracking retest status.",
    evidence: "GitHub repository, README, sample input/output, limitations and test cases.",
    skills: "Python, XML/JSON/CSV handling, regex, error handling and Git.",
    relevance: "Shows programming being applied to practical security work."
  }
};

const modal = document.getElementById("projectModal");
const closeButton = document.getElementById("modalClose");

const modalFields = {
  title: document.getElementById("modalTitle"),
  summary: document.getElementById("modalSummary"),
  objective: document.getElementById("modalObjective"),
  evidence: document.getElementById("modalEvidence"),
  skills: document.getElementById("modalSkills"),
  relevance: document.getElementById("modalRelevance")
};

document.querySelectorAll(".project-detail").forEach(button => {
  button.addEventListener("click", () => {
    const data = projects[button.dataset.project];
    if (!data) return;

    Object.keys(modalFields).forEach(key => {
      modalFields[key].textContent = data[key];
    });

    modal.showModal();
  });
});

if (closeButton && modal) {
  closeButton.addEventListener("click", () => modal.close());

  modal.addEventListener("click", event => {
    const rect = modal.getBoundingClientRect();
    const outside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (outside) modal.close();
  });
}
