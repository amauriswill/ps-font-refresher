/*
Script: Actualizar Fuentes (Force Tool Toggle)
Versión: 1.0 Stable
Descripción: Fuerza la carga de fuentes seleccionando momentáneamente la herramienta de texto.
*/

(function() {
    // 1. Configuración inicial
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
            // Fallo silencioso si no puede cambiar
        }
    }

    try {
        // 2. Verificar contexto (Necesitamos un lienzo activo)
        if (app.documents.length === 0) {
            tempDoc = app.documents.add();
        } else {
            tempDoc = app.activeDocument;
        }

        // 3. EL TRUCO: Seleccionar Herramienta de Texto (TxTl)
        // Esto obliga a la UI a leer las fuentes del sistema
        selectTool("TxTl");
        
        // Pausa técnica (micro-delay) para asegurar refresco de UI
        for(var i=0; i<100000; i++) { var dummy = i * 2; }

        // 4. Volver a Herramienta Mover (MvTl)
        selectTool("MvTl");

        // 5. Limpieza inteligente
        // Solo cerramos el documento si es uno temporal creado por nosotros
        if (tempDoc) {
            var docName = tempDoc.name.toLowerCase();
            if (docName.indexOf("untitled") !== -1 || docName.indexOf("sin título") !== -1) {
                tempDoc.close(SaveOptions.DONOTSAVECHANGES);
            }
        }

        // Restaurar configuración
        app.displayDialogs = originalDialogs;
        
        alert("✅ Fuentes Actualizadas.\n\nLa lista de fuentes debería estar al día ahora.");

    } catch(e) {
        app.displayDialogs = originalDialogs;
        alert("Aviso: " + e.message);
    }
})();