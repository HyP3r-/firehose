var hoseTypes = null;
var hoseManufacturers = null;
var hoseEvents = null;

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
 * Update list
 */
function updateHoses(hoses) {
    var listTable = $("#listTable");

    function createSelect(row, data, values, id) {
        var div = $("<div/>", {class: "input-group"});
        var select = $("<select/>", {id: id + "-" + row.id, value: data, class: "custom-select"});
        $.each(values, function (index, element) {
            var option = $("<option/>", {text: element.name, value: element.id});
            if (data === element.id) {
                option.attr("selected", "selected");
            }
            select.append(option);
        });
        div.append(select);
        return div.prop("outerHTML");
    }

    function createInput(row, data, id, placeholder, append) {
        var div = $("<div/>", {class: "input-group"});
        var input = $("<input/>", {
            id: id + "-" + row.id,
            value: data,
            type: "text",
            placeholder: placeholder,
            class: "form-control"
        });
        div.append(input);
        if (append) {
            div.append(
                $("<div/>", {"class": "input-group-append"}).append(
                    $("<span/>", {"class": "input-group-text"}).text("m")
                )
            );
        }
        return div.prop("outerHTML");
    }

    listTable.DataTable({
        autoWidth: false,
        data: hoses,
        columns: [
            {
                className: "align-middle font-weight-bold",
                data: "number",
                title: "Schlauch Nummer"
            },
            {
                data: "hoseType",
                title: "Schlauch Typ",
                render: function (data, type, row, meta) {
                    return createSelect(row, data, hoseTypes, "hoseTypes");
                }
            },
            {
                data: "length",
                title: "Länge",
                render: function (data, type, row, meta) {
                    return createInput(row, data, "buildYear", "Baujahr", "m");
                }
            },
            {
                data: "description",
                title: "Beschreibung",
                render: function (data, type, row, meta) {
                    return createInput(row, data, "description", "Beschreibung");
                }
            },
            {
                data: "manufacturer",
                title: "Hersteller",
                render: function (data, type, row, meta) {
                    return createSelect(row, data, hoseManufacturers, "hoseManufacturers");
                }
            },
            {
                data: "buildYear",
                title: "Baujahr",
                render: function (data, type, row, meta) {
                    return createInput(row, data, "buildYear", "Baujahr");
                }
            },
            {
                data: "barcode",
                title: "Barcode",
                render: function (data, type, row, meta) {
                    return createInput(row, data, "barcode", "Barcode");
                }
            },
            {
                data: "",
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

