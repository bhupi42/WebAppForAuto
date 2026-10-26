const moduleSections = [...document.querySelectorAll(".module-section")];
const moduleLinks = [...document.querySelectorAll("[data-module-link]")];
const moduleSearch = document.getElementById("moduleSearch");
const breadcrumbCurrent = document.getElementById("breadcrumbCurrent");

function showModule(moduleId) {
  const target = document.getElementById(moduleId) ? moduleId : "home";
  moduleSections.forEach((section) => { section.hidden = section.id !== target; });
  moduleLinks.forEach((link) => link.classList.toggle("active", link.dataset.moduleLink === target));
  breadcrumbCurrent.textContent = document.getElementById(target).dataset.title;
  document.title = `${document.getElementById(target).dataset.title} | Automation Testing Practice Lab`;
}

function syncRoute() {
  showModule(location.hash.slice(1) || "home");
}

window.addEventListener("hashchange", syncRoute);
syncRoute();

moduleSearch.addEventListener("input", () => {
  const query = moduleSearch.value.trim().toLowerCase();
  moduleLinks.forEach((link) => {
    const matches = link.textContent.toLowerCase().includes(query);
    link.hidden = !matches;
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    moduleSearch.focus();
  }
});

document.querySelectorAll("[data-reset-section]").forEach((button) => {
  button.addEventListener("click", () => {
    const sectionId = button.dataset.resetSection;
    if (sectionId === "forms") document.getElementById("registrationForm").reset();
    if (sectionId === "tables") resetTable();
    if (sectionId === "buttons") resetButtons();
    if (sectionId === "selection") resetSelection();
    if (sectionId === "frames") document.getElementById("practiceFrame").srcdoc = document.getElementById("practiceFrame").srcdoc;
    if (sectionId === "async") resetAsync();
    if (sectionId === "files") resetFiles();
    if (sectionId === "search") resetCatalog();
    if (sectionId === "auth") resetAuth();
    if (sectionId === "advanced") resetAdvanced();
  });
});

document.getElementById("resetAll").addEventListener("click", () => {
  const currentHash = location.hash;
  sessionStorage.removeItem("practiceLabSignedIn");
  location.href = `${location.pathname}${location.search}${currentHash || "#home"}`;
  location.reload();
});

const registrationForm = document.getElementById("registrationForm");
const formStatus = document.getElementById("formStatus");
const rangeInput = document.getElementById("experienceRange");
rangeInput.addEventListener("input", () => { document.getElementById("rangeValue").value = rangeInput.value; });
registrationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("fullName");
  const email = document.getElementById("emailAddress");
  const password = document.getElementById("passwordField");
  const terms = document.getElementById("termsCheck");
  const failures = [
    [name, "nameError", name.value.trim().length < 2, "Enter at least 2 characters."],
    [email, "emailError", !email.validity.valid || !email.value, "Enter a valid email address."],
    [password, "passwordError", password.value.length < 8, "Use at least 8 characters."],
  ];
  let hasError = false;
  failures.forEach(([control, errorId, invalid, message]) => {
    document.getElementById(errorId).textContent = invalid ? message : "";
    control.setAttribute("aria-invalid", String(invalid));
    if (invalid) hasError = true;
  });
  if (!terms.checked) hasError = true;
  if (hasError) {
    formStatus.textContent = terms.checked ? "Please correct the highlighted fields." : "Please accept the practice terms and correct the highlighted fields.";
    formStatus.className = "status-text error";
    return;
  }
  formStatus.textContent = `Profile created locally for ${name.value.trim()}. No data was sent.`;
  formStatus.className = "status-text";
});
registrationForm.addEventListener("reset", () => {
  setTimeout(() => {
    ["nameError", "emailError", "passwordError"].forEach((id) => { document.getElementById(id).textContent = ""; });
    ["fullName", "emailAddress", "passwordField"].forEach((id) => document.getElementById(id).removeAttribute("aria-invalid"));
    formStatus.textContent = "";
    formStatus.className = "status-text";
    document.getElementById("rangeValue").value = "5";
  });
});

let clickCount = 0;
function resetButtons() {
  clickCount = 0;
  document.getElementById("counterValue").textContent = "0";
  document.getElementById("textChangeButton").textContent = "Change this label";
  document.getElementById("changedLabel").textContent = "Button label has not changed.";
  document.getElementById("revealButton").textContent = "Show hidden content";
  document.getElementById("revealedContent").hidden = true;
  document.getElementById("lockedButton").disabled = true;
  document.getElementById("buttonStatus").textContent = "";
}
document.getElementById("counterButton").addEventListener("click", () => {
  clickCount += 1;
  document.getElementById("counterValue").textContent = String(clickCount);
});
document.getElementById("textChangeButton").addEventListener("click", (event) => {
  event.currentTarget.textContent = "Label changed ✓";
  document.getElementById("changedLabel").textContent = "The button label changed after click.";
});
document.getElementById("revealButton").addEventListener("click", (event) => {
  const content = document.getElementById("revealedContent");
  content.hidden = !content.hidden;
  event.currentTarget.textContent = content.hidden ? "Show hidden content" : "Hide content";
});
document.getElementById("loadingButton").addEventListener("click", (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  button.textContent = "Working...";
  setTimeout(() => {
    button.disabled = false;
    button.textContent = "Run mock action";
    document.getElementById("buttonStatus").textContent = "Mock operation completed successfully.";
  }, 900);
});
document.getElementById("confirmButton").addEventListener("click", () => {
  document.getElementById("buttonStatus").textContent = window.confirm("Continue with this practice action?") ? "Action confirmed." : "Action cancelled.";
});
document.getElementById("alertButton").addEventListener("click", () => window.alert("Practice alert: automation can handle this dialog."));
document.getElementById("unlockButton").addEventListener("click", () => {
  document.getElementById("lockedButton").disabled = false;
  document.getElementById("buttonStatus").textContent = "The next button is enabled.";
});
document.getElementById("lockedButton").addEventListener("click", () => { document.getElementById("buttonStatus").textContent = "Enabled button clicked."; });

const initialEmployees = [
  { name: "Ada Lovelace", role: "QA Engineer", team: "Platform", status: "Active" },
  { name: "Grace Hopper", role: "Developer", team: "Quality", status: "Active" },
  { name: "Alan Turing", role: "Test Analyst", team: "Platform", status: "On leave" },
  { name: "Katherine Johnson", role: "QA Engineer", team: "Product", status: "Active" },
  { name: "Donald Knuth", role: "Developer", team: "Quality", status: "Active" },
  { name: "Margaret Hamilton", role: "Test Analyst", team: "Product", status: "On leave" },
];
let employees = initialEmployees.map((employee) => ({ ...employee }));
let sortKey = "name";
let sortAscending = true;
let currentPage = 1;
const pageSize = 5;
function renderTable() {
  const query = document.getElementById("tableSearch").value.trim().toLowerCase();
  const filtered = employees.filter((employee) => Object.values(employee).some((value) => value.toLowerCase().includes(query)));
  filtered.sort((left, right) => left[sortKey].localeCompare(right[sortKey]) * (sortAscending ? 1 : -1));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  currentPage = Math.min(currentPage, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const body = document.getElementById("employeeRows");
  body.replaceChildren();
  pageRows.forEach((employee) => {
    const row = document.createElement("tr");
    [employee.name, employee.role, employee.team, employee.status].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });
    const actionCell = document.createElement("td");
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "btn btn-sm btn-outline-secondary";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove ${employee.name}`);
    removeButton.addEventListener("click", () => {
      employees = employees.filter((candidate) => candidate !== employee);
      renderTable();
      document.getElementById("tableStatus").textContent = `${employee.name} removed.`;
    });
    actionCell.append(removeButton);
    row.append(actionCell);
    body.append(row);
  });
  document.getElementById("tableCount").textContent = `${filtered.length} ${filtered.length === 1 ? "record" : "records"}`;
  document.getElementById("tableFooter").textContent = filtered.length ? `Showing ${pageRows.length} of ${filtered.length} matching records` : "No records match this search.";
  document.getElementById("tablePageStatus").textContent = `PAGE ${currentPage} OF ${pageCount}`;
  document.getElementById("prevPage").disabled = currentPage <= 1;
  document.getElementById("nextPage").disabled = currentPage >= pageCount;
}
function resetTable() {
  employees = initialEmployees.map((employee) => ({ ...employee }));
  document.getElementById("tableSearch").value = "";
  currentPage = 1;
  document.getElementById("tableStatus").textContent = "Table restored to initial data.";
  renderTable();
}
document.getElementById("tableSearch").addEventListener("input", () => { currentPage = 1; renderTable(); });
document.querySelectorAll("[data-sort]").forEach((button) => button.addEventListener("click", () => {
  if (sortKey === button.dataset.sort) sortAscending = !sortAscending;
  else { sortKey = button.dataset.sort; sortAscending = true; }
  renderTable();
}));
document.getElementById("addRowButton").addEventListener("click", () => {
  const nextNumber = employees.filter((employee) => employee.name.startsWith("Practice User")).length + 1;
  employees.push({ name: `Practice User ${nextNumber}`, role: "Student", team: "Training", status: "Active" });
  currentPage = Math.ceil(employees.length / pageSize);
  document.getElementById("tableStatus").textContent = `Practice User ${nextNumber} added.`;
  renderTable();
});
document.getElementById("prevPage").addEventListener("click", () => { currentPage -= 1; renderTable(); });
document.getElementById("nextPage").addEventListener("click", () => { currentPage += 1; renderTable(); });
renderTable();

function updateSelectionStatus() {
  const selected = [...document.querySelectorAll(".skill-check:checked")].map((checkbox) => checkbox.value);
  const environment = document.querySelector('input[name="environment"]:checked').value;
  document.getElementById("selectionStatus").textContent = `Selected: ${selected.join(", ") || "none"} · Environment: ${environment}`;
}
function resetSelection() {
  document.querySelectorAll(".skill-check").forEach((checkbox) => { checkbox.checked = false; });
  document.querySelector('input[name="environment"][value="Chrome"]').checked = true;
  document.getElementById("browserSelect").value = "";
  document.getElementById("multiSelect").selectedIndex = -1;
  document.getElementById("countrySelect").value = "";
  document.getElementById("stateSelect").innerHTML = "<option value=''>Choose country first</option>";
  document.getElementById("stateSelect").disabled = true;
  updateSelectionStatus();
  document.getElementById("dropdownStatus").textContent = "Selections will appear here.";
}
document.querySelectorAll(".skill-check, input[name='environment']").forEach((control) => control.addEventListener("change", updateSelectionStatus));
document.getElementById("selectAllSkills").addEventListener("click", () => { document.querySelectorAll(".skill-check").forEach((checkbox) => { checkbox.checked = true; }); updateSelectionStatus(); });
document.getElementById("clearSkills").addEventListener("click", () => { document.querySelectorAll(".skill-check").forEach((checkbox) => { checkbox.checked = false; }); updateSelectionStatus(); });
document.getElementById("browserSelect").addEventListener("change", (event) => { document.getElementById("dropdownStatus").textContent = `Browser selected: ${event.target.value || "none"}`; });
document.getElementById("multiSelect").addEventListener("change", (event) => {
  document.getElementById("dropdownStatus").textContent = `Tools selected: ${[...event.target.selectedOptions].map((option) => option.value).join(", ") || "none"}`;
});
const regionOptions = { Canada: ["Ontario", "Quebec", "British Columbia"], USA: ["California", "New York", "Texas"] };
document.getElementById("countrySelect").addEventListener("change", (event) => {
  const stateSelect = document.getElementById("stateSelect");
  const regions = regionOptions[event.target.value] || [];
  stateSelect.innerHTML = `<option value="">Choose province / state</option>${regions.map((region) => `<option>${region}</option>`).join("")}`;
  stateSelect.disabled = !regions.length;
  document.getElementById("dropdownStatus").textContent = `Country: ${event.target.value || "none"}`;
});
document.getElementById("stateSelect").addEventListener("change", (event) => {
  document.getElementById("dropdownStatus").textContent = `Location: ${document.getElementById("countrySelect").value}, ${event.target.value}`;
});
updateSelectionStatus();

document.getElementById("dynamicAttribute").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const nextValue = button.dataset.dynamic === "ready" ? "updated" : "ready";
  button.dataset.dynamic = nextValue;
  document.getElementById("dynamicAttributeStatus").textContent = `Current state: ${nextValue}`;
});

const practiceDialog = document.getElementById("practiceDialog");
document.getElementById("nativeAlert").addEventListener("click", () => window.alert("This is a native JavaScript alert."));
document.getElementById("nativeConfirm").addEventListener("click", () => { document.getElementById("dialogStatus").textContent = window.confirm("Do you want to continue?") ? "Confirmation accepted." : "Confirmation dismissed."; });
document.getElementById("nativePrompt").addEventListener("click", () => {
  const response = window.prompt("Enter a short practice value:");
  document.getElementById("dialogStatus").textContent = response === null ? "Prompt dismissed." : `Prompt value: ${response}`;
});
document.getElementById("delayedAlert").addEventListener("click", (event) => {
  event.currentTarget.disabled = true;
  document.getElementById("dialogStatus").textContent = "Alert scheduled for one second from now.";
  setTimeout(() => { window.alert("Delayed practice alert."); event.currentTarget.disabled = false; }, 1000);
});
document.getElementById("openModal").addEventListener("click", () => practiceDialog.showModal());
document.getElementById("modalConfirm").addEventListener("click", (event) => { event.preventDefault(); practiceDialog.close("confirmed"); });
practiceDialog.addEventListener("close", () => { document.getElementById("dialogStatus").textContent = practiceDialog.returnValue === "confirmed" ? "Modal confirmed." : "Modal closed."; });
document.getElementById("toastButton").addEventListener("click", () => {
  const region = document.getElementById("toastRegion");
  region.innerHTML = "<div class='toast-message'>Practice notification displayed.</div>";
  setTimeout(() => region.replaceChildren(), 2800);
});

document.getElementById("openTabButton").addEventListener("click", () => {
  const newTab = window.open(`${location.origin}${location.pathname}#basics`, "_blank", "noopener");
  document.getElementById("windowInfo").querySelector("span").textContent = newTab ? "New tab opened at Basics." : "Popup blocked by the browser.";
});
document.getElementById("windowInfo").querySelector("span").textContent = `${location.host || "local file"} · ${window.innerWidth} × ${window.innerHeight}`;

document.getElementById("doubleClickTarget").addEventListener("dblclick", () => { document.getElementById("mouseStatus").textContent = "Double-click detected."; });
document.getElementById("mouse").addEventListener("contextmenu", (event) => {
  event.preventDefault();
  const menu = document.getElementById("customContext");
  menu.hidden = false;
  menu.style.left = `${Math.min(event.offsetX, event.currentTarget.clientWidth - 180)}px`;
  menu.style.top = `${event.offsetY}px`;
});
document.querySelectorAll("#customContext button").forEach((button) => button.addEventListener("click", () => {
  document.getElementById("mouseStatus").textContent = button.textContent.includes("Close") ? "Custom context menu closed." : "Custom menu action selected.";
  document.getElementById("customContext").hidden = true;
}));
const dragItem = document.getElementById("dragItem");
const dropTarget = document.getElementById("dropTarget");
dragItem.addEventListener("dragstart", (event) => event.dataTransfer.setData("text/plain", dragItem.id));
dropTarget.addEventListener("dragover", (event) => { event.preventDefault(); dropTarget.classList.add("over"); });
dropTarget.addEventListener("dragleave", () => dropTarget.classList.remove("over"));
dropTarget.addEventListener("drop", (event) => {
  event.preventDefault();
  dropTarget.classList.remove("over");
  if (event.dataTransfer.getData("text/plain") === dragItem.id) {
    dropTarget.textContent = "Dropped successfully";
    document.getElementById("mouseStatus").textContent = "Drag-and-drop completed.";
  }
});
const keyboardInput = document.getElementById("keyboardInput");
keyboardInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") { event.preventDefault(); document.getElementById("keyboardStatus").textContent = `Enter submitted: ${keyboardInput.value || "empty value"}`; }
  else if (event.key === "Escape") { keyboardInput.value = ""; document.getElementById("keyboardStatus").textContent = "Escape cleared the input."; }
  else if (event.key.startsWith("Arrow")) document.getElementById("keyboardStatus").textContent = `Key pressed: ${event.key}`;
});
document.querySelectorAll(".keypad button").forEach((button) => button.addEventListener("click", () => { document.getElementById("keyboardStatus").textContent = `Key control selected: ${button.dataset.key}`; }));

function resetAsync() {
  document.getElementById("asyncStatus").textContent = "Ready for a task.";
  document.getElementById("asyncSpinner").hidden = true;
  document.getElementById("taskProgress").value = 0;
  document.getElementById("delayedElement").hidden = true;
  const removable = document.getElementById("removableElement");
  if (!removable) {
    const restored = document.createElement("p");
    restored.id = "removableElement";
    restored.className = "result-box";
    restored.textContent = "This element can be removed from the DOM.";
    document.querySelector("#async .practice-panel").append(restored);
  }
}
document.getElementById("asyncButton").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const progress = document.getElementById("taskProgress");
  const spinner = document.getElementById("asyncSpinner");
  button.disabled = true;
  spinner.hidden = false;
  document.getElementById("asyncStatus").textContent = "Task running...";
  progress.value = 0;
  let step = 0;
  const timer = setInterval(() => {
    step += 1;
    progress.value = step * 25;
    if (step === 4) {
      clearInterval(timer);
      spinner.hidden = true;
      button.disabled = false;
      document.getElementById("asyncStatus").textContent = "Task completed successfully.";
    }
  }, 500);
});
document.getElementById("delayedShowButton").addEventListener("click", () => {
  document.getElementById("delayedElement").hidden = true;
  setTimeout(() => { document.getElementById("delayedElement").hidden = false; }, 1000);
});
document.getElementById("delayedRemoveButton").addEventListener("click", () => {
  setTimeout(() => document.getElementById("removableElement")?.remove(), 2000);
});
document.getElementById("mockRequestButton").addEventListener("click", (event) => {
  event.currentTarget.disabled = true;
  document.getElementById("asyncStatus").textContent = "Mock request in progress...";
  setTimeout(() => {
    document.getElementById("asyncStatus").textContent = "Mock request succeeded (200).";
    event.currentTarget.disabled = false;
  }, 750);
});

document.getElementById("toggleHidden").addEventListener("click", () => {
  const target = document.getElementById("displayNoneExample");
  target.hidden = !target.hidden;
  document.getElementById("visibilityStatus").textContent = `Display-none example is now ${target.hidden ? "hidden" : "visible"}.`;
});
document.getElementById("replaceNodeButton").addEventListener("click", () => {
  const target = document.getElementById("replaceMe");
  const replacement = document.createElement("span");
  replacement.id = "replaceMe";
  replacement.textContent = "Replacement DOM node";
  target.replaceWith(replacement);
  document.getElementById("visibilityStatus").textContent = "Original node detached and replaced.";
});

document.getElementById("cloneTemplate").addEventListener("click", () => {
  const template = document.getElementById("messageTemplate");
  document.getElementById("templateOutput").append(template.content.cloneNode(true));
});
const practiceCanvas = document.getElementById("practiceCanvas");
const canvasContext = practiceCanvas.getContext("2d");
canvasContext.fillStyle = "#f8efcc";
canvasContext.fillRect(0, 0, practiceCanvas.width, practiceCanvas.height);
canvasContext.fillStyle = "#245b4b";
canvasContext.fillRect(18, 22, 104, 104);
canvasContext.fillStyle = "#e65b45";
canvasContext.beginPath();
canvasContext.arc(203, 74, 43, 0, Math.PI * 2);
canvasContext.fill();

function updateFileStatus() {
  const files = [...document.querySelectorAll("#singleFile, #multipleFiles, #imageFile, #documentFile")].flatMap((input) => [...input.files]);
  const status = document.getElementById("fileStatus");
  if (!files.length) { status.textContent = "No files selected."; status.className = "status-text"; return; }
  const tooLarge = files.find((file) => file.size > 2 * 1024 * 1024);
  status.textContent = tooLarge ? `${tooLarge.name} exceeds the 2 MB practice limit.` : `Selected: ${files.map((file) => `${file.name} (${Math.ceil(file.size / 1024)} KB)`).join(", ")}`;
  status.className = tooLarge ? "status-text error" : "status-text";
}
document.querySelectorAll("#singleFile, #multipleFiles, #imageFile, #documentFile").forEach((input) => input.addEventListener("change", updateFileStatus));
function resetFiles() {
  document.querySelectorAll("#singleFile, #multipleFiles, #imageFile, #documentFile").forEach((input) => { input.value = ""; });
  document.getElementById("fileStatus").textContent = "No files selected.";
  document.getElementById("uploadProgress").value = 0;
}
document.getElementById("simulateUpload").addEventListener("click", (event) => {
  const progress = document.getElementById("uploadProgress");
  const button = event.currentTarget;
  button.disabled = true;
  progress.value = 0;
  let step = 0;
  const timer = setInterval(() => {
    step += 1;
    progress.value = step * 20;
    if (step === 5) {
      clearInterval(timer);
      button.disabled = false;
      document.getElementById("fileStatus").textContent = "Local upload simulation complete; no file was transmitted.";
    }
  }, 150);
});

const catalogItems = [
  { name: "Text & semantics", category: "Core", detail: "Headings, lists, and accessible landmarks" },
  { name: "Forms & inputs", category: "Core", detail: "Native fields and client-side validation" },
  { name: "Tables", category: "Core", detail: "Sort, filter, and update a local dataset" },
  { name: "Playwright locators", category: "Browser", detail: "Role, label, text, and test ID strategies" },
  { name: "Selenium windows", category: "Browser", detail: "Practice tabs, frames, and browser dialogs" },
  { name: "Mouse interactions", category: "Browser", detail: "Hover, right-click, and drag-and-drop" },
  { name: "Accessibility", category: "Specialty", detail: "Names, focus, and live region examples" },
  { name: "Shadow DOM", category: "Specialty", detail: "Open shadow root and a custom component" },
  { name: "File handling", category: "Specialty", detail: "Local file validation and sample downloads" },
];
function renderCatalog() {
  const query = document.getElementById("catalogSearch").value.trim().toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const sort = document.getElementById("catalogSort").value;
  const results = catalogItems.filter((item) => (category === "all" || item.category === category) && `${item.name} ${item.detail} ${item.category}`.toLowerCase().includes(query));
  results.sort((left, right) => left[sort].localeCompare(right[sort]));
  const container = document.getElementById("catalogResults");
  container.replaceChildren();
  if (!results.length) {
    const empty = document.createElement("div");
    empty.className = "catalog-empty";
    empty.textContent = "No results. Try a different search or category.";
    container.append(empty);
  } else {
    results.forEach((item) => {
      const row = document.createElement("div");
      row.className = "catalog-row";
      const title = document.createElement("b"); title.textContent = item.name;
      const group = document.createElement("span"); group.textContent = item.category;
      const description = document.createElement("span"); description.textContent = item.detail;
      row.append(title, group, description);
      container.append(row);
    });
  }
  document.getElementById("catalogStatus").textContent = `${results.length} RESULT${results.length === 1 ? "" : "S"}`;
}
function resetCatalog() {
  document.getElementById("catalogSearch").value = "";
  document.getElementById("categoryFilter").value = "all";
  document.getElementById("catalogSort").value = "name";
  renderCatalog();
}
["catalogSearch", "categoryFilter", "catalogSort"].forEach((id) => document.getElementById(id).addEventListener("input", renderCatalog));
document.getElementById("clearCatalogSearch").addEventListener("click", () => { document.getElementById("catalogSearch").value = ""; renderCatalog(); });
renderCatalog();

function updateAuthView() {
  const signedIn = sessionStorage.getItem("practiceLabSignedIn") === "true";
  document.getElementById("protectedDemo").hidden = !signedIn;
  if (signedIn) document.getElementById("loginStatus").textContent = "Signed in to the mock session.";
}
function resetAuth() {
  sessionStorage.removeItem("practiceLabSignedIn");
  document.getElementById("loginForm").reset();
  document.getElementById("loginStatus").textContent = "Session cleared.";
  updateAuthView();
}
document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const valid = document.getElementById("usernameInput").value === "student" && document.getElementById("loginPassword").value === "practice123";
  document.getElementById("loginStatus").textContent = valid ? "Mock sign-in successful." : "Invalid demo username or password.";
  document.getElementById("loginStatus").className = valid ? "status-text" : "status-text error";
  if (valid) { sessionStorage.setItem("practiceLabSignedIn", "true"); updateAuthView(); }
});
document.getElementById("togglePassword").addEventListener("click", (event) => {
  const password = document.getElementById("loginPassword");
  const reveal = password.type === "password";
  password.type = reveal ? "text" : "password";
  event.currentTarget.textContent = reveal ? "Hide" : "Show";
  event.currentTarget.setAttribute("aria-label", reveal ? "Hide password" : "Show password");
});
document.getElementById("logoutButton").addEventListener("click", resetAuth);
updateAuthView();

class PracticeCounter extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `<style>:host{display:block;font:13px sans-serif;color:#202725}.row{display:flex;align-items:center;gap:12px}.row button{border:1px solid #91a99c;border-radius:3px;background:#fff;padding:7px 12px;color:#245b4b;cursor:pointer}.count{font-family:monospace;color:#245b4b}</style><div class="row"><button type="button" aria-label="Increment shadow counter">Increment</button><span class="count" role="status" aria-live="polite">Count: 0</span></div>`;
    let count = 0;
    shadow.querySelector("button").addEventListener("click", () => {
      count += 1;
      shadow.querySelector(".count").textContent = `Count: ${count}`;
    });
  }
}
customElements.define("practice-counter", PracticeCounter);

document.getElementById("announceButton").addEventListener("click", () => {
  document.getElementById("liveAnnouncement").textContent = `Status updated at ${new Date().toLocaleTimeString()}.`;
});

document.getElementById("validateBoundary").addEventListener("click", () => {
  const control = document.getElementById("boundaryInput");
  const valid = control.value.length >= 3 && control.value.length <= 10;
  document.getElementById("boundaryStatus").textContent = valid ? `Valid length: ${control.value.length}.` : `Invalid length: ${control.value.length}; enter 3–10 characters.`;
});
document.getElementById("checkWhitespace").addEventListener("click", () => {
  const value = document.getElementById("whitespaceInput").value;
  document.getElementById("whitespaceStatus").textContent = value.trim() ? `Non-empty trimmed value: "${value.trim()}"` : "Value is empty after trimming whitespace.";
});
document.getElementById("replaceAdvanced").addEventListener("click", () => {
  const host = document.getElementById("advancedHost");
  const replacement = document.createElement("span");
  replacement.textContent = `Replacement created ${new Date().toLocaleTimeString()}`;
  host.replaceChildren(replacement);
});
function resetAdvanced() {
  document.getElementById("boundaryInput").value = "";
  document.getElementById("whitespaceInput").value = "";
  document.getElementById("boundaryStatus").textContent = "";
  document.getElementById("whitespaceStatus").textContent = "";
  document.getElementById("advancedHost").innerHTML = "<span>Original node in the advanced scenario</span>";
}