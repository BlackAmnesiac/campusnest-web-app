# Guía de estilo — CampusNest

Todos los colores viven al inicio de `src/styles.css` (bloque `:root`) como variables CSS. En el resto del código **no se escriben colores a mano**: se usan siempre las variables.

| Rol | Variable | Valor | Dónde se usa |
|---|---|---|---|
| Primario | `--primary` | `#E11D48` | Marca (logo y nombre), botones principales (`.btn-primary`), foco, pasos activos |
| Primario (hover) | `--primary-dark` | `#BE123C` | Hover de botones principales |
| Primario (fondo suave) | `--primary-container` | `#3A1722` | Ítem activo de la navbar, chips seleccionados |
| Texto sobre primario | `--on-primary` | `#FFFFFF` | Texto de botones principales |
| Secundario | `--secondary` | `#FB7185` | Botones secundarios (`.btn-secondary`), enlaces, elementos interactivos |
| Fondo | `--bg` | `#121214` | Fondo de la página |
| Superficie | `--panel` | `#1C1C1F` | Cards, paneles, navbar |
| Texto | `--text` / `--muted` | `#E8E8EA` / `#A1A1AA` | Texto principal / secundario |
| Éxito | `--ok` | `#34D399` | Etiquetas de match alto |

## Ejemplo

```css
.btn-primary   { background: var(--primary);  color: var(--on-primary); }
.btn-secondary { border-color: var(--secondary); color: var(--secondary); }
a, .linkbtn    { color: var(--secondary); }
```

## Cómo cambiar la paleta

Edita solo los valores del bloque `:root` al inicio de `src/styles.css`. Si la guía de estilo del Figma usa otros colores, se cambian ahí y se actualiza toda la interfaz.
