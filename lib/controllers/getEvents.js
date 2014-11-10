function getEvents(req, res) {
    var self = this;
    self.getEvents(function (err, events) {
        if (err) {
            res.send(500);
            return;
        }

        res.send({
            events: events
        });
    });
}
;

module.exports = getEvents;
