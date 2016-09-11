'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = testSpreader;

var _chai = require('chai');

var _ = require('../');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function testSpreader(generageGraphSpreading, ids) {
  it('#insertedSpreaderLink', function (done) {
    var _generageGraphSpreadi = generageGraphSpreading();

    var pathGraph = _generageGraphSpreadi.pathGraph;
    var spreadGraph = _generageGraphSpreadi.spreadGraph;
    var spreaderGraph = _generageGraphSpreadi.spreaderGraph;
    var graphSpreading = _generageGraphSpreadi.graphSpreading;
    var queueSpreading = _generageGraphSpreadi.queueSpreading;


    spreadGraph.on('insert', function (oldLink, newLink) {
      queueSpreading.insertedSpreadLink(newLink);
    });
    spreadGraph.on('remove', function (oldLink, newLink) {
      queueSpreading.removedSpreadLink(oldLink);
    });

    spreaderGraph.on('insert', function (oldLink, newLink) {
      queueSpreading.insertedSpreaderLink(spreaderGraph, newLink);
    });

    spreaderGraph.on('update', function (oldLink, newLink) {
      _chai.assert.lengthOf(newLink.launched, 0);
      spreadGraph.fetch({}, undefined, function (error, results) {
        _chai.assert.deepEqual(results, [{ source: 'a', target: 'b', id: 'spread/0',
          process: [], spreader: 'spreader/0'
        }, { source: 'a', target: 'c', id: 'spread/1',
          prev: 'spread/0', path: 'path/0', root: 'spread/0',
          process: [], spreader: 'spreader/0'
        }, { source: 'a', target: 'd', id: 'spread/2',
          prev: 'spread/1', path: 'path/1', root: 'spread/0',
          process: [], spreader: 'spreader/0'
        }, { source: 'a', target: 'e', id: 'spread/3',
          prev: 'spread/2', path: 'path/2', root: 'spread/0',
          process: [], spreader: 'spreader/0'
        }]);
        done();
      });
    });

    pathGraph.insert({ source: ids[1], target: ids[2] }, function (error, graphLinkId0) {
      pathGraph.insert({ source: ids[2], target: ids[3] }, function (error, graphLinkId1) {
        pathGraph.insert({ source: ids[3], target: ids[4] }, function (error, graphLinkId2) {
          spreaderGraph.insert({ source: ids[0], target: ids[1] });
        });
      });
    });
  });

  it('#updatedSourceOrTargetSpreaderLink #updatedLaunchedUnspreadSpreaderLink', function (done) {
    var _generageGraphSpreadi2 = generageGraphSpreading();

    var pathGraph = _generageGraphSpreadi2.pathGraph;
    var spreadGraph = _generageGraphSpreadi2.spreadGraph;
    var spreaderGraph = _generageGraphSpreadi2.spreaderGraph;
    var graphSpreading = _generageGraphSpreadi2.graphSpreading;
    var queueSpreading = _generageGraphSpreadi2.queueSpreading;


    spreadGraph.on('insert', function (oldLink, newLink) {
      queueSpreading.insertedSpreadLink(newLink);
    });
    spreadGraph.on('remove', function (oldLink, newLink) {
      queueSpreading.removedSpreadLink(oldLink);
    });

    spreaderGraph.on('insert', function (oldLink, newLink) {
      queueSpreading.insertedSpreaderLink(spreaderGraph, newLink);
    });

    spreaderGraph.on('update', function (oldLink, newLink) {
      if (oldLink.source != newLink.source || oldLink.target != newLink.target) {
        queueSpreading.updatedSourceOrTargetSpreaderLink(spreaderGraph, newLink);
      } else {
        if (newLink.target == ids[1]) {
          spreaderGraph.update(newLink.id, { target: ids[2] });
        } else {
          if (newLink.launched.length) {
            queueSpreading.updatedLaunchedUnspreadSpreaderLink(spreaderGraph, newLink);
          } else {
            spreadGraph.fetch({}, undefined, function (error, results) {
              _chai.assert.deepEqual(results, [{ source: 'a', target: 'c', id: 'spread/4',
                process: [], spreader: 'spreader/0'
              }, { source: 'a', target: 'd', id: 'spread/5',
                prev: 'spread/4', path: 'path/1', root: 'spread/4',
                process: [], spreader: 'spreader/0'
              }, { source: 'a', target: 'e', id: 'spread/6',
                prev: 'spread/5', path: 'path/2', root: 'spread/4',
                process: [], spreader: 'spreader/0'
              }]);
              done();
            });
          }
        }
      }
    });

    pathGraph.insert({ source: ids[1], target: ids[2] }, function (error, graphLinkId0) {
      pathGraph.insert({ source: ids[2], target: ids[3] }, function (error, graphLinkId1) {
        pathGraph.insert({ source: ids[3], target: ids[4] }, function (error, graphLinkId2) {
          spreaderGraph.insert({ source: ids[0], target: ids[1] });
        });
      });
    });
  });

  it('#removedSpreaderLink', function (done) {
    var _generageGraphSpreadi3 = generageGraphSpreading();

    var pathGraph = _generageGraphSpreadi3.pathGraph;
    var spreadGraph = _generageGraphSpreadi3.spreadGraph;
    var spreaderGraph = _generageGraphSpreadi3.spreaderGraph;
    var graphSpreading = _generageGraphSpreadi3.graphSpreading;
    var queueSpreading = _generageGraphSpreadi3.queueSpreading;


    spreadGraph.on('insert', function (oldLink, newLink) {
      queueSpreading.insertedSpreadLink(newLink);
    });
    spreadGraph.on('remove', function (oldLink, newLink) {
      queueSpreading.removedSpreadLink(oldLink);
    });

    spreaderGraph.on('insert', function (oldLink, newLink) {
      queueSpreading.insertedSpreaderLink(spreaderGraph, newLink);
    });

    spreaderGraph.on('update', function (oldLink, newLink) {
      _chai.assert.lengthOf(newLink.launched, 0);
      spreaderGraph.remove(newLink.id);
    });
    spreaderGraph.on('remove', function (oldLink, newLink) {
      queueSpreading.removedSpreaderLink(spreaderGraph, oldLink);
    });

    spreaderGraph.removed.on('update', function (oldLink, newLink) {
      _chai.assert.lengthOf(newLink.launched, 0);
      spreadGraph.fetch({}, undefined, function (error, spreadLinks) {
        _chai.assert.lengthOf(spreadLinks, 0);
        spreaderGraph.fetch({}, undefined, function (error, spreaderLinks) {
          _chai.assert.lengthOf(spreaderLinks, 0);
          done();
        });
      });
    });

    pathGraph.insert({ source: ids[1], target: ids[2] }, function (error, graphLinkId0) {
      pathGraph.insert({ source: ids[2], target: ids[3] }, function (error, graphLinkId1) {
        pathGraph.insert({ source: ids[3], target: ids[4] }, function (error, graphLinkId2) {
          spreaderGraph.insert({ source: ids[0], target: ids[1] });
        });
      });
    });
  });
};
//# sourceMappingURL=testSpreader.js.map