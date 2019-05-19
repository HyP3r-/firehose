$(function () {
    loadList();
    $("#inputHoseNumber, #inputBarcode").change(function () {
        loadList();
    });
});

/**
 * Load list of Hoses
 */
function loadList() {
    var number = $("#inputHoseNumber").val();
    var barcode = $("#inputBarcode").val();
    $.post("/api/link/list", {number: number, barcode: barcode})
        .done(function (data) {
            updateList(data.list);
        })
        .fail(function () {

        });
}

/**
 * Update list
 */
function updateList(list) {
    var listTable = $("#listTable tbody");
    listTable.empty();
    $.each(list, function (index, element) {
        var row = $("<tr/>");
        row.append($("<td/>", {text: element.number}));
        row.append($("<td/>", {text: element.description}));
        row.append($("<td/>", {text: element.hoseType}));
        row.append($("<td/>", {text: element.manufacturer}));
        listTable.append(row);
    });
}