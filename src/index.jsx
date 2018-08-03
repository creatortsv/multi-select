import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Group from './group';
import './index.css';

/**
 * @param value
 * @param props
 * @return {*}
 * @constructor
 */
const Option = ({ value, ...props }) => <option {...props}>{value}</option>;

class MultiSelect extends Component {
  /**
   * @param label
   * @param value
   * @param children
   * @param selected
   * @param fixed
   * @param term
   * @return {*}
   */
  static prepareOptions({
    label,
    value,
    children,
  }, selected = [], fixed = [], term = '') {
    const option = { label, value };
    const searching = term.length > 1;
    if (children) {
      option.values = [];
      option.children = children
        .map(option => MultiSelect.prepareOptions(option, selected, fixed, term));

      const extract = ({ label, value, found, children }) => {
        if (children) {
          children.forEach(extract);
        } else if (option.values.indexOf(value) < 0) {
          if (searching) {
            found && option.values.push(value);
          } else {
            option.values.push(value);
          }
        }
      };

      extract(option);
      if (searching && option.values.length > 0) {
        option.open = true;
      }

      return option;
    } else {
      option.active = selected.indexOf(value) > -1;
      option.pinned = fixed.indexOf(value) > -1;

      if (searching) {
        const start = label
          .toLowerCase()
          .indexOf(term.toLowerCase());

        if (start > -1) {
          const end = start + term.length;
          option.found = true;
          option.label = (
            <span>
              {label.substring(0, start)}
              <span style={{ color: 'red' }}>{label.substring(start, end)}</span>
              {label.substring(end)}
            </span>
          );
        }
      }

      return option;
    }
  }

  /**
   * @param props
   */
  constructor(props) {
    super(props);

    /**
     * @type {{term: string}}
     */
    this.state = {
      term: '',
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleUnselect = this.handleUnselect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  /**
   * @return {*}
   */
  render() {
    const {
      fixed,

      options,
      wrapperClass,
      wrapperStyle,
      containerClass,
      containerStyle,
      sectionClass,
      sectionStyle,
      groupClass,
      groupStyle,
      itemClass,
      itemStyle,
      openGroupClass,
      openGroupStyle,
      filterClass,
      filterStyle,
      lang,

      ...rest,
    } = this.props;

    const { term } = this.state;
    const searching = term.length > 1;
    const selected = this.props.value;
    const readyOpts = options
      .map(option => MultiSelect.prepareOptions(option, selected, fixed, term));

    const used = [];
    const selectOptions = [];
    const selectedOptions = [];
    const fixedOptions = [];

    const each = ({ label, value, values, active, pinned, children, found, ...rest }, key) => {
      if (children) {
        return <Group {...{
          ...rest,
          key,
          label,
          values,
          style: { ...groupStyle },
          className: groupClass,
          openClass: openGroupClass,
          openStyle: openGroupStyle,
          children: children.map(each),
          onSelect: this.handleSelect,
          disabled: values
            .filter(v => [...selected, ...fixed].indexOf(v) < 0)
            .length < 1,
        }} />
      } else {
        const item = {
          ...rest,
          key,
          label,
          value,
          active,
          pinned,
          found,
          className: itemClass,
          style: itemStyle,
        };

        if (used.indexOf(value) < 0) {
          selectOptions.push(<Option {...{
            key: selectOptions.length,
            label,
            value,
          }} />);

          if (pinned) {
            delete item.value;
            fixedOptions.push(<Group.Item {...item} />);
          } else if (active) {
            selectedOptions.push(<Group.Item {...item} onSelect={this.handleUnselect} />);
          }

          used.push(value);
        }

        if (pinned || active || (searching && !found)) {
          return null;
        }

        return <Group.Item {...item}  onSelect={this.handleSelect} />;
      }
    };

    const stackOptions = readyOpts.map(each);
    return (
      <div className={wrapperClass} style={wrapperStyle}>
        <select {...rest} data-name={name} value={selected}>
          {selectOptions}
        </select>
        <div className={containerClass} style={containerStyle}>
          <div className={sectionClass} style={sectionStyle}>
            <div>
              <input
                value={term}
                style={filterStyle}
                className={filterClass}
                placeholder={lang.all}
                onChange={this.handleSearch}
              />
            </div>
            {stackOptions}
            <div>
              <a href="#" onClick={this.handleSelect}>{lang.allAdd}</a>
            </div>
          </div>
          <div className={sectionClass} style={sectionStyle}>
            <p>{lang.selected}</p>
            {selectedOptions}
            <div>
              <a href="#" onClick={this.handleUnselect}>{lang.selectedRemove}</a>
            </div>
          </div>
          {fixedOptions.length > 0 && (
            <div className={sectionClass} style={sectionStyle}>
              <p>{lang.fixed}</p>
              {fixedOptions}
            </div>
          )}
        </div>
      </div>
    );
  }

  /**
   * @param e
   * @param values
   */
  handleSelect(e, values) {
    e.preventDefault();
    const { term } = this.state;
    const { onChange, name, options, fixed } = this.props;
    const { value } = e.currentTarget.dataset;
    const selected = this.props.value;
    let list = [...(values || [])];
    if (value !== undefined) {
      list = [parseInt(value, 10)];
    }

    if (list.length > 0) {
      selected
        .push(...list
          .filter(v => v && selected.indexOf(v) < 0));

      list = selected;
    } else {
      list.push(...selected);
      options
        .map(o => MultiSelect.prepareOptions(o, [], fixed, term))
        .filter(({ values }) => values !== undefined)
        .forEach(({ values }) => list.push(...values));
    }

    onChange(list, name);
  }

  /**
   * @param e
   * @param values
   */
  handleUnselect(e, values) {
    e.preventDefault();
    const { onChange, name } = this.props;
    const { value } = e.currentTarget.dataset;
    let list = [];

    value && list.push(value);
    values && (list = values);

    onChange(list.length === 0 ? [] : this.props
        .value
        .filter(v => list.indexOf(v) < 0), name);
  }

  /**
   * @param e
   */
  handleSearch(e) {
    e.preventDefault();
    const { value } = e.currentTarget;
    this.setState({
      term: value,
    });
  }
}

const value = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.string,
]);

const lang = PropTypes.oneOfType([
  PropTypes.element,
  PropTypes.string,
]);

MultiSelect.propTypes = {
  name: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value,
    label: PropTypes.string,
    children: PropTypes.array,
  })),
  value: PropTypes.arrayOf(value),
  fixed: PropTypes.arrayOf(value),
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  wrapperClass: PropTypes.string,
  wrapperStyle: PropTypes.object,
  containerClass: PropTypes.string,
  containerStyle: PropTypes.object,
  sectionClass: PropTypes.string,
  sectionStyle: PropTypes.object,
  openGroupClass: PropTypes.string,
  openGroupStyle: PropTypes.object,
  groupClass: PropTypes.string,
  groupStyle: PropTypes.object,
  itemClass: PropTypes.string,
  itemStyle: PropTypes.object,
  filterClass: PropTypes.string,
  filterStyle: PropTypes.object,
  onChange: PropTypes.func,
  lang: PropTypes.shape({
    all: lang,
    allAdd: lang,
    selected: lang,
    selectedRemove: lang,
    fixed: lang,
  }),
};

MultiSelect.defaultProps = {
  options: [],
  value: [],
  fixed: [],
  multiple: true,
  disabled: false,
  wrapperClass: 'ms--wrapper',
  wrapperStyle: {},
  containerClass: 'ms--container',
  containerStyle: {},
  sectionClass: 'ms--section',
  sectionStyle: {},
  groupClass: 'ms--group',
  groupStyle: {},
  itemClass: 'ms--item',
  itemStyle: {},
  filterClass: '',
  filterStyle: { display: 'block', width: '100%' },
  openGroupClass: 'ms--group__open',
  openGroupStyle: {},
  onChange: () => {},
  lang: {
    all: 'All elements',
    allAdd: 'Select all',
    selected: 'Selected elements',
    selectedRemove: 'Unselect all',
    fixed: 'Fixed elements',
  },
};

export default MultiSelect;
