// Type definitions for module v0.0.0
// Project: https://github.com/my-koop/service.website
// Definitions by: Michael Ferris <https://github.com/Cellule/>
// Definitions: https://github.com/my-koop/type.definitions

/// <reference path="../mykoop/mykoop.d.ts" />
/// <reference path="./dbQueryStruct.d.ts" />
/// <reference path="./interfaces.d.ts" />

declare module mkevent {

  export interface Module extends mykoop.IModule {
    addEvent(
      updateData: EventInterfaces.AddEventData,
      callback: (err: Error) => void
    );

    getEvents(
      getEventsData: EventInterfaces.GetEventsData,
      callback: (err: Error, result?: Event[]) => void
    );

    updateEvent(
      updateData: EventInterfaces.UpdateEventData,
      callback: (err: Error, result?: boolean) => void
    );

    deleteEvent(
      idEvent : Number,
      callback: (err: Error, result?: boolean) => void
    );

    registerToEvent(
      registerData: EventInterfaces.RegisterEventData,
      callback: (err: Error, result?: {success: boolean}) => void
    );

    getEvent(
      data: EventInterfaces.GetEventData,
      callback: (err: Error, result?: Event) => void
    );

    startEvent(
      params: StartEvent.Params,
      callback: StartEvent.Callback
    );
    __startEvent(
      connection: mysql.IConnection,
      params: StartEvent.Params,
      callback: StartEvent.Callback
    );

    endEvent(
      params: EndEvent.Params,
      callback: EndEvent.Callback
    );
    __endEvent(
      connection: mysql.IConnection,
      params: EndEvent.Params,
      callback: EndEvent.Callback
    );
  }

  export interface Event {
    id          : number;
    name        : string;
    type        : string;
    startDate   : Date;
    endDate     : Date;
    startAmount : number;
    endAmount   : number;
  }

}
