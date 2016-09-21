/**
 * This method allows you to use SpreaderGraph class to its inheritance chain.
 * Field launched is required!
 * Manage field launched.
 * If using this graph, then in the spreadGraph field spreader is required.
 * 
 * @param {Class} ParentClassGraph
 * @return {Class} SpreaderGraph
 * @description `import { factorySpreaderGraph } from 'ancient-graph-spreading';`
 */
function factorySpreaderGraph(ParentClassGraph) {
  class SpreaderGraph extends ParentClassGraph {
    
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
     * Parent insert with added launched field. You can override it field in modifier.
     */
    insert(modifier, callback, context) {
      if (!modifier.launched) modifier.launched = ['spread'];
      return super.insert(modifier, callback, context);
    }
    
    /**
     * Parent update, but if source or target changed, then to the launched field will be added values unspread and spread. You can override it field in modifier.
     */
    update(selector, modifier, callback, context) {
      if (!modifier.hasOwnProperty('launched')) {
        modifier.launched = { add: ['unspread', 'spread'] };
      }
      return super.update(selector, modifier, callback, context);
    }
    
    /**
     * The method is strictly designed so that the class inherits from ExistedGraph.
     * Adds to launched field unspread value.
     */
    remove(selector, callback, context) {
      if (!context) var context = {};
      if (!context.modifier) context.modifier = {};
      context.modifier.launched = ['unspread'];
      return super.remove(selector, callback, context);
    }
  }
  
  return SpreaderGraph;
};

export { factorySpreaderGraph };