var hoseEvents = {};

/**
 * Init Page
 */
$(function () {
    controlForm(true);
    loadHoseEvents();
    $("#inputDate").val(moment().format("YYYY-MM-DD"));
    $("#inputTime").val(moment().format("HH:mm"));
    $("#buttonCheck").click(check);
});

/**
 * Load list of Hose Types
 */
function loadHoseEvents() {
    $.get("/api/general/hoseEvents"
    ).done(function (data) {
        $.each(data.hoseEvents, function (index, element) {
            hoseEvents[element.id] = element;
        });
        updateEvents();
        controlForm(false);
    });
}

/**
 * Update list of events
 */
function updateEvents() {
    var inputEvent = $("#inputEvent");
    inputEvent.empty();
    $.each(hoseEvents, function (key, value) {
        inputEvent.append($("<option/>", {"text": value.name, "value": key, "class": value.status}));
    })
}

/**
 *
 */
function check() {
    var inputBarcodes = $("#inputBarcodes");
    var inputEvent = $("#inputEvent");
    var inputDescription = $("#inputDescription");
    var inputDate = $("#inputDate");
    var inputTime = $("#inputTime");
    var buttonCheck = $("#buttonCheck");

    controlForm(true);
    buttonCheck.nextAll().remove();

    $.postJSON("/api/list/check", {
            barcodes: inputBarcodes.val().split("\n"),
            date: moment(inputDate.val() + " " + inputTime.val()).toISOString(),
            description: inputDescription.val(),
            hoseEventId: inputEvent.val()
        }
    ).done(function (data) {
        var barcodesFail = "";
        var barcodesSuccess = "";

        $.each(data.status, function (index, element) {
            if (element.status !== 0) {
                barcodesFail += element.barcode + "\n";
            } else {
                barcodesSuccess += element.barcode + "\n";
            }
        });

        inputBarcodes.val(barcodesFail.trim());

        if (barcodesFail) {
            buttonCheck.after($("<span/>", {
                class: "badge badge-danger align-self-center mr-2",
                text: "Fehlerhaft: " + barcodesFail
            }));
        }
        if (barcodesSuccess) {
            buttonCheck.after($("<span/>", {
                class: "badge badge-success align-self-center mr-2",
                text: "Erfolgreich: " + barcodesSuccess
            }));
        }
    }).fail(function () {
    }).always(function (data, textStatus, jqXHR) {
        controlForm(false);
    });
}

/**
 * Enable and Disable Form
 */
function controlForm(state) {
    $("#content-wrapper input,button,select,textarea").prop("disabled", state);
}