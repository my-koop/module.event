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
      callback: (err: Error, result?: Event[]) => void
    );

    updateEvent(
      updateData: EventInterfaces.AddEventData,
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
  }

  export interface Event {
    id: number;
    name: string;
    type: string;
    startDate : Date;
    endDate : Date;
    startAmount : number;
    endAmount : number;
  }

}
