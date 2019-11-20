"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFuncInstance = createFuncInstance;
exports.getFuncDef = getFuncDef;
exports.getCategories = getCategories;

var _lodash = _interopRequireDefault(require("lodash"));

var _jquery = _interopRequireDefault(require("jquery"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var index = [];
var categories = {
  Transform: []
};

function addFuncDef(funcDef) {
  funcDef.params = funcDef.params || [];
  funcDef.defaultParams = funcDef.defaultParams || [];

  if (funcDef.category) {
    categories[funcDef.category].push(funcDef);
  }

  index[funcDef.name] = funcDef;
  index[funcDef.shortName || funcDef.name] = funcDef;
} // Transform


addFuncDef({
  name: 'scale',
  category: 'Transform',
  params: [{
    name: 'factor',
    type: 'float',
    options: [100, 0.01, 10, -1]
  }],
  defaultParams: [100]
});
addFuncDef({
  name: 'offset',
  category: 'Transform',
  params: [{
    name: 'delta',
    type: 'float',
    options: [-100, 100]
  }],
  defaultParams: [100]
});
addFuncDef({
  name: 'delta',
  category: 'Transform',
  params: [],
  defaultParams: []
});

var FuncInstance =
/*#__PURE__*/
function () {
  function FuncInstance(funcDef, params) {
    _classCallCheck(this, FuncInstance);

    this.def = funcDef;

    if (params) {
      this.params = params;
    } else {
      // Create with default params
      this.params = [];
      this.params = funcDef.defaultParams.slice(0);
    }

    this.updateText();
  }

  _createClass(FuncInstance, [{
    key: "bindFunction",
    value: function bindFunction(metricFunctions) {
      var func = metricFunctions[this.def.name];

      if (func) {
        // Bind function arguments
        var bindedFunc = func;
        var param;

        for (var i = 0; i < this.params.length; i++) {
          param = this.params[i]; // Convert numeric params

          if (this.def.params[i].type === 'int' || this.def.params[i].type === 'float') {
            param = Number(param);
          }

          bindedFunc = _lodash["default"].partial(bindedFunc, param);
        }

        return bindedFunc;
      } else {
        throw {
          message: 'Method not found ' + this.def.name
        };
      }
    }
  }, {
    key: "render",
    value: function render(metricExp) {
      var str = this.def.name + '(';

      var parameters = _lodash["default"].map(this.params, function (value, index) {
        var paramType = this.def.params[index].type;

        if (paramType === 'int' || paramType === 'float' || paramType === 'value_or_series' || paramType === 'boolean') {
          return value;
        } else if (paramType === 'int_or_interval' && _jquery["default"].isNumeric(value)) {
          return value;
        }

        return "'" + value + "'";
      }, this);

      if (metricExp) {
        parameters.unshift(metricExp);
      }

      return str + parameters.join(', ') + ')';
    }
  }, {
    key: "_hasMultipleParamsInString",
    value: function _hasMultipleParamsInString(strValue, index) {
      if (strValue.indexOf(',') === -1) {
        return false;
      }

      return this.def.params[index + 1] && this.def.params[index + 1].optional;
    }
  }, {
    key: "updateParam",
    value: function updateParam(strValue, index) {
      // handle optional parameters
      // if string contains ',' and next param is optional, split and update both
      if (this._hasMultipleParamsInString(strValue, index)) {
        _lodash["default"].each(strValue.split(','), function (partVal, idx) {
          this.updateParam(partVal.trim(), idx);
        }, this);

        return;
      }

      if (strValue === '' && this.def.params[index].optional) {
        this.params.splice(index, 1);
      } else {
        this.params[index] = strValue;
      }

      this.updateText();
    }
  }, {
    key: "updateText",
    value: function updateText() {
      if (this.params.length === 0) {
        this.text = this.def.name + '()';
        return;
      }

      var text = this.def.name + '(';
      text += this.params.join(', ');
      text += ')';
      this.text = text;
    }
  }]);

  return FuncInstance;
}();

function createFuncInstance(funcDef, params) {
  if (_lodash["default"].isString(funcDef)) {
    if (!index[funcDef]) {
      throw {
        message: 'Method not found ' + name
      };
    }

    funcDef = index[funcDef];
  }

  return new FuncInstance(funcDef, params);
}

function getFuncDef(name) {
  return index[name];
}

function getCategories() {
  return categories;
}
//# sourceMappingURL=aafunc.js.map
