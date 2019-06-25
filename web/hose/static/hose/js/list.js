var hoseTypes = {},
    hoseManufacturers = {},
    hoseEvents = {},
    dataTable = null;

/**
 * Init Page
 */
$(function () {
    loadHoseManufacturers();
});

/**
 * Load list of Hose Manufacturers
 */
function loadHoseManufacturers() {
    $.get("/api/general/hoseManufacturers"
    ).done(function (data) {
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
    $.get("/api/general/hoseTypes"
    ).done(function (data) {
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
    $.get("/api/general/hoseEvents"
    ).done(function (data) {
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
    $.get("/api/list/hoses", {}
    ).done(function (data) {
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
    $.putJSON("/api/list/hose", {field: element.data("field"), id: element.data("id"), value: _value.value}
    ).done(function () {
        fieldChangedCell(element, "table-success");
    }).fail(function () {
        fieldChangedCell(element, "table-danger");
    });
}

/**
 * Update Table Cell
 */
function fieldChangedCell(element, className) {
    var tr = element.parents("td");
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
 * Load history of a hose and display it
 */
function loadHistory() {
    var button = $(this);
    var id = button.data("id");
    $.postJSON("/api/list/history", {hoseId: id}
    ).done(function (data) {
        var hoseHistory = $("#hoseHistory");
        var hoseHistoryTable = $("#hoseHistoryTable");

        // destroy old table
        if ($.fn.dataTable.isDataTable("#hoseHistoryTable")) {
            hoseHistoryTable.DataTable().destroy();
        }

        // create table
        hoseHistoryTable.DataTable({
            autoWidth: false,
            columns: [
                {
                    data: "date",
                    title: "Datum",
                    render: function (data, type, row, meta) {
                        return moment(data).format("YYYY-MM-DD HH:mm");
                    }
                },
                {
                    data: "description",
                    title: "Beschreibung"
                },
                {
                    className: "align-middle",
                    data: "hoseEvent",
                    title: "Ereignis",
                    render: function (data, type, row, meta) {
                        var span = $("<span/>", {
                            text: hoseEvents[data].name,
                            class: "badge " + hoseEvents[data].status
                        });
                        return span.prop("outerHTML");
                    }
                },
                {
                    data: "user",
                    title: "Benutzer"
                }
            ],
            data: data.hoseHistory,
            paging: false,
            searching: false
        });

        // delete button
        $("#hoseDelete").off().one("click", function () {
            hoseDelete(button.parents("tr"), id);
        });

        hoseHistory.modal("show");
    });
}

/**
 * Delete a hose
 */
function hoseDelete(row, id) {
    var hoseHistory = $("#hoseHistory");
    $.deleteJSON("/api/list/hose", {hoseId: id}
    ).done(function (data) {
        hoseHistory.modal("hide");
        dataTable.row(row).remove().draw();
    });
}

/**
 * Update list
 */
function updateHoses(hoses) {
    var listTable = $("#listTable");
    dataTable = listTable.DataTable({
        autoWidth: false,
        buttons: {
            dom: {
                button: {className: "btn"},
                container: {className: "dt-buttons btn-group align-top mr-2"}
            },
            buttons: [
                {
                    action: function (e, dt, node, config) {
                        // TODO: show modal and so on...
                    },
                    className: "btn-success btn-sm",
                    text: function (dt, button, config) {
                        return dt.i18n("buttons.add", "Add");
                    }
                }
            ]
        },
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
                title: "Verlauf",
                render: function (data, type, row, meta) {
                    var button = $("<button/>", {
                        "data-id": row.id,
                        type: "button",
                        class: "btn btn-dark btn-sm",
                        text: "Verlauf"
                    });
                    return button.prop("outerHTML");
                }
            }
        ],
        createdRow: function (row, data, dataIndex) {
            if (!data.lastAction) {
                return;
            }
            var dateEvent = moment(data.lastAction.date);
            var dateNow = moment();
            if (moment.duration(dateNow.diff(dateEvent)).asYears() > 1) {
                $(row).addClass("table-warning");
            }
        },
        data: hoses,
        drawCallback: function () {
            // bind button handler
            listTable.find("tbody td input,select").change(fieldChanged);
            listTable.find("tbody td button").click(loadHistory);
        },
        initComplete: function (settings, json) {
            // add buttons to the data table
            dataTable.buttons().container().prependTo($(".dataTables_filter", dataTable.table().container()));
        }
    });
}

