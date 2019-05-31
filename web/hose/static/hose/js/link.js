/**
 * Init Page
 */
$(function () {
    controlForm(true);
    loadHoseNumbers();
    $("#buttonLink").click(bindHoseBarcode);
    $("#inputBarcode").on('keypress', function (e) {
        if (e.which === 13) {
            bindHoseBarcode();
        }
    });
});

/**
 * Load list of hose numbers
 */
function loadHoseNumbers() {
    $.get("/api/link/hoseNumbers"
    ).done(function (data) {
        var inputNumber = $("#inputNumber");
        inputNumber.empty();
        $.each(data.hoses, function (index, element) {
            inputNumber.append($("<option/>", {text: element.number, value: element.id}));
        });
        controlForm(false);
    });
}

/**
 * Bind Barcode to Hose
 */
function bindHoseBarcode() {
    var inputNumber = $("#inputNumber");
    var inputBarcode = $("#inputBarcode");
    var buttonLink = $("#buttonLink");

    controlForm(true);
    buttonLink.nextAll().remove();

    $.postJSON("/api/link/bind", {id: inputNumber.val(), barcode: inputBarcode.val()}
    ).done(function (data) {
        buttonLink.after(
            $("<span/>", {class: "badge badge-success align-self-center", text: "Erfolgreich"})
                .hide().fadeIn().delay(2000).fadeOut()
        );
        inputBarcode.val("").focus();
    }).fail(function () {
        buttonLink.after(
            $("<span/>", {class: "badge badge-danger align-self-center", text: "Fehler"})
                .hide().fadeIn().delay(2000).fadeOut()
        );
        inputBarcode.focus().select();
    }).always(function (data, textStatus, jqXHR) {
        controlForm(false);
    });
}

/**
 * Enable and Disable Form
 */
function controlForm(state) {
    $("#content-wrapper input,button,select").prop("disabled", state);
}