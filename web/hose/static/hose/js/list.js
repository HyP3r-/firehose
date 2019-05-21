var hoseTypes = {},
    hoseManufacturers = {},
    hoseEvents = {},
    dataTable = null;

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
            $.each(data.hoseManufacturers, function (index, element) {
                hoseManufacturers[element.id] = element;
            });
            loadHoseTypes();
        });
}

/**
 * Load list of Hose Types
 */
function loadHoseTypes() {
    $.get("/api/list/hoseTypes")
        .done(function (data) {
            $.each(data.hoseTypes, function (index, element) {
                hoseTypes[element.id] = element;
            });
            loadHoseEvents();
        });
}

/**
 * Load list of Hose Types
 */
function loadHoseEvents() {
    $.get("/api/list/hoseEvents")
        .done(function (data) {
            hoseEvents = data.hoseEvents;
            loadHoses();
        });
}

/**
 * Load list of Hoses
 */
function loadHoses() {
    $.get("/api/list/hoses", {})
        .done(function (data) {
            updateHoses(data.hoses);
        });
}

/**
 * Create Select for UI
 */
function createSelect(data, type, row, meta, field, classes, values) {
    if (type !== "display") {
        return data in values ? values[data].name : "";
    }

    // create select
    var div = $("<div/>", {class: "input-group input-group-sm flex-nowrap"});
    var select = $("<select/>", {
        "data-field": field,
        "data-id": row.id,
        class: "custom-select " + classes.join(" "),
        value: data
    });

    // add fields
    $.each(values, function (key, value) {
        var option = $("<option/>", {text: value.name, value: value.id});
        if (data === value.id) {
            option.attr("selected", "selected");
        }
        select.append(option);
    });
    div.append(select);

    return div.prop("outerHTML");
}

/**
 * Create Input for UI
 */
function createInput(data, type, row, meta, field, width, classes, placeholder, appendText) {
    if (type !== "display") {
        return data;
    }

    // create input
    var _width = width ? width : "inherit";
    var div = $("<div/>", {class: "input-group input-group-sm flex-nowrap", style: "width: " + _width});
    var input = $("<input/>", {
        "data-field": field,
        "data-id": row.id,
        class: "form-control " + classes.join(" "),
        placeholder: placeholder,
        type: "text",
        value: data
    });
    div.append(input);

    // append text
    if (appendText) {
        var spanAppend = $("<span/>", {class: "input-group-text", text: appendText});
        var divAppend = $("<div/>", {class: "input-group-append"});
        divAppend.append(spanAppend);
        div.append(divAppend);
    }

    return div.prop("outerHTML");
}

/**
 * Process field change
 */
function fieldChanged() {
    var element = $(this);
    $.post("/api/list/fieldUpdate", {field: element.data("field"), id: element.data("id"), value: element.val()})
        .done(function () {
            fieldChangedCell(element, "table-success");
        })
        .fail(function () {
            fieldChangedCell(element, "table-danger");
        });
}

/**
 * Update Table Cell
 */
function fieldChangedCell(element, className) {
    var tr = element.closest("td");
    tr.addClass(className);
    setTimeout(function () {
        tr.toggleClass(className);
    }, 3000);
}

/**
 * Update list
 */
function updateHoses(hoses) {
    var listTable = $("#listTable");
    dataTable = listTable.DataTable({
        drawCallback: function () {
            listTable.find("tbody td input,select").change(fieldChanged);
        },
        autoWidth: false,
        data: hoses,
        columns: [
            {
                className: "align-middle font-weight-bold",
                data: "number",
                title: "Schlauch Nummer"
            },
            {
                data: "hoseTypeId",
                title: "Schlauch Typ",
                render: function (data, type, row, meta) {
                    return createSelect(data, type, row, meta, "hoseTypeId", ["text-center"], hoseTypes);
                }
            },
            {
                data: "length",
                title: "Länge",
                render: function (data, type, row, meta) {
                    return createInput(data, type, row, meta, "buildYear", "6em", ["text-center"], "Baujahr", "m");
                }
            },
            {
                data: "description",
                title: "Beschreibung",
                render: function (data, type, row, meta) {
                    return createInput(data, type, row, meta, "description", undefined, [], "Beschreibung");
                }
            },
            {
                data: "hoseManufacturerId",
                title: "Hersteller",
                render: function (data, type, row, meta) {
                    return createSelect(data, type, row, meta, "hoseManufacturerId", [], hoseManufacturers);
                }
            },
            {
                data: "buildYear",
                title: "Baujahr",
                render: function (data, type, row, meta) {
                    return createInput(data, type, row, meta, "buildYear", "5em", ["text-center"], "Baujahr");
                }
            },
            {
                data: "barcode",
                title: "Barcode",
                render: function (data, type, row, meta) {
                    return createInput(data, type, row, meta, "barcode", "6em", ["text-center"], "Barcode");
                }
            },
            {
                /*data: "",*/
                title: "Letzte Aktion"
            },
            {
                className: "align-middle",
                title: "Details",
                render: function (data, type, row, meta) {
                    var button = $("<button/>", {type: "button", class: "btn btn-success btn-sm", text: "Details"});
                    return button.prop("outerHTML");
                }
            }
        ]
    });
}

