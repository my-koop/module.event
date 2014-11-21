function getEvents(req, res) {
    var self = this;

    var data = {
        isClosed: req.param("isClosed") != 'false'
    };

    self.getEvents(data, function (err, events) {
        if (err) {
            res.error(err);
            return;
        }

        res.send({
            events: events
        });
    });
}
;

module.exports = getEvents;
