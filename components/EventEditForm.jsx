var React    = require("react/addons");
var BSInput  = require("react-bootstrap/Input");
var BSAlert  = require("react-bootstrap/Alert");
var actions  = require("actions");
var _        = require("lodash");
var __       = require("language").__;

var EventEditForm = React.createClass({
  // Decided for a one layer linkedState, because much simpler and faster
  // than custom linking and more reliable
  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    event: React.PropTypes.shape({
      name        : React.PropTypes.string,
      type        : React.PropTypes.oneOf(['workshop', 'cashier']),
      startDate   : React.PropTypes.object,
      endDate     : React.PropTypes.object,
      startAmount : React.PropTypes.number,
      endAmount   : React.PropTypes.number
    }).isRequired
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
      name        : this.props.event.name,
      type        : this.props.event.type,
      startDate   : this.props.event.startDate,
      endDate     : this.props.event.endDate,
      startAmount : this.props.event.startAmount,
      endAmount   : this.props.event.endAmount
    }
  },

  render: function () {
    var others = _.omit(this.props, 'event');

    return (
      <div {...others} >
        <BSInput
          type="text"
          label={__("event::name")}
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
        {/*FIXME Datepicker with time */}
        <BSInput
          type="text"
          label={__("event::startDate")}
          valueLink={this.linkState("startDate")}
        />
        {/*FIXME Datepicker with time */}
        <BSInput
          type="text"
          label={__("event::endDate")}
          valueLink={this.linkState("endDate")}
        />
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
