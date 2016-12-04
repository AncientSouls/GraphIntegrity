/**
 * This method allows you to use RespreadGraph class to its inheritance chain.
 * Lets perceive spread graph as a reason for the spreader graph.
 * Fields launched, process, prev, path and root is required!
 * Manage fields launched and process.
 * Parent class mast be extended from class SpreadGraph.
 * 
 * @param {Class} ParentClassSpreadGraph
 * @return {Class} RespreadGraph
 * @description `import { factoryRespreadGraph } from 'ancient-graph-spreading';`
 */
function factoryRespreadGraph(ParentClassSpreadGraph) {
  class RespreadGraph extends ParentClassSpreadGraph {
    
    /**
     * Parent insert with added 'respread' to launched field. You can override it field in modifier.
     */
    insert(modifier, callback, context) {
      if (!modifier[this.config.aliases.launched]) modifier[this.config.aliases.launched] = ['respread'];
      return super.insert(modifier, callback, context);
    }
    
    /**
     * The method is strictly designed so that the class inherits from ExistedGraph.
     * Adds to launched field custom value from context.
     */
    remove(selector, callback, context) {
      if (!context) context = { [this.config.aliases.launched]: ['respread'] };
      else if (!context[this.config.aliases.launched]) context[this.config.aliases.launched] = ['respread'];
      else {
        if (Object.prototype.toString.call(context[this.config.aliases.launched]) === '[object Array]') {
          context[this.config.aliases.launched].push('respread');
        } else {
          context[this.config.aliases.launched] = [context[this.config.aliases.launched], 'respread'];
        }
      }
      return super.remove(selector, callback, context);
    }
  }
  
  return RespreadGraph;
};

export { factoryRespreadGraph };