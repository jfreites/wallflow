# Desarrollo de Wallflow

Guía para compilar Wallflow localmente, entender cómo funciona por dentro y publicar nuevas versiones. Si solo quieres usar la app, sigue las instrucciones de instalación del [README](README.md).

## Stack

- **[Tauri](https://tauri.app)** — runtime nativo (Rust) + webview
- **React + TypeScript** — interfaz, con estilos propios organizados en tokens de diseño (sin librerías de UI)
- **Wallhaven API**, **Art Institute of Chicago API** (IIIF) y **NASA Image and Video Library** — fuentes de los wallpapers
- **AppleScript (vía `osascript`)** — aplicar el wallpaper al sistema, ya que macOS no expone una API nativa simple para esto

## Requisitos

- macOS
- Node.js y [pnpm](https://pnpm.io)
- Rust (`rustup`)
- Xcode Command Line Tools

## Desarrollo

```bash
pnpm install
pnpm tauri dev
```

La ventana empieza oculta: ábrela desde el ícono de la barra de menú. Se oculta sola al perder el foco, salvo que la fijes con el pin.

## Build local

Para generar la app compilada (.app) y su instalador (.dmg) para la arquitectura de tu Mac:

```bash
pnpm install
pnpm tauri build
```

Los artefactos quedan en `src-tauri/target/release/bundle/`:
- `macos/Wallflow.app` — la app en sí
- `dmg/Wallflow_x.x.x_aarch64.dmg` — instalador tipo imagen de disco

Para generar un build **universal** (Apple Silicon + Intel), igual al que se publica en los releases:

```bash
rustup target add aarch64-apple-darwin x86_64-apple-darwin
pnpm tauri build --target universal-apple-darwin
```

En ese caso los artefactos quedan en `src-tauri/target/universal-apple-darwin/release/bundle/`.

La app se firma ad hoc (`signingIdentity: "-"`), pero no está notarizada: al abrirla por primera vez macOS mostrará el aviso de Gatekeeper descrito en el README. Para quitarlo en un build local: `xattr -cr /ruta/a/Wallflow.app`.

## Cómo funciona (resumen técnico)

- El ícono de la barra de menú controla la visibilidad de una única ventana (popover) transparente con efecto vibrancy de macOS (`windowEffects` de Tauri, que requiere `macOSPrivateApi`), que se oculta automáticamente al perder el foco
- La app corre con política de activación `Accessory` de macOS, para no aparecer en el Dock ni cerrarse al ocultar la ventana
- Cada fuente es un adaptador en `src/sources/` que implementa la interfaz `WallpaperSource` y devuelve un modelo común `Wallpaper`. Cada una declara sus `capabilities`, y la UI oculta los filtros que no soporta
- Las peticiones usan el plugin `http` de Tauri. Los errores (límite de peticiones, sin conexión, API key rechazada) se traducen a mensajes uniformes por fuente
- El Art Institute exige identificar a la app con un header propio, que las `<img>` del webview no pueden enviar: sus imágenes se descargan con el plugin `http` y se muestran como blob
- En NASA, la búsqueda ya trae las URLs de cada imagen. Las dimensiones que faltan se leen de la cabecera del archivo con una petición `Range` y solo al abrir, descargar o aplicar, y se cachean en memoria
- Los wallpapers aplicados se descargan a `~/Wallflow/Wallpapers` (carpeta propia en el home, sin restricciones de permisos de macOS) y se aplican corriendo un script de AppleScript vía el plugin `shell`
- Las preferencias (filtro de resolución, API key, última fuente) y la atribución de lo descargado se persisten con el plugin `store` de Tauri

### Agregar una fuente nueva

1. Crear un archivo en `src/sources/` que exporte un objeto `WallpaperSource` (ver `src/sources/types.ts`), usando `sourceJson`/`sourceFetch` de `src/sources/http.ts` para que los errores se muestren igual que en las demás fuentes.
2. Agregarlo a la lista `SOURCES` en `src/sources/index.ts`.
3. Permitir sus dominios en `http:default` dentro de `src-tauri/capabilities/default.json`.

## Publicar un release

Los releases se generan automáticamente con la GitHub Action [`.github/workflows/release.yml`](.github/workflows/release.yml) al subir un tag `v*`. La Action compila un `.dmg` universal y crea un release en **borrador** con dos archivos: `Wallflow_<versión>_universal.dmg` y una copia con nombre fijo, `Wallflow.dmg`, que es la que enlaza el README (`releases/latest/download/Wallflow.dmg`).

1. Actualiza la versión en los tres archivos:
   - `src-tauri/tauri.conf.json` → `version`
   - `package.json` → `version`
   - `src-tauri/Cargo.toml` → `version` (y corre `cargo check` para actualizar `Cargo.lock`)
2. Haz commit y push a `main`.
3. Crea y sube el tag:
   ```bash
   git tag v0.2.0
   git push origin v0.2.0
   ```
4. Espera a que termine la Action (pestaña *Actions* del repo, unos 10–15 minutos).
5. En *Releases*, abre el borrador, escribe las notas de la versión y publícalo. Desde ese momento el enlace de descarga del README apunta a la nueva versión.

## Roadmap / ideas pendientes

Wallflow Pro: ya existe el diseño de las funciones bloqueadas en Ajustes (insignia "Pro" y estado bloqueado reutilizable), pero ninguna está implementada todavía.

- Rotación automática de wallpaper (slideshow real, no solo preview)
- Soporte multi-monitor
- Favoritos / colecciones
