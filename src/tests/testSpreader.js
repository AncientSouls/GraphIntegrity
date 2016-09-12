import { assert } from 'chai';
import { factoryPathGraph, factorySpreadGraph, GraphSpreading, QueueSpreading } from '../';
import lodash from 'lodash';

export default function testSpreader(generageGraphSpreading, ids) {
  it('#insertedSpreaderLink', function(done) {
    var { pathGraph, spreadGraph, spreaderGraph, graphSpreading, queueSpreading } = generageGraphSpreading();
    
    spreadGraph.on('insert', (oldLink, newLink) => {
      queueSpreading.insertedSpreadLink(newLink);
    });
    spreadGraph.on('remove', (oldLink, newLink) => {
      queueSpreading.removedSpreadLink(oldLink);
    });
    
    spreaderGraph.on('insert', (oldLink, newLink) => {
      queueSpreading.insertedSpreaderLink(spreaderGraph, newLink);
    });
    
    spreaderGraph.on('update', (oldLink, newLink) => {
      assert.lengthOf(newLink.launched, 0);
      spreadGraph.fetch({}, undefined, (error, results) => {
        assert.deepEqual(results, [
          { source: 'a', target: 'b', id: 'spread/0',
            process: [], spreader: 'spreader/0'
          },
          { source: 'a', target: 'c', id: 'spread/1',
            prev: 'spread/0', path: 'path/0', root: 'spread/0',
            process: [], spreader: 'spreader/0'
          },
          { source: 'a', target: 'd', id: 'spread/2',
            prev: 'spread/1', path: 'path/1', root: 'spread/0',
            process: [], spreader: 'spreader/0'
          },
          { source: 'a', target: 'e', id: 'spread/3',
            prev: 'spread/2', path: 'path/2', root: 'spread/0',
            process: [], spreader: 'spreader/0'
          },
        ]);
        done();
      });
    });
    
    pathGraph.insert({ source: ids[1], target: ids[2] }, (error, graphLinkId0) => {
      pathGraph.insert({ source: ids[2], target: ids[3] }, (error, graphLinkId1) => {
        pathGraph.insert({ source: ids[3], target: ids[4] }, (error, graphLinkId2) => {
          spreaderGraph.insert({ source: ids[0], target: ids[1] });
        });
      });
    });
  });
  
  it('#updatedSourceOrTargetSpreaderLink #updatedLaunchedUnspreadSpreaderLink', function(done) {
    var { pathGraph, spreadGraph, spreaderGraph, graphSpreading, queueSpreading } = generageGraphSpreading();
    
    spreadGraph.on('insert', (oldLink, newLink) => {
      queueSpreading.insertedSpreadLink(newLink);
    });
    spreadGraph.on('remove', (oldLink, newLink) => {
      queueSpreading.removedSpreadLink(oldLink);
    });
    
    spreaderGraph.on('insert', (oldLink, newLink) => {
      queueSpreading.insertedSpreaderLink(spreaderGraph, newLink);
    });
    
    spreaderGraph.on('update', (oldLink, newLink) => {
      if (oldLink.source != newLink.source || oldLink.target != newLink.target) {
        queueSpreading.updatedSourceOrTargetSpreaderLink(spreaderGraph, newLink);
      } else {
        if (newLink.target == ids[1]) {
          spreaderGraph.update(newLink.id, { target: ids[2] });
        } else {
          if (newLink.launched.length) {
            queueSpreading.updatedLaunchedUnspreadSpreaderLink(spreaderGraph, newLink);
          } else {
            spreadGraph.fetch({}, undefined, (error, results) => {
              assert.deepEqual(results, [
                { source: 'a', target: 'c', id: 'spread/4',
                  process: [], spreader: 'spreader/0'
                },
                { source: 'a', target: 'd', id: 'spread/5',
                  prev: 'spread/4', path: 'path/1', root: 'spread/4',
                  process: [], spreader: 'spreader/0'
                },
                { source: 'a', target: 'e', id: 'spread/6',
                  prev: 'spread/5', path: 'path/2', root: 'spread/4',
                  process: [], spreader: 'spreader/0'
                },
              ]);
              done();
            });
          }
        }
      }
    });
    
    pathGraph.insert({ source: ids[1], target: ids[2] }, (error, graphLinkId0) => {
      pathGraph.insert({ source: ids[2], target: ids[3] }, (error, graphLinkId1) => {
        pathGraph.insert({ source: ids[3], target: ids[4] }, (error, graphLinkId2) => {
          spreaderGraph.insert({ source: ids[0], target: ids[1] });
        });
      });
    });
  });
  
  it('#removedSpreaderLink', function(done) {
    var { pathGraph, spreadGraph, spreaderGraph, graphSpreading, queueSpreading } = generageGraphSpreading();
    
    spreadGraph.on('insert', (oldLink, newLink) => {
      queueSpreading.insertedSpreadLink(newLink);
    });
    spreadGraph.on('remove', (oldLink, newLink) => {
      queueSpreading.removedSpreadLink(oldLink);
    });
    
    spreaderGraph.on('insert', (oldLink, newLink) => {
      queueSpreading.insertedSpreaderLink(spreaderGraph, newLink);
    });
    spreaderGraph.on('update', (oldLink, newLink) => {
      assert.lengthOf(newLink.launched, 0);
      spreaderGraph.remove(newLink.id);
    });
    spreaderGraph.on('remove', (oldLink, newLink) => {
      queueSpreading.removedSpreaderLink(spreaderGraph, oldLink);
    });
    
    spreaderGraph.removed.on('update', (oldLink, newLink) => {
      assert.lengthOf(newLink.launched, 0);
      spreadGraph.fetch({}, undefined, (error, spreadLinks) => {
        assert.lengthOf(spreadLinks, 0);
        spreaderGraph.fetch({}, undefined, (error, spreaderLinks) => {
          assert.lengthOf(spreaderLinks, 0);
          done();
        });
      });
    });
    
    pathGraph.insert({ source: ids[1], target: ids[2] }, (error, graphLinkId0) => {
      pathGraph.insert({ source: ids[2], target: ids[3] }, (error, graphLinkId1) => {
        pathGraph.insert({ source: ids[3], target: ids[4] }, (error, graphLinkId2) => {
          spreaderGraph.insert({ source: ids[0], target: ids[1] });
        });
      });
    });
  });
};