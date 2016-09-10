'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GraphSpreading = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class with methods for spread and unspread of the spreadGraph on pathGraph(s).
 * 
 * @class
 * @description `import { GraphSpreading } from 'ancient-graph-spreading';`
 */
var GraphSpreading = function () {

  /**
   * @param {SpreadGraph} spreadGraph
   */
  function GraphSpreading(spreadGraph) {
    _classCallCheck(this, GraphSpreading);

    this.spreadGraph = spreadGraph;
    this.pathGraphs = [];
  }

  /**
   * @param {PathGraph} pathGraph
   */


  _createClass(GraphSpreading, [{
    key: 'addPathGraph',
    value: function addPathGraph(pathGraph) {
      this.pathGraphs.push(pathGraph);
    }

    /**
     * Spread by pathLink with available spreadLinks.
     * 
     * @param {PathGraph} pathGraph
     * @param {PathLink} pathLink
     * @param {Object} [context]
     * @param {GraphSpreading~spreadFromSpreadLinkByPathLinkCallback} [handler]
     * @param {GraphSpreading~spreadByPathLinkCallback} [callback]
     */

  }, {
    key: 'spreadByPathLink',
    value: function spreadByPathLink(pathGraph, pathLink, context, handler, callback) {
      var _this = this;

      this.spreadGraph.fetch(_defineProperty({}, this.spreadGraph._variableField, pathLink[pathGraph._fromField]), undefined, function (error, spreadLinks) {
        if (spreadLinks.length) {
          var queue = _async2.default.queue(function (spreadLink, callback) {
            _this.spreadFromSpreadLinkByPathLink(spreadLink, pathGraph, pathLink, context, function (error, id, spreadLink, pathGraph, pathLink) {
              if (handler) handler(error, id, spreadLink, pathGraph, pathLink);
              callback();
            });
          });
          queue.push(spreadLinks, function (error) {
            if (callback) callback();
          });
        } else {
          if (callback) callback();
        }
      });
    }

    /**
     * Optional callback.
     *
     * @callback GraphSpreading~spreadByPathLinkCallback
     */

    /**
     * Spread root of tree spreadLink.
     * 
     * @param {SpreadLink} newSpreadLink
     * @param {Object} [context]
     * @param {Graph~insertCallback} [callback]
     */

  }, {
    key: 'spreadNewSpreadLink',
    value: function spreadNewSpreadLink(newSpreadLink, context, callback) {
      var _this2 = this;

      this.spreadGraph._spreadingHandler(undefined, undefined, undefined, newSpreadLink, context, function (newSpreadLink) {
        if (newSpreadLink) _this2.spreadGraph.insert(newSpreadLink, callback, context);
      });
    }

    /**
     * Spread by all available paths from spreadLink.
     * 
     * @param {SpreadLink} spreadLink
     * @param {Object} [context]
     * @param {GraphSpreading~spreadFromSpreadLinkByPathGraphHandler} [handler]
     * @param {GraphSpreading~spreadFromSpreadLinkByPathGraphCallback} [callback]
     */

  }, {
    key: 'spreadFromSpreadLink',
    value: function spreadFromSpreadLink(spreadLink, context, handler, callback) {
      var _this3 = this;

      var queue = _async2.default.queue(function (pathGraph, callback) {
        _this3.spreadFromSpreadLinkByPathGraph(spreadLink, pathGraph, context, handler, callback);
      });
      queue.drain = function () {
        if (callback) callback();
      };
      queue.push(this.pathGraphs);
    }

    /**
     * Spread by all available paths in pathGraph from spreadLink.
     * 
     * @param {SpreadLink} spreadLink
     * @param {PathGraph} pathGraph
     * @param {GraphSpreading~spreadFromSpreadLinkByPathGraphHandler} [handler]
     * @param {GraphSpreading~spreadFromSpreadLinkByPathGraphCallback} [callback]
     */

  }, {
    key: 'spreadFromSpreadLinkByPathGraph',
    value: function spreadFromSpreadLinkByPathGraph(spreadLink, pathGraph, context, handler, callback) {
      var _this4 = this;

      pathGraph.fetch(_defineProperty({}, pathGraph._fromField, spreadLink[this.spreadGraph._variableField]), undefined, function (error, pathLinks) {
        var queue = _async2.default.queue(function (pathLink, callback) {
          _this4.spreadFromSpreadLinkByPathLink(spreadLink, pathGraph, pathLink, context, function (error, id) {
            if (handler) handler(error, id, spreadLink, pathGraph, pathLink);
            callback();
          });
        });
        queue.drain = function () {
          if (callback) callback();
        };
        queue.push(pathLinks);
      });
    }

    /**
     * Optional handler. If present, called with an error object as the first argument and, if no error, others arguments with results of spreading.
     *
     * @callback GraphSpreading~spreadFromSpreadLinkByPathGraphHandler
     * @param {Error} [error]
     * @param {string} [id]
     * @param {SpreadLink} [spreadLink]
     * @param {PathGraph} [pathGraph]
     * @param {PathLink} [pathLink]
     */

    /**
     * Optional callback.
     *
     * @callback GraphSpreading~spreadFromSpreadLinkByPathGraphCallback
     */

    /**
     * Spread by pathLink in pathGraph from spreadLink.
     * 
     * @param {SpreadLink} spreadLink
     * @param {PathGraph} pathGraph
     * @param {PathLink} pathLink
     * @param {Object} [context]
     * @param {GraphSpreading~spreadFromSpreadLinkByPathLinkCallback} [callback]
     */

  }, {
    key: 'spreadFromSpreadLinkByPathLink',
    value: function spreadFromSpreadLinkByPathLink(spreadLink, pathGraph, pathLink, context, callback) {
      var _spreadGraph$_spreadi,
          _this5 = this;

      this.spreadGraph._spreadingHandler(spreadLink, pathGraph, pathLink, (_spreadGraph$_spreadi = {}, _defineProperty(_spreadGraph$_spreadi, this.spreadGraph._constantField, spreadLink[this.spreadGraph._constantField]), _defineProperty(_spreadGraph$_spreadi, this.spreadGraph._variableField, pathLink[pathGraph._toField]), _defineProperty(_spreadGraph$_spreadi, 'prev', spreadLink.id), _defineProperty(_spreadGraph$_spreadi, 'path', pathLink.id), _defineProperty(_spreadGraph$_spreadi, 'root', spreadLink.root ? spreadLink.root : spreadLink.id), _spreadGraph$_spreadi), context, function (newSpreadLink) {
        if (newSpreadLink) _this5.spreadGraph.insert(newSpreadLink, function (error, id) {
          if (callback) callback(error, id, spreadLink, pathGraph, pathLink);
        }, context);
      });
    }

    /**
     * Optional callback. If present, called with an error object as the first argument and, if no error, the unique id of inserted spread link as the second.
     *
     * @callback GraphSpreading~spreadFromSpreadLinkByPathLinkCallback
     * @param {Error} [error]
     * @param {string} [id]
     * @param {SpreadLink} [spreadLink]
     * @param {PathGraph} [pathGraph]
     * @param {PathLink} [pathLink]
     */

    /**
     * Remove spreadLinks with specific prev spreadLink id.
     * 
     * @param {string} spreadLinkId
     * @param {Object} [context]
     * @param {GraphSpreading~unspreadFromRemovedSpreadLinkByPrevIdHandler} [handler]
     * @param {GraphSpreading~unspreadFromRemovedSpreadLinkByPrevIdCallback} [callback]
     */

  }, {
    key: 'unspreadFromRemovedSpreadLinkByPrevId',
    value: function unspreadFromRemovedSpreadLinkByPrevId(spreadLinkId, context, handler, callback) {
      var _this6 = this;

      if (handler) {
        this.spreadGraph.fetch({ prev: spreadLinkId }, undefined, function (error, spreadLinks) {
          if (error) {
            if (callback) callback(error);
          } else {
            var queue = _async2.default.queue(function (spreadLink, next) {
              _this6.spreadGraph.remove(spreadLink.id, function (error, count) {
                handler(error, spreadLink);
                next();
              }, context);
            });
            if (callback) queue.drain = function () {
              callback(undefined, spreadLinks.length);
            };
            queue.push(spreadLinks);
          }
        });
      } else {
        this.spreadGraph.remove({ prev: spreadLinkId }, callback, context);
      }
    }

    /**
     * Optional handler. If present, called with an error object as the first argument and, if no error, others arguments with results of unspreading.
     *
     * @callback GraphSpreading~unspreadFromRemovedSpreadLinkByPrevIdHandler
     * @param {Error} [error]
     * @param {SpreadLink} [spreadLink]
     */

    /**
     * Optional callback.
     *
     * @callback GraphSpreading~unspreadFromRemovedSpreadLinkByPrevIdCallback
     * @param {Error} [error]
     * @param {number} [count]
     */

    /**
     * Remove spreadLinks with specific path pathLink id.
     * 
     * @param {string} pathLinkId
     * @param {Object} [context]
     * @param {GraphSpreading~unspreadByPathIdHandler} [handler]
     * @param {GraphSpreading~unspreadByPathIdCallback} [callback]
     */

  }, {
    key: 'unspreadByPathId',
    value: function unspreadByPathId(pathLinkId, context, handler, callback) {
      var _this7 = this;

      if (handler) {
        this.spreadGraph.fetch({ path: pathLinkId }, undefined, function (error, spreadLinks) {
          if (error) {
            if (callback) callback(error);
          } else {
            var queue = _async2.default.queue(function (spreadLink, next) {
              _this7.spreadGraph.remove(spreadLink.id, function (error, count) {
                handler(error, spreadLink);
                next();
              }, context);
            });
            if (callback) queue.drain = function () {
              callback(undefined, spreadLinks.length);
            };
            queue.push(spreadLinks);
          }
        });
      } else {
        this.spreadGraph.remove({ path: pathLinkId }, callback, context);
      }
    }

    /**
     * Optional handler. If present, called with an error object as the first argument and, if no error, others arguments with results of unspreading.
     *
     * @callback GraphSpreading~unspreadByPathIdHandler
     * @param {Error} [error]
     * @param {SpreadLink} [spreadLink]
     */

    /**
     * Optional callback.
     *
     * @callback GraphSpreading~unspreadByPathIdCallback
     * @param {Error} [error]
     * @param {number} [count]
     */

  }]);

  return GraphSpreading;
}();

exports.GraphSpreading = GraphSpreading;
//# sourceMappingURL=spreading.js.map