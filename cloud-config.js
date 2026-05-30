(function () {
  const params = new URLSearchParams(String(window.location.hash || "").replace(/^#/, ""));
  window.AGRICOLA_GARCIA_CLOUD = {
    enabled: window.location.protocol === "http:" || window.location.protocol === "https:",
    endpoint: "/api/state",
    editKey: params.get("edit") || "",
    editKeyRequired: false,
    readOnly: false,
    pollMs: 15000,
  };
})();
