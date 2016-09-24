'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AllowedFields = ['source', 'target', 'id'];

/**
 * This method allows you to use PathGraph class to its inheritance chain.
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
     * @param {} collection - A pointer to the collection dannymineobhodimye daapteru to work with the graph. This may be a connection to the SQL database and table name, for example, or a collection of Mongo. 
     * @param {Object} fields - Comparison of the data in the collection of data in the graph. It is necessary for the adapter.
     * @param {Object} config - Additional config.
     * @param {string[]} config.fromFields - Start direction in path link
     * @param {string[]} config.toFields - End direction in path link
     */
    function PathGraph(collection, selector, config) {
      _classCallCheck(this, PathGraph);

      var _this = _possibleConstructorReturn(this, (PathGraph.__proto__ || Object.getPrototypeOf(PathGraph)).apply(this, arguments));

      if (config.fromFields) {
        _this.fromFields = config.fromFields;
      } else throw new Error('config.fromFields is not defined');

      if (config.toFields) {
        _this.toFields = config.toFields;
      } else throw new Error('config.toFields is not defined');

      if (!_this.fromFields.length) {
        throw new Error('config.fromFields can not be empty');
      }

      if (!_this.toFields.length) {
        throw new Error('config.fromFields can not be empty');
      }

      for (var fr in _this.fromFields) {
        if (AllowedFields.indexOf(_this.fromFields[fr]) == -1) {
          throw new Error('config.fromFields may includes only `sourec`, `target` and `id`, but ' + _this.toFields[to]);
        }
        for (var to in _this.toFields) {
          if (AllowedFields.indexOf(_this.toFields[to]) == -1) {
            throw new Error('config.toFields may includes only `sourec`, `target` and `id`, but ' + _this.toFields[to]);
          }
          if (_this.fromFields[fr] == _this.toFields[to]) {
            throw new Error('The start and end of the path con not be at one reference of the link.');
          }
        }
      }
      return _this;
    }

    return PathGraph;
  }(ParentClassGraph);

  return PathGraph;
};

exports.factoryPathGraph = factoryPathGraph;
//# sourceMappingURL=path.js.map