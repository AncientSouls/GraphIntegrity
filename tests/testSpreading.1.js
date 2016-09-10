'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = testGraphSpreading;

var _chai = require('chai');

function testGraphSpreading(generateGraphSpreading) {
  it('#spreadFromSpreadLinkByPathLink', function (done) {
    var _generateGraphSpreadi = generateGraphSpreading();

    var pathGraph = _generateGraphSpreadi.pathGraph;
    var spreadGraph = _generateGraphSpreadi.spreadGraph;
    var graphSpreading = _generateGraphSpreadi.graphSpreading;

    pathGraph.insert({ source: 'b', target: 'c' }, function (error, pathLinkId) {
      spreadGraph.insert({ source: 'a', target: 'b' }, function (error, spreadLinkId0) {
        spreadGraph.fetch(spreadLinkId0, undefined, function (error, spreadLinks) {
          _chai.assert.lengthOf(spreadLinks, 1);
          pathGraph.fetch(pathLinkId, undefined, function (error, pathLinks) {
            _chai.assert.lengthOf(pathLinks, 1);
            graphSpreading.spreadFromSpreadLinkByPathLink(spreadLinks[0], pathGraph, pathLinks[0], undefined, function (error, spreadLinkId1, spreadLink, _pathGraph, pathLink) {
              _chai.assert.ifError(error);
              _chai.assert.deepEqual(spreadLink, spreadLinks[0]);
              _chai.assert.equal(_pathGraph, pathGraph);
              _chai.assert.deepEqual(pathLink, pathLinks[0]);
              spreadGraph.fetch({}, undefined, function (error, spreadLinks) {
                _chai.assert.lengthOf(spreadLinks, 2);
                _chai.assert.deepEqual(spreadLinks, [{ id: spreadLinkId0, source: 'a', target: 'b' }, { id: spreadLinkId1, source: 'a', target: 'c', prev: spreadLinkId0, path: pathLink.id, root: spreadLinkId0 }]);
                done();
              });
            });
          });
        });
      });
    });
  });

  it('#spreadFromSpreadLinkByPathGraph', function (done) {
    var _generateGraphSpreadi2 = generateGraphSpreading();

    var pathGraph = _generateGraphSpreadi2.pathGraph;
    var spreadGraph = _generateGraphSpreadi2.spreadGraph;
    var graphSpreading = _generateGraphSpreadi2.graphSpreading;

    pathGraph.insert({ source: 'b', target: 'c' }, function (error, pathLinkId) {
      spreadGraph.insert({ source: 'a', target: 'b' }, function (error, spreadLinkId) {
        spreadGraph.fetch(spreadLinkId, undefined, function (error, spreadLinks) {
          _chai.assert.lengthOf(spreadLinks, 1);
          pathGraph.fetch(pathLinkId, undefined, function (error, pathLinks) {
            _chai.assert.lengthOf(pathLinks, 1);
            graphSpreading.spreadFromSpreadLinkByPathGraph(spreadLinks[0], pathGraph, undefined, function (error, id, spreadLink, _pathGraph, pathLink) {
              _chai.assert.ifError(error);
              _chai.assert.deepEqual(spreadLink, spreadLinks[0]);
              _chai.assert.equal(_pathGraph, pathGraph);
              _chai.assert.deepEqual(pathLink, pathLinks[0]);
              spreadGraph.fetch(id, undefined, function (error, spreadLinks) {
                _chai.assert.deepEqual(spreadLinks, [{ id: id, source: 'a', target: 'c', prev: spreadLinkId, path: pathLink.id, root: spreadLinkId }]);
              });
            }, function () {
              spreadGraph.fetch({}, undefined, function (error, pathLinks) {
                _chai.assert.lengthOf(pathLinks, 2);
                done();
              });
            });
          });
        });
      });
    });
  });

  it('#spreadFromSpreadLink', function (done) {
    var _generateGraphSpreadi3 = generateGraphSpreading();

    var pathGraph = _generateGraphSpreadi3.pathGraph;
    var spreadGraph = _generateGraphSpreadi3.spreadGraph;
    var graphSpreading = _generateGraphSpreadi3.graphSpreading;

    pathGraph.insert({ source: 'b', target: 'c' }, function (error, pathLinkId) {
      spreadGraph.insert({ source: 'a', target: 'b' }, function (error, spreadLinkId) {
        spreadGraph.fetch(spreadLinkId, undefined, function (error, spreadLinks) {
          _chai.assert.lengthOf(spreadLinks, 1);
          pathGraph.fetch(pathLinkId, undefined, function (error, pathLinks) {
            _chai.assert.lengthOf(pathLinks, 1);
            graphSpreading.spreadFromSpreadLink(spreadLinks[0], undefined, function (error, id, spreadLink, _pathGraph, pathLink) {
              _chai.assert.ifError(error);
              _chai.assert.deepEqual(spreadLink, spreadLinks[0]);
              _chai.assert.equal(_pathGraph, pathGraph);
              _chai.assert.deepEqual(pathLink, pathLinks[0]);
              spreadGraph.fetch(id, undefined, function (error, spreadLinks) {
                _chai.assert.deepEqual(spreadLinks, [{ id: id, source: 'a', target: 'c', prev: spreadLinkId, path: pathLinks[0].id, root: spreadLinkId }]);
              });
            }, function () {
              spreadGraph.fetch({}, undefined, function (error, spreadLinks) {
                _chai.assert.lengthOf(spreadLinks, 2);
                _chai.assert.notDeepEqual(spreadLinks, [{ source: 'a', target: 'b' }, { source: 'a', target: 'c', prev: spreadLinkId, path: pathLinks[0].id, root: spreadLinkId }]);
                done();
              });
            });
          });
        });
      });
    });
  });

  it('#spreadNewSpreadLink', function (done) {
    var _generateGraphSpreadi4 = generateGraphSpreading();

    var pathGraph = _generateGraphSpreadi4.pathGraph;
    var spreadGraph = _generateGraphSpreadi4.spreadGraph;
    var graphSpreading = _generateGraphSpreadi4.graphSpreading;

    pathGraph.insert({ source: 'b', target: 'c' }, function (error, pathLinkId) {
      graphSpreading.spreadNewSpreadLink({ source: 'a', target: 'b' }, undefined, function (error, id) {
        _chai.assert.ifError(error);
        spreadGraph.fetch({}, undefined, function (error, pathLinks) {
          _chai.assert.lengthOf(pathLinks, 1);
          _chai.assert.deepEqual(pathLinks, [{ id: id, source: 'a', target: 'b' }]);
          done();
        });
      });
    });
  });

  it('#spreadByPathLink', function (done) {
    var _generateGraphSpreadi5 = generateGraphSpreading();

    var pathGraph = _generateGraphSpreadi5.pathGraph;
    var spreadGraph = _generateGraphSpreadi5.spreadGraph;
    var graphSpreading = _generateGraphSpreadi5.graphSpreading;

    spreadGraph.insert({ source: 'a', target: 'b' }, function (error, spreadLinkId) {
      spreadGraph.fetch(spreadLinkId, undefined, function (error, spreadLinks) {
        _chai.assert.lengthOf(spreadLinks, 1);
        pathGraph.insert({ source: 'b', target: 'c' }, function (error, pathLinkId) {
          pathGraph.fetch(pathLinkId, undefined, function (error, pathLinks) {
            graphSpreading.spreadByPathLink(pathGraph, pathLinks[0], undefined, function (error, id, spreadLink, _pathGraph, pathLink) {
              _chai.assert.ifError(error);
              _chai.assert.deepEqual(spreadLink, spreadLinks[0]);
              _chai.assert.equal(_pathGraph, pathGraph);
              _chai.assert.deepEqual(pathLink, pathLinks[0]);
            }, function () {
              spreadGraph.fetch({}, undefined, function (error, pathLinks) {
                _chai.assert.lengthOf(pathLinks, 2);
                done();
              });
            });
          });
        });
      });
    });
  });

  it('#unspreadFromRemovedSpreadLinkByPrevId', function (done) {
    var _generateGraphSpreadi6 = generateGraphSpreading();

    var pathGraph = _generateGraphSpreadi6.pathGraph;
    var spreadGraph = _generateGraphSpreadi6.spreadGraph;
    var graphSpreading = _generateGraphSpreadi6.graphSpreading;

    pathGraph.insert({ source: 'b', target: 'c' }, function (error, pathLinkId0) {
      pathGraph.insert({ source: 'c', target: 'e' }, function (error, pathLinkId1) {
        spreadGraph.insert({ source: 'a', target: 'b' }, function (error, spreadLinkId0) {
          spreadGraph.insert({ source: 'a', target: 'c', prev: spreadLinkId0, path: pathLinkId0, root: spreadLinkId0 }, function (error, spreadLinkId1) {
            spreadGraph.insert({ source: 'a', target: 'e', prev: spreadLinkId1, path: pathLinkId1, root: spreadLinkId0 }, function (error, spreadLinkId2) {
              spreadGraph.remove(spreadLinkId0, function (error, count) {
                graphSpreading.unspreadFromRemovedSpreadLinkByPrevId(spreadLinkId0, function (error, spreadLink1) {
                  _chai.assert.ifError(error);
                }, function (error, count) {
                  _chai.assert.ifError(error);
                  spreadGraph.fetch({}, undefined, function (error, spreadLinks) {
                    _chai.assert.ifError(error);
                    _chai.assert.deepEqual(spreadLinks, [{ id: spreadLinkId2, source: 'a', target: 'e', prev: spreadLinkId1, path: pathLinkId1, root: spreadLinkId0 }]);
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};
//# sourceMappingURL=testSpreading.1.js.map