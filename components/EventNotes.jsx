var React = require("react");

var MKPermissionMixin = require("mykoop-user/components/PermissionMixin");
var MKNotes = require("mykoop-core/components/Notes");

var __         = require("language").__;
var actions    = require("actions");

var EventNotes = React.createClass({
  mixins: [MKPermissionMixin],

  getDefaultProps: function() {
    return {
      params: {}
    }
  },

  render: function () {
    var eventId = parseInt(this.props.params.id);
    return (
      <div>
        <h1>
          {__("event::eventNotesTitle")}: #{eventId}
        </h1>
        <MKNotes
          resourceId={eventId}
          retrieveNotesAction={actions.event.notes.list}
          addNoteAction={actions.event.notes.new}
          readOnly={!this.constructor.validateUserPermissions({
            events: {
              notes: {
                edit: true
              }
            }
          })}
        />
      </div>
    );
  }
});

module.exports = EventNotes;
