class Event implements mkevent.Event {
  public static COLUMNS_DB = ["idEvent", "name", "type", "startDate", "endDate", "startAmount", "endAmount"];
  public  id              : number;
  public  name            : string;
  public  type            : string;
  public  startDate       : Date;
  public  endDate         : Date;
  public  startAmount     : number;
  public  endAmount       : number;
  public  countRegistered : number;

  constructor(row: any) {
    this.id = parseInt(row.idEvent);
    this.name = row.name;
    this.type = row.type;
    this.startDate = row.startDate;
    this.endDate = row.endDate;
    this.startAmount = parseFloat(row.startAmount);
    if(isNaN(this.startAmount)) {
      this.startAmount = null;
    }
    this.endAmount = parseFloat(row.endAmount);
    if(isNaN(this.endAmount)) {
      this.endAmount = null;
    }
    this.countRegistered = parseInt(row.countRegistered) || 0;
  }
}

export = Event;
