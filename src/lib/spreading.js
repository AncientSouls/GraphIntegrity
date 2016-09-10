import async from 'async';

/**
 * Class with methods for spread and unspread of the spreadGraph on pathGraph(s).
 * 
 * @class
 * @description `import { GraphSpreading } from 'ancient-graph-spreading';`
 */
class GraphSpreading {
  
  /**
   * @param {SpreadGraph} spreadGraph
   */
  constructor(spreadGraph) {
    this.spreadGraph = spreadGraph;
    this.pathGraphs = [];
  }
  
  /**
   * @param {PathGraph} pathGraph
   */
  addPathGraph(pathGraph) {
    this.pathGraphs.push(pathGraph);
  }
  
  /**
   * Spread by pathLink with available spreadLinks.
   * 
   * @param {PathGraph} pathGraph
   * @param {PathLink} pathLink
   * @param {Object} [context]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathLinkCallback} [handler]
   * @param {GraphSpreading~spreadByPathLinkCallback} [callback]
   */
  spreadByPathLink(pathGraph, pathLink, context, handler, callback) {
    this.spreadGraph.fetch({
      [this.spreadGraph._variableField]: pathLink[pathGraph._fromField]
    }, undefined, (error, spreadLinks) => {
      if (spreadLinks.length) {
        var queue = async.queue((spreadLink, callback) => {
          this.spreadFromSpreadLinkByPathLink(spreadLink, pathGraph, pathLink, context, (error, id, spreadLink, pathGraph, pathLink) => {
            if (handler) handler(error, id, spreadLink, pathGraph, pathLink);
            callback();
          });
        });
        queue.push(spreadLinks, (error) => {
          if (callback) callback();
        });
      } else {
        if (callback) callback();
      }
    });
  }
  
  /**
   * Optional callback.
   *
   * @callback GraphSpreading~spreadByPathLinkCallback
   */
  
  /**
   * Spread root of tree spreadLink.
   * 
   * @param {SpreadLink} newSpreadLink
   * @param {Object} [context]
   * @param {Graph~insertCallback} [callback]
   */
  spreadNewSpreadLink(newSpreadLink, context, callback) {
    this.spreadGraph._spreadingHandler(undefined, undefined, undefined, newSpreadLink, context, (newSpreadLink) => {
      if (newSpreadLink) this.spreadGraph.insert(newSpreadLink, callback, context);
    });
  }
  
  /**
   * Spread by all available paths from spreadLink.
   * 
   * @param {SpreadLink} spreadLink
   * @param {Object} [context]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathGraphHandler} [handler]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathGraphCallback} [callback]
   */
  spreadFromSpreadLink(spreadLink, context, handler, callback) {
    var queue = async.queue((pathGraph, callback) => {
      this.spreadFromSpreadLinkByPathGraph(spreadLink, pathGraph, context, handler, callback);
    });
    queue.drain = () => { if (callback) callback(); }
    queue.push(this.pathGraphs);
  }
  
  /**
   * Spread by all available paths in pathGraph from spreadLink.
   * 
   * @param {SpreadLink} spreadLink
   * @param {PathGraph} pathGraph
   * @param {GraphSpreading~spreadFromSpreadLinkByPathGraphHandler} [handler]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathGraphCallback} [callback]
   */
  spreadFromSpreadLinkByPathGraph(spreadLink, pathGraph, context, handler, callback) {
    pathGraph.fetch({
      [pathGraph._fromField]: spreadLink[this.spreadGraph._variableField]
    }, undefined, (error, pathLinks) => {
      var queue = async.queue((pathLink, callback) => {
        this.spreadFromSpreadLinkByPathLink(spreadLink, pathGraph, pathLink, context, (error, id) => {
          if (handler) handler(error, id, spreadLink, pathGraph, pathLink);
          callback();
        });
      });
      queue.drain = () => { if (callback) callback(); }
      queue.push(pathLinks);
    });
  }
  
  /**
   * Optional handler. If present, called with an error object as the first argument and, if no error, others arguments with results of spreading.
   *
   * @callback GraphSpreading~spreadFromSpreadLinkByPathGraphHandler
   * @param {Error} [error]
   * @param {string} [id]
   * @param {SpreadLink} [spreadLink]
   * @param {PathGraph} [pathGraph]
   * @param {PathLink} [pathLink]
   */
  
  /**
   * Optional callback.
   *
   * @callback GraphSpreading~spreadFromSpreadLinkByPathGraphCallback
   */
  
  /**
   * Spread by pathLink in pathGraph from spreadLink.
   * 
   * @param {SpreadLink} spreadLink
   * @param {PathGraph} pathGraph
   * @param {PathLink} pathLink
   * @param {Object} [context]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathLinkCallback} [callback]
   */
  spreadFromSpreadLinkByPathLink(spreadLink, pathGraph, pathLink, context, callback) {
    this.spreadGraph._spreadingHandler(spreadLink, pathGraph, pathLink, {
      [this.spreadGraph._constantField]: spreadLink[this.spreadGraph._constantField],
      [this.spreadGraph._variableField]: pathLink[pathGraph._toField],
      prev: spreadLink.id,
      path: pathLink.id,
      root: spreadLink.root?spreadLink.root:spreadLink.id
    }, context, (newSpreadLink) => {
      if (newSpreadLink) this.spreadGraph.insert(newSpreadLink, (error, id) => {
        if (callback) callback(error, id, spreadLink, pathGraph, pathLink);
      }, context);
    });
  }
  
  /**
   * Optional callback. If present, called with an error object as the first argument and, if no error, the unique id of inserted spread link as the second.
   *
   * @callback GraphSpreading~spreadFromSpreadLinkByPathLinkCallback
   * @param {Error} [error]
   * @param {string} [id]
   * @param {SpreadLink} [spreadLink]
   * @param {PathGraph} [pathGraph]
   * @param {PathLink} [pathLink]
   */
  
  /**
   * Remove spreadLinks with specific prev spreadLink id.
   * 
   * @param {string} spreadLinkId
   * @param {Object} [context]
   * @param {GraphSpreading~unspreadFromRemovedSpreadLinkByPrevIdHandler} [handler]
   * @param {GraphSpreading~unspreadFromRemovedSpreadLinkByPrevIdCallback} [callback]
   */
  unspreadFromRemovedSpreadLinkByPrevId(spreadLinkId, context, handler, callback) {
    if (handler) {
      this.spreadGraph.fetch({ prev: spreadLinkId }, undefined, (error, spreadLinks) => {
        if (error) {
          if (callback) callback(error);
        } else {
          var queue = async.queue((spreadLink, next) => {
            this.spreadGraph.remove(spreadLink.id, (error, count) => {
              handler(error, spreadLink);
              next();
            }, context);
          });
          if (callback) queue.drain = () => { callback(undefined, spreadLinks.length); }
          queue.push(spreadLinks);
        }
      });
    } else {
      this.spreadGraph.remove({ prev: spreadLinkId }, callback, context);
    }
  }
  
  /**
   * Optional handler. If present, called with an error object as the first argument and, if no error, others arguments with results of unspreading.
   *
   * @callback GraphSpreading~unspreadFromRemovedSpreadLinkByPrevIdHandler
   * @param {Error} [error]
   * @param {SpreadLink} [spreadLink]
   */
  
  /**
   * Optional callback.
   *
   * @callback GraphSpreading~unspreadFromRemovedSpreadLinkByPrevIdCallback
   * @param {Error} [error]
   * @param {number} [count]
   */
  
  /**
   * Remove spreadLinks with specific path pathLink id.
   * 
   * @param {string} pathLinkId
   * @param {Object} [context]
   * @param {GraphSpreading~unspreadByPathIdHandler} [handler]
   * @param {GraphSpreading~unspreadByPathIdCallback} [callback]
   */
  unspreadByPathId(pathLinkId, context, handler, callback) {
    if (handler) {
      this.spreadGraph.fetch({ path: pathLinkId }, undefined, (error, spreadLinks) => {
        if (error) {
          if (callback) callback(error);
        } else {
          var queue = async.queue((spreadLink, next) => {
            this.spreadGraph.remove(spreadLink.id, (error, count) => {
              handler(error, spreadLink);
              next();
            }, context);
          });
          if (callback) queue.drain = () => { callback(undefined, spreadLinks.length); }
          queue.push(spreadLinks);
        }
      });
    } else {
      this.spreadGraph.remove({ path: pathLinkId }, callback, context);
    }
  }
  
  /**
   * Optional handler. If present, called with an error object as the first argument and, if no error, others arguments with results of unspreading.
   *
   * @callback GraphSpreading~unspreadByPathIdHandler
   * @param {Error} [error]
   * @param {SpreadLink} [spreadLink]
   */
  
  /**
   * Optional callback.
   *
   * @callback GraphSpreading~unspreadByPathIdCallback
   * @param {Error} [error]
   * @param {number} [count]
   */
}

export { GraphSpreading };