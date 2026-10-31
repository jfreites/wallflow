# Wallflow

App de barra de menú para macOS que permite buscar y aplicar wallpapers desde [Wallhaven](https://wallhaven.cc), el [Art Institute of Chicago](https://www.artic.edu) y la [NASA](https://images.nasa.gov) sin salir del teclado ni abrir el navegador.

![Wallflow](sshots/wallflow.jpg)

## Descarga

**[⬇ Descargar Wallflow para macOS](https://github.com/jfreites/wallflow/releases/latest/download/Wallflow.dmg)**

Requiere macOS 11 (Big Sur) o superior. Funciona en Mac con Apple Silicon e Intel.
¿Buscas otra versión o las notas de cambios? Mira [todas las versiones](https://github.com/jfreites/wallflow/releases).

## Instalación

1. Abre el archivo `Wallflow.dmg` que descargaste y arrastra **Wallflow** a la carpeta **Aplicaciones**.
2. Abre Wallflow desde Aplicaciones. macOS mostrará un aviso diciendo que no puede verificar la app: haz clic en **Listo** (o **OK**) para cerrarlo.
   Esto pasa porque Wallflow es un proyecto personal y no está registrado con Apple, no porque la app tenga algún problema.
3. Abre **Ajustes del Sistema → Privacidad y seguridad**, baja hasta la sección **Seguridad** y haz clic en **Abrir igualmente** junto al mensaje sobre Wallflow. Confirma con tu contraseña o Touch ID.
4. Busca el ícono de Wallflow en la barra de menú, arriba a la derecha de la pantalla. La app no aparece en el Dock.

A partir de ahí se abre con normalidad. Solo hay que repetir los pasos 2 y 3 después de instalar una versión nueva.

<details>
<summary>Alternativa desde Terminal</summary>

En lugar de los pasos 2 y 3, puedes quitar el bloqueo con este comando y luego abrir la app normalmente:

```bash
xattr -cr /Applications/Wallflow.app
```
</details>

### Actualizar

Descarga el nuevo `Wallflow.dmg`, cierra Wallflow (clic derecho en su ícono → **Salir**) y arrastra la nueva versión a Aplicaciones, reemplazando la anterior. Tus wallpapers guardados y tus ajustes se conservan.

### Desinstalar

Cierra Wallflow y borra `Wallflow.app` de Aplicaciones. Si también quieres borrar los wallpapers descargados, elimina la carpeta `Wallflow` de tu carpeta de inicio.

## Características

- Vive como un ícono en la barra de menú, sin ocupar lugar en el Dock
- Tres fuentes intercambiables desde un selector en "Buscar": **Wallhaven**, **Art Institute of Chicago** (obras de dominio público) y **NASA** (imágenes de espacio y Tierra). La última fuente usada se recuerda
- Sin texto de búsqueda muestra contenido destacado de cada fuente. En Wallhaven puedes ordenar por Latest, Hot, Toplist o Random; en NASA aparecen temas como Hubble, James Webb, nebulosas, galaxias o la Tierra desde el espacio
- Solo muestra imágenes aptas como wallpaper: en Art Institute y NASA se descartan las verticales y las de baja resolución, y en NASA además logos, insignias y fotos de eventos
- Filtro por la resolución de tu pantalla en Wallhaven (activable en Ajustes)
- Al pasar el mouse sobre cada imagen: aplicar, guardar o ver en grande, junto con el autor o la fuente y un enlace a la obra
- Vista a pantalla completa de la ventana para recorrer las imágenes, con autor, fuente y licencia
- Aplica el wallpaper al escritorio con un clic. En NASA avisa si la imagen es más pequeña que tu pantalla
- Guarda cada wallpaper aplicado o guardado en la carpeta `~/Wallflow/Wallpapers`, junto con su atribución
- Pestaña "Mis Wallpapers" para ver, volver a aplicar y eliminar los wallpapers que ya descargaste
- Muestra cuánto espacio ocupan tus wallpapers guardados y permite liberarlo con un clic
- Campo opcional para tu API key de Wallhaven en Ajustes
- Aspecto nativo de macOS: fondo translúcido, tema claro u oscuro según el sistema y navegación completa por teclado

## Cómo se usa

- **Clic en el ícono** de la barra de menú: abre o cierra la ventana. **Clic derecho**: menú con la opción **Salir**.
- La ventana se oculta sola al hacer clic fuera de ella. Para dejarla siempre visible, fíjala con el botón del **pin** (arriba a la derecha); el botón **–** la oculta.
- **Buscar**: elige la fuente, escribe lo que buscas o explora los destacados.
- **Mis Wallpapers**: todo lo que aplicaste o guardaste, disponible sin conexión.
- **Ajustes**: filtro de resolución, API key de Wallhaven y espacio usado.

### Atajos de teclado

| Atajo | Acción |
|---|---|
| `⌘K` | Ir a la búsqueda |
| `←` / `→` | Imagen anterior o siguiente en la vista a pantalla completa |
| `Esc` | Cerrar la vista a pantalla completa o cancelar una confirmación |
| `Tab` / `⇧Tab` | Moverse entre los controles de la ventana |

## Atribución y licencias

Cada imagen conserva su autor y fuente. Las obras del Art Institute of Chicago son de dominio público (CC0). El contenido de la NASA se rige por las [pautas de uso de medios de la NASA](https://www.nasa.gov/nasa-brand-center/images-and-media/). Wallhaven aloja contenido de sus usuarios: revisa los términos de cada imagen si vas a usarla fuera de tu escritorio.

---

¿Quieres compilar Wallflow o contribuir? Revisa la [guía de desarrollo](DEVELOPMENT.md).

Proyecto personal, hecho para dejar de entrar a Wallhaven manualmente cada vez que quiero cambiar de fondo de pantalla.
