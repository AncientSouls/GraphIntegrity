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
        if (modifier.hasOwnProperty(this._variableField) || modifier.hasOwnProperty(this._constantField)) {
          modifier.launched = { add: ['unspread', 'spread'] };
        }
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