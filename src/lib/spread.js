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
     * @param {Array} args - parent class graph arguments
     * @param {string} constantField
     * @param {string} variableField
     */
    constructor(args, constantField, variableField) {
      super(...args);
      this._constantField = constantField;
      this._variableField = variableField;
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
     * Adds to launched field unspread value.
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