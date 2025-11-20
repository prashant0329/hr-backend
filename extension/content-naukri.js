console.log("Naukri duplicate checker content script loaded");

function extractCandidate() {
  const nameEl =
    document.querySelector("h1") ||
    document.querySelector(".jd-header-title") ||
    document.querySelector(".headline");

  const name = nameEl ? nameEl.innerText.trim() : "";

  const emailEl = document.querySelector("a[href^='mailto:']");
  const phoneEl = document.querySelector("a[href^='tel:']");

  const email = emailEl ? emailEl.innerText.trim() : "";
  const phone = phoneEl ? phoneEl.innerText.trim() : "";

  return { name, email, phone, source: "Naukri" };
}

function createPanel() {
  if (document.getElementById("dup-check-panel")) return;

  const panel = document.createElement("div");
  panel.id = "dup-check-panel";
  panel.style.position = "fixed";
  panel.style.top = "80px";
  panel.style.right = "20px";
  panel.style.zIndex = "999999";
  panel.style.background = "#ffffff";
  panel.style.border = "1px solid #ddd";
  panel.style.borderRadius = "10px";
  panel.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  panel.style.padding = "10px 12px";
  panel.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  panel.style.fontSize = "12px";
  panel.style.minWidth = "230px";

  panel.innerHTML = `
    <div style="font-weight:600; margin-bottom:6px; font-size:13px;">
      Client Duplicate Check
    </div>
    <div id="dup-status-peoplestrong" style="margin-bottom:4px;">
      PeopleStrong: <span style="font-weight:600; color:#666;">Not checked</span>
    </div>
    <div id="dup-status-ripplehire" style="margin-bottom:8px;">
      RippleHire: <span style="font-weight:600; color:#666;">Not checked</span>
    </div>
    <button id="btn-run-dup-check" style="
      width:100%;
      padding:6px 8px;
      font-size:12px;
      border:none;
      border-radius:6px;
      background:#2563eb;
      color:white;
      cursor:pointer;
    ">
      Check in Client Portals
    </button>
    <div style="margin-top:4px; font-size:10px; color:#999;">
      Make sure you are logged in to PeopleStrong & RippleHire.
    </div>
  `;

  document.body.appendChild(panel);

  document.getElementById("btn-run-dup-check").addEventListener("click", () => {
    const candidate = extractCandidate();
    chrome.runtime.sendMessage({ type: "CANDIDATE_FROM_NAUKRI", candidate }, () => {
      chrome.runtime.sendMessage({ type: "OPEN_CLIENT_PORTAL_SEARCH" }, () => {
        updateStatus("peoplestrong", "Checking…", "#f97316");
        updateStatus("ripplehire", "Checking…", "#f97316");
      });
    });
  });
}

function updateStatus(system, text, color) {
  const id =
    system === "peoplestrong"
      ? "dup-status-peoplestrong"
      : "dup-status-ripplehire";

  const wrap = document.getElementById(id);
  if (!wrap) return;
  const span = wrap.querySelector("span") || wrap;
  span.textContent = text;
  if (color) {
    span.style.color = color;
    span.style.fontWeight = "700";
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "UPDATE_CLIENT_DUPLICATE_STATUS") {
    if (message.system === "peoplestrong") {
      if (message.status === "duplicate") {
        updateStatus("peoplestrong", "Duplicate found", "#dc2626");
      } else if (message.status === "not_found") {
        updateStatus("peoplestrong", "Not found", "#16a34a");
      } else {
        updateStatus("peoplestrong", message.details || "Unknown", "#6b7280");
      }
    }
    if (message.system === "ripplehire") {
      if (message.status === "duplicate") {
        updateStatus("ripplehire", "Duplicate found", "#dc2626");
      } else if (message.status === "not_found") {
        updateStatus("ripplehire", "Not found", "#16a34a");
      } else {
        updateStatus("ripplehire", message.details || "Unknown", "#6b7280");
      }
    }
  }
});

setTimeout(createPanel, 3000);
