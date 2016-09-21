var AllowedFields = ['source', 'target', 'id'];

/**
 * This method allows you to use PathGraph class to its inheritance chain.
 * Field launched is required!
 * Manage field launched.
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
      
      if (!this.fromFields.length) {
        throw new Error('config.fromFields can not be empty');
      }
      
      if (!this.toFields.length) {
        throw new Error('config.fromFields can not be empty');
      }
      
      for (var fr in this.fromFields) {
        if (AllowedFields.indexOf(this.fromFields[fr]) == -1) {
          throw new Error('config.fromFields may includes only `sourec`, `target` and `id`, but '+this.toFields[to]);
        }
        for (var to in this.toFields) {
          if (AllowedFields.indexOf(this.toFields[to]) == -1) {
            throw new Error('config.toFields may includes only `sourec`, `target` and `id`, but '+this.toFields[to]);
          }
          if (this.fromFields[fr] == this.toFields[to]) {
            throw new Error('The start and end of the path con not be at one reference of the link.');
          }
        }
      }
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
      if (
        !modifier.hasOwnProperty('launched')
      ) {
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
  
  return PathGraph;
};

export { factoryPathGraph };