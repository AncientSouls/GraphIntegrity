require('source-map-support').install();

import { assert } from 'chai';

import { Graph } from 'ancient-graph/lib/adapters/object.js';

import { factoryPathGraph, factorySpreadGraph, factorySpreaderGraph, GraphSpreading, QueueSpreading as AncientQueueSpreading } from '../';
import { factoryExistedGraph, factoryNonExistedGraph } from 'ancient-graph-removed';

import testGraphSpreading from './testSpreading.js';
import testQueue from './testQueue.js';
import testSpreader from './testSpreader.js';

describe('AncientSouls/GraphSpreading', function() {
  function generateGraphSpreading() {
    
    // Unique id between graphs

    class NamedGraph extends Graph {
      constructor(collection, fields, config) {
        super(...arguments);
        
        if (config.name) this.name = config.name;
      }
      _idGenerator(index, link) { return this.name+'/'+index; }
    }
    
    // Removed (Existed and NonExisted)
    
    var ExistedGraph = factoryExistedGraph(NamedGraph);
    var NonExistedGraph = factoryNonExistedGraph(NamedGraph);
    
    // PathGraph
    
    var ExistedPathGraph = factoryPathGraph(ExistedGraph);
    var NonExistedPathGraph = NonExistedGraph;
    
    // SpreadGraph
    
    var ExistedSpreadGraph = (() => {
      var ExistedSpreadGraph = factorySpreadGraph(ExistedGraph);
      class CustomExistedSpreadGraph extends ExistedSpreadGraph {
        _spreadingHandler(prevSpreadLink, pathGraph, pathLink, newSpreadLink, context, callback) {
          if (!pathLink) {
            callback(newSpreadLink);
          } else {
            pathGraph.get(pathLink.id, undefined, (error, pathLink) => {
              if (!pathLink) callback();
              else this.get({
                source: newSpreadLink.source, target: newSpreadLink.target,
                prev: newSpreadLink.prev, path: newSpreadLink.path, root: newSpreadLink.root
              }, undefined, (error, spreadLink) => {
                if (spreadLink) callback();
                else this.get(prevSpreadLink.id, undefined, (error, prevSpreadLink) => {
                  callback(prevSpreadLink?newSpreadLink:undefined);
                });
              });
            });
          }
        }
      }
      return CustomExistedSpreadGraph;
    })();
    var NonExistedSpreadGraph = factorySpreadGraph(NonExistedGraph);
    
    // Graphs instances
    
    // pathGraph
    
    var pathGraph = new ExistedPathGraph([], {
        id: 'id', source: 'source', target: 'target',
        removed: 'removed', launched: 'launched', process: 'process'
    }, { name: 'path', fromFields: ['source'], toFields: ['target'] });
    
    pathGraph.removed = new NonExistedPathGraph(
      pathGraph.collection, pathGraph.fields, pathGraph.config
    );
    
    // spreadGraph
    
    var spreadGraph = new ExistedSpreadGraph([], {
      id: 'id', source: 'source', target: 'target',
      removed: 'removed', launched: 'launched', process: 'process',
      prev: 'prev', path: 'path', root: 'root'
    }, { name: 'spread', constantField: 'source', variableField: 'target' });
    
    spreadGraph.removed = new NonExistedSpreadGraph(
      spreadGraph.collection, spreadGraph.fields, spreadGraph.config
    );
    
    // GraphSpreading instance
    
    var graphSpreading = new GraphSpreading(spreadGraph);
    graphSpreading.addPathGraph(pathGraph);
    
    // QueueSpreading id parser
    
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
  
  describe('GraphSpreading PathGraph SpreadGraph', function() {
    testGraphSpreading(generateGraphSpreading, "abcdefghijklmnopqrstuvwxyz".split(""));
  });
  
  describe('QueueSpreading PathGraph SpreadGraph', function() {
    testQueue(generateGraphSpreading, "abcdefghijklmnopqrstuvwxyz".split(""));
  });
  
  describe('SpreaderGraph PathGraph SpreadGraph', function() {
    testSpreader(function() {
      
      // Unique id between graphs
  
      class NamedGraph extends Graph {
        constructor(collection, fields, config) {
          super(...arguments);
          
          if (config.name) this.name = config.name;
        }
        _idGenerator(index, link) { return this.name+'/'+index; }
      }
      
      // Removed (Existed and NonExisted)
      
      var ExistedGraph = factoryExistedGraph(NamedGraph);
      var NonExistedGraph = factoryNonExistedGraph(NamedGraph);
      
      // PathGraph
      
      var ExistedPathGraph = factoryPathGraph(ExistedGraph);
      var NonExistedPathGraph = NonExistedGraph;
      
      // SpreadGraph
      
      var ExistedSpreadGraph = (() => {
        var ExistedSpreadGraph = factorySpreadGraph(ExistedGraph);
        class CustomExistedSpreadGraph extends ExistedSpreadGraph {
          _spreadingHandler(prevSpreadLink, pathGraph, pathLink, newSpreadLink, context, callback) {
            
            // Spreader support for this SpreadGraph
            if (prevSpreadLink && prevSpreadLink.spreader) {
              newSpreadLink.spreader = prevSpreadLink.spreader;
            }
            
            this.fetch({
              source: newSpreadLink.source, target: newSpreadLink.target,
              spreader: newSpreadLink.spreader
            }, undefined, (error, spreadLinks) => {
              callback((!spreadLinks.length)?newSpreadLink:undefined);
            });
          }
        }
        return CustomExistedSpreadGraph;
      })();
      var NonExistedSpreadGraph = factorySpreadGraph(NonExistedGraph);
      
      // SpreaderGraph
      
      var ExistedSpreaderGraph = factorySpreaderGraph(ExistedGraph);
      var NonExistedSpreaderGraph = NonExistedGraph;
      
      // Graphs instances
      
      // pathGraph
      
      var pathGraph = new ExistedPathGraph([], {
          id: 'id', source: 'source', target: 'target',
          removed: 'removed', launched: 'launched', process: 'process'
      }, { name: 'path', fromFields: ['source'], toFields: ['target'] });
      
      pathGraph.removed = new NonExistedPathGraph(
        pathGraph.collection, pathGraph.fields, pathGraph.config
      );
      
      // spreadGraph
      
      var spreadGraph = new ExistedSpreadGraph([], {
        id: 'id', source: 'source', target: 'target',
        removed: 'removed', launched: 'launched', process: 'process', spreader: 'spreader',
        prev: 'prev', path: 'path', root: 'root'
      }, { name: 'spread', constantField: 'source', variableField: 'target' });
      
      spreadGraph.removed = new NonExistedSpreadGraph(
        spreadGraph.collection, spreadGraph.fields, spreadGraph.config
      );
      
      // spreaderGraph
      
      var spreaderGraph = new ExistedSpreaderGraph([], {
          id: 'id', source: 'source', target: 'target',
          removed: 'removed', launched: 'launched', process: 'process'
      }, { name: 'spreader', constantField: 'source', variableField: 'target' });
      
      spreaderGraph.removed = new NonExistedSpreaderGraph(
        spreaderGraph.collection, spreaderGraph.fields, spreaderGraph.config
      );
      
      // GraphSpreading instance
      
      var graphSpreading = new GraphSpreading(spreadGraph);
      graphSpreading.addPathGraph(pathGraph);
      
      // QueueSpreading id parser
      
      class QueueSpreading extends AncientQueueSpreading {
        _getGraph(id) {
          var splited = id.split('/');
          if (splited[0] == 'spread') return spreadGraph;
          else if (splited[0] == 'path') return pathGraph;
          else if (splited[0] == 'spreader') return spreaderGraph;
          else throw new Error('Graph is not founded');
        }
      }
      
      var queueSpreading = new QueueSpreading(graphSpreading);
      
      return { pathGraph, spreadGraph, spreaderGraph, graphSpreading, queueSpreading };
    }, "abcdefghijklmnopqrstuvwxyz".split(""));
  });
});