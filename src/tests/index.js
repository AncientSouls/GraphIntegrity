require('source-map-support').install();

import { Graph } from 'ancient-graph/lib/adapters/object.js';

import { factoryPathGraph, factorySpreadGraph, GraphSpreading, QueueSpreading as AncientQueueSpreading } from '../';
import { factoryExistedGraph, factoryNonExistedGraph } from 'ancient-graph-removed';

import testGraphSpreading from './testSpreading.js';
import testQueue from './testQueue.js';

describe('AncientSouls/GraphSpreading', function() {
  function generateGraphSpreading() {
    
    class NamedGraph extends Graph {
      constructor(collection, fields, name) {
        super(collection, fields);
        this._name = name;
      }
      _idGenerator(index, link) { return this._name+'/'+index; }
    }
    
    var ExistedGraph = factoryExistedGraph(NamedGraph);
    var NonExistedGraph = factoryNonExistedGraph(NamedGraph);
    
    var ExistedPathGraph = factoryPathGraph(ExistedGraph);
    var NonExistedPathGraph = NonExistedGraph;
    
    var ExistedSpreadGraph = (() => {
      var ExistedSpreadGraph = factorySpreadGraph(ExistedGraph);
      class CustomExistedSpreadGraph extends ExistedSpreadGraph {
        _spreadingHandler(prevSpreadLink, pathGraph, pathLink, newSpreadLink, context, callback) {
          if (!pathLink) {
            callback(newSpreadLink);
          } else {
            pathGraph.fetch(pathLink.id, undefined, (error, pathLinks) => {
              this.fetch({
                source: newSpreadLink.source, target: newSpreadLink.target,
                prev: newSpreadLink.prev, path: newSpreadLink.path, root: newSpreadLink.root
              }, undefined, (error, spreadLinks) => {
                callback(!spreadLinks.length&&pathLinks.length?newSpreadLink:undefined);
              });
            });
          }
        }
      }
      return CustomExistedSpreadGraph;
    })();
    var NonExistedSpreadGraph = factorySpreadGraph(NonExistedGraph);
    
    var pathGraph = new ExistedPathGraph([[], {
        id: 'id', source: 'source', target: 'target',
        removed: 'removed', launched: 'launched', process: 'process'
    }, 'path'], 'source', 'target');
    
    pathGraph.removed = new NonExistedPathGraph(
      pathGraph.collection, pathGraph.fields, pathGraph._name
    );
    
    var spreadGraph = new ExistedSpreadGraph([[], {
      id: 'id', source: 'source', target: 'target',
      removed: 'removed', launched: 'launched', process: 'process',
      prev: 'prev', path: 'path', root: 'root'
    }, 'spread'], 'source', 'target');
    
    spreadGraph.removed = new NonExistedSpreadGraph(
      [spreadGraph.collection, spreadGraph.fields, spreadGraph._name],
      spreadGraph._fromField, spreadGraph._toField
    );
    
    var graphSpreading = new GraphSpreading(spreadGraph);
    graphSpreading.addPathGraph(pathGraph);
    
    class QueueSpreading extends AncientQueueSpreading {
      _getGraph(id) {
        var splited = id.split('/');
        if (splited[0] == 'spread') return spreadGraph;
        else if (splited[0] == 'path') return pathGraph;
        else throw new Error('Graph is not founded');
      }
    }
    
    var queueSpreading = new QueueSpreading(graphSpreading);
    
    return { pathGraph, spreadGraph, graphSpreading, queueSpreading };
  };
  
  describe('GraphSpreading', function() {
    testGraphSpreading(generateGraphSpreading, "abcdefghijklmnopqrstuvwxyz".split(""));
  });
  
  describe('QueueSpreading', function() {
    testQueue(generateGraphSpreading, "abcdefghijklmnopqrstuvwxyz".split(""));
  });
});