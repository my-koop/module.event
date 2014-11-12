var getLogger = require("mykoop-logger");
var logger = getLogger(module);

function deleteEvent(req, res) {
    var self = this;
    var idEvent = parseInt(req.param("id"));
    self.deleteEvent(idEvent, function (err) {
        if (err) {
            return res.error(err);
        }

        res.end();
    });
}
;

module.exports = deleteEvent;
