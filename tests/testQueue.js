'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = testQueue;

var _chai = require('chai');

var _ = require('../');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function testQueue(generageGraphSpreading, ids) {
  it('#spreadByPath', function (done) {
    var _generageGraphSpreadi = generageGraphSpreading();

    var pathGraph = _generageGraphSpreadi.pathGraph;
    var spreadGraph = _generageGraphSpreadi.spreadGraph;
    var graphSpreading = _generageGraphSpreadi.graphSpreading;
    var queueSpreading = _generageGraphSpreadi.queueSpreading;


    spreadGraph.insert({ source: ids[0], target: ids[1] }, function (error, spreadLinkId0) {
      pathGraph.insert({ source: ids[2], target: ids[3] }, function (error, pathLinkId0) {
        spreadGraph.on('insert', function (oldLink, newLink) {
          queueSpreading.spreadBySpread(newLink);
        });
        spreadGraph.on('remove', function (oldLink, newLink) {
          queueSpreading.unspreadBySpread(oldLink);
        });
        pathGraph.on('insert', function (oldLink, newLink) {
          queueSpreading.spreadByPath(pathGraph, newLink);
        });
        pathGraph.on('update', function (oldLink, newLink) {
          _chai.assert.lengthOf(newLink.launched, 0);
          spreadGraph.fetch({}, undefined, function (error, results) {
            _chai.assert.deepEqual(results, [{ source: 'a', target: 'b', id: 'spread/0' }, {
              source: 'a', target: 'c', id: 'spread/1',
              prev: 'spread/0', path: 'path/1', root: 'spread/0',
              process: []
            }, {
              source: 'a', target: 'd', id: 'spread/2',
              prev: 'spread/1', path: 'path/0', root: 'spread/0',
              process: []
            }]);
            done();
          });
        });
        pathGraph.insert({ source: ids[1], target: ids[2] });
      });
    });
  });
  it('#unspreadByPath #spreadByPath', function (done) {
    var _generageGraphSpreadi2 = generageGraphSpreading();

    var pathGraph = _generageGraphSpreadi2.pathGraph;
    var spreadGraph = _generageGraphSpreadi2.spreadGraph;
    var graphSpreading = _generageGraphSpreadi2.graphSpreading;
    var queueSpreading = _generageGraphSpreadi2.queueSpreading;


    var mainPathLink;

    spreadGraph.on('insert', function (oldLink, newLink) {
      queueSpreading.spreadBySpread(newLink);
    });
    spreadGraph.on('remove', function (oldLink, newLink) {
      queueSpreading.unspreadBySpread(oldLink);
    });
    pathGraph.on('insert', function (oldLink, newLink) {
      queueSpreading.spreadByPath(pathGraph, newLink);
    });
    pathGraph.on('update', function (oldLink, newLink) {
      if (oldLink.source != newLink.source || oldLink.target != newLink.target) {
        queueSpreading.unspreadByPath(pathGraph, newLink);
      } else if (!_lodash2.default.isEqual(oldLink.launched, newLink.launched)) {
        if (newLink.id == mainPathLink && newLink.launched == 0) {
          spreadGraph.fetch({}, undefined, function (error, results) {
            _chai.assert.deepEqual(results, [{ source: 'a', target: 'b', id: 'spread/0' }, {
              source: 'a', target: 'c', id: 'spread/1',
              prev: 'spread/0', path: 'path/0', root: 'spread/0',
              process: []
            }, {
              source: 'a', target: 'd', id: 'spread/2',
              prev: 'spread/1', path: 'path/1', root: 'spread/0',
              process: []
            }]);
            pathGraph.fetch({}, undefined, function (error, results) {
              _chai.assert.deepEqual(results, [{
                "id": "path/0",
                "launched": [],
                "source": "b",
                "target": "c"
              }, {
                "id": "path/1",
                "launched": [],
                "source": "c",
                "target": "d"
              }]);
              done();
            });
          });
        } else {
          queueSpreading.spreadByPath(pathGraph, newLink);
        }
      }
    });

    spreadGraph.insert({ source: ids[0], target: ids[1] }, function (error, spreadLinkId0) {
      pathGraph.insert({ source: ids[3], target: ids[3] }, function (error, pathLinkId0) {
        mainPathLink = pathLinkId0;
        pathGraph.insert({ source: ids[2], target: ids[3] }, function (error, pathLinkId1) {
          pathGraph.update(pathLinkId0, { source: ids[1], target: ids[2] });
        });
      });
    });
  });

  it('#unspreadByPath', function (done) {
    var _generageGraphSpreadi3 = generageGraphSpreading();

    var pathGraph = _generageGraphSpreadi3.pathGraph;
    var spreadGraph = _generageGraphSpreadi3.spreadGraph;
    var graphSpreading = _generageGraphSpreadi3.graphSpreading;
    var queueSpreading = _generageGraphSpreadi3.queueSpreading;


    var mainPathLink;

    spreadGraph.on('insert', function (oldLink, newLink) {
      queueSpreading.spreadBySpread(newLink);
    });
    spreadGraph.on('remove', function (oldLink, newLink) {
      queueSpreading.unspreadBySpread(oldLink);
    });
    pathGraph.on('insert', function (oldLink, newLink) {
      queueSpreading.spreadByPath(pathGraph, newLink);
    });
    pathGraph.on('update', function (oldLink, newLink) {
      if (oldLink.source != newLink.source || oldLink.target != newLink.target) {
        queueSpreading.unspreadByPath(pathGraph, newLink);
      } else if (!_lodash2.default.isEqual(oldLink.launched, newLink.launched)) {
        queueSpreading.spreadByPath(pathGraph, newLink);
      }
    });
    pathGraph.on('remove', function (oldLink, newLink) {
      queueSpreading.unspreadByPath(pathGraph, oldLink);
    });
    pathGraph.removed.on('update', function (oldLink, newLink) {
      setTimeout(function () {
        spreadGraph.fetch({}, undefined, function (error, spreadLinks) {
          _chai.assert.deepEqual(spreadLinks, [{ id: 'spread/0', source: 'a', target: 'b' }]);
          pathGraph.fetch({}, undefined, function (error, pathLinks) {
            _chai.assert.deepEqual(pathLinks, [{ id: 'path/1', source: 'c', target: 'd', launched: [] }]);
            done();
          });
        });
      }, 200);
    });

    spreadGraph.insert({ source: ids[0], target: ids[1] }, function (error, spreadLinkId0) {
      pathGraph.insert({ source: ids[1], target: ids[2] }, function (error, pathLinkId0) {
        pathGraph.insert({ source: ids[2], target: ids[3] }, function (error, pathLinkId1) {
          pathGraph.remove(pathLinkId0);
        });
      });
    });
  });
};
//# sourceMappingURL=testQueue.js.map