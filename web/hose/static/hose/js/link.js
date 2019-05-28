/**
 * Init Page
 */
$(function () {
    loadHoseNumbers();
    $("#buttonLink").click(bindHoseBarcode)
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
    });
}

/**
 * Bind Barcode to Hose
 */
function bindHoseBarcode() {
    var inputNumber = $("#inputNumber");
    var inputBarcode = $("#inputBarcode");
    var buttonLink = $("#buttonLink");
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
    });
}