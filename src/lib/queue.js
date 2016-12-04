/**
 * Class with methods for easy subscription to spreading on graph events.
 * 
 * @class
 * @description `import { QueueSpreading } from 'ancient-graph-spreading';`
 */
class QueueSpreading {
  
  /**
   * @param {GraphSpreading} graphSpreading
   */
  constructor(graphSpreading) {
    this.graphSpreading = graphSpreading;
    if (this._getGraph == QueueSpreading.prototype._getGraph) {
      throw new Error('Method `_getGraph` is not adapted.');
    }
  }
  
  /**
   * Should return graph instance by link id from process field.
   * 
   * @param {string} linkId
   * @return {Graph} graph
   * @throws {Error} If graph is not founded
   */
  _getGraph(linkId) {}
  
  /**
   * Reacts to end of method triggered from launched or process link. If there are no other processes spreading links performed for the start, remove launched token.
   * 
   * @param {ExistedGraph} launchedGraph
   * @param {string} launchedLinkId
   * @param {string} launchedToRemove
   */
  removeFromLaunched(launchedLinkId, launchedToRemove) {
    var launchedGraph = this._getGraph(launchedLinkId);
    this.graphSpreading.spreadGraph.count({ [this.graphSpreading.spreadGraph.config.aliases.process]: launchedLinkId }, undefined, (error, count) => {
      if (!count) {
        launchedGraph.update({ [launchedGraph.config.aliases.id]: launchedLinkId, [launchedGraph.config.aliases.launched]: launchedToRemove }, { [launchedGraph.config.aliases.launched]: { remove: launchedToRemove }}, (error, count) => {
          if (error) throw error;
          if (!count) {
            if(launchedGraph.removed) {
              launchedGraph.removed.update({ [launchedGraph.removed.config.aliases.id]: launchedLinkId, [launchedGraph.removed.config.aliases.launched]: launchedToRemove }, { [this.graphSpreading.spreadGraph.config.aliases.launched]: { remove: launchedToRemove }}, (error, count) => {
                if (error) throw error;
              });
            }
          }
        });
      }
    });
  }
  
  /**
   * Reacts to insert a new path and reacts to update launched remove unspread, but spread still exists. This method triggers the first step of the second spread queue.
   * If passed callback, then not be called removeFromLaunched.
   * 
   * @param {PathGraph} pathGraph
   * @param {PathLink} pathLink
   * @param {string[]} pathLink.launched - ['spread']
   * @param {Function} [callback]
   */
  spreadByPath(pathGraph, pathLink, callback) {
    this.graphSpreading.spreadByPathLink(pathGraph, pathLink, { [this.graphSpreading.spreadGraph.config.aliases.process]: pathLink[pathGraph.config.aliases.id] }, undefined, () => {
      if (callback) callback();
      else this.removeFromLaunched(pathLink[pathGraph.config.aliases.id], 'spread');
    });
  }
  
  /**
   * Reacts to remove path and reacts to update source or target in path. Then it launched two queues, unspread and spread. This method triggers the first step of the first unspread queue. After removal of unspread from launched from path, you need to start the second queue with method spreadByPath.
   * If passed callback, then not be called removeFromLaunched.
   * 
   * @param {PathGraph} pathGraph
   * @param {PathLink} pathLink
   * @param {string[]} pathLink.launched - ['unspread', 'spread']
   * @param {Function} [callback]
   */
  unspreadByPath(pathGraph, pathLink, callback) {
    this.graphSpreading.unspreadByPathId(pathLink[pathGraph.config.aliases.id], { [pathGraph.config.aliases.process]: pathLink.id }, undefined, () => {
      if (callback) callback();
      else this.removeFromLaunched(pathLink[pathGraph.config.aliases.id], 'unspread');
    });
  }
  
  /**
   * Reacts to insert new spread link. Link can be inserted with field process as step in queue or with field launched as start of queue.
   * If passed callback, then not be called removeFromLaunched.
   * 
   * @param {SpreadLink} spreadLink
   * @param {Function} [callback]
   */
  spreadBySpread(spreadLink, callback) {
    var
      context = {},
      process = false
    ;
    if (spreadLink[this.graphSpreading.spreadGraph.config.aliases.process] && typeof(spreadLink[this.graphSpreading.spreadGraph.config.aliases.process][0]) == 'string') {
       context[this.graphSpreading.spreadGraph.config.aliases.process] = spreadLink[this.graphSpreading.spreadGraph.config.aliases.process][0];
       process = true;
    } else if (spreadLink[this.graphSpreading.spreadGraph.config.aliases.launched] && typeof(spreadLink[this.graphSpreading.spreadGraph.config.aliases.launched][0]) == 'string') {
      context[this.graphSpreading.spreadGraph.config.aliases.process] = spreadLink[this.graphSpreading.spreadGraph.config.aliases.id];
    } else {
      if (callback) callback();
      return; 
    }
    this.graphSpreading.spreadFromSpreadLink(spreadLink, context, undefined, () => {
      if (process) {
        this.graphSpreading.spreadGraph.update(spreadLink[this.graphSpreading.spreadGraph.config.aliases.id], { [this.graphSpreading.spreadGraph.config.aliases.process]: { remove: context[this.graphSpreading.spreadGraph.config.aliases.process] }});
      }
      if (callback) callback();
      else this.removeFromLaunched(context.process, 'spread');
    });
  }
  
  /**
   * Reacts to remove spread link.
   * If passed callback, then not be called removeFromLaunched.
   * 
   * @param {SpreadLink} spreadLink
   * @param {Function} [callback]
   */
  unspreadBySpread(spreadLink, callback) {
    var
      context = { [this.graphSpreading.spreadGraph.config.aliases.process]: {} },
      process = false,
      launched = false
    ;
    if (spreadLink[this.graphSpreading.spreadGraph.config.aliases.process] && typeof(spreadLink[this.graphSpreading.spreadGraph.config.aliases.process][0]) == 'string') {
       context[this.graphSpreading.spreadGraph.config.aliases.process] = spreadLink[this.graphSpreading.spreadGraph.config.aliases.process][0];
       launched = process = context[this.graphSpreading.spreadGraph.config.aliases.process];
    } else if (spreadLink[this.graphSpreading.spreadGraph.config.aliases.launched] && typeof(spreadLink[this.graphSpreading.spreadGraph.config.aliases.launched][0]) == 'string') {
      context[this.graphSpreading.spreadGraph.config.aliases.process] = spreadLink[this.graphSpreading.spreadGraph.config.aliases.id];
      launched = spreadLink[this.graphSpreading.spreadGraph.config.aliases.id];
    } else {
      if (callback) callback();
      return;
    }
    this.graphSpreading.unspreadFromRemovedSpreadLinkByPrevId(spreadLink[this.graphSpreading.spreadGraph.config.aliases.id], context, undefined, () => {
      if (process) {
        this.graphSpreading.spreadGraph.removed.update(spreadLink[this.graphSpreading.spreadGraph.config.aliases.id], { [this.graphSpreading.spreadGraph.config.aliases.process]: { remove: context.process }});
      }
      if (callback) callback();
      else this.removeFromLaunched(launched, 'unspread');
    });
  }
  
  /**
   * Reacts to insert a new spreader and reacts to update launched remove unspread, but spread still exists. This method triggers the first step of the second spread queue.
   * If passed callback, then not be called removeFromLaunched.
   * 
   * @param {SpreaderGraph} spreaderGraph
   * @param {SpreaderLink} spreaderLink
   * @param {string[]} spreaderLink.launched - ['spread']
   * @param {Function} [callback]
   */
  spreadBySpreader(spreaderGraph, spreaderLink, callback) {
    this.graphSpreading.spreadNewSpreadLink({
      [this.graphSpreading.spreadGraph.constantField]: spreaderLink[spreaderGraph.constantField],
      [this.graphSpreading.spreadGraph.variableField]: spreaderLink[spreaderGraph.variableField],
      spreader: spreaderLink[this.graphSpreading.spreadGraph.config.aliases.id]
    }, { [this.graphSpreading.spreadGraph.config.aliases.process]: spreaderLink[this.graphSpreading.spreadGraph.config.aliases.id] }, () => {
      if (callback) callback();
      else this.removeFromLaunched(spreaderLink[this.graphSpreading.spreadGraph.config.aliases.id], 'spread');
    });
  }
  
  /**
   * Reacts to remove spreader link and reacts to update source or target in spreader. Then it launched two queues, unspread and spread. This method triggers the first step of the first unspread queue. After removal of unspread from launched from spreader, you need to start the second queue with method spreadBySpreader.
   * If passed callback, then not be called removeFromLaunched.
   * 
   * @param {SpreaderGraph} spreaderGraph
   * @param {SpreaderLink} spreaderLink
   * @param {string[]} spreaderLink.launched - ['unspread', 'spread']
   * @param {Function} [callback]
   */
  unspreadBySpreader(spreaderGraph, spreaderLink, callback) {
    this.graphSpreading.spreadGraph.remove({
      [this.graphSpreading.spreadGraph.config.aliases.spreader]: spreaderLink[this.graphSpreading.spreadGraph.config.aliases.id]
    }, (error, count) => {
      if (callback) callback();
      else this.removeFromLaunched(spreaderLink[this.graphSpreading.spreadGraph.config.aliases.id], 'unspread');
    }, { modifier: { [this.graphSpreading.spreadGraph.config.aliases.process]: { add: spreaderLink[this.graphSpreading.spreadGraph.config.aliases.id] }}});
  }
}

export { QueueSpreading };