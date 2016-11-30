var AllowedFields = ['source', 'target', 'id'];

/**
 * This method allows you to use PathGraph class to its inheritance chain.
 * 
 * @param {Class} ParentClassGraph
 * @return {Class} PathGraph
 * @description `import { factoryPathGraph } from 'ancient-graph-spreading';`
 */
function factoryPathGraph(ParentClassGraph) {
  class PathGraph extends ParentClassGraph {
    
    /**
     * Parent constrctor arguments taken in args array.
     * 
     * @param {} collection - A pointer to the collection dannymineobhodimye daapteru to work with the graph. This may be a connection to the SQL database and table name, for example, or a collection of Mongo. 
     * @param {Object} fields - Comparison of the data in the collection of data in the graph. It is necessary for the adapter.
     * @param {Object} config - Additional config.
     * @param {string[]} config.fromFields - Start direction in path link
     * @param {string[]} config.toFields - End direction in path link
     */
    constructor(collection, selector, config) {
      super(...arguments);
      
      if (config.fromFields) {
        this.fromFields = config.fromFields;
      } else throw new Error('config.fromFields is not defined');
      
      if (config.toFields) {
        this.toFields = config.toFields;
      } else throw new Error('config.toFields is not defined');
    }
  }
  
  return PathGraph;
};

export { factoryPathGraph };