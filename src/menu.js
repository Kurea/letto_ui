import { SUPPORTED_TYPES, SUPPORTED_CATEGORY_TYPES, EXPECTED_HANDLE_ARGS } from './api';
import Handle from './handle';
import HashHandle from './hash_handle';
import ValueHandle from './value_handle';
import React from 'react';
import PropTypes from 'prop-types';

function MenuModule(props) {
  function handleClick(e) {
    e.preventDefault();
    MenuX.addModule(props.functionName);
  }
  if (props.isCategory) {
    return <dt>{props.functionName}</dt>;
  } else {
    return <dd onClick={handleClick}>{props.functionName}</dd>;
  }
}

MenuModule.propTypes = {
  functionName: PropTypes.string.isRequired,
  isCategory: PropTypes.boolean
};

export function Menu(props) {
  const categories = SUPPORTED_TYPES.filter((e) => {return e !== 'workflow';});
  const categoriesTitle = categories.map((category) => {
    if (SUPPORTED_CATEGORY_TYPES[category]) {
      const categoryTitle = <MenuModule functionName={category} isCategory />;
      const modulesTitles = SUPPORTED_CATEGORY_TYPES[category].map((module) => {return <MenuModule functionName={module}  isCategory={false} />;});
      const modules = [categoryTitle].concat(modulesTitles);
      return modules;
    }
    return false;
  });
  return <dl>{categoriesTitle}</dl>;

}

export default class MenuX {
  // add a module to the board
  static addModule (name, style) {
    var zone = document.querySelector('.zone');
    if (!style) {
      style = 'left:' + zone.scrollLeft + 'px; top:' + zone.scrollTop + 'px;';
    }
    if (name === 'hash') {
      return new HashHandle(zone, name, EXPECTED_HANDLE_ARGS[name], style);
    } else if (name === 'value') {
      return new ValueHandle(zone, name, EXPECTED_HANDLE_ARGS[name], style);
    } else {
      return new Handle(zone, name, EXPECTED_HANDLE_ARGS[name], style);
    }
  }
}
