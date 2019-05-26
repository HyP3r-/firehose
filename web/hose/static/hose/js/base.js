/**
 * read csrf token
 */
var csrftoken = Cookies.get("csrftoken");

/**
 * check if request has to send an csrf token
 */
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

/**
 * configure ajax
 */
$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});


/**
 * Helper function for post requests
 */
$.each(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS", "CONNECT", "TRACE"], function (index, element) {
    $[element.toLowerCase() + "JSON"] = function (url, data) {
        return jQuery.ajax({
            "type": element,
            "url": url,
            "contentType": "application/json",
            "data": JSON.stringify(data)
        });
    };
});


/**
 * Switch local of moment.js
 */
moment.locale(window.navigator.userLanguage || window.navigator.language);