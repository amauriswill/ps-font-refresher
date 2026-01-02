/*
Script: Diagnóstico de Entorno
Descripción: Verifica qué partes de la API de Photoshop están rotas o accesibles.
*/

(function() {
    var report = "INFORME DE DIAGNÓSTICO:\n";
    
    try {
        // Test 1: Objeto App
        report += "- Objeto 'app': " + (typeof app !== 'undefined' ? "OK" : "FALLO") + "\n";
        
        // Test 2: Acceso a Fuentes
        try {
            var count = app.textFonts.length;
            report += "- API textFonts: OK (Detectadas: " + count + ")\n";
        } catch(e) {
            report += "- API textFonts: ROTO (Error: " + e.message + ")\n";
        }

        // Test 3: Creación de Documentos
        try {
            var doc = app.documents.add(10,10);
            doc.close(2); // 2 = Don't Save
            report += "- Crear Documentos: OK\n";
        } catch(e) {
            report += "- Crear Documentos: FALLO\n";
        }

        alert(report);

    } catch(globalErr) {
        alert("Error Fatal en Diagnóstico: " + globalErr.message);
    }
})();