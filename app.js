(function () {
  const STORAGE_KEY = "siembra-cosechas-v1";
  const THEME_KEY = "siembra-cosechas-theme";
  const ACTIVE_CROP_KEY = "siembra-cosechas-active-crop";
  const ACTIVE_LOT_KEY = "siembra-cosechas-active-lot";
  const TOMATO_MIGRATION_KEY = "tomateFoto20260529Migrado";

  const defaultCrops = ["MAIZ", "TRIGO", "CEBOLLA", "CHILE", "TOMATE", "JITOMATE", "FRIJOL", "SORGO"];
  const defaultCategories = {
    ingresos: ["GRANO", "VERDURA", "PRIMERA", "SEGUNDA", "REZAGA", "VENTA EN CAMPO", "ANTICIPO"],
    inversiones: ["RENTA DE TIERRA", "SEMILLA", "FERTILIZANTE", "AGROQUIMICOS", "RIEGO", "FLETE", "EMPAQUE", "ASESORIA", "OTRO"],
    maquinaria: ["BARBECHO", "RASTREO", "SIEMBRA", "FUMIGACION", "COSECHA", "DIESEL", "MANTENIMIENTO", "RENTA DE MAQUINA", "FLETE"],
  };

  const sectionConfig = {
    cultivos: {
      title: "Cultivos de la temporada",
      formTitle: "Nuevo cultivo de temporada",
      subtitleSingular: "cultivo",
      subtitlePlural: "cultivos",
      totalLabel: "TOTAL HECTAREAS",
    },
    ingresos: {
      title: "Ingresos de cosecha",
      formTitle: "Nuevo ingreso de cosecha",
      typeLabel: "Ingreso de cosecha",
      subtitleSingular: "ingreso",
      subtitlePlural: "ingresos",
      nameKey: "comprador",
      nameLabel: "Comprador",
      categoryLabel: "Producto / calidad",
      referenceKey: "referencia",
      referenceLabel: "Comprobante",
      quantityLabel: "Cantidad cosechada",
      unitPriceLabel: "Precio unitario",
      totalLabel: "TOTAL INGRESOS",
    },
    inversiones: {
      title: "Inversiones y gastos de cultivo",
      formTitle: "Nueva inversion de cultivo",
      typeLabel: "Inversion de cultivo",
      subtitleSingular: "inversion",
      subtitlePlural: "inversiones",
      nameKey: "proveedor",
      nameLabel: "Proveedor / persona",
      categoryLabel: "Tipo de gasto",
      referenceKey: "referencia",
      referenceLabel: "Factura / recibo",
      quantityLabel: "Cantidad",
      unitPriceLabel: "Costo unitario",
      totalLabel: "TOTAL INVERSION",
    },
    maquinaria: {
      title: "Maquinaria, diesel y fletes",
      formTitle: "Nuevo gasto de maquinaria",
      typeLabel: "Maquinaria / diesel",
      subtitleSingular: "gasto",
      subtitlePlural: "gastos",
      nameKey: "equipo",
      nameLabel: "Equipo / maquinaria",
      categoryLabel: "Tipo de trabajo",
      referenceKey: "referencia",
      referenceLabel: "Recibo / folio",
      quantityLabel: "Horas / litros / viajes",
      unitPriceLabel: "Costo unitario",
      totalLabel: "TOTAL MAQUINARIA",
    },
    manoObra: {
      title: "Peones y mano de obra",
      formTitle: "Nueva mano de obra",
      subtitleSingular: "registro",
      subtitlePlural: "registros",
      totalLabel: "TOTAL MANO DE OBRA",
    },
  };

  const transactionSections = ["ingresos", "inversiones", "maquinaria"];

  const els = {
    month: document.querySelector("#month-input"),
    startDate: document.querySelector("#start-date-input"),
    endDate: document.querySelector("#end-date-input"),
    sales: document.querySelector("#sales-input"),
    syncStatus: document.querySelector("#sync-status"),
    totalSales: document.querySelector("#total-sales"),
    totalInvestment: document.querySelector("#total-providers"),
    totalMachinery: document.querySelector("#total-store"),
    totalLabor: document.querySelector("#total-salaries"),
    totalCosts: document.querySelector("#total-costs"),
    totalProfit: document.querySelector("#total-external"),
    profitCard: document.querySelector("#profit-card"),
    summaryMessage: document.querySelector("#summary-message"),
    globalCropFilter: document.querySelector("#global-crop-filter"),
    globalLotFilter: document.querySelector("#global-lot-filter"),
    cropScopeLabel: document.querySelector("#crop-scope-label"),
    lotScopeLabel: document.querySelector("#lot-scope-label"),
    barIncome: document.querySelector("#bar-providers"),
    barInvestment: document.querySelector("#bar-store"),
    barMachinery: document.querySelector("#bar-external"),
    barLabor: document.querySelector("#bar-salaries"),
    cropSummary: document.querySelector("#crop-summary"),
    lotSummary: document.querySelector("#lot-summary"),
    tabs: document.querySelectorAll(".section-tab"),
    formTitle: document.querySelector("#form-title"),
    nameLabel: document.querySelector("#name-label"),
    categoryLabel: document.querySelector("#category-label"),
    quantityLabel: document.querySelector("#quantity-label"),
    unitPriceLabel: document.querySelector("#unit-price-label"),
    referenceLabel: document.querySelector("#reference-label"),
    transactionForm: document.querySelector("#transaction-form"),
    salaryForm: document.querySelector("#salary-form"),
    entrySection: document.querySelector("#entry-section"),
    entryCrop: document.querySelector("#entry-crop"),
    entryLot: document.querySelector("#entry-lot"),
    entryName: document.querySelector("#entry-name"),
    entryCategory: document.querySelector("#entry-category"),
    knownNames: document.querySelector("#known-names"),
    categoryOptions: document.querySelector("#category-options"),
    cropOptions: document.querySelector("#crop-options"),
    lotOptions: document.querySelector("#lot-options"),
    entryConcept: document.querySelector("#entry-concept"),
    entryQuantity: document.querySelector("#entry-quantity"),
    entryUnit: document.querySelector("#entry-unit"),
    entryUnitPrice: document.querySelector("#entry-unit-price"),
    entryAmount: document.querySelector("#entry-amount"),
    entryPaid: document.querySelector("#entry-paid"),
    entryDate: document.querySelector("#entry-date"),
    entryMethod: document.querySelector("#entry-method"),
    entryReference: document.querySelector("#entry-reference"),
    entryNotes: document.querySelector("#entry-notes"),
    transactionSubmit: document.querySelector("#transaction-submit"),
    cropPlanForm: document.querySelector("#crop-plan-form"),
    planCrop: document.querySelector("#plan-crop"),
    planVariety: document.querySelector("#plan-variety"),
    planSeason: document.querySelector("#plan-season"),
    planLot: document.querySelector("#plan-lot"),
    planHectares: document.querySelector("#plan-hectares"),
    planStatus: document.querySelector("#plan-status"),
    planStartDate: document.querySelector("#plan-start-date"),
    planHarvestDate: document.querySelector("#plan-harvest-date"),
    planNotes: document.querySelector("#plan-notes"),
    planSubmit: document.querySelector("#plan-submit"),
    salaryCrop: document.querySelector("#salary-crop"),
    salaryLot: document.querySelector("#salary-lot"),
    salaryEmployee: document.querySelector("#salary-employee"),
    salaryPeriod: document.querySelector("#salary-period"),
    salaryTurns: document.querySelector("#salary-turns"),
    salaryDaily: document.querySelector("#salary-daily"),
    salarySubtotal: document.querySelector("#salary-subtotal"),
    salaryPaid: document.querySelector("#salary-paid"),
    salaryDate: document.querySelector("#salary-date"),
    salaryMethod: document.querySelector("#salary-method"),
    salaryNotes: document.querySelector("#salary-notes"),
    salarySubmit: document.querySelector("#salary-submit"),
    clearForm: document.querySelector("#clear-form-btn"),
    exportCsv: document.querySelector("#export-csv-btn"),
    backupJson: document.querySelector("#backup-json-btn"),
    shareApp: document.querySelector("#share-app-btn"),
    importJson: document.querySelector("#import-json-input"),
    print: document.querySelector("#print-btn"),
    visualPdf: document.querySelector("#visual-pdf-btn"),
    restoreSeed: document.querySelector("#restore-seed-btn"),
    themeToggle: document.querySelector("#theme-toggle"),
    sectionTitle: document.querySelector("#section-title"),
    sectionSubtitle: document.querySelector("#section-subtitle"),
    search: document.querySelector("#search-input"),
    cropFilter: document.querySelector("#crop-filter"),
    lotFilter: document.querySelector("#lot-filter"),
    paidFilter: document.querySelector("#paid-filter"),
    fromFilter: document.querySelector("#from-filter"),
    toFilter: document.querySelector("#to-filter"),
    tableHead: document.querySelector("#table-head"),
    tableBody: document.querySelector("#table-body"),
    tableFoot: document.querySelector("#table-foot"),
    pdfReport: document.querySelector("#pdf-report"),
    toast: document.querySelector("#toast"),
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const seed = clone(window.SIEMBRA_COSECHAS_SEED || {});
  const cloudConfig = normalizeCloudConfig(window.AGRICOLA_GARCIA_CLOUD || {});

  let state = loadState();
  let activeSection = "ingresos";
  let activeCrop = cleanUpper(localStorage.getItem(ACTIVE_CROP_KEY)) || "TODOS";
  let activeLot = cleanUpper(localStorage.getItem(ACTIVE_LOT_KEY)) || "TODOS";
  let editing = null;
  let toastTimer = null;
  let cloudSaveTimer = null;
  let cloudSaving = false;
  let lastCloudStateJson = "";

  function normalizeCloudConfig(config) {
    return {
      enabled: Boolean(config.enabled && config.endpoint),
      endpoint: String(config.endpoint || "").trim(),
      editKey: String(config.editKey || "").trim(),
      readOnly: Boolean(config.readOnly),
      pollMs: Math.max(0, toNumber(config.pollMs || 15000)),
    };
  }

  function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return normalizeState(seed);
    try {
      const parsed = JSON.parse(saved);
      const normalized = normalizeState(parsed);
      if (!parsed.settings?.[TOMATO_MIGRATION_KEY] && normalized.settings?.[TOMATO_MIGRATION_KEY]) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      }
      return normalized;
    } catch (error) {
      return normalizeState(seed);
    }
  }

  function normalizeState(input) {
    input = input || {};
    const base = clone(seed);
    const settings = input.settings || {};
    const normalized = {
      version: input.version || base.version || 1,
      generatedAt: input.generatedAt || base.generatedAt || "",
      sourceFile: input.sourceFile || base.sourceFile || "",
      settings: {
        ...base.settings,
        ...settings,
        ingresoExtra: toNumber(settings.ingresoExtra ?? settings.ventas ?? base.settings?.ingresoExtra),
      },
      cultivos: normalizeCropPlanRows(input.cultivos || base.cultivos || []),
      ingresos: normalizeTransactionRows(input.ingresos || base.ingresos || []),
      inversiones: normalizeTransactionRows(input.inversiones || base.inversiones || []),
      maquinaria: normalizeTransactionRows(input.maquinaria || base.maquinaria || []),
      manoObra: normalizeLaborRows(input.manoObra || input.salarios || base.manoObra || []),
    };
    return mergeTomatoSeedOnce(normalized);
  }

  function mergeTomatoSeedOnce(current) {
    if (current.settings?.[TOMATO_MIGRATION_KEY]) return current;
    const seedCultivos = normalizeCropPlanRows(seed.cultivos || []).filter(isTomatoSeedRow);
    const seedIngresos = normalizeTransactionRows(seed.ingresos || []).filter(isTomatoSeedRow);
    const seedInversiones = normalizeTransactionRows(seed.inversiones || []).filter(isTomatoSeedRow);
    const seedMaquinaria = normalizeTransactionRows(seed.maquinaria || []).filter(isTomatoSeedRow);
    const seedManoObra = normalizeLaborRows(seed.manoObra || []).filter(isTomatoSeedRow);
    let changed = false;
    changed = mergeMissingRows(current.cultivos, seedCultivos) || changed;
    changed = mergeMissingRows(current.ingresos, seedIngresos) || changed;
    changed = mergeMissingRows(current.inversiones, seedInversiones) || changed;
    changed = mergeMissingRows(current.maquinaria, seedMaquinaria) || changed;
    changed = mergeMissingRows(current.manoObra, seedManoObra) || changed;

    if (changed || hasSeedRows(current, [...seedCultivos, ...seedIngresos, ...seedInversiones, ...seedMaquinaria, ...seedManoObra])) {
      current.settings = {
        ...current.settings,
        [TOMATO_MIGRATION_KEY]: true,
      };
    }
    return current;
  }

  function isTomatoSeedRow(row) {
    const id = String(row.id || "").toLowerCase();
    return cleanUpper(row.cultivo) === "TOMATE" || id.includes("-tom-") || id.startsWith("cult-tom");
  }

  function mergeMissingRows(targetRows, incomingRows) {
    let changed = false;
    incomingRows.forEach((row) => {
      if (!targetRows.some((item) => item.id === row.id)) {
        targetRows.push(row);
        changed = true;
      }
    });
    return changed;
  }

  function hasSeedRows(current, seedRows) {
    const ids = new Set(seedRows.map((row) => row.id).filter(Boolean));
    return [...current.cultivos, ...current.ingresos, ...current.inversiones, ...current.maquinaria, ...current.manoObra].some((row) =>
      ids.has(row.id),
    );
  }

  function normalizeCropPlanRows(rows) {
    return Array.isArray(rows)
      ? rows.map((row) => ({
          ...row,
          cultivo: cleanUpper(row.cultivo),
          variedad: cleanUpper(row.variedad),
          temporada: cleanUpper(row.temporada),
          lote: cleanUpper(row.lote),
          hectareas: toNumber(row.hectareas),
          estado: cleanUpper(row.estado || "PLANEADO"),
        }))
      : [];
  }

  function normalizeTransactionRows(rows) {
    return Array.isArray(rows)
      ? rows.map((row) => ({
          ...row,
          cultivo: cleanUpper(row.cultivo),
          lote: cleanUpper(row.lote),
          categoria: cleanUpper(row.categoria),
          cantidad: toNumber(row.cantidad),
          precioUnitario: toNumber(row.precioUnitario),
          monto: toNumber(row.monto) || toNumber(row.cantidad) * toNumber(row.precioUnitario),
          pagado: cleanPaid(row.pagado),
        }))
      : [];
  }

  function normalizeLaborRows(rows) {
    return Array.isArray(rows)
      ? rows.map((row) => ({
          ...row,
          cultivo: cleanUpper(row.cultivo),
          lote: cleanUpper(row.lote),
          turnos: toNumber(row.turnos),
          pagoDiario: toNumber(row.pagoDiario),
          subtotal: toNumber(row.subtotal) || toNumber(row.turnos) * toNumber(row.pagoDiario),
          pagado: cleanPaid(row.pagado),
        }))
      : [];
  }

  function saveState(message) {
    if (isReadOnlyMode()) {
      render();
      showToast("Este link es solo de consulta.");
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    render();
    scheduleCloudSave();
    if (message) showToast(message);
  }

  function setSyncStatus(message, mode = "") {
    if (!els.syncStatus) return;
    els.syncStatus.textContent = message;
    els.syncStatus.dataset.mode = mode;
  }

  function isReadOnlyMode() {
    return cloudConfig.enabled && cloudConfig.readOnly;
  }

  function applyReadOnlyMode() {
    document.body.classList.toggle("read-only-mode", isReadOnlyMode());
    if (!isReadOnlyMode()) return;
    [els.transactionForm, els.salaryForm, els.cropPlanForm].forEach((form) => {
      form?.querySelectorAll("input, select, textarea, button").forEach((element) => {
        element.disabled = true;
      });
    });
    [els.month, els.startDate, els.endDate, els.sales, els.importJson, els.restoreSeed].forEach((element) => {
      if (element) element.disabled = true;
    });
  }

  function cloudHeaders() {
    const headers = { "Content-Type": "application/json" };
    if (cloudConfig.editKey) headers["x-edit-key"] = cloudConfig.editKey;
    return headers;
  }

  async function fetchCloudState() {
    const response = await fetch(cloudConfig.endpoint, {
      method: "GET",
      headers: cloudHeaders(),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`No se pudo leer la nube (${response.status})`);
    const incoming = await response.json();
    return normalizeState(incoming.state || incoming);
  }

  async function pushCloudState() {
    if (!cloudConfig.enabled || cloudSaving) return;
    const payload = {
      ...clone(state),
      syncedAt: new Date().toISOString(),
    };
    const nextJson = JSON.stringify(payload);
    if (nextJson === lastCloudStateJson) return;
    cloudSaving = true;
    setSyncStatus("Guardando en web...", "saving");
    try {
      const response = await fetch(cloudConfig.endpoint, {
        method: "PUT",
        headers: cloudHeaders(),
        body: nextJson,
      });
      if (response.status === 403) {
        setSyncStatus("Solo lectura", "readonly");
        showToast("Este link no tiene permiso para editar.");
        return;
      }
      if (!response.ok) throw new Error(`No se pudo guardar (${response.status})`);
      lastCloudStateJson = nextJson;
      setSyncStatus(cloudConfig.readOnly ? "Solo lectura" : "Guardado en web", cloudConfig.readOnly ? "readonly" : "synced");
    } catch (error) {
      setSyncStatus("Pendiente de sincronizar", "error");
      showToast("No se pudo guardar en la web. Se guardo localmente.");
    } finally {
      cloudSaving = false;
    }
  }

  function scheduleCloudSave() {
    if (!cloudConfig.enabled || cloudConfig.readOnly) return;
    clearTimeout(cloudSaveTimer);
    cloudSaveTimer = setTimeout(pushCloudState, 650);
  }

  async function syncFromCloud(silent = false) {
    if (!cloudConfig.enabled || cloudSaving) return;
    try {
      if (!silent) setSyncStatus("Cargando datos web...", "saving");
      const remoteState = await fetchCloudState();
      const remoteJson = JSON.stringify(remoteState);
      if (remoteJson !== lastCloudStateJson) {
        state = remoteState;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        lastCloudStateJson = remoteJson;
        render();
      }
      setSyncStatus(cloudConfig.readOnly ? "Solo lectura" : "Guardado en web", cloudConfig.readOnly ? "readonly" : "synced");
    } catch (error) {
      setSyncStatus("Guardado local", "local");
      if (!silent) showToast("No se pudo conectar a la version web.");
    }
  }

  function initCloudSync() {
    if (!cloudConfig.enabled) {
      setSyncStatus("Guardado local", "local");
      return;
    }
    if (cloudConfig.readOnly) setSyncStatus("Solo lectura", "readonly");
    applyReadOnlyMode();
    syncFromCloud(false);
    if (cloudConfig.pollMs) {
      setInterval(() => syncFromCloud(true), cloudConfig.pollMs);
    }
  }

  function money(value) {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(toNumber(value));
  }

  function toNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  }

  function cleanUpper(value) {
    return String(value || "").trim().toUpperCase();
  }

  function cleanPaid(value) {
    return String(value || "NO").trim().toUpperCase() === "SI" ? "SI" : "NO";
  }

  function displayDate(value) {
    if (!value) return "";
    const parts = String(value).slice(0, 10).split("-");
    if (parts.length !== 3) return value;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  function htmlEscape(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function sectionRows(section = activeSection) {
    return state[section] || [];
  }

  function laborSubtotal(row) {
    const savedSubtotal = toNumber(row.subtotal);
    if (savedSubtotal) return savedSubtotal;
    return toNumber(row.turnos) * toNumber(row.pagoDiario);
  }

  function sumRows(rows, amountKey = "monto") {
    return rows.reduce((total, row) => total + toNumber(row[amountKey]), 0);
  }

  function totals(scopeCrop = "", scopeLot = "") {
    const crop = cleanUpper(scopeCrop);
    const lot = cleanUpper(scopeLot);
    const incomeRows = filterByScope(state.ingresos, crop, lot);
    const investmentRows = filterByScope(state.inversiones, crop, lot);
    const machineryRows = filterByScope(state.maquinaria, crop, lot);
    const laborRows = filterByScope(state.manoObra, crop, lot);
    const incomeExtra = crop || lot ? 0 : toNumber(state.settings.ingresoExtra);
    const harvestIncome = sumRows(incomeRows);
    const totalIncome = harvestIncome + incomeExtra;
    const totalInvestment = sumRows(investmentRows);
    const totalMachinery = sumRows(machineryRows);
    const totalLabor = laborRows.reduce((total, row) => total + laborSubtotal(row), 0);
    const totalCosts = totalInvestment + totalMachinery + totalLabor;
    const profit = totalIncome - totalCosts;
    const unpaidIncome = incomeRows.filter((row) => row.pagado !== "SI").reduce((total, row) => total + toNumber(row.monto), 0);
    const unpaidCosts =
      investmentRows.filter((row) => row.pagado !== "SI").reduce((total, row) => total + toNumber(row.monto), 0) +
      machineryRows.filter((row) => row.pagado !== "SI").reduce((total, row) => total + toNumber(row.monto), 0) +
      laborRows.filter((row) => row.pagado !== "SI").reduce((total, row) => total + laborSubtotal(row), 0);
    return {
      harvestIncome,
      incomeExtra,
      totalIncome,
      totalInvestment,
      totalMachinery,
      totalLabor,
      totalCosts,
      profit,
      unpaidIncome,
      unpaidCosts,
    };
  }

  function filterByScope(rows, crop, lot) {
    return (rows || []).filter((row) => {
      if (crop && cleanUpper(row.cultivo) !== crop) return false;
      if (lot && cleanUpper(row.lote) !== lot) return false;
      return true;
    });
  }

  function renderSettings() {
    els.month.value = state.settings.mes || "";
    els.startDate.value = state.settings.fechaInicio || "";
    els.endDate.value = state.settings.fechaFin || "";
    els.sales.value = state.settings.ingresoExtra ?? 0;
  }

  function renderSummary() {
    const scopeCrop = currentScopeCrop();
    const scopeLot = currentScopeLot();
    const t = totals(scopeCrop, scopeLot);
    els.totalSales.textContent = money(t.totalIncome);
    els.totalInvestment.textContent = money(t.totalInvestment);
    els.totalMachinery.textContent = money(t.totalMachinery);
    els.totalLabor.textContent = money(t.totalLabor);
    els.totalCosts.textContent = money(t.totalCosts);
    els.totalProfit.textContent = money(t.profit);
    els.totalProfit.classList.toggle("is-loss", t.profit < 0);
    els.profitCard.classList.toggle("profit-positive", t.profit >= 0);
    els.profitCard.classList.toggle("profit-negative", t.profit < 0);
    els.summaryMessage.textContent = summaryMessage(t, scopeCrop, scopeLot);

    const denominator = Math.max(t.totalIncome, t.totalInvestment, t.totalMachinery, t.totalLabor, 1);
    setBar(els.barIncome, t.totalIncome / denominator);
    setBar(els.barInvestment, t.totalInvestment / denominator);
    setBar(els.barMachinery, t.totalMachinery / denominator);
    setBar(els.barLabor, t.totalLabor / denominator);
  }

  function summaryMessage(t, crop = "", lot = "") {
    const scope =
      crop && lot
        ? `Analitico de ${crop}, parcela ${lot}. `
        : crop
        ? `Analitico de ${crop}. `
        : lot
        ? `Analitico de la parcela ${lot}. `
        : "Analitico de todos los cultivos y parcelas. ";
    const result = t.profit >= 0 ? `Ganancia registrada: ${money(t.profit)}.` : `Perdida registrada: ${money(Math.abs(t.profit))}.`;
    const margin = t.totalIncome ? ` Margen: ${((t.profit / t.totalIncome) * 100).toFixed(1)}%.` : "";
    const pending = [];
    if (t.unpaidIncome) pending.push(`por cobrar ${money(t.unpaidIncome)}`);
    if (t.unpaidCosts) pending.push(`por pagar ${money(t.unpaidCosts)}`);
    const pendingText = pending.length ? ` Pendiente: ${pending.join(" y ")}.` : "";
    return `${scope}Ingresos: ${money(t.totalIncome)}. Costos: ${money(t.totalCosts)}. ${result}${margin}${pendingText}`;
  }

  function setBar(element, ratio) {
    element.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
  }

  function renderCropSummary() {
    const crops = allCrops().filter(Boolean).sort((a, b) => a.localeCompare(b, "es"));
    if (!crops.length) {
      els.cropSummary.innerHTML = "";
      return;
    }
    els.cropSummary.innerHTML = crops
      .map((crop) => {
        const t = totals(crop);
        const cls = t.profit < 0 ? "is-loss" : "is-profit";
        const activeClass = activeCrop === crop && activeLot === "TODOS" ? " active-crop-card" : "";
        return `
          <button class="crop-card${activeClass}" type="button" data-crop="${htmlEscape(crop)}" aria-label="Ver analitico de ${htmlEscape(crop)}">
            <div>
              <span>Cultivo</span>
              <strong>${htmlEscape(crop)}</strong>
            </div>
            <dl>
              <div><dt>Ingresos</dt><dd>${money(t.totalIncome)}</dd></div>
              <div><dt>Costos</dt><dd>${money(t.totalCosts)}</dd></div>
              <div><dt>Utilidad</dt><dd class="${cls}">${money(t.profit)}</dd></div>
            </dl>
          </button>
        `;
      })
      .join("");
  }

  function renderLotSummary() {
    if (!els.lotSummary) return;
    const crop = currentScopeCrop();
    const lots = lotScopes(crop);
    if (!lots.length) {
      els.lotSummary.innerHTML = "";
      return;
    }
    els.lotSummary.innerHTML = lots
      .map((scope) => {
        const t = totals(scope.cultivo, scope.lote);
        const cls = t.profit < 0 ? "is-loss" : "is-profit";
        const activeClass = activeCrop === scope.cultivo && activeLot === scope.lote ? " active-crop-card" : "";
        return `
          <button class="crop-card lot-card${activeClass}" type="button" data-crop="${htmlEscape(scope.cultivo)}" data-lot="${htmlEscape(scope.lote)}" aria-label="Ver analitico de ${htmlEscape(scope.cultivo)} parcela ${htmlEscape(scope.lote)}">
            <div>
              <span>Parcela</span>
              <strong>${htmlEscape(scope.lote)}</strong>
            </div>
            <small>${htmlEscape(scope.cultivo)}</small>
            <dl>
              <div><dt>Ingresos</dt><dd>${money(t.totalIncome)}</dd></div>
              <div><dt>Costos</dt><dd>${money(t.totalCosts)}</dd></div>
              <div><dt>Utilidad</dt><dd class="${cls}">${money(t.profit)}</dd></div>
            </dl>
          </button>
        `;
      })
      .join("");
  }

  function renderSectionChrome() {
    const config = sectionConfig[activeSection];
    els.tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.section === activeSection));
    els.formTitle.textContent = editing ? "Editar registro" : config.formTitle;
    els.sectionTitle.textContent = config.title;
    els.cropPlanForm.classList.toggle("hidden", activeSection !== "cultivos");
    els.transactionForm.classList.toggle("hidden", activeSection === "manoObra" || activeSection === "cultivos");
    els.salaryForm.classList.toggle("hidden", activeSection !== "manoObra");

    if (activeSection === "cultivos") {
      els.planSubmit.textContent = editing ? "Actualizar cultivo de temporada" : "Guardar cultivo de temporada";
    } else if (activeSection !== "manoObra") {
      els.entrySection.value = transactionSections.includes(activeSection) ? activeSection : "ingresos";
      syncTransactionLabels();
    } else {
      els.salarySubmit.textContent = editing ? "Actualizar mano de obra" : "Guardar mano de obra";
    }
  }

  function syncTransactionLabels() {
    const targetSection = els.entrySection.value || activeSection;
    const config = sectionConfig[targetSection] || sectionConfig.ingresos;
    els.formTitle.textContent = editing ? `Editar: ${config.typeLabel}` : config.formTitle;
    els.nameLabel.textContent = config.nameLabel;
    els.categoryLabel.textContent = config.categoryLabel;
    els.quantityLabel.textContent = config.quantityLabel;
    els.unitPriceLabel.textContent = config.unitPriceLabel;
    els.referenceLabel.textContent = config.referenceLabel;
    els.transactionSubmit.textContent = editing ? "Actualizar registro" : `Guardar ${config.typeLabel.toLowerCase()}`;
    renderKnownNames(targetSection);
    renderCategoryOptions(targetSection);
  }

  function renderDatalistsAndFilters() {
    renderCropOptions();
    renderLotOptions();
    renderGlobalCropFilter();
    renderGlobalLotFilter();
    renderCropFilter();
    renderLotFilter();
    if (activeSection !== "manoObra") {
      renderKnownNames(els.entrySection.value || activeSection);
      renderCategoryOptions(els.entrySection.value || activeSection);
    }
  }

  function renderCropOptions() {
    const crops = [...new Set([...defaultCrops, ...allCrops()].filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
    els.cropOptions.innerHTML = crops.map((crop) => `<option value="${htmlEscape(crop)}"></option>`).join("");
  }

  function renderLotOptions() {
    const lots = uniqueFromAllRows("lote");
    els.lotOptions.innerHTML = lots.map((lot) => `<option value="${htmlEscape(lot)}"></option>`).join("");
  }

  function renderCropFilter() {
    const selected = activeCrop || els.cropFilter.value || "TODOS";
    const crops = allCrops().filter(Boolean).sort((a, b) => a.localeCompare(b, "es"));
    els.cropFilter.innerHTML = `<option value="TODOS">Todos</option>${crops
      .map((crop) => `<option value="${htmlEscape(crop)}">${htmlEscape(crop)}</option>`)
      .join("")}`;
    els.cropFilter.value = selected === "TODOS" || crops.includes(selected) ? selected : "TODOS";
  }

  function renderLotFilter() {
    if (!els.lotFilter) return;
    const selected = activeLot || els.lotFilter.value || "TODOS";
    const lots = allLots(currentScopeCrop());
    els.lotFilter.innerHTML = `<option value="TODOS">Todas</option>${lots
      .map((lot) => `<option value="${htmlEscape(lot)}">${htmlEscape(lot)}</option>`)
      .join("")}`;
    els.lotFilter.value = selected === "TODOS" || lots.includes(selected) ? selected : "TODOS";
  }

  function renderGlobalCropFilter() {
    if (!els.globalCropFilter || !els.cropScopeLabel) return;
    const crops = allCrops().filter(Boolean).sort((a, b) => a.localeCompare(b, "es"));
    if (activeCrop !== "TODOS" && !crops.includes(activeCrop)) {
      activeCrop = "TODOS";
      localStorage.setItem(ACTIVE_CROP_KEY, activeCrop);
    }
    els.globalCropFilter.innerHTML = `<option value="TODOS">Todos los cultivos</option>${crops
      .map((crop) => `<option value="${htmlEscape(crop)}">${htmlEscape(crop)}</option>`)
      .join("")}`;
    els.globalCropFilter.value = activeCrop;
    els.cropScopeLabel.textContent = activeCrop === "TODOS" ? "Todos los cultivos" : activeCrop;
  }

  function renderGlobalLotFilter() {
    if (!els.globalLotFilter || !els.lotScopeLabel) return;
    const lots = allLots(currentScopeCrop());
    if (activeLot !== "TODOS" && !lots.includes(activeLot)) {
      activeLot = "TODOS";
      localStorage.setItem(ACTIVE_LOT_KEY, activeLot);
    }
    els.globalLotFilter.innerHTML = `<option value="TODOS">Todas las parcelas</option>${lots
      .map((lot) => `<option value="${htmlEscape(lot)}">${htmlEscape(lot)}</option>`)
      .join("")}`;
    els.globalLotFilter.value = activeLot;
    els.lotScopeLabel.textContent = activeLot === "TODOS" ? "Todas las parcelas" : `Parcela ${activeLot}`;
  }

  function renderKnownNames(section) {
    const config = sectionConfig[section] || sectionConfig.ingresos;
    const names = [...new Set(sectionRows(section).map((row) => cleanUpper(row[config.nameKey])).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, "es"),
    );
    els.knownNames.innerHTML = names.map((name) => `<option value="${htmlEscape(name)}"></option>`).join("");
  }

  function renderCategoryOptions(section) {
    const categories = [
      ...new Set([...(defaultCategories[section] || []), ...sectionRows(section).map((row) => cleanUpper(row.categoria)).filter(Boolean)]),
    ].sort((a, b) => a.localeCompare(b, "es"));
    els.categoryOptions.innerHTML = categories.map((category) => `<option value="${htmlEscape(category)}"></option>`).join("");
  }

  function allCrops() {
    return [
      ...new Set(
        allRows()
          .map((row) => cleanUpper(row.cultivo))
          .filter(Boolean),
      ),
    ];
  }

  function allRows() {
    return [...state.cultivos, ...state.ingresos, ...state.inversiones, ...state.maquinaria, ...state.manoObra];
  }

  function allLots(scopeCrop = "") {
    const crop = cleanUpper(scopeCrop);
    return [
      ...new Set(
        allRows()
          .filter((row) => !crop || cleanUpper(row.cultivo) === crop)
          .map((row) => cleanUpper(row.lote))
          .filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b, "es"));
  }

  function lotScopes(scopeCrop = "") {
    const crop = cleanUpper(scopeCrop);
    const scopes = new Map();
    allRows().forEach((row) => {
      const rowCrop = cleanUpper(row.cultivo);
      const lot = cleanUpper(row.lote);
      if (!rowCrop || !lot) return;
      if (crop && rowCrop !== crop) return;
      const key = `${rowCrop}||${lot}`;
      if (!scopes.has(key)) scopes.set(key, { cultivo: rowCrop, lote: lot });
    });
    return [...scopes.values()].sort((a, b) => `${a.cultivo} ${a.lote}`.localeCompare(`${b.cultivo} ${b.lote}`, "es"));
  }

  function currentScopeCrop() {
    return activeCrop === "TODOS" ? "" : activeCrop;
  }

  function currentScopeLot() {
    return activeLot === "TODOS" ? "" : activeLot;
  }

  function setActiveCrop(crop, resetLot = false) {
    activeCrop = cleanUpper(crop) || "TODOS";
    if (resetLot || (activeLot !== "TODOS" && !allLots(currentScopeCrop()).includes(activeLot))) {
      activeLot = "TODOS";
      localStorage.setItem(ACTIVE_LOT_KEY, activeLot);
    }
    localStorage.setItem(ACTIVE_CROP_KEY, activeCrop);
    if (els.globalCropFilter) els.globalCropFilter.value = activeCrop;
    if (els.cropFilter) els.cropFilter.value = activeCrop;
    render();
  }

  function setActiveLot(lot) {
    activeLot = cleanUpper(lot) || "TODOS";
    localStorage.setItem(ACTIVE_LOT_KEY, activeLot);
    if (els.globalLotFilter) els.globalLotFilter.value = activeLot;
    if (els.lotFilter) els.lotFilter.value = activeLot;
    render();
  }

  function setActiveScope(crop, lot) {
    activeCrop = cleanUpper(crop) || "TODOS";
    activeLot = cleanUpper(lot) || "TODOS";
    localStorage.setItem(ACTIVE_CROP_KEY, activeCrop);
    localStorage.setItem(ACTIVE_LOT_KEY, activeLot);
    if (els.globalCropFilter) els.globalCropFilter.value = activeCrop;
    if (els.cropFilter) els.cropFilter.value = activeCrop;
    if (els.globalLotFilter) els.globalLotFilter.value = activeLot;
    if (els.lotFilter) els.lotFilter.value = activeLot;
    render();
  }

  function uniqueFromAllRows(key) {
    return [
      ...new Set(
        allRows()
          .map((row) => cleanUpper(row[key]))
          .filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b, "es"));
  }

  function filteredRows() {
    const rows = sectionRows();
    const query = els.search.value.trim().toLowerCase();
    const crop = activeCrop || els.cropFilter.value || "TODOS";
    const lot = activeLot || els.lotFilter?.value || "TODOS";
    const paid = els.paidFilter.value;
    const from = els.fromFilter.value;
    const to = els.toFilter.value;
    return rows.filter((row) => {
      const rowPaid = cleanPaid(row.pagado);
      const date = activeSection === "cultivos" ? row.fechaSiembra || row.fechaCosecha || "" : row.fecha || "";
      const text = JSON.stringify(row).toLowerCase();
      if (query && !text.includes(query)) return false;
      if (crop !== "TODOS" && cleanUpper(row.cultivo) !== crop) return false;
      if (lot !== "TODOS" && cleanUpper(row.lote) !== lot) return false;
      if (activeSection !== "cultivos" && paid !== "TODOS" && rowPaid !== paid) return false;
      if (from && date && date < from) return false;
      if (to && date && date > to) return false;
      if (from && !date) return false;
      if (to && !date) return false;
      return true;
    });
  }

  function renderTable() {
    const rows = filteredRows();
    const config = sectionConfig[activeSection];
    els.sectionSubtitle.textContent = `${rows.length} ${rows.length === 1 ? config.subtitleSingular : config.subtitlePlural}`;
    if (activeSection === "cultivos") {
      renderCropPlanTable(rows);
    } else if (activeSection === "manoObra") {
      renderLaborTable(rows);
    } else {
      renderTransactionTable(rows, config);
    }
  }

  function renderCropPlanTable(rows) {
    els.tableHead.innerHTML = `
      <tr>
        <th>Cultivo</th>
        <th>Tipo / variedad</th>
        <th>Temporada</th>
        <th>Lote</th>
        <th>Hectareas</th>
        <th>Estado</th>
        <th>Fecha siembra</th>
        <th>Cosecha estimada</th>
        <th>Notas</th>
        <th>Acciones</th>
      </tr>
    `;
    if (!rows.length) {
      els.tableBody.innerHTML = `<tr class="empty-row"><td colspan="10">No hay cultivos de temporada con estos filtros.</td></tr>`;
    } else {
      els.tableBody.innerHTML = rows
        .map(
          (row) => `
            <tr>
              <td>${htmlEscape(row.cultivo)}</td>
              <td>${htmlEscape(row.variedad)}</td>
              <td>${htmlEscape(row.temporada)}</td>
              <td>${htmlEscape(row.lote)}</td>
              <td class="number">${formatQuantity(row.hectareas)}</td>
              <td><span class="type-badge">${htmlEscape(row.estado || "PLANEADO")}</span></td>
              <td>${displayDate(row.fechaSiembra)}</td>
              <td>${displayDate(row.fechaCosecha)}</td>
              <td>${htmlEscape(row.notas)}</td>
              <td class="actions-cell">
                <button type="button" data-action="edit" data-id="${row.id}">Editar</button>
                <button type="button" data-action="delete" data-id="${row.id}">Eliminar</button>
              </td>
            </tr>
          `,
        )
        .join("");
    }
    const totalHectares = rows.reduce((sum, row) => sum + toNumber(row.hectareas), 0);
    els.tableFoot.innerHTML = `
      <tr>
        <td colspan="4">TOTAL HECTAREAS</td>
        <td class="number">${formatQuantity(totalHectares)}</td>
        <td colspan="5"></td>
      </tr>
    `;
  }

  function renderTransactionTable(rows, config) {
    els.tableHead.innerHTML = `
      <tr>
        <th>Tipo</th>
        <th>Cultivo</th>
        <th>Lote</th>
        <th>${htmlEscape(config.nameLabel)}</th>
        <th>${htmlEscape(config.categoryLabel)}</th>
        <th>Concepto</th>
        <th>Cantidad</th>
        <th>Unidad</th>
        <th>${htmlEscape(config.unitPriceLabel)}</th>
        <th>Monto</th>
        <th>Pagado</th>
        <th>Fecha</th>
        <th>Metodo</th>
        <th>${htmlEscape(config.referenceLabel)}</th>
        <th>Notas</th>
        <th>Acciones</th>
      </tr>
    `;
    if (!rows.length) {
      els.tableBody.innerHTML = `<tr class="empty-row"><td colspan="16">No hay registros con estos filtros.</td></tr>`;
    } else {
      els.tableBody.innerHTML = rows
        .map((row) => {
          const name = row[config.nameKey] || "";
          const reference = row[config.referenceKey] || "";
          const paidClass = row.pagado === "SI" ? "" : "paid-no";
          return `
            <tr>
              <td><span class="type-badge">${htmlEscape(config.typeLabel)}</span></td>
              <td>${htmlEscape(row.cultivo)}</td>
              <td>${htmlEscape(row.lote)}</td>
              <td>${htmlEscape(name)}</td>
              <td>${htmlEscape(row.categoria)}</td>
              <td>${htmlEscape(row.concepto)}</td>
              <td class="number">${formatQuantity(row.cantidad)}</td>
              <td>${htmlEscape(row.unidad)}</td>
              <td class="money">${money(row.precioUnitario)}</td>
              <td class="money">${money(row.monto)}</td>
              <td class="paid-cell ${paidClass}">${htmlEscape(row.pagado || "NO")}</td>
              <td>${displayDate(row.fecha)}</td>
              <td>${htmlEscape(row.metodo)}</td>
              <td>${htmlEscape(reference)}</td>
              <td>${htmlEscape(row.notas)}</td>
              <td class="actions-cell">
                <button type="button" data-action="edit" data-id="${row.id}">Editar</button>
                <button type="button" data-action="delete" data-id="${row.id}">Eliminar</button>
              </td>
            </tr>
          `;
        })
        .join("");
    }
    const total = sumRows(rows);
    els.tableFoot.innerHTML = `
      <tr>
        <td colspan="9">${htmlEscape(config.totalLabel)}</td>
        <td class="money">${money(total)}</td>
        <td colspan="6"></td>
      </tr>
    `;
  }

  function renderLaborTable(rows) {
    els.tableHead.innerHTML = `
      <tr>
        <th>Cultivo</th>
        <th>Lote</th>
        <th>Peon / trabajador</th>
        <th>Actividad</th>
        <th>Jornales</th>
        <th>Pago jornal</th>
        <th>Subtotal</th>
        <th>Pagado</th>
        <th>Fecha</th>
        <th>Metodo</th>
        <th>Observaciones</th>
        <th>Acciones</th>
      </tr>
    `;
    if (!rows.length) {
      els.tableBody.innerHTML = `<tr class="empty-row"><td colspan="12">No hay mano de obra con estos filtros.</td></tr>`;
    } else {
      els.tableBody.innerHTML = rows
        .map((row) => {
          const paidClass = row.pagado === "SI" ? "" : "paid-no";
          return `
            <tr>
              <td>${htmlEscape(row.cultivo)}</td>
              <td>${htmlEscape(row.lote)}</td>
              <td>${htmlEscape(row.empleado)}</td>
              <td>${htmlEscape(row.periodo)}</td>
              <td class="number">${formatQuantity(row.turnos)}</td>
              <td class="money">${money(row.pagoDiario)}</td>
              <td class="money">${money(laborSubtotal(row))}</td>
              <td class="paid-cell ${paidClass}">${htmlEscape(row.pagado || "NO")}</td>
              <td>${displayDate(row.fecha)}</td>
              <td>${htmlEscape(row.metodo)}</td>
              <td>${htmlEscape(row.observaciones)}</td>
              <td class="actions-cell">
                <button type="button" data-action="edit" data-id="${row.id}">Editar</button>
                <button type="button" data-action="delete" data-id="${row.id}">Eliminar</button>
              </td>
            </tr>
          `;
        })
        .join("");
    }
    const total = rows.reduce((sum, row) => sum + laborSubtotal(row), 0);
    els.tableFoot.innerHTML = `
      <tr>
        <td colspan="6">TOTAL MANO DE OBRA</td>
        <td class="money">${money(total)}</td>
        <td colspan="5"></td>
      </tr>
    `;
  }

  function formatQuantity(value) {
    const number = toNumber(value);
    return number ? number.toLocaleString("es-MX", { maximumFractionDigits: 2 }) : "";
  }

  function render() {
    renderSettings();
    renderDatalistsAndFilters();
    renderSummary();
    renderCropSummary();
    renderLotSummary();
    renderSectionChrome();
    renderTable();
  }

  function applyTheme(theme) {
    const dark = theme === "dark";
    document.body.classList.toggle("dark-mode", dark);
    els.themeToggle.textContent = dark ? "Modo claro" : "Modo nocturno";
    els.themeToggle.setAttribute("aria-pressed", String(dark));
  }

  function initTheme() {
    applyTheme(localStorage.getItem(THEME_KEY) || "light");
  }

  function toggleTheme() {
    const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
  }

  function clearForms() {
    editing = null;
    els.transactionForm.reset();
    els.salaryForm.reset();
    els.cropPlanForm.reset();
    els.entrySection.value = transactionSections.includes(activeSection) ? activeSection : "ingresos";
    els.entryPaid.value = "SI";
    els.salaryPaid.value = "SI";
    els.planStatus.value = "PLANEADO";
    els.planSeason.value = state.settings.mes || "";
    els.entryMethod.value = activeSection === "ingresos" ? "TRANSFERENCIA" : "EFECTIVO";
    els.salaryMethod.value = "EFECTIVO";
    const today = new Date().toISOString().slice(0, 10);
    els.entryDate.value = today;
    els.salaryDate.value = today;
    els.entryUnit.value = defaultUnit(activeSection);
    els.transactionSubmit.textContent = "Guardar registro";
    els.salarySubmit.textContent = "Guardar mano de obra";
    syncTransactionLabels();
    renderSectionChrome();
  }

  function defaultUnit(section) {
    if (section === "ingresos") return "TON";
    if (section === "maquinaria") return "HORA";
    return "";
  }

  function nextId(section) {
    const prefix =
      section === "cultivos" ? "cult" : section === "manoObra" ? "mo" : section === "ingresos" ? "ing" : section === "inversiones" ? "inv" : "maq";
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function currentTransactionFromForm() {
    const targetSection = els.entrySection.value || activeSection;
    const config = sectionConfig[targetSection];
    const quantity = toNumber(els.entryQuantity.value);
    const unitPrice = toNumber(els.entryUnitPrice.value);
    const typedAmount = toNumber(els.entryAmount.value);
    const row = {
      id: editing?.id || nextId(targetSection),
      cultivo: cleanUpper(els.entryCrop.value),
      lote: cleanUpper(els.entryLot.value),
      categoria: cleanUpper(els.entryCategory.value),
      concepto: els.entryConcept.value.trim(),
      cantidad: quantity,
      unidad: cleanUpper(els.entryUnit.value),
      precioUnitario: unitPrice,
      monto: typedAmount || quantity * unitPrice,
      pagado: els.entryPaid.value,
      fecha: els.entryDate.value,
      metodo: cleanUpper(els.entryMethod.value),
      notas: els.entryNotes.value.trim(),
    };
    row[config.nameKey] = cleanUpper(els.entryName.value);
    row[config.referenceKey] = els.entryReference.value.trim();
    return { targetSection, row };
  }

  function currentLaborFromForm() {
    const turns = toNumber(els.salaryTurns.value);
    const daily = toNumber(els.salaryDaily.value);
    const typedSubtotal = toNumber(els.salarySubtotal.value);
    return {
      id: editing?.id || nextId("manoObra"),
      cultivo: cleanUpper(els.salaryCrop.value),
      lote: cleanUpper(els.salaryLot.value),
      empleado: els.salaryEmployee.value.trim(),
      periodo: els.salaryPeriod.value.trim(),
      turnos: turns,
      pagoDiario: daily,
      subtotal: typedSubtotal || turns * daily,
      pagado: els.salaryPaid.value,
      fecha: els.salaryDate.value,
      metodo: cleanUpper(els.salaryMethod.value),
      observaciones: els.salaryNotes.value.trim(),
    };
  }

  function currentCropPlanFromForm() {
    return {
      id: editing?.id || nextId("cultivos"),
      cultivo: cleanUpper(els.planCrop.value),
      variedad: cleanUpper(els.planVariety.value),
      temporada: cleanUpper(els.planSeason.value || state.settings.mes),
      lote: cleanUpper(els.planLot.value),
      hectareas: toNumber(els.planHectares.value),
      estado: cleanUpper(els.planStatus.value || "PLANEADO"),
      fechaSiembra: els.planStartDate.value,
      fechaCosecha: els.planHarvestDate.value,
      notas: els.planNotes.value.trim(),
    };
  }

  function upsertRow(section, row) {
    const rows = sectionRows(section);
    const index = rows.findIndex((item) => item.id === row.id);
    if (index >= 0) rows[index] = row;
    else rows.push(row);
  }

  function moveOrUpsertRow(originalSection, targetSection, row) {
    if (originalSection && originalSection !== targetSection) {
      state[originalSection] = sectionRows(originalSection).filter((item) => item.id !== row.id);
    }
    upsertRow(targetSection, row);
  }

  function handleTransactionSubmit(event) {
    event.preventDefault();
    const { targetSection, row } = currentTransactionFromForm();
    const config = sectionConfig[targetSection];
    if (!row.cultivo) {
      showToast("Agrega el cultivo.");
      return;
    }
    if (!row.concepto && !row[config.nameKey] && !row.categoria) {
      showToast("Agrega concepto, proveedor/comprador o categoria.");
      return;
    }
    moveOrUpsertRow(editing?.section || activeSection, targetSection, row);
    activeSection = targetSection;
    clearForms();
    saveState("Registro guardado.");
  }

  function handleLaborSubmit(event) {
    event.preventDefault();
    const row = currentLaborFromForm();
    if (!row.cultivo) {
      showToast("Agrega el cultivo.");
      return;
    }
    if (!row.empleado && !row.periodo) {
      showToast("Agrega peon/trabajador o actividad.");
      return;
    }
    upsertRow("manoObra", row);
    activeSection = "manoObra";
    clearForms();
    saveState("Mano de obra guardada.");
  }

  function handleCropPlanSubmit(event) {
    event.preventDefault();
    const row = currentCropPlanFromForm();
    if (!row.cultivo) {
      showToast("Agrega el cultivo.");
      return;
    }
    if (!row.lote && !row.variedad) {
      showToast("Agrega lote/parcela o tipo/variedad.");
      return;
    }
    upsertRow("cultivos", row);
    activeSection = "cultivos";
    clearForms();
    saveState("Cultivo de temporada guardado.");
  }

  function editRow(id) {
    const row = sectionRows().find((item) => item.id === id);
    if (!row) return;
    editing = { section: activeSection, id };
    if (activeSection === "cultivos") {
      els.planCrop.value = row.cultivo || "";
      els.planVariety.value = row.variedad || "";
      els.planSeason.value = row.temporada || "";
      els.planLot.value = row.lote || "";
      els.planHectares.value = row.hectareas || "";
      els.planStatus.value = row.estado || "PLANEADO";
      els.planStartDate.value = row.fechaSiembra || "";
      els.planHarvestDate.value = row.fechaCosecha || "";
      els.planNotes.value = row.notas || "";
      els.planSubmit.textContent = "Actualizar cultivo de temporada";
    } else if (activeSection === "manoObra") {
      els.salaryCrop.value = row.cultivo || "";
      els.salaryLot.value = row.lote || "";
      els.salaryEmployee.value = row.empleado || "";
      els.salaryPeriod.value = row.periodo || "";
      els.salaryTurns.value = row.turnos || "";
      els.salaryDaily.value = row.pagoDiario || "";
      els.salarySubtotal.value = laborSubtotal(row) || "";
      els.salaryPaid.value = row.pagado || "NO";
      els.salaryDate.value = row.fecha || "";
      els.salaryMethod.value = row.metodo || "";
      els.salaryNotes.value = row.observaciones || "";
      els.salarySubmit.textContent = "Actualizar mano de obra";
    } else {
      const config = sectionConfig[activeSection];
      els.entrySection.value = activeSection;
      els.entryCrop.value = row.cultivo || "";
      els.entryLot.value = row.lote || "";
      els.entryName.value = row[config.nameKey] || "";
      els.entryCategory.value = row.categoria || "";
      els.entryConcept.value = row.concepto || "";
      els.entryQuantity.value = row.cantidad || "";
      els.entryUnit.value = row.unidad || "";
      els.entryUnitPrice.value = row.precioUnitario || "";
      els.entryAmount.value = row.monto || "";
      els.entryPaid.value = row.pagado || "NO";
      els.entryDate.value = row.fecha || "";
      els.entryMethod.value = row.metodo || "";
      els.entryReference.value = row[config.referenceKey] || "";
      els.entryNotes.value = row.notas || "";
      els.transactionSubmit.textContent = "Actualizar registro";
      syncTransactionLabels();
    }
    renderSectionChrome();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteRow(id) {
    const rows = sectionRows();
    const row = rows.find((item) => item.id === id);
    if (!row) return;
    const label = activeSection === "cultivos" ? `${row.cultivo || ""} ${row.lote || ""}`.trim() : activeSection === "manoObra" ? row.empleado || row.periodo : row.concepto || row.categoria;
    if (!confirm(`Eliminar "${label || "registro"}"?`)) return;
    state[activeSection] = rows.filter((item) => item.id !== id);
    clearForms();
    saveState("Registro eliminado.");
  }

  function updateSettings() {
    state.settings.mes = els.month.value.trim().toUpperCase();
    state.settings.fechaInicio = els.startDate.value;
    state.settings.fechaFin = els.endDate.value;
    state.settings.ingresoExtra = toNumber(els.sales.value);
    saveState();
  }

  function updateTransactionAmount() {
    const subtotal = toNumber(els.entryQuantity.value) * toNumber(els.entryUnitPrice.value);
    if (subtotal) els.entryAmount.value = subtotal.toFixed(2);
  }

  function updateLaborSubtotal() {
    const subtotal = toNumber(els.salaryTurns.value) * toNumber(els.salaryDaily.value);
    els.salarySubtotal.value = subtotal ? subtotal.toFixed(2) : "";
  }

  function exportCsv() {
    const config = sectionConfig[activeSection];
    const rows = filteredRows();
    const data =
      activeSection === "cultivos"
        ? rows.map((row) => ({
            Cultivo: row.cultivo,
            "Tipo / variedad": row.variedad,
            Temporada: row.temporada,
            Lote: row.lote,
            Hectareas: row.hectareas,
            Estado: row.estado,
            "Fecha siembra": row.fechaSiembra,
            "Cosecha estimada": row.fechaCosecha,
            Notas: row.notas,
          }))
        : activeSection === "manoObra"
        ? rows.map((row) => ({
            Cultivo: row.cultivo,
            Lote: row.lote,
            Trabajador: row.empleado,
            Actividad: row.periodo,
            Jornales: row.turnos,
            "Pago jornal": row.pagoDiario,
            Subtotal: laborSubtotal(row),
            Pagado: row.pagado,
            Fecha: row.fecha,
            Metodo: row.metodo,
            Observaciones: row.observaciones,
          }))
        : rows.map((row) => ({
            Tipo: config.typeLabel,
            Cultivo: row.cultivo,
            Lote: row.lote,
            [config.nameLabel]: row[config.nameKey],
            [config.categoryLabel]: row.categoria,
            Concepto: row.concepto,
            Cantidad: row.cantidad,
            Unidad: row.unidad,
            [config.unitPriceLabel]: row.precioUnitario,
            Monto: row.monto,
            Pagado: row.pagado,
            Fecha: row.fecha,
            Metodo: row.metodo,
            [config.referenceLabel]: row[config.referenceKey],
            Notas: row.notas,
          }));
    const csv = toCsv(data);
    downloadText(csv, `${slug(config.title)}-${slug(state.settings.mes || "temporada")}.csv`, "text/csv;charset=utf-8");
    showToast("CSV exportado.");
  }

  function toCsv(rows) {
    if (!rows.length) return "";
    const headers = Object.keys(rows[0]);
    const escapeCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    return [headers.map(escapeCell).join(","), ...rows.map((row) => headers.map((header) => escapeCell(row[header])).join(","))].join("\n");
  }

  function exportJson() {
    downloadText(JSON.stringify(state, null, 2), `respaldo-siembra-${slug(state.settings.mes || "temporada")}.json`, "application/json");
    showToast("Respaldo JSON creado.");
  }

  function sharePackage() {
    return {
      ...clone(state),
      sharedAt: new Date().toISOString(),
      compartir: {
        titulo: "Agricola Garcia - Control de siembra y cosechas",
        instrucciones:
          "Abre Agricola-Garcia-Control-Siembra-Portable.html en la otra computadora y usa Cargar JSON para importar este archivo.",
      },
    };
  }

  async function shareAppData() {
    const filename = `agricola-garcia-compartir-${slug(state.settings.mes || "temporada")}.json`;
    const text = JSON.stringify(sharePackage(), null, 2);
    const shareText =
      "Te comparto los datos de Agricola Garcia. Abre la app portable y usa Cargar JSON para importar este archivo.";

    try {
      if (typeof File !== "undefined" && navigator.share && navigator.canShare) {
        const file = new File([text], filename, { type: "application/json" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "Agricola Garcia - Control de siembra",
            text: shareText,
            files: [file],
          });
          showToast("Archivo listo para compartir.");
          return;
        }
      }
    } catch (error) {
      if (error?.name === "AbortError") {
        showToast("Compartir cancelado.");
        return;
      }
    }

    downloadText(text, filename, "application/json");
    showToast("Archivo para compartir descargado. Mandalo junto con el portable.");
  }

  function renderPdfReport() {
    const t = totals();
    const period = `${displayDate(state.settings.fechaInicio)} - ${displayDate(state.settings.fechaFin)}`;
    els.pdfReport.innerHTML = `
      ${reportWatermark()}
      <div class="report-cover">
        <p class="report-kicker">Agrícola García</p>
        <h1>Reporte de siembra y cosechas ${htmlEscape(state.settings.mes || "")}</h1>
        <p class="report-period">${htmlEscape(period)}</p>
      </div>

      <section class="report-summary">
        <div>
          <span>Ingresos</span>
          <strong>${money(t.totalIncome)}</strong>
        </div>
        <div>
          <span>Inversion</span>
          <strong>${money(t.totalInvestment)}</strong>
        </div>
        <div>
          <span>Maquinaria / diesel</span>
          <strong>${money(t.totalMachinery)}</strong>
        </div>
        <div>
          <span>Mano de obra</span>
          <strong>${money(t.totalLabor)}</strong>
        </div>
        <div>
          <span>Costo total</span>
          <strong>${money(t.totalCosts)}</strong>
        </div>
        <div>
          <span>Utilidad</span>
          <strong>${money(t.profit)}</strong>
        </div>
      </section>

      <section class="report-block">
        <h2>Lectura rapida</h2>
        <table class="report-mini-table">
          <tbody>
            <tr><th>Ingresos por cosecha</th><td>${money(t.harvestIncome)}</td></tr>
            <tr><th>Ingreso extra / anticipo</th><td>${money(t.incomeExtra)}</td></tr>
            <tr><th>Inversion de cultivo</th><td>${money(t.totalInvestment)}</td></tr>
            <tr><th>Maquinaria y diesel</th><td>${money(t.totalMachinery)}</td></tr>
            <tr><th>Peones / mano de obra</th><td>${money(t.totalLabor)}</td></tr>
            <tr><th>Ganancia / perdida</th><td>${money(t.profit)}</td></tr>
          </tbody>
        </table>
      </section>

      ${reportCropPlans()}
      ${reportCropSummary()}
      ${reportTransactions("ingresos")}
      ${reportTransactions("inversiones")}
      ${reportTransactions("maquinaria")}
      ${reportLabor()}
    `;
  }

  function reportCropSummary() {
    const crops = allCrops().filter(Boolean);
    if (!crops.length) return "";
    return `
      <section class="report-block page-break-avoid">
        <h2>Resultado por cultivo</h2>
        <table class="report-detail-table">
          <thead>
            <tr>
              <th>Cultivo</th>
              <th>Ingresos</th>
              <th>Costos</th>
              <th>Utilidad</th>
            </tr>
          </thead>
          <tbody>
            ${crops
              .map((crop) => {
                const t = totals(crop);
                return `
                  <tr>
                    <td>${htmlEscape(crop)}</td>
                    <td class="money">${money(t.totalIncome)}</td>
                    <td class="money">${money(t.totalCosts)}</td>
                    <td class="money">${money(t.profit)}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </section>
    `;
  }

  function reportCropPlans() {
    const rows = state.cultivos || [];
    if (!rows.length) return "";
    return `
      <section class="report-block page-break-avoid">
        <h2>Cultivos de temporada</h2>
        <div class="report-total-line">
          <span>${rows.length} cultivos</span>
          <strong>${formatQuantity(rows.reduce((sum, row) => sum + toNumber(row.hectareas), 0))} ha</strong>
        </div>
        <table class="report-detail-table">
          <thead>
            <tr>
              <th>Cultivo</th>
              <th>Tipo / variedad</th>
              <th>Lote</th>
              <th>Hectareas</th>
              <th>Estado</th>
              <th>Siembra</th>
              <th>Cosecha estimada</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) => `
                  <tr>
                    <td>${htmlEscape(row.cultivo || "")}</td>
                    <td>${htmlEscape(row.variedad || "")}</td>
                    <td>${htmlEscape(row.lote || "")}</td>
                    <td class="number">${formatQuantity(row.hectareas)}</td>
                    <td>${htmlEscape(row.estado || "")}</td>
                    <td>${displayDate(row.fechaSiembra)}</td>
                    <td>${displayDate(row.fechaCosecha)}</td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </section>
    `;
  }

  function reportTransactions(section) {
    const config = sectionConfig[section];
    const rows = state[section] || [];
    const total = sumRows(rows);
    return `
      <section class="report-block page-break-avoid">
        <h2>${htmlEscape(config.title)}</h2>
        <div class="report-total-line">
          <span>${rows.length} registros</span>
          <strong>${money(total)}</strong>
        </div>
        <table class="report-detail-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cultivo</th>
              <th>Lote</th>
              <th>${htmlEscape(config.nameLabel)}</th>
              <th>${htmlEscape(config.categoryLabel)}</th>
              <th>Concepto</th>
              <th>Cantidad</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            ${rows.length ? rows.map((row) => reportTransactionRow(row, config)).join("") : '<tr><td colspan="8">Sin registros</td></tr>'}
          </tbody>
        </table>
      </section>
    `;
  }

  function reportTransactionRow(row, config) {
    return `
      <tr>
        <td>${displayDate(row.fecha)}</td>
        <td>${htmlEscape(row.cultivo || "")}</td>
        <td>${htmlEscape(row.lote || "")}</td>
        <td>${htmlEscape(row[config.nameKey] || "")}</td>
        <td>${htmlEscape(row.categoria || "")}</td>
        <td>${htmlEscape(row.concepto || "")}</td>
        <td>${formatQuantity(row.cantidad)} ${htmlEscape(row.unidad || "")}</td>
        <td class="money">${money(row.monto)}</td>
      </tr>
    `;
  }

  function reportLabor() {
    const rows = state.manoObra || [];
    const total = rows.reduce((sum, row) => sum + laborSubtotal(row), 0);
    return `
      <section class="report-block page-break-avoid">
        <h2>Peones y mano de obra</h2>
        <div class="report-total-line">
          <span>${rows.length} registros</span>
          <strong>${money(total)}</strong>
        </div>
        <table class="report-detail-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cultivo</th>
              <th>Lote</th>
              <th>Trabajador</th>
              <th>Actividad</th>
              <th>Jornales</th>
              <th>Pago jornal</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${
              rows.length
                ? rows
                    .map(
                      (row) => `
                        <tr>
                          <td>${displayDate(row.fecha)}</td>
                          <td>${htmlEscape(row.cultivo || "")}</td>
                          <td>${htmlEscape(row.lote || "")}</td>
                          <td>${htmlEscape(row.empleado || "")}</td>
                          <td>${htmlEscape(row.periodo || "")}</td>
                          <td class="number">${formatQuantity(row.turnos)}</td>
                          <td class="money">${money(row.pagoDiario)}</td>
                          <td class="money">${money(laborSubtotal(row))}</td>
                        </tr>
                      `,
                    )
                    .join("")
                : '<tr><td colspan="8">Sin registros</td></tr>'
            }
          </tbody>
        </table>
      </section>
    `;
  }

  function renderVisualPdfReport() {
    const t = totals();
    const period = `${displayDate(state.settings.fechaInicio)} - ${displayDate(state.settings.fechaFin)}`;
    const resultLabel = t.profit >= 0 ? "Ganancia" : "Perdida";
    const resultClass = t.profit >= 0 ? "result-positive" : "result-negative";
    const margin = t.totalIncome ? (t.profit / t.totalIncome) * 100 : 0;
    els.pdfReport.innerHTML = `
      ${reportWatermark()}
      <article class="partner-report">
        <section class="partner-hero">
          <div>
            <p class="report-kicker">Agrícola García | Formato visual para socios</p>
            <h1>Resultado de siembra y cosechas ${htmlEscape(state.settings.mes || "")}</h1>
            <p class="report-period">${htmlEscape(period)}</p>
          </div>
          <div class="partner-result ${resultClass}">
            <span>${resultLabel}</span>
            <strong>${money(t.profit)}</strong>
            <small>Margen ${margin.toFixed(1)}%</small>
          </div>
        </section>

        <section class="partner-metrics">
          <div><span>Ingresos totales</span><strong>${money(t.totalIncome)}</strong></div>
          <div><span>Costo total</span><strong>${money(t.totalCosts)}</strong></div>
          <div><span>Utilidad / perdida</span><strong>${money(t.profit)}</strong></div>
          <div><span>Por cada $100 vendidos</span><strong>${money(t.totalIncome ? (t.profit / t.totalIncome) * 100 : 0)}</strong></div>
        </section>

        <section class="partner-panels">
          <div class="partner-panel">
            <h2>Donde se fue la inversion</h2>
            ${visualCostBreakdown(t)}
          </div>
          <div class="partner-panel">
            <h2>Lectura rapida</h2>
            <dl class="partner-list">
              <div><dt>Ingreso por cosecha</dt><dd>${money(t.harvestIncome)}</dd></div>
              <div><dt>Ingreso extra / anticipo</dt><dd>${money(t.incomeExtra)}</dd></div>
              <div><dt>Pendiente por cobrar</dt><dd>${money(t.unpaidIncome)}</dd></div>
              <div><dt>Pendiente por pagar</dt><dd>${money(t.unpaidCosts)}</dd></div>
            </dl>
          </div>
        </section>

        ${visualCropPlanOverview()}
        ${visualCropOverview()}
      </article>
    `;
  }

  function visualCostBreakdown(t) {
    const rows = [
      { label: "Inversion cultivo", value: t.totalInvestment, className: "cost-investment" },
      { label: "Maquinaria / diesel", value: t.totalMachinery, className: "cost-machinery" },
      { label: "Peones / mano de obra", value: t.totalLabor, className: "cost-labor" },
    ];
    const max = Math.max(...rows.map((row) => row.value), 1);
    return `
      <div class="partner-bars">
        ${rows
          .map(
            (row) => `
              <div class="partner-bar-row">
                <div>
                  <span>${htmlEscape(row.label)}</span>
                  <strong>${money(row.value)}</strong>
                </div>
                <i><b class="${row.className}" style="width: ${(row.value / max) * 100}%"></b></i>
              </div>
            `,
          )
          .join("")}
      </div>
    `;
  }

  function visualCropOverview() {
    const crops = allCrops().filter(Boolean).sort((a, b) => a.localeCompare(b, "es"));
    if (!crops.length) return "";
    return `
      <section class="partner-crops">
        <h2>Resultado por cultivo</h2>
        <div>
          ${crops
            .map((crop) => {
              const t = totals(crop);
              const margin = t.totalIncome ? (t.profit / t.totalIncome) * 100 : 0;
              const cls = t.profit >= 0 ? "crop-profit" : "crop-loss";
              return `
                <article>
                  <span>${htmlEscape(crop)}</span>
                  <strong class="${cls}">${money(t.profit)}</strong>
                  <dl>
                    <div><dt>Ingreso</dt><dd>${money(t.totalIncome)}</dd></div>
                    <div><dt>Costo</dt><dd>${money(t.totalCosts)}</dd></div>
                    <div><dt>Margen</dt><dd>${margin.toFixed(1)}%</dd></div>
                  </dl>
                </article>
              `;
            })
            .join("")}
        </div>
      </section>
    `;
  }

  function visualCropPlanOverview() {
    const rows = state.cultivos || [];
    if (!rows.length) return "";
    return `
      <section class="partner-crops partner-plans">
        <h2>Cultivos activos en esta temporada</h2>
        <div>
          ${rows
            .map(
              (row) => `
                <article>
                  <span>${htmlEscape(row.cultivo || "")}</span>
                  <strong>${htmlEscape(row.variedad || row.lote || "SIN TIPO")}</strong>
                  <dl>
                    <div><dt>Lote</dt><dd>${htmlEscape(row.lote || "")}</dd></div>
                    <div><dt>Hectareas</dt><dd>${formatQuantity(row.hectareas)}</dd></div>
                    <div><dt>Estado</dt><dd>${htmlEscape(row.estado || "")}</dd></div>
                  </dl>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function reportWatermark() {
    return `<img class="report-watermark" src="agricola-garcia-logo.png" alt="" aria-hidden="true" />`;
  }

  function printReport() {
    renderPdfReport();
    document.body.classList.add("printing-report");
    window.print();
  }

  function printVisualReport() {
    renderVisualPdfReport();
    document.body.classList.add("printing-report", "visual-report-mode");
    window.print();
  }

  function importJson(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const incoming = JSON.parse(String(reader.result || "{}"));
        const appendMode = incoming.appendMode === true || cleanUpper(incoming.modo) === "AGREGAR";
        state = appendMode ? mergeIncomingState(state, incoming) : normalizeState(incoming);
        activeSection = appendMode && Array.isArray(incoming.cultivos) ? "cultivos" : "ingresos";
        clearForms();
        saveState(appendMode ? "Datos agregados al analitico." : "Respaldo cargado.");
      } catch (error) {
        showToast("No se pudo leer el JSON.");
      } finally {
        els.importJson.value = "";
      }
    };
    reader.readAsText(file);
  }

  function mergeIncomingState(currentState, incoming) {
    const next = normalizeState(currentState);
    mergeRows(next.cultivos, normalizeCropPlanRows(incoming.cultivos || []));
    mergeRows(next.ingresos, normalizeTransactionRows(incoming.ingresos || []));
    mergeRows(next.inversiones, normalizeTransactionRows(incoming.inversiones || []));
    mergeRows(next.maquinaria, normalizeTransactionRows(incoming.maquinaria || []));
    mergeRows(next.manoObra, normalizeLaborRows(incoming.manoObra || []));
    return next;
  }

  function mergeRows(targetRows, incomingRows) {
    incomingRows.forEach((row) => {
      const index = targetRows.findIndex((item) => item.id === row.id);
      if (index >= 0) targetRows[index] = row;
      else targetRows.push(row);
    });
  }

  function restoreSeed() {
    if (!confirm("Restaurar los datos de ejemplo de siembra y cosechas?")) return;
    state = normalizeState(seed);
    activeSection = "ingresos";
    clearForms();
    saveState("Datos de ejemplo restaurados.");
  }

  function downloadText(text, filename, type) {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function slug(value) {
    return String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.classList.add("show");
    toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2200);
  }

  function bindEvents() {
    els.tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        activeSection = tab.dataset.section;
        clearForms();
        render();
      });
    });
    [els.month, els.startDate, els.endDate, els.sales].forEach((input) => {
      input.addEventListener("change", updateSettings);
    });
    [els.search, els.paidFilter, els.fromFilter, els.toFilter].forEach((input) => {
      input.addEventListener("input", renderTable);
      input.addEventListener("change", renderTable);
    });
    els.cropFilter.addEventListener("change", () => setActiveCrop(els.cropFilter.value));
    if (els.lotFilter) {
      els.lotFilter.addEventListener("change", () => setActiveLot(els.lotFilter.value));
    }
    if (els.globalCropFilter) {
      els.globalCropFilter.addEventListener("change", () => setActiveCrop(els.globalCropFilter.value));
    }
    if (els.globalLotFilter) {
      els.globalLotFilter.addEventListener("change", () => setActiveLot(els.globalLotFilter.value));
    }
    els.cropSummary.addEventListener("click", (event) => {
      const card = event.target.closest("[data-crop]");
      if (!card) return;
      setActiveCrop(card.dataset.crop, true);
    });
    if (els.lotSummary) {
      els.lotSummary.addEventListener("click", (event) => {
        const card = event.target.closest("[data-crop][data-lot]");
        if (!card) return;
        setActiveScope(card.dataset.crop, card.dataset.lot);
      });
    }
    els.transactionForm.addEventListener("submit", handleTransactionSubmit);
    els.salaryForm.addEventListener("submit", handleLaborSubmit);
    els.cropPlanForm.addEventListener("submit", handleCropPlanSubmit);
    els.clearForm.addEventListener("click", clearForms);
    els.entrySection.addEventListener("change", () => {
      els.entryUnit.value = defaultUnit(els.entrySection.value);
      syncTransactionLabels();
    });
    els.entryQuantity.addEventListener("input", updateTransactionAmount);
    els.entryUnitPrice.addEventListener("input", updateTransactionAmount);
    els.salaryTurns.addEventListener("input", updateLaborSubtotal);
    els.salaryDaily.addEventListener("input", updateLaborSubtotal);
    els.tableBody.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      const { action, id } = button.dataset;
      if (action === "edit") editRow(id);
      if (action === "delete") deleteRow(id);
    });
    els.exportCsv.addEventListener("click", exportCsv);
    els.backupJson.addEventListener("click", exportJson);
    els.shareApp.addEventListener("click", shareAppData);
    els.importJson.addEventListener("change", (event) => importJson(event.target.files[0]));
    els.print.addEventListener("click", printReport);
    els.visualPdf.addEventListener("click", printVisualReport);
    els.restoreSeed.addEventListener("click", restoreSeed);
    els.themeToggle.addEventListener("click", toggleTheme);
    window.addEventListener("afterprint", () => document.body.classList.remove("printing-report", "visual-report-mode"));
  }

  initTheme();
  bindEvents();
  clearForms();
  render();
  initCloudSync();
})();
