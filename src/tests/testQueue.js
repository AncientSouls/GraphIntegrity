import { assert } from 'chai';
import { factoryPathGraph, factorySpreadGraph, GraphSpreading, QueueSpreading } from '../';
import lodash from 'lodash';

export default function testQueue(generageGraphSpreading, ids) {
  it('#insertedPathLink', function(done) {
    var { pathGraph, spreadGraph, graphSpreading, queueSpreading } = generageGraphSpreading();
    
    spreadGraph.insert({ source: ids[0], target: ids[1] }, (error, spreadLinkId0) => {
      pathGraph.insert({ source: ids[2], target: ids[3] }, (error, pathLinkId0) => {
        spreadGraph.on('insert', (oldLink, newLink) => {
          queueSpreading.insertedSpreadLink(newLink);
        });
        spreadGraph.on('remove', (oldLink, newLink) => {
          queueSpreading.removedSpreadLink(oldLink);
        });
        pathGraph.on('insert', (oldLink, newLink) => {
          queueSpreading.insertedPathLink(pathGraph, newLink);
        });
        pathGraph.on('update', (oldLink, newLink) => {
          assert.lengthOf(newLink.launched, 0);
          spreadGraph.fetch({}, undefined, (error, results) => {
            assert.deepEqual(results, [
              { source: 'a', target: 'b', id: 'spread/0' },
              {
                source: 'a', target: 'c', id: 'spread/1',
                prev: 'spread/0', path: 'path/1', root: 'spread/0',
                process: [],
              },
              {
                source: 'a', target: 'd', id: 'spread/2',
                prev: 'spread/1', path: 'path/0', root: 'spread/0',
                process: [],
              }
            ]);
            done();
          });
        });
        pathGraph.insert({ source: ids[1], target: ids[2] });
      });
    });
  });
  it('#updatedSourceOrTargetPathLink #updatedLaunchedUnspreadPathLink', function(done) {
    var { pathGraph, spreadGraph, graphSpreading, queueSpreading } = generageGraphSpreading();
    
    var mainPathLink;
    
    spreadGraph.on('insert', (oldLink, newLink) => {
      queueSpreading.insertedSpreadLink(newLink);
    });
    spreadGraph.on('remove', (oldLink, newLink) => {
      queueSpreading.removedSpreadLink(oldLink);
    });
    pathGraph.on('insert', (oldLink, newLink) => {
      queueSpreading.insertedPathLink(pathGraph, newLink);
    });
    pathGraph.on('update', (oldLink, newLink) => {
      if (oldLink.source != newLink.source || oldLink.target != newLink.target) {
        queueSpreading.updatedSourceOrTargetPathLink(pathGraph, newLink);
      } else if(!lodash.isEqual(oldLink.launched, newLink.launched)) {
        if (newLink.id == mainPathLink && newLink.launched == 0) {
          spreadGraph.fetch({}, undefined, (error, results) => {
            assert.deepEqual(results, [
              { source: 'a', target: 'b', id: 'spread/0' },
              {
                source: 'a', target: 'c', id: 'spread/1',
                prev: 'spread/0', path: 'path/0', root: 'spread/0',
                process: [],
              },
              {
                source: 'a', target: 'd', id: 'spread/2',
                prev: 'spread/1', path: 'path/1', root: 'spread/0',
                process: [],
              }
            ]);
            pathGraph.fetch({}, undefined, (error, results) => {
              assert.deepEqual(results, [
                {
                  "id": "path/0",
                  "launched": [],
                  "source": "b",
                  "target": "c"
                },
                {
                  "id": "path/1",
                  "launched": [],
                  "source": "c",
                  "target": "d"
                }
              ]);
              done();
            });
          });
        } else {
          queueSpreading.updatedLaunchedUnspreadPathLink(pathGraph, newLink);
        }
      }
    });
    
    spreadGraph.insert({ source: ids[0], target: ids[1] }, (error, spreadLinkId0) => {
      pathGraph.insert({ source: ids[3], target: ids[3] }, (error, pathLinkId0) => {
        mainPathLink = pathLinkId0;
        pathGraph.insert({ source: ids[2], target: ids[3] }, (error, pathLinkId1) => {
          pathGraph.update(pathLinkId0, { source: ids[1], target: ids[2] });
        });
      });
    });
  });
  
  it('#removedPathLink', function(done) {
    var { pathGraph, spreadGraph, graphSpreading, queueSpreading } = generageGraphSpreading();
    
    var mainPathLink;
    
    spreadGraph.on('insert', (oldLink, newLink) => {
      queueSpreading.insertedSpreadLink(newLink);
    });
    spreadGraph.on('remove', (oldLink, newLink) => {
      queueSpreading.removedSpreadLink(oldLink);
    });
    pathGraph.on('insert', (oldLink, newLink) => {
      queueSpreading.insertedPathLink(pathGraph, newLink);
    });
    pathGraph.on('update', (oldLink, newLink) => {
      if (oldLink.source != newLink.source || oldLink.target != newLink.target) {
        queueSpreading.updatedSourceOrTargetPathLink(pathGraph, newLink);
      } else if(!lodash.isEqual(oldLink.launched, newLink.launched)) {
        queueSpreading.updatedLaunchedUnspreadPathLink(pathGraph, newLink);
      }
    });
    pathGraph.on('remove', (oldLink, newLink) => {
      queueSpreading.removedPathLink(pathGraph, oldLink);
    });
    pathGraph.removed.on('update', (oldLink, newLink) => {
      setTimeout(() => {
        spreadGraph.fetch({}, undefined, (error, spreadLinks) => {
          assert.deepEqual(spreadLinks, [
            { id: 'spread/0', source: 'a', target: 'b' }
          ]);
          pathGraph.fetch({}, undefined, (error, pathLinks) => {
            assert.deepEqual(pathLinks, [
              { id: 'path/1', source: 'c', target: 'd', launched: [] }
            ]);
            done();
          });
        });
      }, 200);
    });
    
    spreadGraph.insert({ source: ids[0], target: ids[1] }, (error, spreadLinkId0) => {
      pathGraph.insert({ source: ids[1], target: ids[2] }, (error, pathLinkId0) => {
        pathGraph.insert({ source: ids[2], target: ids[3] }, (error, pathLinkId1) => {
          pathGraph.remove(pathLinkId0);
        });
      });
    });
  });
};