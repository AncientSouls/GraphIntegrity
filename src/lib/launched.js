/**
 * This method allows you to use LaunchedGraph class to its inheritance chain.
 * Field launched is required!
 * Manage field launched.
 * 
 * @param {Class} ParentClassGraph
 * @return {Class} LaunchedGraph
 * @description `import { factoryLaunchedGraph } from 'ancient-graph-spreading';`
 */
function factoryLaunchedGraph(ParentClassGraph) {
  class LaunchedGraph extends ParentClassGraph {
    
    /**
     * Parent insert with added launched field. You can override it field in modifier.
     */
    insert(modifier, callback, context) {
      if (!modifier.launched) modifier.launched = ['spread'];
      else {
        if (Object.prototype.toString.call(modifier.launched) !== '[object Array]') {
          modifier.launched = [modifier.launched]
        }
        modifier.launched.push('spread');
      }
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
  
  return LaunchedGraph;
};

export { factoryLaunchedGraph };