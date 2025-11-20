console.log("RippleHire script active");

const DUPLICATE_KEYWORDS = [
  "already exists",
  "already registered",
  "candidate already exists",
  "profile already exists",
  "application already submitted"
];

const NOT_FOUND_KEYWORDS = [
  "no matching results",
  "no records found",
  "no candidate found",
  "0 candidates",
  "no data found"
];

function analyzePage() {
  const text = document.body.innerText.toLowerCase();
  let status = "unknown";
  let details = "";

  const dup = DUPLICATE_KEYWORDS.some((kw) => text.includes(kw));
  const nf = NOT_FOUND_KEYWORDS.some((kw) => text.includes(kw));

  if (dup) {
    status = "duplicate";
    details = "Duplicate message detected on RippleHire.";
  } else if (nf) {
    status = "not_found";
    details = "No records found on RippleHire.";
  } else {
    details = "No clear duplicate message on RippleHire.";
  }

  chrome.runtime.sendMessage({
    type: "CLIENT_DUPLICATE_STATUS",
    system: "ripplehire",
    status,
    details
  });
}

setTimeout(analyzePage, 6000);
