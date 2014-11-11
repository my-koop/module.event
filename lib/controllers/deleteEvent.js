var getLogger = require("mykoop-logger");
var logger = getLogger(module);

function deleteEvent(req, res) {
    var self = this;
    var idEvent = parseInt(req.param("id"));
    self.deleteEvent(idEvent, function (err) {
        if (err) {
            logger.error(err);
            return res.sendStatus(500);
        }

        res.end();
    });
}
;

module.exports = deleteEvent;
