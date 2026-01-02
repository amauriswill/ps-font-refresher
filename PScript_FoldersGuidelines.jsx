#target photoshop

// =========================================================================
// SCRIPT: REPLICAR ESTRUCTURA "RODANDO" (CORREGIDO)
// =========================================================================

// Configuración
var MARGIN = 100;

function createStructure() {
    if (app.documents.length === 0) {
        alert("❌ Por favor, abre un documento primero.");
        return;
    }

    var doc = app.activeDocument;
    
    // Guardar estado original
    var originalRuler = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.PIXELS;
    app.preferences.typeUnits = TypeUnits.PIXELS;

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
        grpAdjust.name = "ADJUSMENTS"; // Tal cual tu captura
        setLayerLabelColor("green"); // Función auxiliar

        // Para que las capas queden en el orden visual correcto (1 abajo, 3 arriba),
        // las creamos en orden inverso (1, luego 2, luego 3) porque PS apila hacia arriba.
        
        // --- Capa 1: Color e intensidad (Vibrance) ---
        addAdjustmentLayer("vibrance"); 
        doc.activeLayer.name = "Color e intensidad 1";
        // Mover dentro del grupo si quedó fuera
        safeMoveToGroup(doc.activeLayer, grpAdjust);

        // --- Capa 2: Tono/saturación ---
        addAdjustmentLayer("hueSaturation");
        doc.activeLayer.name = "Tono/saturación 2";
        safeMoveToGroup(doc.activeLayer, grpAdjust);

        // --- Capa 3: Curvas ---
        addAdjustmentLayer("curves");
        doc.activeLayer.name = "Curvas 3";
        safeMoveToGroup(doc.activeLayer, grpAdjust);

        // -----------------------------------------------------------------
        // 3. GRUPO: txt_PRICE (Amarillo)
        // -----------------------------------------------------------------
        // Deseleccionar para crear grupo nuevo fuera de adjustments
        doc.activeLayer = grpAdjust;
        
        var grpPrice = doc.layerSets.add();
        grpPrice.name = "txt_PRICE";
        grpPrice.move(grpAdjust, ElementPlacement.PLACEAFTER);
        setLayerLabelColor("yellow");

        // Texto: DESDE...
        var layerPrice = grpPrice.artLayers.add();
        layerPrice.kind = LayerKind.TEXT;
        layerPrice.name = "DESDE US$47,900";
        layerPrice.textItem.contents = "DESDE US$47,900";
        layerPrice.textItem.size = 40;
        layerPrice.textItem.position = [doc.width.value - MARGIN - 300, doc.height.value - MARGIN - 50];

        // Grupo 8
        var grp8 = grpPrice.layerSets.add();
        grp8.name = "Grupo 8";

        // -----------------------------------------------------------------
        // 4. CAPA: Relleno generativo 2 copia
        // -----------------------------------------------------------------
        var layerGenCopy = doc.artLayers.add();
        layerGenCopy.name = "Relleno generativo 2 copia";
        layerGenCopy.move(grpPrice, ElementPlacement.PLACEAFTER);
        // Relleno gris para simular
        doc.selection.selectAll();
        var gray = new SolidColor(); gray.rgb.hexValue = "888888";
        doc.selection.fill(gray);
        doc.selection.deselect();

        // -----------------------------------------------------------------
        // 5. GRUPO: Txt_RODANDO (Amarillo)
        // -----------------------------------------------------------------
        var grpRodando = doc.layerSets.add();
        grpRodando.name = "Txt_RODANDO";
        grpRodando.move(layerGenCopy, ElementPlacement.PLACEAFTER);
        setLayerLabelColor("yellow");

        // Texto: AGARRA el año
        var layerAgarra = grpRodando.artLayers.add();
        layerAgarra.kind = LayerKind.TEXT;
        layerAgarra.name = "AGARRA el año";
        layerAgarra.textItem.contents = "AGARRA el año";
        layerAgarra.textItem.size = 60;
        layerAgarra.textItem.position = [MARGIN, MARGIN + 150];

        // Texto: rodando
        var layerRodando = grpRodando.artLayers.add();
        layerRodando.kind = LayerKind.TEXT;
        layerRodando.name = "rodando";
        layerRodando.textItem.contents = "rodando";
        layerRodando.textItem.size = 120;
        layerRodando.textItem.position = [MARGIN, MARGIN + 100];

        // -----------------------------------------------------------------
        // 6. CAPA: Relleno generativo 2 (Fondo)
        // -----------------------------------------------------------------
        var layerGen = doc.artLayers.add();
        layerGen.name = "Relleno generativo 2";
        layerGen.move(grpRodando, ElementPlacement.PLACEAFTER);
        // Relleno oscuro
        doc.selection.selectAll();
        var dark = new SolidColor(); dark.rgb.hexValue = "222222";
        doc.selection.fill(dark);
        doc.selection.deselect();
        
        alert("✅ Estructura creada correctamente.");

    } catch(e) {
        alert("Error: " + e.message + "\nLínea: " + e.line);
    } finally {
        app.preferences.rulerUnits = originalRuler;
    }
}

// --- FUNCIONES AUXILIARES ---

// Crea capa de ajuste usando ActionManager (Evita Error 8193)
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

// Colorea la etiqueta de la capa activa
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
        }
        
        desc2.putEnumerated(charIDToTypeID("Clr "), charIDToTypeID("Clr "), colorID);
        desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), desc2);
        executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    } catch(e) {}
}

// Mueve capa dentro de grupo si no está ya ahí (Helper seguro)
function safeMoveToGroup(layer, group) {
    try {
        layer.move(group, ElementPlacement.INSIDE);
    } catch(e) {
        // Si falla suele ser porque ya está dentro o es la capa activa
    }
}

// Ejecutar
app.activeDocument.suspendHistory("Estructura Rodando Final", "createStructure()");