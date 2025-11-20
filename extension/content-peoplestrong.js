console.log("PeopleStrong script active");

const DUPLICATE_KEYWORDS = [
  "already exists",
  "candidate already exists",
  "profile already exists",
  "already applied",
  "worker already in system"
];

const NOT_FOUND_KEYWORDS = [
  "no records found",
  "no data found",
  "no candidate found",
  "no matching profiles",
  "0 records"
];

function analyzePage() {
  const text = document.body.innerText.toLowerCase();
  let status = "unknown";
  let details = "";

  const dup = DUPLICATE_KEYWORDS.some((kw) => text.includes(kw));
  const nf = NOT_FOUND_KEYWORDS.some((kw) => text.includes(kw));

  if (dup) {
    status = "duplicate";
    details = "Duplicate message detected on PeopleStrong.";
  } else if (nf) {
    status = "not_found";
    details = "No records found on PeopleStrong.";
  } else {
    details = "No clear duplicate message on PeopleStrong.";
  }

  chrome.runtime.sendMessage({
    type: "CLIENT_DUPLICATE_STATUS",
    system: "peoplestrong",
    status,
    details
  });
}

setTimeout(analyzePage, 6000);
