var hoseTypes = null;
var hoseManufacturers = null;

/**
 * Init Page
 */
$(function () {
    loadHoseManufacturers();
    $("#inputHoseNumber, #inputBarcode").change(function () {
        loadHoses();
    });
});

/**
 * Load list of Hose Manufacturers
 */
function loadHoseManufacturers() {
    $.get("/api/list/hoseManufacturers")
        .done(function (data) {
            hoseManufacturers = data.hoseManufacturers;
            loadHoseTypes();
        });
}

/**
 * Load list of Hose Types
 */
function loadHoseTypes() {
    $.get("/api/list/hoseTypes")
        .done(function (data) {
            hoseTypes = data.hoseTypes;
            loadHoses();
        });
}

/**
 * Load list of Hoses
 */
function loadHoses() {
    var number = $("#inputHoseNumber").val();
    var barcode = $("#inputBarcode").val();
    $.post("/api/list/hoses", {number: number, barcode: barcode})
        .done(function (data) {
            updateHoses(data.hoses);
        });
}

/**
 * Update list
 */
function updateHoses(hoses) {
    var listTable = $("#listTable");

    listTable.DataTable({
        data: hoses,
        columns: [
            {
                data: "number",
                title: "Schlauch Nummer"
            },
            {
                data: "hoseType",
                title: "Schlauch Typ"
            },
            {
                data: "length",
                title: "Länge",
                render: function (data, type, row, meta) {
                    return data + " m";
                }
            },
            {
                data: "description",
                title: "Beschreibung"
            },
            {
                data: "manufacturer",
                title: "Hersteller"
            },
            {
                data: "buildYear",
                title: "Baujahr"
            },
            {
                data: "",
                title: "Letzte Aktion"
            },
            {
                data: "",
                title: "Details"
            }
        ]
    });
}

