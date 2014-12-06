var Event = (function () {
    function Event(row) {
        this.id = parseInt(row.idEvent);
        this.name = row.name;
        this.type = row.type;
        this.startDate = row.startDate;
        this.endDate = row.endDate;
        this.startAmount = parseFloat(row.startAmount);
        if (isNaN(this.startAmount)) {
            this.startAmount = null;
        }
        this.endAmount = parseFloat(row.endAmount);
        if (isNaN(this.endAmount)) {
            this.endAmount = null;
        }
        this.countRegistered = parseInt(row.countRegistered) || 0;
        this.description = row.description;
    }
    Event.COLUMNS_DB = [
        "idEvent",
        "name",
        "type",
        "startDate",
        "endDate",
        "startAmount",
        "endAmount",
        "description"
    ];
    return Event;
})();
module.exports = Event;
