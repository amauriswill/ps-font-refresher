# 🔄 Photoshop Font Refresher

Un script para Adobe Photoshop que permite **actualizar la lista de fuentes instaladas sin necesidad de reiniciar el programa**.

![Version](https://img.shields.io/badge/version-1.0-blue) ![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20MacOS-lightgrey)

## ⚠️ El Problema
Photoshop carga la caché de fuentes únicamente al iniciarse. Si instalas una tipografía nueva mientras trabajas, esta no aparecerá disponible hasta que cierres y vuelvas a abrir el software, interrumpiendo tu flujo de trabajo creativo.

## 🛠️ La Solución
Este repositorio contiene un script `.jsx` que fuerza a Photoshop a re-escanear el directorio de fuentes del sistema operativo.

### ¿Cómo funciona?
Debido a que algunas versiones de Photoshop tienen bugs en la API `app.textFonts`, este script utiliza un método de **Simulación de Herramienta (Tool Toggle)**:
1. Abre un contexto temporal seguro.
2. Simula la selección de la Herramienta de Texto (`T`).
3. Esto obliga a la interfaz de Photoshop a leer las fuentes del sistema.
4. Restaura la herramienta anterior y limpia los temporales.

## 🚀 Instalación y Uso

### Método Rápido
1. Descarga el archivo `src/RefrescarFuentes.jsx`.
2. En Photoshop, ve a **Archivo > Secuencias de comandos > Explorar...**
3. Selecciona el archivo descargado.

### Instalación Permanente
Copia el archivo `.jsx` en la carpeta de scripts de Photoshop:
- **Windows:** `C:\Archivos de programa\Adobe\Adobe Photoshop [Versión]\Presets\Scripts\`
- **Mac:** `/Applications/Adobe Photoshop [Versión]/Presets/Scripts/`

Reinicia Photoshop una vez. El script aparecerá ahora en el menú de Secuencias de comandos.

## 📂 Contenido del Repositorio

- `src/RefrescarFuentes.jsx`: El script principal de producción. **(Usa este)**.
- `src/Diagnostico.jsx`: Herramienta para desarrolladores que verifica qué APIs están rotas en tu versión de Photoshop.
- `docs/GUIA_USO.txt`: Instrucciones detalladas para crear atajos de teclado (Actions).

## 📄 Licencia
Este proyecto está bajo la Licencia MIT - siéntete libre de usarlo y modificarlo.