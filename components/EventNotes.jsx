var React = require("react");

var MKNotes = require("mykoop-core/components/Notes");

var __         = require("language").__;
var actions    = require("actions");

var EventNotes = React.createClass({
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
          {__("event::EventNotesTitle")}: #{eventId}
        </h1>
        <MKNotes
          resourceId={eventId}
          retrieveNotesAction={actions.event.notes.list}
          addNoteAction={actions.event.notes.new}
        />
      </div>
    );
  }
});

module.exports = EventNotes;
