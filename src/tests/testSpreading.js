import { assert } from 'chai';

export default function testGraphSpreading(generateGraphSpreading, ids) {
  it('#spreadNewSpreadLink #spreadFromSpreadLink #spreadFromSpreadLinkByPathGraph #spreadFromSpreadLinkByPathLink', function(done) {
    var { pathGraph, spreadGraph, graphSpreading } = generateGraphSpreading();
    
    pathGraph.insert({ source: ids[1], target: ids[2] }, function(error, pathLinkId) {
      assert.ifError(error);
      
      pathGraph.fetch(pathLinkId, undefined, (error, pathLinks) => {
        assert.ifError(error);
        assert.lengthOf(pathLinks, 1);
        assert.deepEqual(pathLinks[0].launched, ['spread']);
        
        // no spreadLinks for spread, remove launched spread
        
        pathGraph.update(pathLinkId, { launched: { remove: 'spread' }}, (error, count) => {
          assert.ifError(error);
          assert.equal(count, 1);
          
          pathGraph.fetch(pathLinkId, undefined, (error, pathLinks) => {
            assert.ifError(error);
            assert.lengthOf(pathLinks, 1);
            assert.deepEqual(pathLinks[0].launched, []);
            
            graphSpreading.spreadNewSpreadLink({ source: ids[0], target: ids[1], launched: ['spread'] }, undefined, (error, spreadLinkId0) => {
              assert.ifError(error);
              
              spreadGraph.fetch(spreadLinkId0, undefined, (error, spreadLinks) => {
                assert.ifError(error);
                assert.lengthOf(spreadLinks, 1);
                
                // as reaction to launched spread in spreadLink
                
                graphSpreading.spreadFromSpreadLink(
                  spreadLinks[0], { process: spreadLinkId0 },
                  (error, id, spreadLink, _pathGraph, pathLink) => {
                    assert.ifError(error);
                    assert.deepEqual(spreadLink, spreadLinks[0]);
                    assert.equal(_pathGraph, pathGraph);
                    assert.deepEqual(pathLink, pathLinks[0]);
                  }, () => {
                    spreadGraph.fetch({}, undefined, (error, spreadLinks) => {
                      assert.ifError(error);
                      assert.lengthOf(spreadLinks, 2);
                      assert.deepEqual(spreadLinks, [
                        { id: spreadLinks[0].id, source: ids[0], target: ids[1], launched: ['spread'] },
                        {
                          id: spreadLinks[1].id, source: ids[0], target: ids[2],
                          prev: spreadLinkId0, path: pathLinks[0].id, root: spreadLinkId0,
                          process: [spreadLinkId0]
                        }
                      ]);
                      
                      // remove process token
                      
                      spreadGraph.update(spreadLinks[1].id, { process: { remove: spreadLinkId0}}, (error, count) => {
                        assert.ifError(error);
                        assert.equal(count, 1);
                        
                        // check other process from this launched
                        
                        spreadGraph.fetch({ process: spreadLinkId0 }, undefined, (error, spreadLinks) => {
                          assert.ifError(error);
                          assert.lengthOf(spreadLinks, 0);
                          
                          // remove launched token
                          
                          spreadGraph.update(spreadLinkId0, { launched: { remove: 'spread' }}, (error, count) => {
                            assert.ifError(error);
                            assert.equal(count, 1);
                            
                            done();
                          });
                        });
                      });
                    });
                  }
                );
              });
            });
          });
        });
      });
    });
  });
  
  it('#spreadByPathLink #spreadFromSpreadLinkByPathGraph #spreadFromSpreadLinkByPathLink', function(done) {
    var { pathGraph, spreadGraph, graphSpreading } = generateGraphSpreading();
    
    graphSpreading.spreadNewSpreadLink({ source: ids[0], target: ids[1] }, undefined, (error, spreadLinkId0) => {
      assert.ifError(error);
      
      spreadGraph.fetch(spreadLinkId0, undefined, (error, spreadLinks) => {
        assert.ifError(error);
        assert.lengthOf(spreadLinks, 1);
        
        pathGraph.insert({ source: ids[1], target: ids[2] }, function(error, pathLinkId0) {
          assert.ifError(error);
          
          pathGraph.fetch(pathLinkId0, undefined, (error, pathLinks) => {
            assert.ifError(error);
            assert.lengthOf(pathLinks, 1);
            assert.deepEqual(pathLinks[0].launched, ['spread']);
            
            // as reaction to launched spread in graphLink
            
            graphSpreading.spreadByPathLink(
              pathGraph, pathLinks[0], { process: pathLinkId0 },
              (error, id, spreadLink, _pathGraph, pathLink) => {
                assert.ifError(error);
                assert.deepEqual(spreadLink, spreadLinks[0]);
                assert.equal(_pathGraph, pathGraph);
                assert.deepEqual(pathLink, pathLinks[0]);
              },
              () => {
                spreadGraph.fetch({}, undefined, (error, spreadLinks) => {
                  assert.lengthOf(spreadLinks, 2);
                  assert.deepEqual(spreadLinks, [
                    { id: spreadLinks[0].id, source: ids[0], target: ids[1] },
                    {
                      id: spreadLinks[1].id, source: ids[0], target: ids[2],
                      prev: spreadLinkId0, path: pathLinks[0].id, root: spreadLinkId0,
                      process: [ pathLinkId0 ]
                    }
                  ]);
                      
                  // remove process token
                  
                  spreadGraph.update(spreadLinks[1].id, { process: { remove: pathLinkId0 }}, (error, count) => {
                    assert.ifError(error);
                    assert.equal(count, 1);
                    
                    // check other process from this launched
                    
                    spreadGraph.fetch({ process: pathLinkId0 }, undefined, (error, spreadLinks) => {
                      assert.ifError(error);
                      assert.lengthOf(spreadLinks, 0);
                      
                      // remove launched token
                      
                      pathGraph.update(pathLinkId0, { launched: { remove: 'spread' }}, (error, count) => {
                        assert.ifError(error);
                        assert.equal(count, 1);
                        
                        done();
                      });
                    });
                  });
                });
              }
            );
          });
        });
      });
    });
  });
  
  it('#unspreadFromRemovedSpreadLinkByPrevId', function(done) {
    var { pathGraph, spreadGraph, graphSpreading } = generateGraphSpreading();
    pathGraph.insert({ source: ids[1], target: ids[2] }, (error, pathLinkId0) => {
      pathGraph.insert({ source: ids[2], target: ids[3] }, (error, pathLinkId1) => {
        spreadGraph.insert({ source: ids[0], target: ids[1] }, (error, spreadLinkId0) => {
          spreadGraph.insert({ source: ids[0], target: ids[2], prev: spreadLinkId0, path: pathLinkId0, root: spreadLinkId0 }, (error, spreadLinkId1) => {
            spreadGraph.insert({ source: ids[0], target: ids[3], prev: spreadLinkId1, path: pathLinkId1, root: spreadLinkId0 }, (error, spreadLinkId2) => {
              spreadGraph.remove(spreadLinkId0, (error, count) => {
                graphSpreading.unspreadFromRemovedSpreadLinkByPrevId(spreadLinkId0, (error, spreadLink1) => {
                  assert.ifError(error);
                }, (error, count) => {
                  assert.ifError(error);
                  spreadGraph.fetch({}, undefined, (error, spreadLinks) => {
                    assert.ifError(error);
                    assert.deepEqual(spreadLinks, [
                      { id: spreadLinkId2, source: ids[0], target: ids[3], prev: spreadLinkId1, path: pathLinkId1, root: spreadLinkId0 }
                    ]);
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