/**
 * This method allows you to use SpreaderGraph class to its inheritance chain.
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
  }
  
  return SpreaderGraph;
};

export { factorySpreaderGraph };