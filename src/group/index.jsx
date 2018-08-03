import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class Group extends Component {
  /**
   * @param props
   */
  constructor(props) {
    super(props);

    /**
     * @type {{open: *}}
     */
    this.state = {
      open: props.open,
    };

    this.handleToggle = this.handleToggle.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * @return {*}
   */
  render() {
    const { open } = this.state;
    const {
      label,
      children,
      className,
      openClass,
      openStyle,
      style,
      disabled,
      ...rest,
    } = this.props;

    const props = {
      ...rest,
      className: classnames(className, { [openClass]: open }),
      style: { ...style, ...(open ? openStyle : {}) },
    };

    if (!open) {
      props.onDoubleClick = this.handleClick;
    }

    return (
      <div {...props}>
        {!disabled && <span onClick={this.handleToggle} className="ms--toggle-open" />}
        {label}
        {!disabled && open && (
          <div>
            {children}
          </div>
        )}
      </div>
    );
  }

  /**
   * @param e
   */
  handleToggle(e) {
    e.preventDefault();
    this.setState({
      open: !this.state.open,
    })
  };

  /**
   * @param e
   */
  handleClick(e) {
    const { onSelect, values } = this.props;
    onSelect(e, values);
  }
}

/**
 * @type {{open: shim, label: (shim|*)}}
 */
Group.propTypes = {
  open: PropTypes.bool,
  values: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ])),
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  openClass: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  disabled: PropTypes.bool,
  openStyle: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
};

/**
 * @type {{open: boolean}}
 */
Group.defaultProps = {
  open: false,
  values: [],
  disabled: false,
  openClass: [],
  openStyle: {},
};

Group.Item = ({ label, value, pinned, active, found, onSelect, ...props }) => (
  <a {...props} data-value={value} onDoubleClickCapture={onSelect}>
    {label}
  </a>
);

export default Group;
