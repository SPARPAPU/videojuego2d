# Guía de entrega paso a paso

1. **Revisar localmente:** descomprime el ZIP y abre `index.html`. Si algo no carga, ejecuta un servidor local (`python -m http.server 8000`) y entra a `http://localhost:8000`.
2. **Probar los requisitos:** confirma 25 objetivos, movimientos distintos, rebotes, destellos de colisión, clic para eliminar/reaparecer, contador, cruceta, audio y favicon.
3. **Personalizar créditos:** edita el footer de `index.html` con nombres y números de control.
4. **Guardar en Git:** abre terminal dentro de la carpeta, ejecuta `git init`, `git add .`, `git commit -m "Versión inicial"`.
5. **Crear repositorio GitHub:** crea un repositorio vacío y copia la URL HTTPS. Ejecuta `git branch -M main`, `git remote add origin URL_REAL`, `git push -u origin main`.
6. **Publicar:** GitHub → Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save.
7. **Verificar remoto:** abre la URL de GitHub Pages y prueba el juego de nuevo. Comprueba particularmente los recursos de `assets/` y que el audio solo se active después de pulsar el botón.
8. **Preparar evidencia:** captura la aplicación en ejecución, el repositorio, los commits y GitHub Pages. Inserta las evidencias y conclusiones en el documento solicitado por el profesor y exporta a PDF.
9. **Entrega:** sube a Moodle el documento PDF, la URL del repositorio y la URL de la aplicación publicada.
