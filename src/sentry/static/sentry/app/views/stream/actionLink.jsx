import Modal from "react-bootstrap/Modal";
import OverlayMixin from "react-bootstrap/OverlayMixin";
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
import React from "react";
import SelectedGroupStore from "../../stores/selectedGroupStore";
import TooltipMixin from "../../mixins/tooltip";

var ActionLink = React.createClass({
  mixins: [
    OverlayMixin, PureRenderMixin,
    TooltipMixin({
      html: false,
      container: 'body'
    })
  ],

  propTypes: {
    actionLabel: React.PropTypes.string,
    groupIds: React.PropTypes.instanceOf(Array).isRequired,
    canActionAll: React.PropTypes.bool.isRequired,
    confirmLabel: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    neverConfirm: React.PropTypes.bool,
    onAction: React.PropTypes.func.isRequired,
    onlyIfBulk: React.PropTypes.bool,
    selectAllActive: React.PropTypes.bool.isRequired
  },

  getDefaultProps() {
    return {
      actionTypes: {},
      buttonTitle: null, // title="..." (optional)
      confirmLabel: 'Edit',
      onlyIfBulk: false,
      neverConfirm: false,
      disabled: false
    };
  },

  getInitialState() {
    return {
      isModalOpen: false
    };
  },

  handleToggle() {
    if (this.props.disabled) {
      return;
    }
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },

  handleActionAll(evt) {
    this.props.onAction(evt, this.props.actionTypes.ALL);
    this.setState({
      isModalOpen: false
    });
  },

  handleActionSelected(evt) {
    this.props.onAction(evt, this.props.actionTypes.SELECTED);
    this.setState({
      isModalOpen: false
    });
  },

  defaultActionLabel(confirmLabel) {
    return confirmLabel.toLowerCase() + ' these {count} events';
  },

  render() {
    var className = this.props.className;
    if (this.props.disabled) {
      className += ' disabled';
    }
    className += ' tip';
    return (
      <a title={this.props.tooltip || this.props.buttonTitle}
         className={className}
         disabled={this.props.disabled}
         onClick={this.handleToggle}>
        {this.props.children}
      </a>
    );
  },

  shouldConfirm(numSelectedItems) {
    // By default, should confirm ...
    var shouldConfirm = true;

    // Unless `neverConfirm` is true, then return false
    if (this.props.neverConfirm === true) {
      shouldConfirm = false;

    // Unless `onlyIfBulk` is true, then return false if all items are not selected
    } else if (this.props.onlyIfBulk === true && (!this.props.selectAllActive || numSelectedItems === 1)) {
      shouldConfirm = false;
    }

    return shouldConfirm;
  },

  renderOverlay() {
    if (!this.state.isModalOpen) {
      return null;
    }

    var selectedItemIds = SelectedGroupStore.getSelectedIds();
    if (selectedItemIds.size === 0) {
      throw new Error('ActionModal rendered without any selected groups');
    }

    if (!this.shouldConfirm(selectedItemIds.size)) {
      this.handleActionSelected();
      this.state.isModalOpen = false;
      return null;
    }

    var confirmLabel = this.props.confirmLabel;
    var actionLabel = this.props.actionLabel || this.defaultActionLabel(confirmLabel);
    var numEvents = selectedItemIds.size;

    actionLabel = actionLabel.replace('{count}', numEvents);

    return (
      <Modal title="Please confirm" animation={false} onRequestHide={this.handleToggle}>
        <div className="modal-body">
          <p><strong>Are you sure that you want to {actionLabel}?</strong></p>
          <p>This action cannot be undone.</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default"
                  onClick={this.handleToggle}>Cancel</button>
          {this.props.canActionAll &&
            <button type="button" className="btn btn-danger"
                    onClick={this.handleActionAll}>{confirmLabel} all recorded events</button>
          }
          <button type="button" className="btn btn-primary"
                  onClick={this.handleActionSelected}>{confirmLabel} {numEvents} selected events</button>
        </div>
      </Modal>
    );
  }
});

export default ActionLink;

