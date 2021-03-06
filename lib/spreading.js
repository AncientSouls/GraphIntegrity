'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.GraphSpreading=undefined;var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _async=require('async');var _async2=_interopRequireDefault(_async);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}/**
 * Class with methods for spread and unspread of the spreadGraph on pathGraph(s).
 * 
 * @class
 * @description `import { GraphSpreading } from 'ancient-graph-spreading';`
 */var GraphSpreading=function(){/**
   * @param {SpreadGraph} spreadGraph
   */function GraphSpreading(spreadGraph){_classCallCheck(this,GraphSpreading);this.spreadGraph=spreadGraph;this.pathGraphs=[]}/**
   * Custom async callbacks support
   * 
   * @param {Array|Iterable|Object} coll - A collection to iterate over.
   * @param {function} iteratee - A function to apply to each item in coll.
   * @param {function} callback - A callback which is called when all iteratee functions have finished.
   */_createClass(GraphSpreading,[{key:'each',value:function each(coll,iteratee,callback){_async2.default.each(coll,iteratee,callback)}/**
   * @param {PathGraph} pathGraph
   */},{key:'addPathGraph',value:function addPathGraph(pathGraph){this.pathGraphs.push(pathGraph)}/**
   * Custom wrapper of query to spread graph
   * 
   * @param {Object} [query]
   * @param {Object} [context]
   */},{key:'_wrapSpreadQuery',value:function _wrapSpreadQuery(query,context){}/**
   * Custom wrapper of query to path graph
   * 
   * @param {Object} [query]
   * @param {Object} [pathGraph]
   * @param {String} [fromField]
   * @param {String} [toField]
   * @param {Object} [context]
   */},{key:'_wrapPathQuery',value:function _wrapPathQuery(query,pathGraph,fromField,toField,context){}/**
   * Custom getter of possible from fields.
   * 
   * @param {Object} [pathGraph]
   * @param {Object} [pathLink]
   * @param {Object} [spreadLink]
   * @return {String[]} [fromFields]
   */},{key:'_getFromFields',value:function _getFromFields(pathGraph,pathLink,spreadLink){return pathGraph.fromFields}/**
   * Custom getter of possible to fields.
   * 
   * @param {Object} [pathGraph]
   * @param {Object} [pathLink]
   * @param {Object} [spreadLink]
   * @return {String[]} [toFields]
   */},{key:'_getToFields',value:function _getToFields(pathGraph,pathLink,spreadLink){return pathGraph.toFields}/**
   * Spread by pathLink and specified fromField with available spreadLinks.
   * 
   * @param {string} fromField
   * @param {PathGraph} pathGraph
   * @param {PathLink} pathLink
   * @param {Object} [context]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathLinkCallback} [handler]
   * @param {GraphSpreading~spreadByPathLinkCallback} [callback]
   */},{key:'_spreadByPathLink',value:function _spreadByPathLink(fromField,pathGraph,pathLink,context,handler,callback){var _this=this;var query=_defineProperty({},this.spreadGraph.config.aliases[this.spreadGraph.variableField],pathLink[pathGraph.config.aliases[fromField]]);this._wrapSpreadQuery(query,context);this.spreadGraph.fetch(query,undefined,function(error,spreadLinks){if(spreadLinks.length){_this.each(spreadLinks,function(spreadLink,next){_this.spreadFromSpreadLinkByPathLink(spreadLink,pathGraph,pathLink,context,handler,function(){next()})},function(){if(callback)callback()})}else{if(callback)callback()}})}/**
   * Spread by pathLink with available spreadLinks.
   * 
   * @param {PathGraph} pathGraph
   * @param {PathLink} pathLink
   * @param {Object} [context]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathLinkCallback} [handler]
   * @param {GraphSpreading~spreadByPathLinkCallback} [callback]
   */},{key:'spreadByPathLink',value:function spreadByPathLink(pathGraph,pathLink,context,handler,callback){var _this2=this;this.each(this._getFromFields(pathGraph,pathLink),function(fromField,next){_this2._spreadByPathLink(fromField,pathGraph,pathLink,context,handler,next)},callback)}/**
   * Optional callback.
   *
   * @callback GraphSpreading~spreadByPathLinkCallback
   *//**
   * Spread root of tree spreadLink.
   * 
   * @param {SpreadLink} newSpreadLink
   * @param {Object} [context]
   * @param {Graph~insertCallback} [callback]
   */},{key:'spreadNewSpreadLink',value:function spreadNewSpreadLink(newSpreadLink,context,callback){var _this3=this;this.spreadGraph._spreadingHandler(undefined,undefined,undefined,newSpreadLink,context,function(newSpreadLink){if(newSpreadLink){_this3.spreadGraph.insert(newSpreadLink,callback,context)}else{if(callback)callback()}})}/**
   * Spread by all available paths from spreadLink.
   * 
   * @param {SpreadLink} spreadLink
   * @param {Object} [context]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathGraphHandler} [handler]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathGraphCallback} [callback]
   */},{key:'spreadFromSpreadLink',value:function spreadFromSpreadLink(spreadLink,context,handler,callback){var _this4=this;this.each(this.pathGraphs,function(pathGraph,next){_this4.spreadFromSpreadLinkByPathGraph(spreadLink,pathGraph,context,handler,next)},function(){if(callback)callback()})}/**
   * Spread by all available paths in pathGraph from spreadLink and specified fromField.
   * 
   * @param {string} fromField
   * @param {SpreadLink} spreadLink
   * @param {PathGraph} pathGraph
   * @param {Object} [context]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathGraphHandler} [handler]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathGraphCallback} [callback]
   */},{key:'_spreadFromSpreadLinkByPathGraph',value:function _spreadFromSpreadLinkByPathGraph(fromField,spreadLink,pathGraph,context,handler,callback){var _this5=this;var query=_defineProperty({},pathGraph.config.aliases[fromField],spreadLink[this.spreadGraph.variableField]);this._wrapPathQuery(query,pathGraph,fromField,undefined,context);pathGraph.fetch(query,undefined,function(error,pathLinks){_this5.each(pathLinks,function(pathLink,next){_this5.spreadFromSpreadLinkByPathLink(spreadLink,pathGraph,pathLink,context,handler,next)},function(){if(callback)callback()})})}/**
   * Spread by all available paths in pathGraph from spreadLink.
   * 
   * @param {SpreadLink} spreadLink
   * @param {PathGraph} pathGraph
   * @param {GraphSpreading~spreadFromSpreadLinkByPathGraphHandler} [handler]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathGraphCallback} [callback]
   */},{key:'spreadFromSpreadLinkByPathGraph',value:function spreadFromSpreadLinkByPathGraph(spreadLink,pathGraph,context,handler,callback){var _this6=this;this.each(this._getFromFields(pathGraph,undefined,spreadLink),function(fromField,next){_this6._spreadFromSpreadLinkByPathGraph(fromField,spreadLink,pathGraph,context,handler,next)},callback)}/**
   * Optional handler. If present, called with an error object as the first argument and, if no error, others arguments with results of spreading.
   *
   * @callback GraphSpreading~spreadFromSpreadLinkByPathGraphHandler
   * @param {Error} [error]
   * @param {string} [newSpreadLinkId]
   * @param {SpreadLink} [prevSpreadLink]
   * @param {PathGraph} [pathGraph]
   * @param {PathLink} [pathLink]
   *//**
   * Optional callback.
   *
   * @callback GraphSpreading~spreadFromSpreadLinkByPathGraphCallback
   *//**
   * Spread by pathLink and specified toField in pathGraph from spreadLink.
   * 
   * @param {SpreadLink} spreadLink
   * @param {PathGraph} pathGraph
   * @param {PathLink} pathLink
   * @param {Object} [context]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathLinkCallback} [callback]
   */},{key:'_spreadFromSpreadLinkByPathLink',value:function _spreadFromSpreadLinkByPathLink(toField,spreadLink,pathGraph,pathLink,context,callback){var _spreadGraph$_spreadi,_this7=this;this.spreadGraph._spreadingHandler(spreadLink,pathGraph,pathLink,(_spreadGraph$_spreadi={},_defineProperty(_spreadGraph$_spreadi,this.spreadGraph.config.aliases[this.spreadGraph.constantField],spreadLink[this.spreadGraph.config.aliases[this.spreadGraph.constantField]]),_defineProperty(_spreadGraph$_spreadi,this.spreadGraph.config.aliases[this.spreadGraph.variableField],pathLink[pathGraph.config.aliases[toField]]),_defineProperty(_spreadGraph$_spreadi,this.spreadGraph.config.aliases.prev,spreadLink[this.spreadGraph.config.aliases.id]),_defineProperty(_spreadGraph$_spreadi,this.spreadGraph.config.aliases.path,pathLink[pathGraph.config.aliases.id]),_defineProperty(_spreadGraph$_spreadi,this.spreadGraph.config.aliases.root,spreadLink[this.spreadGraph.config.aliases.root]?spreadLink[this.spreadGraph.config.aliases.root]:spreadLink[this.spreadGraph.config.aliases.id]),_spreadGraph$_spreadi),context,function(newSpreadLink){if(newSpreadLink){_this7.spreadGraph.insert(newSpreadLink,function(error,id){if(callback)callback(error,id,spreadLink,pathGraph,pathLink)},context)}else{if(callback)callback()}})}/**
   * Spread by pathLink in pathGraph from spreadLink.
   * 
   * @param {SpreadLink} spreadLink
   * @param {PathGraph} pathGraph
   * @param {PathLink} pathLink
   * @param {Object} [context]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathLinkHandler} [handler]
   * @param {GraphSpreading~spreadFromSpreadLinkByPathLinkCallback} [callback]
   */},{key:'spreadFromSpreadLinkByPathLink',value:function spreadFromSpreadLinkByPathLink(spreadLink,pathGraph,pathLink,context,handler,callback){var _this8=this;this.each(this._getToFields(pathGraph,pathLink,spreadLink),function(toField,next){_this8._spreadFromSpreadLinkByPathLink(toField,spreadLink,pathGraph,pathLink,context,function(error,id,prev,pathGraph,pathLink){if(handler)handler(error,id,prev,pathGraph,pathLink);next()})},callback)}/**
   * Optional handler.
   *
   * @callback GraphSpreading~spreadFromSpreadLinkByPathLinkCallback
   * @param {Error} [error]
   * @param {string} [newSpreadLinkId]
   * @param {SpreadLink} [prevSpreadLink]
   * @param {PathGraph} [pathGraph]
   * @param {PathLink} [pathLink]
   *//**
   * Optional callback. If present, called with an error object as the first argument and, if no error, the unique id of inserted spread link as the second.
   *
   * @callback GraphSpreading~spreadFromSpreadLinkByPathLinkCallback
   *//**
   * Remove spreadLinks with specific prev spreadLink id.
   * 
   * @param {string} spreadLinkId
   * @param {Object} [context]
   * @param {GraphSpreading~unspreadFromRemovedSpreadLinkByPrevIdHandler} [handler]
   * @param {GraphSpreading~unspreadFromRemovedSpreadLinkByPrevIdCallback} [callback]
   */},{key:'unspreadFromRemovedSpreadLinkByPrevId',value:function unspreadFromRemovedSpreadLinkByPrevId(spreadLinkId,context,handler,callback){var _this9=this;var query=_defineProperty({},this.spreadGraph.config.aliases.prev,spreadLinkId);this._wrapSpreadQuery(query,context);if(handler){this.spreadGraph.fetch(query,undefined,function(error,spreadLinks){if(error){if(callback)callback(error)}else{_this9.each(spreadLinks,function(spreadLink,next){_this9.spreadGraph.remove(spreadLink[_this9.spreadGraph.config.aliases.id],function(error,count){handler(error,spreadLink);next()},context)},function(){if(callback)callback(undefined,spreadLinks.length)})}})}else{this.spreadGraph.remove(query,callback,context)}}/**
   * Optional handler. If present, called with an error object as the first argument and, if no error, others arguments with results of unspreading.
   *
   * @callback GraphSpreading~unspreadFromRemovedSpreadLinkByPrevIdHandler
   * @param {Error} [error]
   * @param {SpreadLink} [spreadLink]
   *//**
   * Optional callback.
   *
   * @callback GraphSpreading~unspreadFromRemovedSpreadLinkByPrevIdCallback
   * @param {Error} [error]
   * @param {number} [count]
   *//**
   * Remove spreadLinks with specific path pathLink id.
   * 
   * @param {string} pathLinkId
   * @param {Object} [context]
   * @param {GraphSpreading~unspreadByPathIdHandler} [handler]
   * @param {GraphSpreading~unspreadByPathIdCallback} [callback]
   */},{key:'unspreadByPathId',value:function unspreadByPathId(pathLinkId,context,handler,callback){var _this10=this;var query=_defineProperty({},this.spreadGraph.config.aliases.path,pathLinkId);this._wrapSpreadQuery(query,context);if(handler){this.spreadGraph.fetch(query,undefined,function(error,spreadLinks){if(error){if(callback)callback(error)}else{_this10.each(spreadLinks,function(spreadLink,next){_this10.spreadGraph.remove(spreadLink[_this10.spreadGraph.config.aliases.id],function(error,count){handler(error,spreadLink);next()},context)},function(){if(callback)callback(undefined,spreadLinks.length)})}})}else{this.spreadGraph.remove(query,callback,context)}}/**
   * Optional handler.
   *
   * @callback GraphSpreading~unspreadByPathIdHandler
   * @param {Error} [error]
   * @param {SpreadLink} [spreadLink]
   *//**
   * Optional callback.
   *
   * @callback GraphSpreading~unspreadByPathIdCallback
   * @param {Error} [error]
   * @param {number} [count]
   *//**
   * Unspread all valid spreadLinks to this id.
   * 
   * @param {string} id
   * @param {Object} [context]
   * @param {GraphSpreading~unspreadToHandler} [handler]
   * @param {GraphSpreading~unspreadToCallback} [callback]
   */},{key:'unspread',value:function unspread(id,context,handler,callback){var _this11=this;var query=_defineProperty({},this.spreadGraph.config.aliases[this.spreadGraph.variableField],id);this._wrapSpreadQuery(query,context);this.spreadGraph.fetch(query,undefined,function(error,spreadLinks){if(error){if(callback)callback(error)}else{_this11.each(spreadLinks,function(spreadLink,next){_this11.spreadGraph._unspreadingHandler(spreadLink,context,function(permission){if(permission){_this11.spreadGraph.remove(spreadLink[_this11.spreadGraph.config.aliases.id],function(error,count){if(handler)handler(error,spreadLink);next()},context)}})},function(){if(callback)callback(undefined,spreadLinks.length)})}})}/**
   * Optional handler.
   *
   * @callback GraphSpreading~unspreadToHandler
   * @param {Error} [error]
   * @param {SpreadLink} [spreadLink]
   *//**
   * Optional callback.
   *
   * @callback GraphSpreading~unspreadToCallback
   *//**
   * Spread all spread links from all available paths to this id.
   * 
   * @param {string} id
   * @param {Object} [context]
   * @param {GraphSpreading~spreadToHandler} [handler]
   * @param {GraphSpreading~spreadToCallback} [callback]
   */},{key:'spreadTo',value:function spreadTo(id,context,handler,callback){var _this12=this;this.each(this.pathGraphs,function(pathGraph,nextPathGraph){_this12.each(_this12._getToFields(pathGraph),function(toField,nextToField){var query=_defineProperty({},_this12.spreadGraph.config.aliases[toField],id);_this12._wrapPathQuery(query,pathGraph,undefined,toField,context);pathGraph.fetch(query,undefined,function(error,pathLinks){_this12.each(pathLinks,function(pathLink,nextPathLink){_this12.spreadByPathLink(pathGraph,pathLink,context,handler,nextPathLink)},function(error){nextToField()})})},nextPathGraph)},function(){if(callback)callback()})}/**
   * Optional handler. Fires after each processed spread link.
   * Id can be empty if the `this.spreadGraph._spreadingHandler` banned spreading.
   * 
   * @callback GraphSpreading~spreadToHandler
   * @param {Error} [error]
   * @param {string} [newSpreadLinkId]
   * @param {SpreadLink} [prevSpreadLink]
   * @param {PathGraph} [pathGraph]
   * @param {PathLink} [pathLink]
   *//**
   * Optional callback.
   *
   * @callback GraphSpreading~spreadToCallback
   */}]);return GraphSpreading}();exports.GraphSpreading=GraphSpreading;
//# sourceMappingURL=spreading.js.map