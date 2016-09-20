/**
 * This method allows you to use SpreadGraph class to its inheritance chain.
 * Fields launched, process, prev, path and root is required!
 * Manage fields launched and process.
 * 
 * @param {Class} ParentClassGraph
 * @return {Class} SpreadGraph
 * @description `import { factorySpreadGraph } from 'ancient-graph-spreading';`
 */
function factorySpreadGraph(ParentClassGraph) {
  class SpreadGraph extends ParentClassGraph {
    
    /**
     * @param {} collection - A pointer to the collection dannymineobhodimye daapteru to work with the graph. This may be a connection to the SQL database and table name, for example, or a collection of Mongo. 
     * @param {Object} fields - Comparison of the data in the collection of data in the graph. It is necessary for the adapter.
     * @param {Object} config - Additional config.
     * @param {String} config.constantField - Constant field in graph
     * @param {String} config.variableField - Spreadable field in graph
     */
    constructor(collection, selector, config) {
      super(...arguments);
      
      if (config.constantField) this.constantField = config.constantField;
      else throw new Error('config.constantField is not defined');
      
      if (config.variableField) this.variableField = config.variableField;
      else throw new Error('config.variableField is not defined');
    }
    
    /**
     * Default spreading handler. If spread specified link allowed, callback it link, else callback undefined.
     * 
     * @param {Object} [prevSpreadLink]
     * @param {PathGraph} [pathGraph]
     * @param {Object} [pathLink]
     * @param {Object} newSpreadLink 
     * @param {Object} [context]
     * @param {SpreadGraph~_spreadingHandlerCallback} [callback]
     */
    _spreadingHandler(prevSpreadLink, pathGraph, pathLink, newSpreadLink, context, callback) {
      callback(newSpreadLink);
    }
    
    /**
     * Responce from _spreadingHandler method.
     *
     * @callback SpreadGraph~_spreadingHandlerCallback
     * @param {Object} [newSpreadLink] 
     */
    
    /**
     * Default unspreading handler. If unspread specified link allowed, callback it link, else callback undefined.
     * It called in cases of dispute. When respread, if this method not replaced, will be respreaded all spread links.
     * 
     * @param {Object} spreadLink 
     * @param {Object} [context]
     * @param {SpreadGraph~_unspreadingHandlerCallback} [callback]
     */
    _unspreadingHandler(spreadLink, context, callback) {
      callback(true);
    }
    
    /**
     * Responce from _unspreadingHandler method.
     *
     * @callback SpreadGraph~_unspreadingHandlerCallback
     * @param {Boolean} [premission = true]
     */
    
    /**
     * Parent insert with parser of context.process.
     */
    insert(modifier, callback, context) {
      if (context && context.process) {
        modifier.process = [context.process];
      }
      return super.insert(modifier, callback, context);
    }
    
    /**
     * The method is strictly designed so that the class inherits from ExistedGraph.
     * Adds to process field custom value from context.
     */
    remove(selector, callback, context) {
      if (context && context.process) {
        if (!context.modifier) context.modifier = {};
        context.modifier.process = { add: context.process };
      }
      return super.remove(selector, callback, context);
    }
  }
  
  return SpreadGraph;
};

export { factorySpreadGraph };