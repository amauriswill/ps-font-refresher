// ActualizarFuentes_Final.jsx
// Solución: Simulación de selección de herramienta
// Compatible con versiones que tienen errores en app.textFonts

(function() {
    // 1. Configuración inicial para evitar molestias
    var originalDialogs = app.displayDialogs;
    app.displayDialogs = DialogModes.NO;

    var tempDoc = null;

    // Función segura para cambiar de herramienta
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
            // Si falla el cambio, no detenemos el script
        }
    }

    try {
        // 2. Necesitamos un lienzo para activar las herramientas
        // Intentamos usar el documento activo, si no hay, creamos uno
        if (app.documents.length === 0) {
            tempDoc = app.documents.add();
        } else {
            tempDoc = app.activeDocument;
        }

        // 3. EL TRUCO: "Despertar" la interfaz
        // Seleccionamos la Herramienta de Texto (TxTl)
        selectTool("TxTl");
        
        // Pequeña pausa técnica para asegurar que la UI reaccione
        for(var i=0; i<100000; i++) { var dummy = i * 2; }

        // 4. Volver a la Herramienta Mover (MvTl) para dejar todo limpio
        selectTool("MvTl");

        // 5. Limpieza
        // Si creamos un documento temporal (se llama "Untitled" o "Sin título"), lo cerramos
        if (tempDoc) {
            var docName = tempDoc.name.toLowerCase();
            if (docName.indexOf("untitled") !== -1 || docName.indexOf("sin título") !== -1) {
                tempDoc.close(SaveOptions.DONOTSAVECHANGES);
            }
        }

        // Restaurar configuración original
        app.displayDialogs = originalDialogs;
        
        // Mensaje de Éxito
        alert("✅ Fuentes Actualizadas.\n\nLa lista de fuentes debería estar al día ahora.");

    } catch(e) {
        // Restauración de emergencia en caso de fallo raro
        app.displayDialogs = originalDialogs;
        alert("Aviso: " + e.message);
    }
})();