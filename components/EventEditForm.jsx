var React             = require("react/addons");
var BSInput           = require("react-bootstrap/Input");
var MKDateTimePicker  = require("mykoop-core/components/DateTimePicker");
var MKAlertTrigger    = require("mykoop-core/components/AlertTrigger");
var actions           = require("actions");
var _                 = require("lodash");
var __                = require("language").__;
var formatDate        = require("language").formatDate;

var EventEditForm = React.createClass({
  // Decided for a one layer linkedState, because much simpler and faster
  // than custom linking and more reliable
  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    id : React.PropTypes.number
  },

  getEvent: function() {
    return {
      name        : this.state.name,
      type        : this.state.type,
      startDate   : this.state.startDate,
      endDate     : this.state.endDate,
      startAmount : this.state.startAmount,
      endAmount   : this.state.endAmount
    }
  },

  getInitialState: function() {
    return {
      id : this.props.id,
      type: "cashier",
      event: null
    }
  },

  componentWillMount: function() {
    var self = this;

    actions.event.get({
      data: {
        id : 271 //FIXME : Get the id that is passed...
      }
    }, function (err, res) {
      if (err) {
        MKAlertTrigger.showAlert(__("errors::error", {context: err.context}));
        console.error(err);
        return;
      }

      self.setState({event: res.event}); //FIX ME : Not returning the event (getting undefined)
      console.log("Name : " + event.name)
    });
  },

  render: function () {
    var self = this;
    var others = _.omit(this.props, 'event');

    return (
      <div {...others} >
        <BSInput
          type="text"
          label={__("name")}
          valueLink={this.linkState("name")}
        />
        <BSInput
          type="select"
          defaultValue="cashier"
          label={__("event::type")}
          valueLink={this.linkState("type")}
        >
          <option value="workshop">{__("event::workshop")}</option>
          <option value="cashier">{__("event::cashier")}</option>
        </BSInput>
        <label>
          {__("event::startDate")}
          <MKDateTimePicker
            onChange={function(date, str) {
              self.setState({
                startDate: str
              });
            }}
          />
        </label>
        <label>
          {__("event::endDate")}
          <MKDateTimePicker
            onChange={function(date, str) {
              self.setState({
                endDate: str
              });
            }}
          />
        </label>
        <BSInput
          type="number"
          label={__("event::startAmount")}
          valueLink={this.linkState("startAmount")}
        />
        <BSInput
          type="number"
          label={__("event::endAmount")}
          valueLink={this.linkState("endAmount")}
        />
      </div>
    );
  }
});

module.exports = EventEditForm;
