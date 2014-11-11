function getEvents(req, res) {
    var self = this;
    self.getEvents(function (err, events) {
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
