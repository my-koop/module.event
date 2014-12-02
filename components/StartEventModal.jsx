var React    = require("react/addons");
var BSButton = require("react-bootstrap/Button");
var BSModal  = require("react-bootstrap/Modal");
var BSInput  = require("react-bootstrap/Input");
var BSAlert  = require("react-bootstrap/Alert");
var actions  = require("actions");
var __       = require("language").__;
var _        = require("lodash");
var MKAlertTrigger    = require("mykoop-core/components/AlertTrigger");


var StartEventModal = React.createClass({
  // Decided for a one layer linkedState, because much simpler and faster
  // than custom linking and more reliable
  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    event: React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      name: React.PropTypes.string.isRequired,
    }).isRequired,
    onSave: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      errorMessage: null
    }
  },

  onSave: function (hideFnc) {
    var self = this;
    actions.event.start({
      data:{
        id : this.props.event.id,
        startAmount : this.state.startAmount
      }
    }, function (err, res) {
      if (err) {
        console.error(err);
        self.setState({
          errorMessage: __("event::eventStartFailed")
        });
        return;
      }

      self.setState({errorMessage: null});
      MKAlertTrigger.showAlert(__("event::eventStarted"));
      hideFnc();
      self.props.onSave && self.props.onSave();
    });
  },

  render: function () {
    var self = this;
    return this.transferPropsTo(
      <BSModal
        title={__("event::startEvent") + " " + this.props.event.name}
        bsSize="small"
        backdrop="static"
      >
        <div className="modal-body">
          {this.state.errorMessage ?
            <BSAlert bsStyle="danger">
              {this.state.errorMessage}
            </BSAlert>
          : null}
          <BSInput
            type="number"
            label={__("event::startAmount")}
            valueLink={this.linkState("startAmount")}
          />
        </div>
        <div className="modal-footer">
          <BSButton
            onClick={self.onSave.bind(self, this.props.onRequestHide)}
            bsStyle="success"
          >
            {__("start")}
          </BSButton>
          <BSButton
            type="close"
            onClick={this.props.onRequestHide}
            bsStyle="danger"
          >
            {__("cancel")}
          </BSButton>
        </div>
      </BSModal>
    );
  }
});

module.exports = StartEventModal;
