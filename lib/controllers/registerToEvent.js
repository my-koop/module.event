var getLogger = require("mykoop-logger");
var logger = getLogger(module);

function registerToEvent(req, res) {
    var self = this;
    var data = {
        idUser: Number(req.param("idUser")),
        idEvent: Number(req.param("idEvent")),
        registered: true
    };

    self.registerToEvent(data, function (err) {
        if (err) {
            logger.error(err);
            return res.error(err);
        }

        res.end();
    });
}
;

module.exports = registerToEvent;
