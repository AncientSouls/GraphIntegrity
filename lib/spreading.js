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
     * Spread by pathLink and specified fromField with available spreadLinks.
     * 
     * @oaram {string} fromField
     * @param {PathGraph} pathGraph
     * @param {PathLink} pathLink
     * @param {Object} [context]
     * @param {GraphSpreading~spreadFromSpreadLinkByPathLinkCallback} [handler]
     * @param {GraphSpreading~spreadByPathLinkCallback} [callback]
     */

  }, {
    key: '_spreadByPathLink',
    value: function _spreadByPathLink(fromField, pathGraph, pathLink, context, handler, callback) {
      var _this = this;

      this.spreadGraph.fetch(_defineProperty({}, this.spreadGraph.variableField, pathLink[fromField]), undefined, function (error, spreadLinks) {
        if (spreadLinks.length) {
          var queue = _async2.default.queue(function (spreadLink, next) {
            _this.spreadFromSpreadLinkByPathLink(spreadLink, pathGraph, pathLink, context, handler, next);
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
      var _this2 = this;

      _async2.default.each(pathGraph.fromFields, function (fromField, next) {
        _this2._spreadByPathLink(fromField, pathGraph, pathLink, context, handler, next);
      }, callback);
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
      var _this3 = this;

      this.spreadGraph._spreadingHandler(undefined, undefined, undefined, newSpreadLink, context, function (newSpreadLink) {
        if (newSpreadLink) {
          _this3.spreadGraph.insert(newSpreadLink, callback, context);
        } else {
          if (callback) callback();
        }
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
      var _this4 = this;

      var queue = _async2.default.queue(function (pathGraph, callback) {
        _this4.spreadFromSpreadLinkByPathGraph(spreadLink, pathGraph, context, handler, callback);
      });
      queue.drain = function () {
        if (callback) callback();
      };
      queue.push(this.pathGraphs);
    }

    /**
     * Spread by all available paths in pathGraph from spreadLink and specified fromField.
     * 
     * @param {string} fromField
     * @param {SpreadLink} spreadLink
     * @param {PathGraph} pathGraph
     * @param {GraphSpreading~spreadFromSpreadLinkByPathGraphHandler} [handler]
     * @param {GraphSpreading~spreadFromSpreadLinkByPathGraphCallback} [callback]
     */

  }, {
    key: '_spreadFromSpreadLinkByPathGraph',
    value: function _spreadFromSpreadLinkByPathGraph(fromField, spreadLink, pathGraph, context, handler, callback) {
      var _this5 = this;

      pathGraph.fetch(_defineProperty({}, fromField, spreadLink[this.spreadGraph.variableField]), undefined, function (error, pathLinks) {
        var queue = _async2.default.queue(function (pathLink, callback) {
          _this5.spreadFromSpreadLinkByPathLink(spreadLink, pathGraph, pathLink, context, handler, callback);
        });
        queue.drain = function () {
          if (callback) callback();
        };
        queue.push(pathLinks);
      });
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
      var _this6 = this;

      _async2.default.each(pathGraph.fromFields, function (fromField, next) {
        _this6._spreadFromSpreadLinkByPathGraph(fromField, spreadLink, pathGraph, context, handler, next);
      }, callback);
    }

    /**
     * Optional handler. If present, called with an error object as the first argument and, if no error, others arguments with results of spreading.
     *
     * @callback GraphSpreading~spreadFromSpreadLinkByPathGraphHandler
     * @param {Error} [error]
     * @param {string} [newSpreadLinkId]
     * @param {SpreadLink} [prevSpreadLink]
     * @param {PathGraph} [pathGraph]
     * @param {PathLink} [pathLink]
     */

    /**
     * Optional callback.
     *
     * @callback GraphSpreading~spreadFromSpreadLinkByPathGraphCallback
     */

    /**
     * Spread by pathLink and specified toField in pathGraph from spreadLink.
     * 
     * @param {SpreadLink} spreadLink
     * @param {PathGraph} pathGraph
     * @param {PathLink} pathLink
     * @param {Object} [context]
     * @param {GraphSpreading~spreadFromSpreadLinkByPathLinkCallback} [callback]
     */

  }, {
    key: '_spreadFromSpreadLinkByPathLink',
    value: function _spreadFromSpreadLinkByPathLink(toField, spreadLink, pathGraph, pathLink, context, callback) {
      var _spreadGraph$_spreadi,
          _this7 = this;

      this.spreadGraph._spreadingHandler(spreadLink, pathGraph, pathLink, (_spreadGraph$_spreadi = {}, _defineProperty(_spreadGraph$_spreadi, this.spreadGraph.constantField, spreadLink[this.spreadGraph.constantField]), _defineProperty(_spreadGraph$_spreadi, this.spreadGraph.variableField, pathLink[toField]), _defineProperty(_spreadGraph$_spreadi, 'prev', spreadLink.id), _defineProperty(_spreadGraph$_spreadi, 'path', pathLink.id), _defineProperty(_spreadGraph$_spreadi, 'root', spreadLink.root ? spreadLink.root : spreadLink.id), _spreadGraph$_spreadi), context, function (newSpreadLink) {
        if (newSpreadLink) {
          _this7.spreadGraph.insert(newSpreadLink, function (error, id) {
            if (callback) callback(error, id, spreadLink, pathGraph, pathLink);
          }, context);
        } else {
          if (callback) callback();
        }
      });
    }

    /**
     * Spread by pathLink in pathGraph from spreadLink.
     * 
     * @param {SpreadLink} spreadLink
     * @param {PathGraph} pathGraph
     * @param {PathLink} pathLink
     * @param {Object} [context]
     * @param {GraphSpreading~spreadFromSpreadLinkByPathLinkHandler} [handler]
     * @param {GraphSpreading~spreadFromSpreadLinkByPathLinkCallback} [callback]
     */

  }, {
    key: 'spreadFromSpreadLinkByPathLink',
    value: function spreadFromSpreadLinkByPathLink(spreadLink, pathGraph, pathLink, context, handler, callback) {
      var _this8 = this;

      _async2.default.each(pathGraph.toFields, function (toField, next) {
        _this8._spreadFromSpreadLinkByPathLink(toField, spreadLink, pathGraph, pathLink, context, function (error, id, prev, pathGraph, pathLink) {
          if (handler) handler(error, id, prev, pathGraph, pathLink);
          next();
        });
      }, callback);
    }

    /**
     * Optional handler.
     *
     * @callback GraphSpreading~spreadFromSpreadLinkByPathLinkCallback
     * @param {Error} [error]
     * @param {string} [newSpreadLinkId]
     * @param {SpreadLink} [prevSpreadLink]
     * @param {PathGraph} [pathGraph]
     * @param {PathLink} [pathLink]
     */

    /**
     * Optional callback. If present, called with an error object as the first argument and, if no error, the unique id of inserted spread link as the second.
     *
     * @callback GraphSpreading~spreadFromSpreadLinkByPathLinkCallback
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
      var _this9 = this;

      if (handler) {
        this.spreadGraph.fetch({ prev: spreadLinkId }, undefined, function (error, spreadLinks) {
          if (error) {
            if (callback) callback(error);
          } else {
            var queue = _async2.default.queue(function (spreadLink, next) {
              _this9.spreadGraph.remove(spreadLink.id, function (error, count) {
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
      var _this10 = this;

      if (handler) {
        this.spreadGraph.fetch({ path: pathLinkId }, undefined, function (error, spreadLinks) {
          if (error) {
            if (callback) callback(error);
          } else {
            var queue = _async2.default.queue(function (spreadLink, next) {
              _this10.spreadGraph.remove(spreadLink.id, function (error, count) {
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
     * Optional handler.
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

    /**
     * Unspread all valid spreadLinks to this id.
     * 
     * @param {string} id
     * @param {Object} [context]
     * @param {GraphSpreading~unspreadToHandler} [handler]
     * @param {GraphSpreading~unspreadToCallback} [callback]
     */

  }, {
    key: 'unspread',
    value: function unspread(id, context, handler, callback) {
      var _this11 = this;

      this.spreadGraph.fetch(_defineProperty({}, this.spreadGraph.variableField, id), undefined, function (error, spreadLinks) {
        if (error) {
          if (callback) callback(error);
        } else {
          var queue = _async2.default.queue(function (spreadLink, next) {
            _this11.spreadGraph._unspreadingHandler(spreadLink, context, function (permission) {
              if (permission) {
                _this11.spreadGraph.remove(spreadLink.id, function (error, count) {
                  if (handler) handler(error, spreadLink);
                  next();
                }, context);
              }
            });
          });
          if (callback) queue.drain = function () {
            callback(undefined, spreadLinks.length);
          };
          queue.push(spreadLinks);
        }
      });
    }

    /**
     * Optional handler.
     *
     * @callback GraphSpreading~unspreadToHandler
     * @param {Error} [error]
     * @param {SpreadLink} [spreadLink]
     */

    /**
     * Optional callback.
     *
     * @callback GraphSpreading~unspreadToCallback
     */

    /**
     * Spread all spread links from all available paths to this id.
     * 
     * @param {string} id
     * @param {Object} [context]
     * @param {GraphSpreading~spreadToHandler} [handler]
     * @param {GraphSpreading~spreadToCallback} [callback]
     */

  }, {
    key: 'spreadTo',
    value: function spreadTo(id, context, handler, callback) {
      var _this12 = this;

      var queue = _async2.default.queue(function (pathGraph, nextPathGraph) {
        pathGraph.fetch(_defineProperty({}, pathGraph.toFields[0], id), undefined, function (error, pathLinks) {
          _async2.default.each(pathLinks, function (pathLink, nextPathLink) {
            _this12.spreadByPathLink(pathGraph, pathLink, context, handler, nextPathLink);
          }, function (error) {
            nextPathGraph();
          });
        });
      });
      queue.drain = function () {
        if (callback) callback();
      };
      queue.push(this.pathGraphs);
    }

    /**
     * Optional handler. Fires after each processed spread link.
     * Id can be empty if the `this.spreadGraph._spreadingHandler` banned spreading.
     * 
     * @callback GraphSpreading~spreadToHandler
     * @param {Error} [error]
     * @param {string} [newSpreadLinkId]
     * @param {SpreadLink} [prevSpreadLink]
     * @param {PathGraph} [pathGraph]
     * @param {PathLink} [pathLink]
     */

    /**
     * Optional callback.
     *
     * @callback GraphSpreading~spreadToCallback
     */

  }]);

  return GraphSpreading;
}();

exports.GraphSpreading = GraphSpreading;
//# sourceMappingURL=spreading.js.map