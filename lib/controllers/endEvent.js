var getLogger = require("mykoop-logger");
var logger = getLogger(module);
function endEvent(req, res) {
    var self = this;
    var idEvent = Number(req.param("id"));
    var endAmount = Number(req.param("endAmount"));
    self.endEvent(idEvent, endAmount, function (err) {
        if (err) {
            return res.error(err);
        }
        res.end();
    });
}
;
module.exports = endEvent;
