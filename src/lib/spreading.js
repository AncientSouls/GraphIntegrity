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
   * Custom async callbacks support
   * 
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {function} iteratee - A function to apply to each item in coll.
   * @param {function} callback - A callback which is called when all iteratee functions have finished.
   */
  each(coll, iteratee, callback) {
    async.each(coll, iteratee, callback);
  }
  
  /**
   * @param {PathGraph} pathGraph
   */
  addPathGraph(pathGraph) {
    this.pathGraphs.push(pathGraph);
  }

  /**
   * Custom wrapper of query to spread graph
   * 
   * @param {Object} [query]
   * @param {Object} [context]
   */
  _wrapSpreadQuery(query, context) {}

  /**
   * Custom wrapper of query to path graph
   * 
   * @param {Object} [query]
   * @param {Object} [pathGraph]
   * @param {String} [fromField]
   * @param {String} [toField]
   * @param {Object} [context]
   */
  _wrapPathQuery(query, pathGraph, fromField, toField, context) {}

  /**
   * Custom getter of possible from fields.
   * 
   * @param {Object} [pathGraph]
   * @param {Object} [pathLink]
   * @param {Object} [spreadLink]
   * @return {String[]} [fromFields]
   */
  _getFromFields(pathGraph, pathLink, spreadLink) {
    return pathGraph.fromFields;
  }

  /**
   * Custom getter of possible to fields.
   * 
   * @param {Object} [pathGraph]
   * @param {Object} [pathLink]
   * @param {Object} [spreadLink]
   * @return {String[]} [toFields]
   */
  _getToFields(pathGraph, pathLink, spreadLink) {
    return pathGraph.toFields;
  }
  
  /**
   * Spread by pathLink and specified fromField with available spreadLinks.
   * 
   * @param {string} fromField
   * @param {PathGraph} pathGraph
   * @param {PathLink} pathLink
   * @param {Object} [context]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathLinkCallback} [handler]
   * @param {GraphSpreading~spreadByPathLinkCallback} [callback]
   */
  _spreadByPathLink(fromField, pathGraph, pathLink, context, handler, callback) {
    var query = {
      [this.spreadGraph.config.aliases[this.spreadGraph.variableField]]: pathLink[pathGraph.config.aliases[fromField]],
    };
    this._wrapSpreadQuery(query, context);
    this.spreadGraph.fetch(query, undefined, (error, spreadLinks) => {
      if (spreadLinks.length) {
        this.each(spreadLinks, (spreadLink, next) => {
          this.spreadFromSpreadLinkByPathLink(spreadLink, pathGraph, pathLink, context, handler, () => { next(); });
        }, () => {
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
    this.each(this._getFromFields(pathGraph, pathLink), (fromField, next) => {
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
    this.each(this.pathGraphs, (pathGraph, next) => {
      this.spreadFromSpreadLinkByPathGraph(spreadLink, pathGraph, context, handler, next);
    }, () => {
      if (callback) callback();
    });
  }
  
  /**
   * Spread by all available paths in pathGraph from spreadLink and specified fromField.
   * 
   * @param {string} fromField
   * @param {SpreadLink} spreadLink
   * @param {PathGraph} pathGraph
   * @param {Object} [context]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathGraphHandler} [handler]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathGraphCallback} [callback]
   */
  _spreadFromSpreadLinkByPathGraph(fromField, spreadLink, pathGraph, context, handler, callback) {
    var query = {
      [pathGraph.config.aliases[fromField]]: spreadLink[this.spreadGraph.variableField],
    };
    this._wrapPathQuery(query, pathGraph, fromField, undefined, context);
    pathGraph.fetch(query, undefined, (error, pathLinks) => {
      this.each(pathLinks, (pathLink, next) => {
        this.spreadFromSpreadLinkByPathLink(spreadLink, pathGraph, pathLink, context, handler, next);
      }, () => {
        if (callback) callback();
      });
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
    this.each(this._getFromFields(pathGraph, undefined, spreadLink), (fromField, next) => {
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
      [this.spreadGraph.config.aliases[this.spreadGraph.constantField]]: spreadLink[this.spreadGraph.config.aliases[this.spreadGraph.constantField]],
      [this.spreadGraph.config.aliases[this.spreadGraph.variableField]]: pathLink[pathGraph.config.aliases[toField]],
      [this.spreadGraph.config.aliases.prev]: spreadLink[this.spreadGraph.config.aliases.id],
      [this.spreadGraph.config.aliases.path]: pathLink[pathGraph.config.aliases.id],
      [this.spreadGraph.config.aliases.root]: spreadLink[this.spreadGraph.config.aliases.root]?spreadLink[this.spreadGraph.config.aliases.root]:spreadLink[this.spreadGraph.config.aliases.id]
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
    this.each(this._getToFields(pathGraph, pathLink, spreadLink), (toField, next) => {
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
    var query = {
      [this.spreadGraph.config.aliases.prev]: spreadLinkId,
    };
    this._wrapSpreadQuery(query, context);
    if (handler) {
      this.spreadGraph.fetch(query, undefined, (error, spreadLinks) => {
        if (error) {
          if (callback) callback(error);
        } else {
          this.each(spreadLinks, (spreadLink, next) => {
            this.spreadGraph.remove(spreadLink[this.spreadGraph.config.aliases.id], (error, count) => {
              handler(error, spreadLink);
              next();
            }, context);
          }, () => {
            if (callback) callback(undefined, spreadLinks.length);
          });
        }
      });
    } else {
      this.spreadGraph.remove(query, callback, context);
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
    var query = {
      [this.spreadGraph.config.aliases.path]: pathLinkId,
    };
    this._wrapSpreadQuery(query, context);
    if (handler) {
      this.spreadGraph.fetch(query, undefined, (error, spreadLinks) => {
        if (error) {
          if (callback) callback(error);
        } else {
          this.each(spreadLinks, (spreadLink, next) => {
            this.spreadGraph.remove(spreadLink[this.spreadGraph.config.aliases.id], (error, count) => {
              handler(error, spreadLink);
              next();
            }, context);
          }, () => {
            if (callback) callback(undefined, spreadLinks.length);
          });
        }
      });
    } else {
      this.spreadGraph.remove(query, callback, context);
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
    var query = {
      [this.spreadGraph.config.aliases[this.spreadGraph.variableField]]: id,
    };
    this._wrapSpreadQuery(query, context);
    this.spreadGraph.fetch(query, undefined, (error, spreadLinks) => {
      if (error) {
        if (callback) callback(error);
      } else {
        this.each(spreadLinks, (spreadLink, next) => {
          this.spreadGraph._unspreadingHandler(spreadLink, context, (permission) => {
            if (permission) {
              this.spreadGraph.remove(spreadLink[this.spreadGraph.config.aliases.id], (error, count) => {
                if (handler) handler(error, spreadLink);
                next();
              }, context);
            }
          });
        }, () => {
          if (callback) callback(undefined, spreadLinks.length);
        });
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
    this.each(this.pathGraphs, (pathGraph, nextPathGraph) => {
      this.each(this._getToFields(pathGraph), (toField, nextToField) => {
        var query = {
          [this.spreadGraph.config.aliases[toField]]: id,
        };
        this._wrapPathQuery(query, pathGraph, undefined, toField, context);
        pathGraph.fetch(query, undefined, (error, pathLinks) => {
          this.each(pathLinks, (pathLink, nextPathLink) => {
            this.spreadByPathLink(pathGraph, pathLink, context, handler, nextPathLink);
          }, function(error) {
            nextToField();
          });
        });
      }, nextPathGraph);
    }, () => {
      if (callback) callback();
    });
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