var getLogger = require("mykoop-logger");
var logger = getLogger(module);

function addEvent(req, res) {
    var self = this;
    var data = {
        type: req.param("type"),
        startDate: new Date(req.param("startDate")),
        endDate: new Date(req.param("endDate") || null),
        startAmount: parseFloat(req.param("startAmount")) || null,
        endAmount: parseFloat(req.param("endAmount")) || null
    };

    self.addEvent(data, function (err) {
        if (err) {
            logger.error(err);
            return res.error(err);
        }

        res.end();
    });
}
;

module.exports = addEvent;
