var Event = (function () {
    function Event(row) {
        this.id = Number(row.id);
        this.name = row.name;
        this.type = row.type;
        this.startDate = row.startDate;
        this.endDate = row.endDate;
        this.startAmount = Number(row.startAmount) || 0.00;
        this.endAmount = Number(row.endAmount) || 0.00;
    }
    Event.COLUMNS_DB = ["id", "type", "startDate", "endDate", "startAmount", "endAmount"];
    return Event;
})();

module.exports = Event;
