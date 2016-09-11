'use strict';

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
 * This method allows you to use PathGraph class to its inheritance chain.
 * Field launched is required!
 * Manage field launched.
 * 
 * @param {Class} ParentClassGraph
 * @return {Class} PathGraph
 * @description `import { factoryPathGraph } from 'ancient-graph-spreading';`
 */
function factoryPathGraph(ParentClassGraph) {
  var PathGraph = function (_ParentClassGraph) {
    _inherits(PathGraph, _ParentClassGraph);

    /**
     * Parent constrctor arguments taken in args array.
     * 
     * @param {Array} args - parent class graph arguments
     * @param {string} fromField
     * @param {string} toField
     */
    function PathGraph(args, fromField, toField) {
      var _ref;

      _classCallCheck(this, PathGraph);

      var _this = _possibleConstructorReturn(this, (_ref = PathGraph.__proto__ || Object.getPrototypeOf(PathGraph)).call.apply(_ref, [this].concat(_toConsumableArray(args))));

      _this._fromField = fromField;
      _this._toField = toField;
      return _this;
    }

    /**
     * Parent insert with added launched field. You can override it field in modifier.
     */


    _createClass(PathGraph, [{
      key: 'insert',
      value: function insert(modifier, callback, context) {
        if (!modifier.launched) modifier.launched = ['spread'];
        return _get(PathGraph.prototype.__proto__ || Object.getPrototypeOf(PathGraph.prototype), 'insert', this).call(this, modifier, callback, context);
      }

      /**
       * Parent update, but if source or target changed, then to the launched field will be added values unspread and spread. You can override it field in modifier.
       */

    }, {
      key: 'update',
      value: function update(selector, modifier, callback, context) {
        if (!modifier.hasOwnProperty('launched') && (modifier.hasOwnProperty('source') || modifier.hasOwnProperty('target'))) {
          modifier.launched = { add: ['unspread', 'spread'] };
        }
        return _get(PathGraph.prototype.__proto__ || Object.getPrototypeOf(PathGraph.prototype), 'update', this).call(this, selector, modifier, callback, context);
      }

      /**
       * The method is strictly designed so that the class inherits from ExistedGraph.
       * Adds to launched field unspread value.
       */

    }, {
      key: 'remove',
      value: function remove(selector, callback, context) {
        if (!context) var context = {};
        if (!context.modifier) context.modifier = {};
        context.modifier.launched = ['unspread'];
        return _get(PathGraph.prototype.__proto__ || Object.getPrototypeOf(PathGraph.prototype), 'remove', this).call(this, selector, callback, context);
      }
    }]);

    return PathGraph;
  }(ParentClassGraph);

  return PathGraph;
};

exports.factoryPathGraph = factoryPathGraph;
//# sourceMappingURL=path.1.js.map