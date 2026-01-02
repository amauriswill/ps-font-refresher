#target photoshop;

// =========================================================================
// SCRIPT: ESTRUCTURA CONSOLIDADA (UNA SOLA CARPETA DE TEXTOS)
// =========================================================================

// --- CONFIGURACIÓN ---
var MARGIN = 100;
var DESIRED_PX_SIZE = 70; // Tamaño visual deseado (70px)
var BG_HEX = "eeeeee";    // Color de fondo gris claro

function createStructure() {
    if (app.documents.length === 0) {
        alert("❌ Por favor, abre un documento primero.");
        return;
    }

    var doc = app.activeDocument;
    
    // --- CÁLCULO DE TAMAÑO EXACTO ---
    // Convierte los 70px deseados a "Puntos" basándose en la resolución del documento
    // para evitar que el texto salga gigante en 300dpi.
    var docRes = doc.resolution;
    var finalFontSize = (DESIRED_PX_SIZE * 72) / docRes;
    
    // Espaciado entre líneas (1.5 veces el tamaño)
    var lineHeight = DESIRED_PX_SIZE * 1.5; 

    // Guardar configuración original
    var originalRuler = app.preferences.rulerUnits;
    var originalType = app.preferences.typeUnits;
    app.preferences.rulerUnits = Units.PIXELS;
    app.preferences.typeUnits = TypeUnits.POINTS; 

    try {
        // -----------------------------------------------------------------
        // 1. GUÍAS
        // -----------------------------------------------------------------
        try {
            doc.guides.add(Direction.VERTICAL, MARGIN);
            doc.guides.add(Direction.VERTICAL, doc.width.value - MARGIN);
            doc.guides.add(Direction.HORIZONTAL, MARGIN);
            doc.guides.add(Direction.HORIZONTAL, doc.height.value - MARGIN);
        } catch(e) {}

        // -----------------------------------------------------------------
        // 2. GRUPO: ADJUSTMENTS (Verde)
        // -----------------------------------------------------------------
        var grpAdjust = doc.layerSets.add();
        grpAdjust.name = "ADJUSMENTS";
        setLayerLabelColor("green");

        addAdjustmentLayer("vibrance"); 
        doc.activeLayer.name = "Color e intensidad 1";
        safeMoveToGroup(doc.activeLayer, grpAdjust);

        addAdjustmentLayer("hueSaturation");
        doc.activeLayer.name = "Tono/saturación 2";
        safeMoveToGroup(doc.activeLayer, grpAdjust);

        addAdjustmentLayer("curves");
        doc.activeLayer.name = "Curvas 3";
        safeMoveToGroup(doc.activeLayer, grpAdjust);

        // -----------------------------------------------------------------
        // 3. GRUPO ÚNICO: TEXTOS (Amarillo)
        // -----------------------------------------------------------------
        var startY = MARGIN + DESIRED_PX_SIZE; // Posición inicial Y
        
        doc.activeLayer = grpAdjust; // Reiniciar selección para insertar debajo
        
        var grpTexts = doc.layerSets.add();
        grpTexts.name = "TEXTOS"; // Carpeta consolidada
        grpTexts.move(grpAdjust, ElementPlacement.PLACEAFTER);
        setLayerLabelColor("yellow");

        // Creamos las capas DENTRO de la carpeta única
        // txt_1
        createAlignedLayer(grpTexts, "txt_1", "DESDE US$47,900", MARGIN, startY, finalFontSize);
        
        // txt_2
        createAlignedLayer(grpTexts, "txt_2", "AGARRA el año", MARGIN, startY + lineHeight, finalFontSize);
        
        // txt_3
        createAlignedLayer(grpTexts, "txt_3", "rodando", MARGIN, startY + (lineHeight * 2), finalFontSize);

        // -----------------------------------------------------------------
        // 4. GRUPO: BACKGROUND (Azul)
        // -----------------------------------------------------------------
        var grpBack = doc.layerSets.add();
        grpBack.name = "BACKGROUND";
        grpBack.move(grpTexts, ElementPlacement.PLACEAFTER);
        setLayerLabelColor("blue");

        createSolidColorLayer(BG_HEX); 
        doc.activeLayer.name = "Fondo Gris (" + BG_HEX + ")";
        safeMoveToGroup(doc.activeLayer, grpBack);

        alert("✅ Listo: Textos consolidados en carpeta 'TEXTOS'.");

    } catch(e) {
        alert("Error: " + e.message + "\nLínea: " + e.line);
    } finally {
        // Restaurar unidades originales
        app.preferences.rulerUnits = originalRuler;
        app.preferences.typeUnits = originalType;
    }
}

// =========================================================================
// FUNCIONES AUXILIARES
// =========================================================================

function createAlignedLayer(groupTarget, layerName, textContent, x, y, sizePoints) {
    var layer = app.activeDocument.artLayers.add();
    layer.kind = LayerKind.TEXT;
    layer.name = layerName; // Nombre de capa: txt_1, txt_2...
    
    var ti = layer.textItem;
    ti.contents = textContent;
    ti.size = sizePoints;
    ti.justification = Justification.LEFT;
    ti.position = [x, y];
    
    try { layer.move(groupTarget, ElementPlacement.INSIDE); } catch(e){}
}

function createSolidColorLayer(hexColor) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var layerDesc = new ActionDescriptor();
    var colorDesc = new ActionDescriptor();
    var rgbDesc = new ActionDescriptor();
    
    var r = parseInt(hexColor.substring(0,2), 16);
    var g = parseInt(hexColor.substring(2,4), 16);
    var b = parseInt(hexColor.substring(4,6), 16);

    rgbDesc.putDouble(charIDToTypeID("Rd  "), r);
    rgbDesc.putDouble(charIDToTypeID("Grn "), g);
    rgbDesc.putDouble(charIDToTypeID("Bl  "), b);
    
    colorDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), rgbDesc);
    layerDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), colorDesc);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), layerDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
}

function addAdjustmentLayer(typeStr) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(stringIDToTypeID("adjustmentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var classID;
    switch(typeStr) {
        case "curves": classID = charIDToTypeID("Crvs"); break;
        case "hueSaturation": classID = charIDToTypeID("HStr"); break;
        case "vibrance": classID = stringIDToTypeID("vibrance"); break;
        default: classID = charIDToTypeID("Crvs");
    }
    adjDesc.putClass(charIDToTypeID("Type"), classID);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("adjustmentLayer"), adjDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
}

function setLayerLabelColor(colorName) {
    try {
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        desc.putReference(charIDToTypeID("null"), ref);
        var desc2 = new ActionDescriptor();
        var colorID = charIDToTypeID("None");
        switch(colorName) {
            case "red": colorID = charIDToTypeID("Rd  "); break;
            case "yellow": colorID = charIDToTypeID("Ylw "); break;
            case "green": colorID = charIDToTypeID("Grn "); break;
            case "blue": colorID = charIDToTypeID("Bl  "); break;
            case "violet": colorID = charIDToTypeID("Vlt "); break;
            case "gray": colorID = charIDToTypeID("Gry "); break;
        }
        desc2.putEnumerated(charIDToTypeID("Clr "), charIDToTypeID("Clr "), colorID);
        desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), desc2);
        executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    } catch(e) {}
}

function safeMoveToGroup(layer, group) {
    try { layer.move(group, ElementPlacement.INSIDE); } catch(e) {}
}

app.activeDocument.suspendHistory("Estructura Consolidada", "createStructure()");