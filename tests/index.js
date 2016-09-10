'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _object = require('ancient-graph/lib/adapters/object.js');

var _ = require('../');

var _ancientGraphRemoved = require('ancient-graph-removed');

var _testSpreading = require('./testSpreading.js');

var _testSpreading2 = _interopRequireDefault(_testSpreading);

var _testQueue = require('./testQueue.js');

var _testQueue2 = _interopRequireDefault(_testQueue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('source-map-support').install();

describe('AncientSouls/GraphSpreading', function () {
  function generateGraphSpreading() {
    var NamedGraph = function (_Graph) {
      _inherits(NamedGraph, _Graph);

      function NamedGraph(collection, fields, name) {
        _classCallCheck(this, NamedGraph);

        var _this = _possibleConstructorReturn(this, (NamedGraph.__proto__ || Object.getPrototypeOf(NamedGraph)).call(this, collection, fields));

        _this._name = name;
        return _this;
      }

      _createClass(NamedGraph, [{
        key: '_idGenerator',
        value: function _idGenerator(index, link) {
          return this._name + '/' + index;
        }
      }]);

      return NamedGraph;
    }(_object.Graph);

    var ExistedGraph = (0, _ancientGraphRemoved.factoryExistedGraph)(NamedGraph);
    var NonExistedGraph = (0, _ancientGraphRemoved.factoryNonExistedGraph)(NamedGraph);

    var ExistedPathGraph = (0, _.factoryPathGraph)(ExistedGraph);
    var NonExistedPathGraph = NonExistedGraph;

    var ExistedSpreadGraph = function () {
      var ExistedSpreadGraph = (0, _.factorySpreadGraph)(ExistedGraph);

      var CustomExistedSpreadGraph = function (_ExistedSpreadGraph) {
        _inherits(CustomExistedSpreadGraph, _ExistedSpreadGraph);

        function CustomExistedSpreadGraph() {
          _classCallCheck(this, CustomExistedSpreadGraph);

          return _possibleConstructorReturn(this, (CustomExistedSpreadGraph.__proto__ || Object.getPrototypeOf(CustomExistedSpreadGraph)).apply(this, arguments));
        }

        _createClass(CustomExistedSpreadGraph, [{
          key: '_spreadingHandler',
          value: function _spreadingHandler(prevSpreadLink, pathGraph, pathLink, newSpreadLink, context, callback) {
            var _this3 = this;

            if (!pathLink) {
              callback(newSpreadLink);
            } else {
              pathGraph.fetch(pathLink.id, undefined, function (error, pathLinks) {
                _this3.fetch({
                  source: newSpreadLink.source, target: newSpreadLink.target,
                  prev: newSpreadLink.prev, path: newSpreadLink.path, root: newSpreadLink.root
                }, undefined, function (error, spreadLinks) {
                  callback(!spreadLinks.length && pathLinks.length ? newSpreadLink : undefined);
                });
              });
            }
          }
        }]);

        return CustomExistedSpreadGraph;
      }(ExistedSpreadGraph);

      return CustomExistedSpreadGraph;
    }();
    var NonExistedSpreadGraph = (0, _.factorySpreadGraph)(NonExistedGraph);

    var pathGraph = new ExistedPathGraph([[], {
      id: 'id', source: 'source', target: 'target',
      removed: 'removed', launched: 'launched', process: 'process'
    }, 'path'], 'source', 'target');

    pathGraph.removed = new NonExistedPathGraph(pathGraph.collection, pathGraph.fields, pathGraph._name);

    var spreadGraph = new ExistedSpreadGraph([[], {
      id: 'id', source: 'source', target: 'target',
      removed: 'removed', launched: 'launched', process: 'process',
      prev: 'prev', path: 'path', root: 'root'
    }, 'spread'], 'source', 'target');

    spreadGraph.removed = new NonExistedSpreadGraph([spreadGraph.collection, spreadGraph.fields, spreadGraph._name], spreadGraph._fromField, spreadGraph._toField);

    var graphSpreading = new _.GraphSpreading(spreadGraph);
    graphSpreading.addPathGraph(pathGraph);

    var QueueSpreading = function (_AncientQueueSpreadin) {
      _inherits(QueueSpreading, _AncientQueueSpreadin);

      function QueueSpreading() {
        _classCallCheck(this, QueueSpreading);

        return _possibleConstructorReturn(this, (QueueSpreading.__proto__ || Object.getPrototypeOf(QueueSpreading)).apply(this, arguments));
      }

      _createClass(QueueSpreading, [{
        key: '_getGraph',
        value: function _getGraph(id) {
          var splited = id.split('/');
          if (splited[0] == 'spread') return spreadGraph;else if (splited[0] == 'path') return pathGraph;else throw new Error('Graph is not founded');
        }
      }]);

      return QueueSpreading;
    }(_.QueueSpreading);

    var queueSpreading = new QueueSpreading(graphSpreading);

    return { pathGraph: pathGraph, spreadGraph: spreadGraph, graphSpreading: graphSpreading, queueSpreading: queueSpreading };
  };

  describe('GraphSpreading', function () {
    (0, _testSpreading2.default)(generateGraphSpreading, "abcdefghijklmnopqrstuvwxyz".split(""));
  });

  describe('QueueSpreading', function () {
    (0, _testQueue2.default)(generateGraphSpreading, "abcdefghijklmnopqrstuvwxyz".split(""));
  });
});
//# sourceMappingURL=index.js.map