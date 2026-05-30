(function () {
  const params = new URLSearchParams(String(window.location.hash || "").replace(/^#/, ""));
  const firebase = window.AGRICOLA_GARCIA_FIREBASE;
  const hasFirebase = Boolean(firebase && firebase.apiKey && firebase.projectId);
  const isWeb = window.location.protocol === "http:" || window.location.protocol === "https:";
  const isGithubPages = /(^|\.)github\.io$/i.test(window.location.hostname);

  window.AGRICOLA_GARCIA_CLOUD = hasFirebase
    ? {
        enabled: isWeb,
        provider: "firestore-rest",
        firebase,
        endpoint: "",
        editKey: params.get("edit") || "",
        editKeyRequired: false,
        readOnly: false,
        pollMs: 15000,
      }
    : {
        enabled: isWeb && !isGithubPages,
        provider: "node",
        endpoint: "/api/state",
        editKey: params.get("edit") || "",
        editKeyRequired: false,
        readOnly: false,
        pollMs: 15000,
      };
})();
