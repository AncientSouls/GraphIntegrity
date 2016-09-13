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
   * Spread by pathLink and specified fromField with available spreadLinks.
   * 
   * @oaram {string} fromField
   * @param {PathGraph} pathGraph
   * @param {PathLink} pathLink
   * @param {Object} [context]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathLinkCallback} [handler]
   * @param {GraphSpreading~spreadByPathLinkCallback} [callback]
   */
  _spreadByPathLink(fromField, pathGraph, pathLink, context, handler, callback) {
    this.spreadGraph.fetch({
      [this.spreadGraph.variableField]: pathLink[fromField]
    }, undefined, (error, spreadLinks) => {
      if (spreadLinks.length) {
        var queue = async.queue((spreadLink, next) => {
          this.spreadFromSpreadLinkByPathLink(spreadLink, pathGraph, pathLink, context, handler, next);
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
   * Spread by pathLink with available spreadLinks.
   * 
   * @param {PathGraph} pathGraph
   * @param {PathLink} pathLink
   * @param {Object} [context]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathLinkCallback} [handler]
   * @param {GraphSpreading~spreadByPathLinkCallback} [callback]
   */
  spreadByPathLink(pathGraph, pathLink, context, handler, callback) {
    async.each(pathGraph.fromFields, (fromField, next) => {
      this._spreadByPathLink(fromField, pathGraph, pathLink, context, handler, next);
    }, callback);
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
      if (newSpreadLink) {
        this.spreadGraph.insert(newSpreadLink, callback, context);
      } else {
        if (callback) callback();
      }
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
   * Spread by all available paths in pathGraph from spreadLink and specified fromField.
   * 
   * @param {string} fromField
   * @param {SpreadLink} spreadLink
   * @param {PathGraph} pathGraph
   * @param {GraphSpreading~spreadFromSpreadLinkByPathGraphHandler} [handler]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathGraphCallback} [callback]
   */
  _spreadFromSpreadLinkByPathGraph(fromField, spreadLink, pathGraph, context, handler, callback) {
    pathGraph.fetch({
      [fromField]: spreadLink[this.spreadGraph.variableField]
    }, undefined, (error, pathLinks) => {
      var queue = async.queue((pathLink, callback) => {
        this.spreadFromSpreadLinkByPathLink(spreadLink, pathGraph, pathLink, context, handler, callback);
      });
      queue.drain = () => { if (callback) callback(); }
      queue.push(pathLinks);
    });
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
    async.each(pathGraph.fromFields, (fromField, next) => {
      this._spreadFromSpreadLinkByPathGraph(fromField, spreadLink, pathGraph, context, handler, next);
    }, callback);
  }
  
  /**
   * Optional handler. If present, called with an error object as the first argument and, if no error, others arguments with results of spreading.
   *
   * @callback GraphSpreading~spreadFromSpreadLinkByPathGraphHandler
   * @param {Error} [error]
   * @param {string} [newSpreadLinkId]
   * @param {SpreadLink} [prevSpreadLink]
   * @param {PathGraph} [pathGraph]
   * @param {PathLink} [pathLink]
   */
  
  /**
   * Optional callback.
   *
   * @callback GraphSpreading~spreadFromSpreadLinkByPathGraphCallback
   */
  
  /**
   * Spread by pathLink and specified toField in pathGraph from spreadLink.
   * 
   * @param {SpreadLink} spreadLink
   * @param {PathGraph} pathGraph
   * @param {PathLink} pathLink
   * @param {Object} [context]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathLinkCallback} [callback]
   */
  _spreadFromSpreadLinkByPathLink(toField, spreadLink, pathGraph, pathLink, context, callback) {
    this.spreadGraph._spreadingHandler(spreadLink, pathGraph, pathLink, {
      [this.spreadGraph.constantField]: spreadLink[this.spreadGraph.constantField],
      [this.spreadGraph.variableField]: pathLink[toField],
      prev: spreadLink.id,
      path: pathLink.id,
      root: spreadLink.root?spreadLink.root:spreadLink.id
    }, context, (newSpreadLink) => {
      if (newSpreadLink) {
        this.spreadGraph.insert(newSpreadLink, (error, id) => {
          if (callback) callback(error, id, spreadLink, pathGraph, pathLink);
        }, context);
      } else {
        if (callback) callback();
      }
    });
  }
  
  /**
   * Spread by pathLink in pathGraph from spreadLink.
   * 
   * @param {SpreadLink} spreadLink
   * @param {PathGraph} pathGraph
   * @param {PathLink} pathLink
   * @param {Object} [context]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathLinkHandler} [handler]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathLinkCallback} [callback]
   */
  spreadFromSpreadLinkByPathLink(spreadLink, pathGraph, pathLink, context, handler, callback) {
    async.each(pathGraph.toFields, (toField, next) => {
      this._spreadFromSpreadLinkByPathLink(toField, spreadLink, pathGraph, pathLink, context, (error, id, prev, pathGraph, pathLink) => {
        if (handler) handler(error, id, prev, pathGraph, pathLink);
        next();
      });
    }, callback);
  }
  
  /**
   * Optional handler.
   *
   * @callback GraphSpreading~spreadFromSpreadLinkByPathLinkCallback
   * @param {Error} [error]
   * @param {string} [newSpreadLinkId]
   * @param {SpreadLink} [prevSpreadLink]
   * @param {PathGraph} [pathGraph]
   * @param {PathLink} [pathLink]
   */
  
  /**
   * Optional callback. If present, called with an error object as the first argument and, if no error, the unique id of inserted spread link as the second.
   *
   * @callback GraphSpreading~spreadFromSpreadLinkByPathLinkCallback
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
   * Optional handler.
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
  
  /**
   * Unspread all valid spreadLinks to this id.
   * 
   * @param {string} id
   * @param {Object} [context]
   * @param {GraphSpreading~unspreadToHandler} [handler]
   * @param {GraphSpreading~unspreadToCallback} [callback]
   */
  unspread(id, context, handler, callback) {
     this.spreadGraph.fetch({ [this.spreadGraph.variableField]: id }, undefined, (error, spreadLinks) => {
       if (error) {
         if (callback) callback(error);
       } else {
         var queue = async.queue((spreadLink, next) => {
           this.spreadGraph._unspreadingHandler(spreadLink, context, (permission) => {
             if (permission) {
               this.spreadGraph.remove(spreadLink.id, (error, count) => {
                 if (handler) handler(error, spreadLink);
                 next();
               }, context);
             }
           });
         });
         if (callback) queue.drain = () => { callback(undefined, spreadLinks.length); }
         queue.push(spreadLinks);
       }
     });
  }
  
  /**
   * Optional handler.
   *
   * @callback GraphSpreading~unspreadToHandler
   * @param {Error} [error]
   * @param {SpreadLink} [spreadLink]
   */
  
  /**
   * Optional callback.
   *
   * @callback GraphSpreading~unspreadToCallback
   */
  
  /**
   * Spread all spread links from all available paths to this id.
   * 
   * @param {string} id
   * @param {Object} [context]
   * @param {GraphSpreading~spreadToHandler} [handler]
   * @param {GraphSpreading~spreadToCallback} [callback]
   */
   
  spreadTo(id, context, handler, callback) {
    var queue = async.queue((pathGraph, nextPathGraph) => {
      pathGraph.fetch({
        [pathGraph.toFields[0]]: id
      }, undefined, (error, pathLinks) => {
        async.each(pathLinks, (pathLink, nextPathLink) => {
          this.spreadByPathLink(pathGraph, pathLink, context, handler, nextPathLink);
        }, function(error) {
          nextPathGraph();
        });
      });
    });
    queue.drain = () => { if (callback) callback(); }
    queue.push(this.pathGraphs);
  }
  
  /**
   * Optional handler. Fires after each processed spread link.
   * Id can be empty if the `this.spreadGraph._spreadingHandler` banned spreading.
   * 
   * @callback GraphSpreading~spreadToHandler
   * @param {Error} [error]
   * @param {string} [newSpreadLinkId]
   * @param {SpreadLink} [prevSpreadLink]
   * @param {PathGraph} [pathGraph]
   * @param {PathLink} [pathLink]
   */
  
  /**
   * Optional callback.
   *
   * @callback GraphSpreading~spreadToCallback
   */
}

export { GraphSpreading };