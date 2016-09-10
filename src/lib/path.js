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
     * @param {Array} args - parent class graph arguments
     * @param {string} fromField
     * @param {string} toField
     */
    constructor(args, fromField, toField) {
      super(...args);
      this._fromField = fromField;
      this._toField = toField;
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
      if (!modifier.hasOwnProperty('launched') && (modifier.hasOwnProperty('source') || modifier.hasOwnProperty('target'))) {
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