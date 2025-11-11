# 📝 Smart Notes - Prototipo Google Keep Mejorado

Prototipo funcional de un sistema de notas con **categorización automática por colores** y **etiquetas inteligentes** usando HTML, CSS y JavaScript vanilla.

## 🚀 Características

### ✨ Categorización Automática
- **Colores sugeridos automáticamente** basados en palabras clave:
  - 🔴 **Rojo**: Tareas y pendientes (entregar, urgente, tarea)
  - 🔵 **Azul**: Ideas y recordatorios (idea, pensar, recordar)
  - 🟢 **Verde**: Compras y finanzas (comprar, pagar, mercado)
  - ⚪ **Gris**: General (por defecto)

- **Etiquetas inteligentes** detectadas automáticamente:
  - Universidad, Trabajo, Compras, Salud, Personal, Familia, etc.
  - Hasta 3 etiquetas sugeridas automáticamente
  - Posibilidad de agregar etiquetas manuales

### 🎯 Funcionalidades
- ✅ Crear notas con título y contenido
- ✅ Sugerencias en tiempo real mientras escribes
- ✅ Editar color y etiquetas antes de guardar
- ✅ Persistencia con localStorage (las notas se mantienen tras recargar)
- ✅ Filtrado por color y etiqueta
- ✅ Búsqueda de texto en todas las notas
- ✅ Diseño responsive (móvil y escritorio)
- ✅ Interfaz accesible (ARIA labels)

## 📦 Instalación y Uso

### Opción 1: Abrir directamente
1. Descarga o clona este repositorio
2. Abre el archivo `index.html` en tu navegador
3. ¡Listo! No requiere servidor ni instalación adicional

### Opción 2: Servidor local (opcional)
\`\`\`bash
# Con Python 3
python -m http.server 8000

# Con Node.js (http-server)
npx http-server
\`\`\`

## 🧪 Casos de Prueba

### Caso 1: Tarea Universitaria
**Entrada**: "Entregar informe universidad"
- ✅ Color sugerido: **Rojo** (tarea)
- ✅ Etiqueta sugerida: **Universidad**

### Caso 2: Idea de Proyecto
**Entrada**: "Idea para proyecto de innovación en el trabajo"
- ✅ Color sugerido: **Azul** (idea)
- ✅ Etiquetas sugeridas: **Trabajo**

### Caso 3: Lista de Compras
**Entrada**: "Comprar leche y pan en el mercado"
- ✅ Color sugerido: **Verde** (compra)
- ✅ Etiqueta sugerida: **Compras**

### Caso 4: Recordatorio Personal
**Entrada**: "Recordar cita médica salud"
- ✅ Color sugerido: **Azul** (recordar)
- ✅ Etiquetas sugeridas: **Salud, Personal**

## 🏗️ Estructura del Proyecto

\`\`\`
smart-notes/
├── index.html      # Estructura HTML
├── styles.css      # Estilos y diseño responsive
├── app.js          # Lógica de la aplicación
└── README.md       # Este archivo
\`\`\`

## 💻 Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño responsive con Flexbox y Grid
- **JavaScript (Vanilla)**: Sin frameworks externos
- **localStorage**: Persistencia de datos local

## 🔍 Arquitectura del Código

### app.js - Estructura Principal

1. **Configuración**: Mapas de palabras clave y estado global
2. **Análisis**: Funciones para sugerir colores y etiquetas (`suggestColor`, `suggestTags`)
3. **UI**: Renderizado de componentes (`renderNotesList`, `createNoteCard`)
4. **Gestión**: CRUD de notas (`saveNote`, `deleteNote`)
5. **Filtrado**: Sistema de filtros múltiples (color, etiqueta, búsqueda)
6. **Persistencia**: Guardado en localStorage con manejo de errores
7. **Inicialización**: Event listeners y carga inicial

## 🎨 Personalización

### Agregar Nuevas Palabras Clave

Edita el objeto `COLOR_KEYWORDS` en `app.js`:

\`\`\`javascript
const COLOR_KEYWORDS = {
    red: ['entregar', 'pendiente', 'tu-palabra'],
    // ...
};
\`\`\`

### Agregar Nuevas Etiquetas

Edita el array `TAG_KEYWORDS` en `app.js`:

\`\`\`javascript
const TAG_KEYWORDS = [
    'universidad', 'trabajo', 'tu-etiqueta'
];
\`\`\`

## ✅ Criterios de Aceptación Cumplidos

- ✅ Las notas muestran color y etiquetas sugeridas en tiempo real
- ✅ El filtrado por color funciona correctamente
- ✅ Las etiquetas son editables antes de guardar
- ✅ Las notas persisten tras recargar la página
- ✅ Interfaz responsive y accesible
- ✅ Código comentado y organizado

## 🌐 Compatibilidad

- ✅ Chrome/Edge (últimas versiones)
- ✅ Firefox (últimas versiones)
- ✅ Safari (últimas versiones)
- ✅ Responsive: Móvil, Tablet, Desktop

## 📝 Notas Técnicas

- **Sin dependencias externas**: 100% vanilla JavaScript
- **localStorage**: Límite aprox. 5-10MB según navegador
- **Accesibilidad**: ARIA labels y navegación por teclado
- **Seguridad**: Escapado de HTML para prevenir XSS

## 🚀 Mejoras Futuras (Opcionales)

- [ ] Edición de notas existentes
- [ ] Exportar/Importar notas (JSON)
- [ ] Modo oscuro
- [ ] Arrastrar y soltar para reordenar
- [ ] Sincronización con backend
- [ ] Notas con imágenes adjuntas

---

**Desarrollado como prototipo funcional para demostración de categorización automática inteligente** 🎯
