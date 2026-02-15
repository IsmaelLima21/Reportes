function getGreetingByHour(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Buenos días.";
  if (hour < 19) return "Buenas tardes.";
  return "Buenas noches.";
}

function buildMessage() {
  const institucion = document.getElementById("institucion").value.trim();
  const codigoCE = document.getElementById("codigoCE")?.value.trim() || "";
  const poblacionEstudiantil =
    document.getElementById("poblacionEstudiantil")?.value.trim() || "";
  const estadoBaseMensaje =
    document.getElementById("estadoBaseMensaje")?.value || "";
  const estadoPersonalizadoMensaje =
    document.getElementById("estadoPersonalizadoMensaje")?.value.trim() || "";

  const directorCE =
    document.getElementById("directorCE")?.value.trim() || "";
  const representanteMined =
    document.getElementById("representanteMined")?.value.trim() || "";
  const representanteGobernacion =
    document.getElementById("representanteGobernacion")?.value.trim() || "";

  const incluirPoblacionEstudiantil =
    document.getElementById("incluir-poblacionEstudiantil")?.checked ?? true;
  const incluirDirectorCE =
    document.getElementById("incluir-directorCE")?.checked ?? true;
  const incluirRepresentanteMined =
    document.getElementById("incluir-representanteMined")?.checked ?? true;
  const incluirRepresentanteGobernacion =
    document.getElementById("incluir-representanteGobernacion")?.checked ?? true;
  const otroCargo =
    document.getElementById("otroCargo")?.value.trim() || "";
  const otroNombre =
    document.getElementById("otroNombre")?.value.trim() || "";

  let estadoTexto = estadoBaseMensaje;
  if (estadoBaseMensaje === "otro" && estadoPersonalizadoMensaje) {
    estadoTexto = estadoPersonalizadoMensaje;
  }

  const incluirEstadoReporte =
    document.getElementById("incluir-estado-reporte")?.checked ?? true;
  const posicionEstadoInput = document.querySelector(
    'input[name="posicion-estado"]:checked'
  );
  const posicionEstado = posicionEstadoInput
    ? posicionEstadoInput.value
    : "despues-hora";
  const estadoLinea =
    estadoTexto && incluirEstadoReporte
      ? `ESTADO: ${estadoTexto.toUpperCase()}`
      : "";
  const paquetes = document.getElementById("paquetes").value;
  const zapatos = document.getElementById("zapatos").value;
  const uniformes = document.getElementById("uniformes").value;
  const incluirRecibi =
    document.getElementById("incluir-recibi")?.checked ?? true;
  const incluirListaTeam =
    document.getElementById("incluir-lista-team")?.checked ?? false;
  const incluirFecha =
    document.getElementById("incluir-fecha")?.checked ?? true;
  const incluirHora =
    document.getElementById("incluir-hora")?.checked ?? false;
  const incluirOtrasNovedades =
    document.getElementById("incluir-otras-novedades")?.checked ?? true;
  const otrasNovedadesIncidencias =
    document.getElementById("otrasNovedadesIncidencias")?.value.trim() || "";
  const incluirNovedades =
    document.getElementById("incluir-novedades")?.checked ?? true;
  const novedadesIncidencias =
    document.getElementById("novedadesIncidencias")?.value.trim() || "";

  // Inventario
  const incluirInventario =
    document.getElementById("incluir-inventario")?.checked ?? true;
  const incluirPaquetesRecibidos =
    document.getElementById("incluir-paquetes-recibidos")?.checked ?? true;
  const incluirPaquetesEntregados =
    document.getElementById("incluir-paquetes-entregados")?.checked ?? true;
  const incluirPaquetesResguardo =
    document.getElementById("incluir-paquetes-resguardo")?.checked ?? true;

  const paquetesRecibidos =
    document.getElementById("paquetes-recibidos")?.value || "";
  const paquetesEntregados =
    document.getElementById("paquetes-entregados")?.value || "";
  const paquetesResguardo =
    document.getElementById("paquetes-resguardo")?.value || "";

  const extraMembers = getExtraMembers();

  const horaActual = new Date();
  const fechaTexto = horaActual.toLocaleDateString("es-SV", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
  const horaTexto = horaActual.toLocaleTimeString("es-SV", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const saludo = getGreetingByHour(horaActual);

  const lines = [];

  if (saludo) lines.push(`${saludo}`);
  if (institucion)
    lines.push(`CENTRO ESCOLAR: ${institucion.toUpperCase()}`);
  if (codigoCE)
    lines.push(`CÓDIGO DE CE: ${codigoCE.toUpperCase()}`);

  if (incluirDirectorCE && directorCE) {
    lines.push(`DIRECTOR DE CE: ${directorCE}`);
  }
  if (incluirRepresentanteMined && representanteMined) {
    lines.push(`REPRESENTANTE DEL MINED: ${representanteMined}`);
  }
  if (incluirRepresentanteGobernacion && representanteGobernacion) {
    lines.push(`REPRESENTANTE DE GOBERNACIÓN: ${representanteGobernacion}`);
  }
  if (otroCargo && otroNombre) {
    lines.push(`${otroCargo.toUpperCase()}: ${otroNombre}`);
  }

  if (incluirFecha || incluirHora) {
    let fechaHoraLinea = "";

    if (incluirFecha && fechaTexto) {
      fechaHoraLinea += fechaTexto;
    }
    if (incluirHora && horaTexto) {
      // Siempre anteponer la palabra HORA antes de la hora
      if (fechaHoraLinea) {
        fechaHoraLinea += ` HORA ${horaTexto}`;
      } else {
        fechaHoraLinea += `HORA ${horaTexto}`;
      }
    }

    if (fechaHoraLinea) {
      lines.push(`FECHA: ${fechaHoraLinea}`, "");
    }
  }
  if (posicionEstado === "despues-hora" && estadoLinea) {
    lines.push(estadoLinea, "");
  }

  extraMembers.forEach((m) => {
    const shouldInclude = m.include !== false;
    if (!shouldInclude) return;
    lines.push(`${m.role || "Integrante"}: ${m.name || "-"}`);
  });

  if (incluirListaTeam) {
    const asistentesTeam = getAsistentesFromStorage();
    if (asistentesTeam.length > 0) {
      lines.push("", "INTEGRANTES:");
      asistentesTeam.forEach((nombre, index) => {
        lines.push(`${index + 1}. ${nombre}`);
      });
    }
  }

  if (incluirRecibi) {
    lines.push(
      "",
      "RECIBÍ",
      `PAQUETES: ${paquetes.toUpperCase()}`,
      `ZAPATOS: ${zapatos.toUpperCase()}`,
      `UNIFORMES: ${uniformes.toUpperCase()}`
    );
  }

  if (incluirInventario) {
    const inventarioLines = [];

    if (incluirPaquetesRecibidos && paquetesRecibidos !== "") {
      inventarioLines.push(
        `PAQUETES ESCOLARES RECIBIDOS: ${String(paquetesRecibidos).toUpperCase()}`
      );
    }

    if (incluirPaquetesEntregados && paquetesEntregados !== "") {
      inventarioLines.push(
        `CANTIDAD DE PAQUETES ENTREGADOS: ${String(paquetesEntregados).toUpperCase()}`
      );
    }

    if (incluirPaquetesResguardo && paquetesResguardo !== "") {
      inventarioLines.push(
        `CANTIDAD DE PAQUETES EN RESGUARDO: ${String(paquetesResguardo).toUpperCase()}`
      );
    }

    if (incluirPoblacionEstudiantil && poblacionEstudiantil) {
      inventarioLines.push(
        `POBLACIÓN ESTUDIANTIL: ${String(poblacionEstudiantil).toUpperCase()}`
      );
    }

    if (inventarioLines.length > 0) {
      lines.push("", "INVENTARIO", ...inventarioLines);
    }
  }

  if (incluirOtrasNovedades && otrasNovedadesIncidencias) {
    lines.push("", "OBSERVACIONES:", otrasNovedadesIncidencias);
  }

  if (incluirNovedades && novedadesIncidencias) {
    lines.push("", "NOVEDADES E INCIDENCIAS:", novedadesIncidencias);
  }

  if (posicionEstado === "final-reporte" && estadoLinea) {
    lines.push("", estadoLinea);
  }

  return lines.join("\n");
}

function getAsistentesFromStorage() {
  let data = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.asistentes);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) data = parsed;
    }
  } catch {
    data = [];
  }
  return data;
}

function buildAsistentesMessage() {
  const institucion =
    document.getElementById("institucion-asistentes")?.value.trim() || "";
  const codigoCE =
    document.getElementById("codigoCE-asistentes")?.value.trim() || "";
  const poblacionEstudiantil =
    document.getElementById("poblacionEstudiantil-asistentes")?.value.trim() || "";
  const incluirFecha =
    document.getElementById("incluir-fecha-asistentes")?.checked ?? true;
  const incluirHora =
    document.getElementById("incluir-hora-asistentes")?.checked ?? true;
  const incluirPoblacionEstudiantil =
    document.getElementById("incluir-poblacionEstudiantil-asistentes")?.checked ?? true;

  const saludo = getGreetingByHour();

  const ahora = new Date();
  const fechaTexto = ahora.toLocaleDateString("es-SV", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
  const horaTexto = ahora.toLocaleTimeString("es-SV", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const asistentes = getAsistentesFromStorage();

  const lines = [];

  if (saludo) lines.push(saludo);
  if (institucion) {
    lines.push(`CENTRO ESCOLAR: ${institucion.toUpperCase()}`);
  }
  if (codigoCE) {
    lines.push(`CÓDIGO DE CE: ${codigoCE.toUpperCase()}`);
  }
  if (incluirPoblacionEstudiantil && poblacionEstudiantil) {
    lines.push(`POBLACIÓN ESTUDIANTIL: ${poblacionEstudiantil}`);
  }
  if (incluirFecha || incluirHora) {
    let fechaHoraLinea = "";
    if (incluirFecha && fechaTexto) {
      fechaHoraLinea += fechaTexto;
    }
    if (incluirHora && horaTexto) {
      // Siempre anteponer la palabra HORA antes de la hora
      if (fechaHoraLinea) {
        fechaHoraLinea += ` HORA ${horaTexto}`;
      } else {
        fechaHoraLinea += `HORA ${horaTexto}`;
      }
    }
    if (fechaHoraLinea) {
      lines.push(`FECHA Y HORA: ${fechaHoraLinea}`, "");
    }
  }

  if (asistentes.length > 0) {
    lines.push("", "LISTA DE ASISTENCIA:");
    asistentes.forEach((nombre, index) => {
      lines.push(`${index + 1}. ${nombre}`);
    });
  }

  return lines.join("\n");
}

function buildStatusMessage() {
  const saludo = getGreetingByHour();
  const institucion =
    document.getElementById("institucion-estado")?.value.trim() || "";
  const estadoBase = document.getElementById("estadoBase")?.value || "";
  const estadoPersonalizado =
    document.getElementById("estadoPersonalizado")?.value.trim() || "";

  const paquetesEstado =
    document.getElementById("paquetes-estado")?.value || "no";
  const zapatosEstado =
    document.getElementById("zapatos-estado")?.value || "no";
  const uniformesEstado =
    document.getElementById("uniformes-estado")?.value || "no";
  const incluirRecibiEstado =
    document.getElementById("incluir-recibi-estado")?.checked ?? true;

  let estadoTexto = estadoBase;
  if (estadoBase === "otro" && estadoPersonalizado) {
    estadoTexto = estadoPersonalizado;
  }

  const lines = [];

  if (saludo) lines.push(saludo);
  if (institucion)
    lines.push(`CENTRO ESCOLAR: ${institucion.toUpperCase()}`);
  if (estadoTexto)
    lines.push(`ESTADO: ${estadoTexto.toUpperCase()}`);

  const recibiLines = [];

  if (paquetesEstado === "si") {
    recibiLines.push("PAQUETES: SI");
  }
  if (zapatosEstado === "si") {
    recibiLines.push("ZAPATOS: SI");
  }
  if (uniformesEstado === "si") {
    recibiLines.push("UNIFORMES: SI");
  }

  if (incluirRecibiEstado && recibiLines.length > 0) {
    lines.push("", "RECIBÍ", ...recibiLines);
  }

  return lines.join("\n");
}

const STORAGE_KEYS = {
  form: "mensajeFormData",
  statusForm: "statusFormData",
  view: "activeView",
  extraMembers: "mensajeExtraMembers",
  asistentes: "asistentesLista",
  tracker: "mensajeTrackerState",
};

function updatePreview() {
  const preview = document.getElementById("preview");
  if (preview) {
    preview.textContent = buildMessage();
  }
}

function getExtraMembers() {
  const container = document.getElementById("extra-members");
  if (!container) return [];
  const rows = container.querySelectorAll(".member-row");
  const members = [];
  rows.forEach((row) => {
    const roleInput = row.querySelector(".member-role");
    const nameInput = row.querySelector(".member-name");
    const includeInput = row.querySelector(".member-include");
    const role = roleInput?.value.trim() || "";
    const name = nameInput?.value.trim() || "";
    const include = includeInput ? includeInput.checked : true;
    if (role || name) {
      members.push({ role, name, include });
    }
  });
  return members;
}

function addMemberRow(data = {}) {
  const container = document.getElementById("extra-members");
  if (!container) return;

  const row = document.createElement("div");
  row.className = "member-row";

  const includeInput = document.createElement("input");
  includeInput.type = "checkbox";
  includeInput.className = "member-include";
  // Por defecto incluir, salvo que venga explícitamente como false
  includeInput.checked = data.include !== false;

  const roleInput = document.createElement("input");
  roleInput.type = "text";
  roleInput.placeholder = "Cargo (ej. Supervisor)";
  roleInput.className = "member-role";
  roleInput.value = data.role || "";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "Nombre";
  nameInput.className = "member-name";
  nameInput.value = data.name || "";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "remove-member-btn";
  removeBtn.textContent = "✕";

  const onChange = () => {
    updatePreview();
    saveFormState();
  };

  includeInput.addEventListener("change", onChange);
  roleInput.addEventListener("input", onChange);
  nameInput.addEventListener("input", onChange);
  removeBtn.addEventListener("click", () => {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar este integrante?"
    );
    if (!confirmed) return;
    row.remove();
    updatePreview();
    saveFormState();
  });

  row.appendChild(includeInput);
  row.appendChild(roleInput);
  row.appendChild(nameInput);
  row.appendChild(removeBtn);

  container.appendChild(row);
}

function loadExtraMembersFromStorage() {
  const container = document.getElementById("extra-members");
  if (!container) return;
  container.innerHTML = "";
  let data = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.extraMembers);
    if (raw) data = JSON.parse(raw);
  } catch {
    data = null;
  }
  if (Array.isArray(data)) {
    data.forEach((m) => addMemberRow(m));
  }
}

function setupExtraMembers() {
  const addBtn = document.getElementById("add-member-btn");
  if (!addBtn) return;
  addBtn.addEventListener("click", () => {
    addMemberRow();
  });
}

function updateAsistentesPreview() {
  const preview = document.getElementById("preview-asistentes");
  if (preview) {
    preview.value = buildAsistentesMessage();
  }
}

function renderAsistentesVisual() {
  const container = document.getElementById("asistentes-lista-visual");
  if (!container) return;
  const asistentes = getAsistentesFromStorage();
  if (asistentes.length === 0) {
    container.textContent = "Sin asistentes registrados. Configura la lista en la pestaña Equipo.";
    return;
  }
  const ul = document.createElement("ul");
  asistentes.forEach((nombre, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${nombre}`;
    ul.appendChild(li);
  });
  container.innerHTML = "";
  container.appendChild(ul);
}

function updateStatusPreview() {
  const preview = document.getElementById("preview-status");
  if (preview) {
    preview.value = buildStatusMessage();
  }
}

function saveStatusFormState() {
  const form = document.getElementById("status-form");
  if (!form) return;
  const inputs = form.querySelectorAll("input, select");
  const data = {};
  inputs.forEach((el) => {
    if (!el.id) return;
    if (el.type === "checkbox") {
      data[el.id] = el.checked;
    } else {
      data[el.id] = el.value;
    }
  });
  try {
    localStorage.setItem(STORAGE_KEYS.statusForm, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function loadStatusFormState() {
  const form = document.getElementById("status-form");
  if (!form) return;
  let data = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.statusForm);
    if (raw) data = JSON.parse(raw);
  } catch {
    data = null;
  }
  if (!data) return;
  const inputs = form.querySelectorAll("input, select");
  inputs.forEach((el) => {
    if (!el.id || data[el.id] === undefined) return;
    if (el.type === "checkbox") {
      el.checked = Boolean(data[el.id]);
    } else {
      el.value = data[el.id];
    }
  });

  // Asegurar que el campo personalizado quede bien habilitado/deshabilitado al cargar
  const estadoBase = document.getElementById("estadoBase");
  const estadoPersonalizado = document.getElementById("estadoPersonalizado");
  if (estadoBase && estadoPersonalizado) {
    estadoPersonalizado.disabled = estadoBase.value !== "otro";
  }
}

function setupStatusFormListeners() {
  const form = document.getElementById("status-form");
  if (!form) return;
  const inputs = form.querySelectorAll("input, select");

  inputs.forEach((el) => {
    const handler = () => {
      updateStatusPreview();
      saveStatusFormState();
    };
    el.addEventListener("input", handler);
    el.addEventListener("change", handler);
  });

  const estadoBase = document.getElementById("estadoBase");
  const estadoPersonalizado = document.getElementById("estadoPersonalizado");

  if (estadoBase && estadoPersonalizado) {
    estadoBase.addEventListener("change", () => {
      if (estadoBase.value === "otro") {
        estadoPersonalizado.disabled = false;
        estadoPersonalizado.focus();
      } else {
        estadoPersonalizado.disabled = true;
        estadoPersonalizado.value = "";
      }
      updateStatusPreview();
      saveStatusFormState();
    });
  }
}

function showStatus(text) {
  const status = document.getElementById("status");
  if (!status) return;
  status.textContent = text;
  if (!text) return;
  setTimeout(() => {
    if (status.textContent === text) status.textContent = "";
  }, 1500);
}

function saveFormState() {
  const form = document.getElementById("message-form");
  if (!form) return;
  const inputs = form.querySelectorAll("input, select");
  const data = {};
  inputs.forEach((el) => {
    if (!el.id) return;
    if (el.type === "checkbox") {
      data[el.id] = el.checked;
    } else {
      data[el.id] = el.value;
    }
  });
  try {
    localStorage.setItem(STORAGE_KEYS.form, JSON.stringify(data));
    const extraMembers = getExtraMembers();
    localStorage.setItem(
      STORAGE_KEYS.extraMembers,
      JSON.stringify(extraMembers)
    );
  } catch {
    // ignore
  }
}

function loadFormState() {
  const form = document.getElementById("message-form");
  if (!form) return;
  let data = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.form);
    if (raw) data = JSON.parse(raw);
  } catch {
    data = null;
  }
  if (!data) return;
  const inputs = form.querySelectorAll("input, select");
  inputs.forEach((el) => {
    if (!el.id || data[el.id] === undefined) return;
    if (el.type === "checkbox") {
      el.checked = Boolean(data[el.id]);
    } else {
      el.value = data[el.id];
    }
  });

  // Ajustar habilitación del estado personalizado al cargar
  const estadoBaseMensajeEl = document.getElementById("estadoBaseMensaje");
  const estadoPersonalizadoMensajeEl = document.getElementById(
    "estadoPersonalizadoMensaje"
  );
  if (estadoBaseMensajeEl && estadoPersonalizadoMensajeEl) {
    estadoPersonalizadoMensajeEl.disabled = estadoBaseMensajeEl.value !== "otro";
  }
}

function setupFormListeners() {
  const form = document.getElementById("message-form");
  if (!form) return;
  const inputs = form.querySelectorAll("input, select");
  inputs.forEach((el) => {
    const handler = () => {
      updatePreview();
      saveFormState();
    };
    el.addEventListener("input", handler);
    el.addEventListener("change", handler);
  });

  const estadoBaseMensajeEl = document.getElementById("estadoBaseMensaje");
  const estadoPersonalizadoMensajeEl = document.getElementById(
    "estadoPersonalizadoMensaje"
  );

  if (estadoBaseMensajeEl && estadoPersonalizadoMensajeEl) {
    estadoBaseMensajeEl.addEventListener("change", () => {
      if (estadoBaseMensajeEl.value === "otro") {
        estadoPersonalizadoMensajeEl.disabled = false;
        estadoPersonalizadoMensajeEl.focus();
      } else {
        estadoPersonalizadoMensajeEl.disabled = true;
        estadoPersonalizadoMensajeEl.value = "";
      }
      updatePreview();
      saveFormState();
    });
  }
}



function openMembersModal() {
  const overlay = document.getElementById("members-modal");
  if (!overlay) return;
  overlay.classList.add("modal-overlay--visible");
  overlay.setAttribute("aria-hidden", "false");
}

function closeMembersModal() {
  const overlay = document.getElementById("members-modal");
  if (!overlay) return;
  overlay.classList.remove("modal-overlay--visible");
  overlay.setAttribute("aria-hidden", "true");
}

function setupMembersModal() {
  const openBtn = document.getElementById("open-members-modal");
  const closeBtn = document.getElementById("close-members-modal");
  const overlay = document.getElementById("members-modal");

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      openMembersModal();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      closeMembersModal();
    });
  }

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeMembersModal();
      }
    });
  }
}

function saveAsistentesToStorage(asistentes) {
  try {
    localStorage.setItem(STORAGE_KEYS.asistentes, JSON.stringify(asistentes));
  } catch {
    // ignore
  }
}

function addEquipoRow(nombre = "") {
  const container = document.getElementById("equipo-lista");
  if (!container) return;

  const row = document.createElement("div");
  row.className = "member-row";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "Nombre del asistente";
  nameInput.className = "member-name";
  nameInput.value = nombre || "";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "remove-member-btn";
  removeBtn.textContent = "✕";

  const updateAll = () => {
    const rows = container.querySelectorAll(".member-row");
    const asistentes = [];
    rows.forEach((r) => {
      const input = r.querySelector(".member-name");
      const val = input?.value.trim();
      if (val) asistentes.push(val);
    });
    saveAsistentesToStorage(asistentes);
    renderAsistentesVisual();
    updateAsistentesPreview();
  };

  removeBtn.addEventListener("click", () => {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar este asistente?"
    );
    if (!confirmed) return;
    row.remove();
    updateAll();
  });

  nameInput.addEventListener("input", () => {
    updateAll();
  });

  row.appendChild(nameInput);
  row.appendChild(removeBtn);

  container.appendChild(row);
}

function loadEquipoFromStorage() {
  const container = document.getElementById("equipo-lista");
  if (!container) return;
  container.innerHTML = "";

  const asistentes = getAsistentesFromStorage();
  if (asistentes.length > 0) {
    asistentes.forEach((nombre) => addEquipoRow(nombre));
  }
}

function setupEquipo() {
  const addBtn = document.getElementById("add-equipo-btn");
  if (!addBtn) return;

  addBtn.addEventListener("click", () => {
    addEquipoRow();
  });

  loadEquipoFromStorage();
}

function setupAsistentes() {
  const form = document.getElementById("attendees-form");
  if (form) {
    const inputs = form.querySelectorAll("input[type='text'], input[type='checkbox']");
    inputs.forEach((el) => {
      el.addEventListener("input", () => {
        updateAsistentesPreview();
      });
      el.addEventListener("change", () => {
        updateAsistentesPreview();
      });
    });
  }

  renderAsistentesVisual();
  updateAsistentesPreview();
}

function setupActions() {
  const copyBtn = document.getElementById("copy-btn");
  const waBtn = document.getElementById("whatsapp-btn");
  const copyStatusBtn = document.getElementById("copy-status-btn");
  const waStatusBtn = document.getElementById("whatsapp-status-btn");
  const copyAsistentesBtn = document.getElementById("copy-asistentes-btn");
  const waAsistentesBtn = document.getElementById("whatsapp-asistentes-btn");

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const text = buildMessage();
      try {
        await navigator.clipboard.writeText(text);
        showStatus("Mensaje copiado");
      } catch {
        showStatus("No se pudo copiar");
      }
    });
  }

  if (waBtn) {
    waBtn.addEventListener("click", () => {
      const text = buildMessage();
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
    });
  }

  if (copyStatusBtn) {
    copyStatusBtn.addEventListener("click", async () => {
      const text = buildStatusMessage();
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // silencioso para la pestaña de estado
      }
    });
  }

  if (waStatusBtn) {
    waStatusBtn.addEventListener("click", () => {
      const text = buildStatusMessage();
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
    });
  }

  if (copyAsistentesBtn) {
    copyAsistentesBtn.addEventListener("click", async () => {
      const text = buildAsistentesMessage();
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // silencioso para la pestaña de asistencia
      }
    });
  }

  if (waAsistentesBtn) {
    waAsistentesBtn.addEventListener("click", () => {
      const text = buildAsistentesMessage();
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
    });
  }
}

function setupAccordions() {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    const accordions = form.querySelectorAll(".accordion");

    accordions.forEach((accordion, index) => {
      // 1. Set initial state: First open, others closed
      if (index === 0) {
        accordion.classList.remove("accordion--collapsed");
      } else {
        accordion.classList.add("accordion--collapsed");
      }

      const header = accordion.querySelector(".accordion-header");
      if (!header) return;

      // 2. Remove any existing listeners (by cloning) to avoid duplicates if re-run
      const newHeader = header.cloneNode(true);
      header.parentNode.replaceChild(newHeader, header);

      // 3. Add fresh click listener
      newHeader.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();

        const isCurrentlyCollapsed = accordion.classList.contains("accordion--collapsed");

        // Close ALL accordions in this form first
        accordions.forEach((acc) => {
          acc.classList.add("accordion--collapsed");
        });

        // If it was collapsed, open it. If it was open, it stays closed (toggled off)
        // OR if you want it to always stay open if clicked, change logic.
        // Standard accordion: clicking open one closes it.
        if (isCurrentlyCollapsed) {
          accordion.classList.remove("accordion--collapsed");
        }
      });
    });
  });
}

function switchView(targetView) {
  const views = document.querySelectorAll(".view");
  views.forEach((v) => v.classList.remove("view--active"));
  const tabs = document.querySelectorAll(".tab-button");
  tabs.forEach((t) => t.classList.remove("tab-button--active"));

  let viewEl;
  if (targetView === "estado") {
    viewEl = document.getElementById("view-estado");
  } else if (targetView === "asistentes") {
    viewEl = document.getElementById("view-asistentes");
  } else if (targetView === "equipo") {
    viewEl = document.getElementById("view-equipo");
  } else if (targetView === "texto") {
    viewEl = document.getElementById("view-texto");
  } else {
    viewEl = document.getElementById("view-mensaje");
  }

  const tabEl = Array.from(tabs).find((t) => t.dataset.view === targetView);

  if (viewEl) viewEl.classList.add("view--active");
  if (tabEl) tabEl.classList.add("tab-button--active");

  try {
    localStorage.setItem(STORAGE_KEYS.view, targetView);
  } catch {
    // ignore
  }
}

function setupTabs() {
  const tabs = document.querySelectorAll(".tab-button");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const view =
        tab.dataset.view === "estado"
          ? "estado"
          : tab.dataset.view === "asistentes"
            ? "asistentes"
            : tab.dataset.view === "equipo"
              ? "equipo"
              : tab.dataset.view === "texto"
                ? "texto"
                : "mensaje";
      switchView(view);
    });
  });

  // Load last active view
  let active = "mensaje";
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.view);
    if (saved === "asistentes") {
      // Si antes se usaba la pestaña Asistencia, redirigir a Reportes
      active = "mensaje";
    } else if (
      saved === "mensaje" ||
      saved === "estado" ||
      saved === "equipo" ||
      saved === "texto"
    ) {
      active = saved;
    }
  } catch {
    active = "mensaje";
  }
  switchView(active);
  updateAsistentesPreview();
}

// --- CLOCK FUNCTIONALITY ---
function startClock() {
  const clockEl = document.getElementById("clock");
  if (!clockEl) return;

  function update() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    clockEl.textContent = `${hours}:${strMinutes} ${ampm}`;
  }

  update();
  setInterval(update, 60000); // Update every minute
}

// --- MANUAL REPORT TRACKER & LOGGING ---
// --- MANUAL REPORT TRACKER & LOGGING ---
function setupManualTracker() {
  const trackerEl = document.getElementById("report-tracker");
  const resetBtn = document.getElementById("reset-tracker-btn");

  if (!trackerEl) return;

  // Clear existing content
  trackerEl.innerHTML = "";

  // Load state
  let trackerState = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.tracker);
    if (raw) trackerState = JSON.parse(raw);
  } catch {
    trackerState = [];
  }

  // Ensure AT LEAST 5 items, but allow more if saved
  const minBubbles = 5;
  if (!Array.isArray(trackerState)) {
    trackerState = [];
  }

  // Fill up to minBubbles if needed
  if (trackerState.length < minBubbles) {
    const needed = minBubbles - trackerState.length;
    for (let i = 0; i < needed; i++) {
      trackerState.push({ active: false, time: null });
    }
  }

  // Helper to save and re-render (optional, or just save)
  const save = () => saveTrackerState(trackerState);

  // Render Bubbles
  trackerState.forEach((state, i) => {
    const container = document.createElement("div");
    container.className = "bubble-container";

    const bubble = document.createElement("div");
    bubble.className = "tracker-bubble";
    bubble.textContent = "✓";
    if (state.active) {
      bubble.classList.add("tracker-bubble--active");
    }

    const timestamp = document.createElement("div");
    timestamp.className = "bubble-timestamp";
    timestamp.textContent = state.time || "";

    bubble.addEventListener("click", () => {
      // Toggle
      state.active = !state.active;

      if (state.active) {
        bubble.classList.add("tracker-bubble--active");
        // Set time
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        state.time = timeStr;
        timestamp.textContent = timeStr;

        // Log it
        addLogEntry();
      } else {
        bubble.classList.remove("tracker-bubble--active");
        state.time = null;
        timestamp.textContent = "";
      }
      save();
    });

    container.appendChild(bubble);
    container.appendChild(timestamp);
    trackerEl.appendChild(container); // Append to main wrapper
  });

  // Render "Add Bubble" Button
  const addBtn = document.createElement("button");
  addBtn.className = "add-bubble-btn";
  addBtn.textContent = "+";
  addBtn.title = "Agregar otra palomita";
  addBtn.addEventListener("click", () => {
    // Add new state
    trackerState.push({ active: false, time: null });
    save();
    // Re-render
    setupManualTracker();
  });
  trackerEl.appendChild(addBtn);


  // Setup Reset Button (only if not already set up? No, fine to re-attach or check)
  // To avoid duplicate listeners if this function runs multiple times, we can cloneNode
  // OR just ensure we only set it up once. But since this function is re-run for re-rendering bubbles,
  // we should be careful with the reset button which is OUTSIDE the trackerEl.

  // Actually, we should probably separate the Reset Button setup from the Tracker Render 
  // to avoid adding multiple listeners to the Reset Button.
  // BUT, to keep it simple, let's just handle it here but use .onclick or removeEventListener.
  // Better yet, let's extract Reset setup to its own function or check strictness.

  if (resetBtn) {
    // Cloning to clear previous listeners
    const newResetBtn = resetBtn.cloneNode(true);
    resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);

    newResetBtn.addEventListener("click", () => {
      const confirmed = window.confirm("¿Estás seguro de resetear todas las palomitas?");
      if (!confirmed) return;

      // Reset state: Clear validation, maybe reduce count back to 5? 
      // User didn't specify, but "reset" usually implies reverting to default.
      // Let's keep the count but clear the checks.
      // Update: User said "boton de crear mas palomitas ... boton de resetear". 
      // Usually reset just clears values. I'll clear values but KEEP the extra bubbles for now 
      // unless user wants to go back to 5. Let's stick to clearing values (unchecking).

      trackerState.forEach(s => {
        s.active = false;
        s.time = null;
      });
      // Optionally reset count to 5?
      // trackerState = new Array(5).fill(null).map(() => ({ active: false, time: null }));

      save();
      setupManualTracker();
      showStatus("Palomitas reseteadas");
    });
  }
}

function saveTrackerState(state) {
  try {
    localStorage.setItem(STORAGE_KEYS.tracker, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function addLogEntry() {
  const container = document.getElementById("historial-container");
  if (!container) return;

  // Remove placeholder if it exists
  const placeholder = container.querySelector("p");
  if (placeholder) placeholder.remove();

  // Get current time
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Get report content
  const reportText = buildMessage();
  const reportPreview = reportText.length > 100 ? reportText.substring(0, 100) + "..." : reportText;

  // Create Log Entry HTML
  const entry = document.createElement("div");
  entry.style.cssText = "border-bottom: 1px solid #eee; padding: 8px 0; font-size: 13px;";
  entry.innerHTML = `
    <div style="font-weight: 700; color: #1F2937;">Enviado a las ${timeStr}</div>
    <div style="color: var(--text-muted); margin-top: 4px; white-space: pre-wrap;">${reportPreview}</div>
  `;

  // Prepend to show newest first
  container.prepend(entry);

  // Optional: Auto-open the accordion to show the new log? 
  // Probably annoying if user is working. Let's just log it silently.
}

// --- CIERRE REMINDER MODAL ---
function setupCierreReminder() {
  const estadoSelect = document.getElementById("estadoBaseMensaje");
  const modal = document.getElementById("cierre-reminder-modal");
  const closeBtn = document.getElementById("close-cierre-modal");
  const contentEl = document.getElementById("cierre-reminder-content");

  if (!estadoSelect || !modal || !closeBtn || !contentEl) return;

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    modal.classList.remove("modal-overlay--visible");
  });

  estadoSelect.addEventListener("change", (e) => {
    const val = e.target.value;
    let messageHTML = "";

    if (val === "Realizando Cierre" || val === "Cierre realizado" || val === "Cierre parcial realizado") {
      messageHTML = `
        <strong>Recuerda:</strong>
        <ol style="margin-top: 8px; padding-left: 20px;">
          <li style="margin-bottom: 6px;">Si quedaron alumnos a los que no se les entregó paquete, el Cierre es parcial.</li>
          <li>Ya sea Cierre total o parcial no olvides llenar el formulario en línea de reporte de cierre.</li>
        </ol>`;
    } else if (val === "Entregado en Torre Gobernacion") {
      messageHTML = `
        <strong>Recuerda:</strong>
        <ul style="margin-top: 8px; padding-left: 20px;">
          <li>Realizar la marcación geolocalizada de tu asistencia en Torre Gobernación al momento de entregar las actas.</li>
        </ul>`;
    }

    if (messageHTML) {
      contentEl.innerHTML = messageHTML;
      modal.style.display = "flex";
      requestAnimationFrame(() => {
        modal.classList.add("modal-overlay--visible");
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadFormState();
  loadExtraMembersFromStorage();
  loadStatusFormState();
  setupFormListeners();
  setupExtraMembers();
  setupMembersModal();
  setupStatusFormListeners();
  setupTabs();
  setupActions();
  setupAccordions();
  setupEquipo();
  setupAsistentes();

  // New features
  startClock();
  setupManualTracker(); // Changed from trackReport
  setupCierreReminder();

  updatePreview();
  updateStatusPreview();
  updateAsistentesPreview();
});