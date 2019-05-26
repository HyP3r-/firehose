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
            $.each(data.hoseEvents, function (index, element) {
                hoseEvents[element.id] = element;
            });
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
function createInput(data, type, row, meta, field, width, classes, placeholder, fieldType, appendText) {
    if (type !== "display") {
        return data;
    }

    // create input
    var _width = width ? width : "inherit";
    var div = $("<div/>", {class: "input-group input-group-sm flex-nowrap", style: "width: " + _width});
    var input = $("<input/>", {
        "data-field": field,
        "data-id": row.id,
        "data-type": fieldType,
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

var fieldTypeMapping = {
    "int": function (value) {
        var _value = parseInt(value);
        return {result: !isNaN(_value), value: _value};
    },
    "float": function (value) {
        var _value = parseFloat(value);
        return {result: !isNaN(_value), value: _value};
    },
    "string": function (value) {
        return {result: true, value: value + ""};
    }
};

/**
 * Process field change
 */
function fieldChanged() {
    var element = $(this);
    var value = element.val();
    var fieldType = element.data("type");
    var _value;

    // try to parse the field
    if (fieldType) {
        _value = fieldTypeMapping[fieldType](value);
    } else {
        _value = {result: true, value: value}
    }

    // display error
    if (!_value.result) {
        fieldChangedCell(element, "table-danger");
        return;
    }

    // send to server
    $.postJSON("/api/list/fieldUpdate", {field: element.data("field"), id: element.data("id"), value: _value.value})
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
    var timeout = element.data("timeout");
    if (timeout) {
        clearTimeout(timeout);
    }
    tr.addClass(className);
    timeout = setTimeout(function () {
        tr.toggleClass(className);
    }, 3000);
    element.data("timeout", timeout);
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
                    return createInput(data, type, row, meta, "buildYear", "6em", ["text-center"], "Baujahr", "float", "m");
                }
            },
            {
                data: "description",
                title: "Beschreibung",
                render: function (data, type, row, meta) {
                    return createInput(data, type, row, meta, "description", undefined, [], "Beschreibung", "string");
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
                    return createInput(data, type, row, meta, "buildYear", "5em", ["text-center"], "Baujahr", "int");
                }
            },
            {
                data: "barcode",
                title: "Barcode",
                render: function (data, type, row, meta) {
                    return createInput(data, type, row, meta, "barcode", "6em", ["text-center"], "Barcode", "int");
                }
            },
            {
                data: "lastAction",
                title: "Letzte Aktion",
                render: function (data, type, row, meta) {
                    var text;
                    if (data) {
                        text = moment(data.date).format("YYYY-MM-DD HH:mm") + " " + hoseEvents[data.hoseEventId].name;
                    } else {
                        text = "Keine letzte Aktion";
                    }

                    if (type !== "display") {
                        return text;
                    }

                    var param = {text: text};
                    if (data) {
                        param.class = "badge " + hoseEvents[data.hoseEventId].status;
                    } else {
                        param.class = "badge badge-secondary"
                    }

                    return $("<span/>", param).prop("outerHTML");
                }
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

