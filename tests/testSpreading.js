'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = testGraphSpreading;

var _chai = require('chai');

function testGraphSpreading(generateGraphSpreading, ids) {
  it('#spreadNewSpreadLink #spreadFromSpreadLink #spreadFromSpreadLinkByPathGraph #spreadFromSpreadLinkByPathLink', function (done) {
    var _generateGraphSpreadi = generateGraphSpreading();

    var pathGraph = _generateGraphSpreadi.pathGraph;
    var spreadGraph = _generateGraphSpreadi.spreadGraph;
    var graphSpreading = _generateGraphSpreadi.graphSpreading;


    pathGraph.insert({ source: ids[1], target: ids[2] }, function (error, pathLinkId) {
      _chai.assert.ifError(error);

      pathGraph.fetch(pathLinkId, undefined, function (error, pathLinks) {
        _chai.assert.ifError(error);
        _chai.assert.lengthOf(pathLinks, 1);
        _chai.assert.deepEqual(pathLinks[0].launched, ['spread']);

        // no spreadLinks for spread, remove launched spread

        pathGraph.update(pathLinkId, { launched: { remove: 'spread' } }, function (error, count) {
          _chai.assert.ifError(error);
          _chai.assert.equal(count, 1);

          pathGraph.fetch(pathLinkId, undefined, function (error, pathLinks) {
            _chai.assert.ifError(error);
            _chai.assert.lengthOf(pathLinks, 1);
            _chai.assert.deepEqual(pathLinks[0].launched, []);

            graphSpreading.spreadNewSpreadLink({ source: ids[0], target: ids[1], launched: ['spread'] }, undefined, function (error, spreadLinkId0) {
              _chai.assert.ifError(error);

              spreadGraph.fetch(spreadLinkId0, undefined, function (error, spreadLinks) {
                _chai.assert.ifError(error);
                _chai.assert.lengthOf(spreadLinks, 1);

                // as reaction to launched spread in spreadLink

                graphSpreading.spreadFromSpreadLink(spreadLinks[0], { process: spreadLinkId0 }, function (error, id, spreadLink, _pathGraph, pathLink) {
                  _chai.assert.ifError(error);
                  _chai.assert.deepEqual(spreadLink, spreadLinks[0]);
                  _chai.assert.equal(_pathGraph, pathGraph);
                  _chai.assert.deepEqual(pathLink, pathLinks[0]);
                }, function () {
                  spreadGraph.fetch({}, undefined, function (error, spreadLinks) {
                    _chai.assert.ifError(error);
                    _chai.assert.lengthOf(spreadLinks, 2);
                    _chai.assert.deepEqual(spreadLinks, [{ id: spreadLinks[0].id, source: ids[0], target: ids[1], launched: ['spread'] }, {
                      id: spreadLinks[1].id, source: ids[0], target: ids[2],
                      prev: spreadLinkId0, path: pathLinks[0].id, root: spreadLinkId0,
                      process: [spreadLinkId0]
                    }]);

                    // remove process token

                    spreadGraph.update(spreadLinks[1].id, { process: { remove: spreadLinkId0 } }, function (error, count) {
                      _chai.assert.ifError(error);
                      _chai.assert.equal(count, 1);

                      // check other process from this launched

                      spreadGraph.fetch({ process: spreadLinkId0 }, undefined, function (error, spreadLinks) {
                        _chai.assert.ifError(error);
                        _chai.assert.lengthOf(spreadLinks, 0);

                        // remove launched token

                        spreadGraph.update(spreadLinkId0, { launched: { remove: 'spread' } }, function (error, count) {
                          _chai.assert.ifError(error);
                          _chai.assert.equal(count, 1);

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
      });
    });
  });

  it('#spreadByPathLink #spreadFromSpreadLinkByPathGraph #spreadFromSpreadLinkByPathLink', function (done) {
    var _generateGraphSpreadi2 = generateGraphSpreading();

    var pathGraph = _generateGraphSpreadi2.pathGraph;
    var spreadGraph = _generateGraphSpreadi2.spreadGraph;
    var graphSpreading = _generateGraphSpreadi2.graphSpreading;


    graphSpreading.spreadNewSpreadLink({ source: ids[0], target: ids[1] }, undefined, function (error, spreadLinkId0) {
      _chai.assert.ifError(error);

      spreadGraph.fetch(spreadLinkId0, undefined, function (error, spreadLinks) {
        _chai.assert.ifError(error);
        _chai.assert.lengthOf(spreadLinks, 1);

        pathGraph.insert({ source: ids[1], target: ids[2] }, function (error, pathLinkId0) {
          _chai.assert.ifError(error);

          pathGraph.fetch(pathLinkId0, undefined, function (error, pathLinks) {
            _chai.assert.ifError(error);
            _chai.assert.lengthOf(pathLinks, 1);
            _chai.assert.deepEqual(pathLinks[0].launched, ['spread']);

            // as reaction to launched spread in graphLink

            graphSpreading.spreadByPathLink(pathGraph, pathLinks[0], { process: pathLinkId0 }, function (error, id, spreadLink, _pathGraph, pathLink) {
              _chai.assert.ifError(error);
              _chai.assert.deepEqual(spreadLink, spreadLinks[0]);
              _chai.assert.equal(_pathGraph, pathGraph);
              _chai.assert.deepEqual(pathLink, pathLinks[0]);
            }, function () {
              spreadGraph.fetch({}, undefined, function (error, spreadLinks) {
                _chai.assert.lengthOf(spreadLinks, 2);
                _chai.assert.deepEqual(spreadLinks, [{ id: spreadLinks[0].id, source: ids[0], target: ids[1] }, {
                  id: spreadLinks[1].id, source: ids[0], target: ids[2],
                  prev: spreadLinkId0, path: pathLinks[0].id, root: spreadLinkId0,
                  process: [pathLinkId0]
                }]);

                // remove process token

                spreadGraph.update(spreadLinks[1].id, { process: { remove: pathLinkId0 } }, function (error, count) {
                  _chai.assert.ifError(error);
                  _chai.assert.equal(count, 1);

                  // check other process from this launched

                  spreadGraph.fetch({ process: pathLinkId0 }, undefined, function (error, spreadLinks) {
                    _chai.assert.ifError(error);
                    _chai.assert.lengthOf(spreadLinks, 0);

                    // remove launched token

                    pathGraph.update(pathLinkId0, { launched: { remove: 'spread' } }, function (error, count) {
                      _chai.assert.ifError(error);
                      _chai.assert.equal(count, 1);

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
  });

  it('#unspreadFromRemovedSpreadLinkByPrevId', function (done) {
    var _generateGraphSpreadi3 = generateGraphSpreading();

    var pathGraph = _generateGraphSpreadi3.pathGraph;
    var spreadGraph = _generateGraphSpreadi3.spreadGraph;
    var graphSpreading = _generateGraphSpreadi3.graphSpreading;

    pathGraph.insert({ source: ids[1], target: ids[2] }, function (error, pathLinkId0) {
      pathGraph.insert({ source: ids[2], target: ids[3] }, function (error, pathLinkId1) {
        spreadGraph.insert({ source: ids[0], target: ids[1] }, function (error, spreadLinkId0) {
          spreadGraph.insert({ source: ids[0], target: ids[2], prev: spreadLinkId0, path: pathLinkId0, root: spreadLinkId0 }, function (error, spreadLinkId1) {
            spreadGraph.insert({ source: ids[0], target: ids[3], prev: spreadLinkId1, path: pathLinkId1, root: spreadLinkId0 }, function (error, spreadLinkId2) {
              spreadGraph.remove(spreadLinkId0, function (error, count) {
                graphSpreading.unspreadFromRemovedSpreadLinkByPrevId(spreadLinkId0, function (error, spreadLink1) {
                  _chai.assert.ifError(error);
                }, function (error, count) {
                  _chai.assert.ifError(error);
                  spreadGraph.fetch({}, undefined, function (error, spreadLinks) {
                    _chai.assert.ifError(error);
                    _chai.assert.deepEqual(spreadLinks, [{ id: spreadLinkId2, source: ids[0], target: ids[3], prev: spreadLinkId1, path: pathLinkId1, root: spreadLinkId0 }]);
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

  it('#spreadTo #unspread', function (done) {
    var _generateGraphSpreadi4 = generateGraphSpreading();

    var pathGraph = _generateGraphSpreadi4.pathGraph;
    var spreadGraph = _generateGraphSpreadi4.spreadGraph;
    var graphSpreading = _generateGraphSpreadi4.graphSpreading;

    pathGraph.insert({ source: ids[0], target: ids[3] }, function (error, pathLinkId0) {
      pathGraph.insert({ source: ids[1], target: ids[3] }, function (error, pathLinkId1) {
        pathGraph.insert({ source: ids[2], target: ids[3] }, function (error, pathLinkId2) {
          spreadGraph.insert({ source: ids[4], target: ids[0] }, function (error, spreadLinkId0) {
            spreadGraph.insert({ source: ids[5], target: ids[1] }, function (error, spreadLinkId1) {
              spreadGraph.insert({ source: ids[6], target: ids[2] }, function (error, spreadLinkId2) {
                graphSpreading.spreadTo(ids[3], undefined, undefined, function () {
                  spreadGraph.fetch({ target: ids[3] }, undefined, function (error, spreadLinks) {
                    _chai.assert.ifError(error);
                    _chai.assert.lengthOf(spreadLinks, 3);

                    graphSpreading.unspread(ids[3], undefined, undefined, function () {
                      spreadGraph.fetch({ target: ids[3] }, undefined, function (error, spreadLinks) {
                        _chai.assert.ifError(error);
                        _chai.assert.lengthOf(spreadLinks, 0);

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
    });
  });
};
//# sourceMappingURL=testSpreading.js.map