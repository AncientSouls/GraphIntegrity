"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * This method allows you to use SpreadGraph class to its inheritance chain.
 * Fields launched, process, prev, path and root is required!
 * Manage fields launched and process.
 * 
 * @param {Class} ParentClassGraph
 * @return {Class} SpreadGraph
 * @description `import { factorySpreadGraph } from 'ancient-graph-spreading';`
 */
function factorySpreadGraph(ParentClassGraph) {
  var SpreadGraph = function (_ParentClassGraph) {
    _inherits(SpreadGraph, _ParentClassGraph);

    /**
     * @param {Array} args - parent class graph arguments
     * @param {string} constantField
     * @param {string} variableField
     */
    function SpreadGraph(args, constantField, variableField) {
      var _ref;

      _classCallCheck(this, SpreadGraph);

      var _this = _possibleConstructorReturn(this, (_ref = SpreadGraph.__proto__ || Object.getPrototypeOf(SpreadGraph)).call.apply(_ref, [this].concat(_toConsumableArray(args))));

      _this._constantField = constantField;
      _this._variableField = variableField;
      return _this;
    }

    /**
     * Default spreading handler. If spread specified link allowed, callback it link, else callback undefined.
     * 
     * @param {Object} [prevSpreadLink]
     * @param {PathGraph} [pathGraph]
     * @param {Object} [pathLink]
     * @param {Object} newSpreadLink 
     * @param {Object} [context]
     * @param {SpreadGraph~_spreadingHandlerCallback} [callback]
     */


    _createClass(SpreadGraph, [{
      key: "_spreadingHandler",
      value: function _spreadingHandler(prevSpreadLink, pathGraph, pathLink, newSpreadLink, context, callback) {
        callback(newSpreadLink);
      }

      /**
       * Responce from _spreadingHandler method.
       *
       * @callback SpreadGraph~_spreadingHandlerCallback
       * @param {Object} [newSpreadLink] 
       */

      /**
       * Parent insert with parser of context.process.
       */

    }, {
      key: "insert",
      value: function insert(modifier, callback, context) {
        if (context && context.process) {
          modifier.process = [context.process];
        }
        return _get(SpreadGraph.prototype.__proto__ || Object.getPrototypeOf(SpreadGraph.prototype), "insert", this).call(this, modifier, callback, context);
      }

      /**
       * The method is strictly designed so that the class inherits from ExistedGraph.
       * Adds to launched field unspread value.
       */

    }, {
      key: "remove",
      value: function remove(selector, callback, context) {
        if (context && context.process) {
          if (!context.modifier) context.modifier = {};
          context.modifier.process = { add: context.process };
        }
        return _get(SpreadGraph.prototype.__proto__ || Object.getPrototypeOf(SpreadGraph.prototype), "remove", this).call(this, selector, callback, context);
      }
    }]);

    return SpreadGraph;
  }(ParentClassGraph);

  return SpreadGraph;
};

exports.factorySpreadGraph = factorySpreadGraph;
//# sourceMappingURL=spread.js.map