var getLogger = require("mykoop-logger");
var logger = getLogger(module);
function startEvent(req, res) {
    var self = this;
    var idEvent = Number(req.param("id"));
    var startAmount = Number(req.param("startAmount"));
    self.startEvent(idEvent, startAmount, function (err) {
        if (err) {
            return res.error(err);
        }
        res.end();
    });
}
;
module.exports = startEvent;
