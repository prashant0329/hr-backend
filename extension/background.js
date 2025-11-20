const API_BASE = "https://hr-backend-ry9s.onrender.com";

let currentCandidate = null;
let statuses = { peoplestrong: "unknown", ripplehire: "unknown" };
let hasLogged = false;

async function logToBackend() {
  if (!currentCandidate || hasLogged) return;

  const { name, email, phone } = currentCandidate;

  if (statuses.peoplestrong === "unknown" && statuses.ripplehire === "unknown") {
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/duplicate-log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        peoplestrongStatus: statuses.peoplestrong,
        ripplehireStatus: statuses.ripplehire
      })
    });
    const data = await res.json();
    console.log("Logged to backend:", data);
    hasLogged = true;
  } catch (err) {
    console.error("Error logging to backend:", err);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CANDIDATE_FROM_NAUKRI") {
    currentCandidate = message.candidate;
    statuses = { peoplestrong: "unknown", ripplehire: "unknown" };
    hasLogged = false;
    chrome.storage.local.set({ currentCandidate, statuses });
    sendResponse({ status: "ok" });
  }

  if (message.type === "GET_CURRENT_CANDIDATE") {
    chrome.storage.local.get(["currentCandidate"], (res) => {
      sendResponse({ candidate: res.currentCandidate || currentCandidate || null });
    });
    return true;
  }

  if (message.type === "OPEN_CLIENT_PORTAL_SEARCH") {
    const peopleStrongUrl = "https://yourclient.peoplestrong.com"; // TODO: real URL
    const rippleHireUrl = "https://yourclient.ripplehire.com";     // TODO: real URL

    chrome.tabs.create({ url: peopleStrongUrl, active: false });
    chrome.tabs.create({ url: rippleHireUrl, active: false });

    sendResponse({ status: "opened" });
  }

  if (message.type === "CLIENT_DUPLICATE_STATUS") {
    const { system, status, details } = message;
    if (system === "peoplestrong" || system === "ripplehire") {
      statuses[system] = status;
      chrome.storage.local.set({ statuses });

      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id, {
            type: "UPDATE_CLIENT_DUPLICATE_STATUS",
            system,
            status,
            details
          });
        });
      });

      logToBackend();
    }
  }
});
