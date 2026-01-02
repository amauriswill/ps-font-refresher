// SmartFontRefresher_V4.jsx
// ForceRefresh_ToolToggle.jsx
// En lugar de código complejo, simplemente seleccionamos la herramienta T
// para obligar a la interfaz a cargar las fuentes.

(function() {
    // 1. Configuración inicial
    var originalDialogs = app.displayDialogs;
    app.displayDialogs = DialogModes.NO;

    var tempDoc = null;

    // Función auxiliar para seleccionar herramientas
    function selectTool(toolCode) {
        try {
            var idslct = charIDToTypeID( "slct" );
            var desc = new ActionDescriptor();
            var idnull = charIDToTypeID( "null" );
            var ref = new ActionReference();
            var idTool = charIDToTypeID( toolCode );
            ref.putClass( idTool );
            desc.putReference( idnull, ref );
            executeAction( idslct, desc, DialogModes.NO );
        } catch(e) {
            // Ignorar errores de selección de herramienta
        }
    }

    try {
        // 2. Necesitamos un documento abierto para que las herramientas funcionen
        // Usamos .add() sin parámetros para máxima compatibilidad
        if (app.documents.length === 0) {
            tempDoc = app.documents.add();
        } else {
            // Si ya hay uno, usamos el activo
            tempDoc = app.activeDocument;
        }

        // 3. EL TRUCO: Cambiar de herramienta
        // Seleccionar Herramienta de Texto (TxTl)
        // Esto fuerza a la UI a leer las fuentes del sistema
        selectTool("TxTl");
        
        // Pequeña pausa para asegurar que Photoshop procese el cambio
        // (Un bucle simple que no hace nada más que esperar)
        for(var i=0; i<100000; i++) { var dummy = i * 2; }

        // 4. Volver a Herramienta Mover (MvTl) para dejar todo limpio
        selectTool("MvTl");

        // 5. Limpieza
        // Si creamos un documento temporal, lo cerramos
        if (tempDoc && app.documents.length > 0) {
            // Verificamos si es el documento "Untitled" que acabamos de crear para cerrarlo
            // Si el usuario ya tenía uno abierto, no lo cerramos, solo lo dejamos en paz.
            if (tempDoc.name.indexOf("Untitled") !== -1 || tempDoc.name.indexOf("Sin título") !== -1) {
                tempDoc.close(SaveOptions.DONOTSAVECHANGES);
            }
        }

        // Restaurar diálogos
        app.displayDialogs = originalDialogs;
        
        alert("✅ Proceso terminado.\nSe ha forzado la carga de la Herramienta de Texto.");

    } catch(e) {
        // Restauración de emergencia
        app.displayDialogs = originalDialogs;
        alert("Aviso: " + e.message);
    }
})();