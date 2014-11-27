var Event = (function () {
    function Event(row) {
        this.id = Number(row.idEvent);
        this.name = row.name;
        this.type = row.type;
        this.startDate = row.startDate;
        this.endDate = row.endDate;
        this.startAmount = row.startAmount ? Number(row.startAmount) : null;
        ;
        this.endAmount = row.endAmount ? Number(row.endAmount) : null;
        this.countRegistered = Number(row.countRegistered) || 0;
    }
    Event.COLUMNS_DB = ["idEvent", "name", "type", "startDate", "endDate", "startAmount", "endAmount"];
    return Event;
})();
module.exports = Event;
