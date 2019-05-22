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
 * bind jquery ajax request to pace
 */
window.paceOptions = {
    restartOnRequestAfter: 50,
    ajax: {
        trackMethods: ["GET", "POST"]
    }
};