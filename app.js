/**
 * Smart Notes - Sistema de categorización automática de notas
 * Prototipo funcional con vanilla JavaScript
 */

// ========================================
// 1. CONFIGURACIÓN Y CONSTANTES
// ========================================

/**
 * Mapa de palabras clave para detección de colores
 * Cada color tiene un array de palabras que lo activan
 */
const COLOR_KEYWORDS = {
  red: ["entregar", "pendiente", "tarea", "urgente", "hacer", "deadline", "importante"],
  blue: ["idea", "recordar", "pensar", "inspiración", "notas", "brainstorm", "concepto"],
  green: ["comprar", "pagar", "pago", "recibo", "mercado", "tienda", "dinero", "factura"],
}

/**
 * Palabras clave para detección automática de etiquetas
 * Se convierten en etiquetas con la primera letra en mayúscula
 */
const TAG_KEYWORDS = [
  "universidad",
  "trabajo",
  "compras",
  "salud",
  "personal",
  "familia",
  "proyecto",
  "estudio",
  "ejercicio",
  "viaje",
]

/**
 * Estado global de la aplicación
 */
const appState = {
  notes: [],
  currentNote: {
    title: "",
    content: "",
    color: "gray",
    tags: ["General"],
  },
  filters: {
    color: "all",
    tag: "all",
    search: "",
  },
}

// ========================================
// 2. FUNCIONES DE ANÁLISIS Y SUGERENCIAS
// ========================================

/**
 * Analiza el texto y sugiere un color basado en palabras clave
 * @param {string} text - Texto a analizar (título + contenido)
 * @returns {string} - Color sugerido ('red', 'blue', 'green', 'gray')
 */
function suggestColor(text) {
  const normalizedText = text.toLowerCase()

  // Buscar coincidencias en cada categoría de color
  for (const [color, keywords] of Object.entries(COLOR_KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalizedText.includes(keyword)) {
        return color
      }
    }
  }

  // Color por defecto si no hay coincidencias
  return "gray"
}

/**
 * Analiza el texto y sugiere etiquetas automáticamente
 * @param {string} text - Texto a analizar
 * @returns {string[]} - Array de etiquetas sugeridas (máx. 3)
 */
function suggestTags(text) {
  const normalizedText = text.toLowerCase()
  const foundTags = []

  // Buscar palabras clave en el texto
  for (const keyword of TAG_KEYWORDS) {
    if (normalizedText.includes(keyword)) {
      // Capitalizar primera letra
      const capitalizedTag = keyword.charAt(0).toUpperCase() + keyword.slice(1)
      foundTags.push(capitalizedTag)

      // Limitar a 3 etiquetas
      if (foundTags.length >= 3) break
    }
  }

  // Si no se encuentran etiquetas, devolver "General"
  return foundTags.length > 0 ? foundTags : ["General"]
}

/**
 * Actualiza las sugerencias en tiempo real mientras el usuario escribe
 */
function updateSuggestions() {
  const title = document.getElementById("noteTitle").value
  const content = document.getElementById("noteContent").value
  const fullText = `${title} ${content}`

  // Solo actualizar si hay texto
  if (fullText.trim() === "") {
    appState.currentNote.color = "gray"
    appState.currentNote.tags = ["General"]
  } else {
    // Sugerir color y etiquetas
    appState.currentNote.color = suggestColor(fullText)
    appState.currentNote.tags = suggestTags(fullText)
  }

  // Actualizar UI
  renderColorSuggestion()
  renderTagsSuggestion()
}

// ========================================
// 3. FUNCIONES DE RENDERIZADO DE UI
// ========================================

/**
 * Renderiza la sugerencia de color actual
 */
function renderColorSuggestion() {
  const colorDot = document.getElementById("suggestedColorDot")
  const colorText = document.getElementById("suggestedColorText")

  colorDot.className = `color-dot ${appState.currentNote.color}`

  const colorNames = {
    red: "Rojo (Tareas)",
    blue: "Azul (Ideas)",
    green: "Verde (Compras)",
    gray: "Gris (General)",
  }

  colorText.textContent = colorNames[appState.currentNote.color]
}

/**
 * Renderiza las etiquetas sugeridas como chips editables
 */
function renderTagsSuggestion() {
  const tagsPreview = document.getElementById("tagsPreview")
  tagsPreview.innerHTML = ""

  appState.currentNote.tags.forEach((tag, index) => {
    const tagElement = document.createElement("span")
    tagElement.className = "tag removable"
    tagElement.textContent = tag
    tagElement.setAttribute("data-tag-index", index)

    // Permitir eliminar etiquetas
    tagElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("removable")) {
        removeTag(index)
      }
    })

    tagsPreview.appendChild(tagElement)
  })
}

/**
 * Renderiza la lista completa de notas aplicando filtros activos
 */
function renderNotesList() {
  const notesList = document.getElementById("notesList")
  const notesCount = document.getElementById("notesCount")

  // Aplicar filtros
  const filteredNotes = filterNotes()

  // Actualizar contador
  notesCount.textContent = filteredNotes.length

  // Si no hay notas, mostrar mensaje
  if (filteredNotes.length === 0) {
    notesList.innerHTML = '<p class="empty-state">No se encontraron notas con los filtros aplicados. 🔍</p>'
    return
  }

  // Renderizar cada nota
  notesList.innerHTML = ""
  filteredNotes.forEach((note) => {
    const noteCard = createNoteCard(note)
    notesList.appendChild(noteCard)
  })
}

/**
 * Crea un elemento HTML para una tarjeta de nota
 * @param {Object} note - Objeto con los datos de la nota
 * @returns {HTMLElement} - Elemento div con la tarjeta completa
 */
function createNoteCard(note) {
  const card = document.createElement("div")
  card.className = `note-card ${note.color}`
  card.setAttribute("data-note-id", note.id)

  const date = new Date(note.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  card.innerHTML = `
        <div class="note-card-header">
            <h3 class="note-title">${escapeHtml(note.title) || "Sin título"}</h3>
        </div>
        <p class="note-content">${escapeHtml(note.content)}</p>
        <div class="note-tags">
            ${note.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
        </div>
        <div class="note-footer">
            <span class="note-date">${date}</span>
            <button class="delete-btn" data-note-id="${note.id}" aria-label="Eliminar nota">
                🗑️ Eliminar
            </button>
        </div>
    `

  // Agregar evento de eliminación
  const deleteBtn = card.querySelector(".delete-btn")
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    deleteNote(note.id)
  })

  return card
}

/**
 * Actualiza el selector de filtro de etiquetas con todas las etiquetas disponibles
 */
function updateTagFilter() {
  const tagFilter = document.getElementById("tagFilter")

  // Obtener todas las etiquetas únicas
  const allTags = new Set()
  appState.notes.forEach((note) => {
    note.tags.forEach((tag) => allTags.add(tag))
  })

  // Mantener la opción "Todas"
  tagFilter.innerHTML = '<option value="all">Todas las etiquetas</option>'

  // Agregar cada etiqueta como opción
  Array.from(allTags)
    .sort()
    .forEach((tag) => {
      const option = document.createElement("option")
      option.value = tag
      option.textContent = tag
      tagFilter.appendChild(option)
    })
}

// ========================================
// 4. FUNCIONES DE GESTIÓN DE NOTAS
// ========================================

/**
 * Guarda una nueva nota en el estado y localStorage
 */
function saveNote() {
  const title = document.getElementById("noteTitle").value.trim()
  const content = document.getElementById("noteContent").value.trim()

  // Validar que haya al menos contenido
  if (!content) {
    alert("Por favor, escribe algo en tu nota antes de guardar.")
    return
  }

  // Crear objeto de nota
  const note = {
    id: Date.now().toString(),
    title: title || "Sin título",
    content: content,
    color: appState.currentNote.color,
    tags: [...appState.currentNote.tags],
    createdAt: new Date().toISOString(),
  }

  // Agregar al estado
  appState.notes.unshift(note) // Agregar al inicio (más reciente primero)

  // Guardar en localStorage
  saveToLocalStorage()

  // Limpiar formulario
  clearNoteForm()

  // Actualizar UI
  renderNotesList()
  updateTagFilter()

  // Feedback visual
  showNotification("✅ Nota guardada exitosamente")
}

/**
 * Elimina una nota por su ID
 * @param {string} noteId - ID de la nota a eliminar
 */
function deleteNote(noteId) {
  if (confirm("¿Estás seguro de que quieres eliminar esta nota?")) {
    // Filtrar la nota del array
    appState.notes = appState.notes.filter((note) => note.id !== noteId)

    // Guardar cambios
    saveToLocalStorage()

    // Actualizar UI
    renderNotesList()
    updateTagFilter()

    showNotification("🗑️ Nota eliminada")
  }
}

/**
 * Limpia el formulario de creación de notas
 */
function clearNoteForm() {
  document.getElementById("noteTitle").value = ""
  document.getElementById("noteContent").value = ""
  document.getElementById("manualTagInput").value = ""

  // Resetear estado actual
  appState.currentNote = {
    title: "",
    content: "",
    color: "gray",
    tags: ["General"],
  }

  // Actualizar sugerencias
  updateSuggestions()
}

/**
 * Agrega una etiqueta manual a la nota actual
 */
function addManualTag() {
  const input = document.getElementById("manualTagInput")
  const tagText = input.value.trim()

  if (!tagText) return

  // Capitalizar primera letra
  const capitalizedTag = tagText.charAt(0).toUpperCase() + tagText.slice(1)

  // Verificar si ya existe
  if (appState.currentNote.tags.includes(capitalizedTag)) {
    alert("Esta etiqueta ya está agregada.")
    return
  }

  // Limitar a 5 etiquetas
  if (appState.currentNote.tags.length >= 5) {
    alert("Máximo 5 etiquetas por nota.")
    return
  }

  // Remover "General" si es la única etiqueta
  if (appState.currentNote.tags.length === 1 && appState.currentNote.tags[0] === "General") {
    appState.currentNote.tags = []
  }

  // Agregar nueva etiqueta
  appState.currentNote.tags.push(capitalizedTag)

  // Limpiar input y actualizar UI
  input.value = ""
  renderTagsSuggestion()
}

/**
 * Elimina una etiqueta de la nota actual
 * @param {number} index - Índice de la etiqueta a eliminar
 */
function removeTag(index) {
  appState.currentNote.tags.splice(index, 1)

  // Si no quedan etiquetas, agregar "General"
  if (appState.currentNote.tags.length === 0) {
    appState.currentNote.tags = ["General"]
  }

  renderTagsSuggestion()
}

// ========================================
// 5. FUNCIONES DE FILTRADO Y BÚSQUEDA
// ========================================

/**
 * Aplica los filtros activos y devuelve las notas filtradas
 * @returns {Array} - Array de notas que cumplen con los filtros
 */
function filterNotes() {
  let filtered = [...appState.notes]

  // Filtro por color
  if (appState.filters.color !== "all") {
    filtered = filtered.filter((note) => note.color === appState.filters.color)
  }

  // Filtro por etiqueta
  if (appState.filters.tag !== "all") {
    filtered = filtered.filter((note) => note.tags.includes(appState.filters.tag))
  }

  // Filtro por búsqueda de texto
  if (appState.filters.search) {
    const searchLower = appState.filters.search.toLowerCase()
    filtered = filtered.filter(
      (note) =>
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower) ||
        note.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
    )
  }

  return filtered
}

/**
 * Establece el filtro de color activo
 * @param {string} color - Color a filtrar ('all', 'red', 'blue', 'green', 'gray')
 */
function setColorFilter(color) {
  appState.filters.color = color

  // Actualizar botones activos
  document.querySelectorAll("[data-filter-color]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filterColor === color)
  })

  renderNotesList()
}

/**
 * Establece el filtro de etiqueta activo
 * @param {string} tag - Etiqueta a filtrar
 */
function setTagFilter(tag) {
  appState.filters.tag = tag
  renderNotesList()
}

/**
 * Establece el filtro de búsqueda de texto
 * @param {string} searchText - Texto a buscar
 */
function setSearchFilter(searchText) {
  appState.filters.search = searchText
  renderNotesList()
}

// ========================================
// 6. PERSISTENCIA (localStorage)
// ========================================

/**
 * Guarda el estado actual en localStorage
 */
function saveToLocalStorage() {
  try {
    localStorage.setItem("smartNotes", JSON.stringify(appState.notes))
  } catch (error) {
    console.error("Error al guardar en localStorage:", error)
    alert("No se pudo guardar la nota. Verifica el almacenamiento del navegador.")
  }
}

/**
 * Carga las notas desde localStorage al iniciar
 */
function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem("smartNotes")
    if (saved) {
      appState.notes = JSON.parse(saved)
    }
  } catch (error) {
    console.error("Error al cargar desde localStorage:", error)
    appState.notes = []
  }
}

// ========================================
// 7. UTILIDADES
// ========================================

/**
 * Escapa HTML para prevenir XSS
 * @param {string} text - Texto a escapar
 * @returns {string} - Texto escapado
 */
function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

/**
 * Muestra una notificación temporal
 * @param {string} message - Mensaje a mostrar
 */
function showNotification(message) {
  // Crear elemento de notificación
  const notification = document.createElement("div")
  notification.textContent = message
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `

  document.body.appendChild(notification)

  // Remover después de 3 segundos
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease"
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

// ========================================
// 8. INICIALIZACIÓN Y EVENT LISTENERS
// ========================================

/**
 * Inicializa la aplicación cuando el DOM está listo
 */
function initApp() {
  console.log("📝 Smart Notes iniciado")

  // Cargar datos guardados
  loadFromLocalStorage()

  // Renderizar UI inicial
  renderNotesList()
  updateTagFilter()
  updateSuggestions()

  // Event Listeners - Formulario de nota
  document.getElementById("noteTitle").addEventListener("input", updateSuggestions)
  document.getElementById("noteContent").addEventListener("input", updateSuggestions)
  document.getElementById("saveNoteBtn").addEventListener("click", saveNote)

  // Event Listener - Cambiar color
  document.getElementById("changeColorBtn").addEventListener("click", () => {
    const colorPicker = document.getElementById("colorPicker")
    colorPicker.classList.toggle("hidden")
  })

  // Event Listeners - Selector de colores
  document.querySelectorAll(".color-option").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const color = e.currentTarget.dataset.color
      appState.currentNote.color = color
      renderColorSuggestion()
      document.getElementById("colorPicker").classList.add("hidden")
    })
  })

  // Event Listener - Agregar etiqueta manual
  document.getElementById("addManualTagBtn").addEventListener("click", addManualTag)
  document.getElementById("manualTagInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addManualTag()
    }
  })

  // Event Listeners - Filtros de color
  document.querySelectorAll("[data-filter-color]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      setColorFilter(e.currentTarget.dataset.filterColor)
    })
  })

  // Event Listener - Filtro de etiquetas
  document.getElementById("tagFilter").addEventListener("change", (e) => {
    setTagFilter(e.target.value)
  })

  // Event Listener - Búsqueda
  const searchInput = document.getElementById("searchInput")
  let searchTimeout
  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      setSearchFilter(e.target.value)
    }, 300) // Debounce de 300ms
  })

  console.log("✅ Aplicación lista. Notas cargadas:", appState.notes.length)
}

// Agregar estilos de animación para notificaciones
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)

// Iniciar cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp)
} else {
  initApp()
}
