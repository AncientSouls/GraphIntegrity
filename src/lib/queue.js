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
  mayBeEndedLaunched(launchedLinkId, launchedToRemove) {
    var launchedGraph = this._getGraph(launchedLinkId);
    this.graphSpreading.spreadGraph.count({ process: launchedLinkId }, undefined, (error, count) => {
      if (!count) {
        launchedGraph.update({ id: launchedLinkId, launched: launchedToRemove }, { launched: { remove: launchedToRemove }}, (error, count) => {
          if (error) throw error;
          if (!count) {
            if(launchedGraph.removed) {
              launchedGraph.removed.update({ id: launchedLinkId, launched: launchedToRemove }, { launched: { remove: launchedToRemove }}, (error, count) => {
                if (error) throw error;
              });
            }
          }
        });
      }
    });
  }
  
  /**
   * Reacts to insert a new path.
   * 
   * @param {PathGraph} pathGraph
   * @param {PathLink} pathLink
   * @param {string[]} pathLink.launched - ['spread']
   */
  insertedPathLink(pathGraph, pathLink) {
    this.graphSpreading.spreadByPathLink(pathGraph, pathLink, { process: pathLink.id }, undefined, () => {
      this.mayBeEndedLaunched(pathLink.id, 'spread');
    });
  }
  
  /**
   * Reacts to update source or target in path. Then it launched two queues, unspread and spread. This method triggers the first step of the first unspread queue. After removal of unspread from launched from path, you need to start the second queue with method updatedLaunchedUnspreadPathLink.
   * 
   * @param {PathGraph} pathGraph
   * @param {PathLink} pathLink
   * @param {string[]} pathLink.launched - ['unspread', 'spread']
   */
  updatedSourceOrTargetPathLink(pathGraph, pathLink) {
    this.graphSpreading.unspreadByPathId(pathLink.id, { process: pathLink.id }, undefined, () => {
      this.mayBeEndedLaunched(pathLink.id, 'unspread');
    });
  }
  
  /**
   * Reacts to update launched remove unspread, but spread still exists. This method triggers the first step of the second spread queue.
   * 
   * @param {PathGraph} pathGraph
   * @param {PathLink} pathLink
   * @param {string[]} pathLink.launched - ['spread']
   */
  updatedLaunchedUnspreadPathLink(pathGraph, pathLink) {
    this.insertedPathLink(pathGraph, pathLink);
  }
   
  /**
   * Reacts to remove path. Similar to the method updatedSourceOrTargetPathLink, but the work is gone  with pathGraph.removed.
   * 
   * @param {PathGraph} pathGraph
   * @param {PathLink} pathLink
   * @param {string[]} pathLink.launched - ['unspread']
   */
  removedPathLink(pathGraph, pathLink) {
    this.graphSpreading.unspreadByPathId(pathLink.id, { process: pathLink.id }, undefined, () => {
      this.mayBeEndedLaunched(pathLink.id, 'unspread');
    });
  }
  
  /**
   * Reacts to insert new spread link. Link can be inserted with field process as step in queue or with field launched as start of queue.
   * 
   * @param {SpreadLink} spreadLink
   * @param {string[]} [pathLink.launched]
   * @param {string[]} [pathLink.process]
   */
  insertedSpreadLink(spreadLink) {
    var
      context = {},
      process = false
    ;
    if (spreadLink.process && typeof(spreadLink.process[0]) == 'string') {
       context.process = spreadLink.process[0];
       process = true;
    } else if (spreadLink.launched && typeof(spreadLink.launched[0]) == 'string') {
      context.process = spreadLink.id;
    } else {
      throw new Error('SpreadLink should have `launched` or `process` field.');
    }
    this.graphSpreading.spreadFromSpreadLink(spreadLink, context, undefined, () => {
      if (process) {
        this.graphSpreading.spreadGraph.update(spreadLink.id, { process: { remove: context.process }});
      }
      this.mayBeEndedLaunched(context.process, 'spread');
    });
  }
  
  /**
   * Reacts to remove spread link.
   * 
   * @param {SpreadLink} spreadLink
   */
  removedSpreadLink(spreadLink) {
    var
      context = { process: {} },
      process = false,
      launched = false
    ;
    if (spreadLink.process && typeof(spreadLink.process[0]) == 'string') {
       context.process = spreadLink.process[0];
       launched = process = context.process;
    } else if (spreadLink.launched && typeof(spreadLink.launched[0]) == 'string') {
      context.process = spreadLink.id;
      launched = spreadLink.id;
    } else {
      throw new Error('SpreadLink '+spreadLink.id+' should have `launched` or `process` field.');
    }
    this.graphSpreading.unspreadFromRemovedSpreadLinkByPrevId(spreadLink.id, context, undefined, () => {
      if (process) {
        this.graphSpreading.spreadGraph.removed.update(spreadLink.id, { process: { remove: context.process }});
      }
      this.mayBeEndedLaunched(launched, 'unspread');
    });
  }
  
  /**
   * Reacts to insert a new spreader.
   * 
   * @param {SpreaderGraph} spreaderGraph
   * @param {SpreaderLink} spreaderLink
   * @param {string[]} spreaderLink.launched - ['spread']
   */
  insertedSpreaderLink(spreaderGraph, spreaderLink) {
    this.graphSpreading.spreadNewSpreadLink({
      [this.graphSpreading.spreadGraph._constantField]: spreaderLink[spreaderGraph._constantField],
      [this.graphSpreading.spreadGraph._variableField]: spreaderLink[spreaderGraph._variableField],
      spreader: spreaderLink.id
    }, { process: spreaderLink.id }, () => {
      this.mayBeEndedLaunched(spreaderLink.id, 'spread');
    });
  }
  
  /**
   * Reacts to update source or target in spreader. Then it launched two queues, unspread and spread. This method triggers the first step of the first unspread queue. After removal of unspread from launched from spreader, you need to start the second queue with method updatedLaunchedUnspreadSpreaderLink.
   * 
   * @param {SpreaderGraph} spreaderGraph
   * @param {SpreaderLink} spreaderLink
   * @param {string[]} spreaderLink.launched - ['unspread', 'spread']
   */
  updatedSourceOrTargetSpreaderLink(spreaderGraph, spreaderLink) {
    this.graphSpreading.spreadGraph.remove({
      spreading: spreaderLink.id
    }, (error, count) => {
      this.mayBeEndedLaunched(spreaderLink.id, 'unspread');
    }, { modifier: { process: { add: spreaderLink.id }}});
  }
  
  /**
   * Reacts to update launched remove unspread, but spread still exists. This method triggers the first step of the second spread queue.
   * 
   * @param {SpreaderGraph} spreaderGraph
   * @param {SpreaderLink} spreaderLink
   * @param {string[]} spreaderLink.launched - ['spread']
   */
  updatedLaunchedUnspreadSpreaderLink(spreaderGraph, spreaderLink) {
    this.insertedSpreaderLink(spreaderGraph, spreaderLink);
  }
   
  /**
   * Reacts to remove spreader link. Similar to the method updatedSourceOrTargetSpreaderLink, but the work is gone  with spreaderGraph.removed.
   * 
   * @param {SpreaderGraph} spreaderGraph
   * @param {SpreaderLink} spreaderLink
   * @param {string[]} spreaderLink.launched - ['unspread']
   */
  removedSpreaderLink(spreaderGraph, spreaderLink) {
    this.graphSpreading.spreadGraph.remove({
      spreading: spreaderLink.id
    }, (error, count) => {
      this.mayBeEndedLaunched(spreaderLink.id, 'unspread');
    }, { modifier: { process: { add: spreaderLink.id }}});
  }
}

export { QueueSpreading };