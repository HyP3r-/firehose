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
$.postJSON = function (url, data) {
    return jQuery.ajax({
        "type": "POST",
        "url": url,
        "contentType": "application/json",
        "data": JSON.stringify(data)
    });
};