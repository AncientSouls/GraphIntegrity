'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}/**
 * Class with methods for easy subscription to spreading on graph events.
 * 
 * @class
 * @description `import { QueueSpreading } from 'ancient-graph-spreading';`
 */var QueueSpreading=function(){/**
   * @param {GraphSpreading} graphSpreading
   */function QueueSpreading(graphSpreading){_classCallCheck(this,QueueSpreading);this.graphSpreading=graphSpreading;if(this._getGraph==QueueSpreading.prototype._getGraph){throw new Error('Method `_getGraph` is not adapted.')}}/**
   * Should return graph instance by link id from process field.
   * 
   * @param {string} linkId
   * @return {Graph} graph
   * @throws {Error} If graph is not founded
   */_createClass(QueueSpreading,[{key:'_getGraph',value:function _getGraph(linkId){}/**
   * Reacts to end of method triggered from launched or process link. If there are no other processes spreading links performed for the start, remove launched token.
   * 
   * @param {ExistedGraph} launchedGraph
   * @param {string} launchedLinkId
   * @param {string} launchedToRemove
   */},{key:'removeFromLaunched',value:function removeFromLaunched(launchedLinkId,launchedToRemove){var launchedGraph=this._getGraph(launchedLinkId);this.graphSpreading.spreadGraph.count({process:launchedLinkId},undefined,function(error,count){if(!count){launchedGraph.update({id:launchedLinkId,launched:launchedToRemove},{launched:{remove:launchedToRemove}},function(error,count){if(error)throw error;if(!count){if(launchedGraph.removed){launchedGraph.removed.update({id:launchedLinkId,launched:launchedToRemove},{launched:{remove:launchedToRemove}},function(error,count){if(error)throw error})}}})}})}/**
   * Reacts to insert a new path and reacts to update launched remove unspread, but spread still exists. This method triggers the first step of the second spread queue.
   * If passed callback, then not be called removeFromLaunched.
   * 
   * @param {PathGraph} pathGraph
   * @param {PathLink} pathLink
   * @param {string[]} pathLink.launched - ['spread']
   * @param {Function} [callback]
   */},{key:'spreadByPath',value:function spreadByPath(pathGraph,pathLink,callback){var _this=this;this.graphSpreading.spreadByPathLink(pathGraph,pathLink,{process:pathLink.id},undefined,function(){if(callback)callback();else _this.removeFromLaunched(pathLink.id,'spread')})}/**
   * Reacts to remove path and reacts to update source or target in path. Then it launched two queues, unspread and spread. This method triggers the first step of the first unspread queue. After removal of unspread from launched from path, you need to start the second queue with method spreadByPath.
   * If passed callback, then not be called removeFromLaunched.
   * 
   * @param {PathGraph} pathGraph
   * @param {PathLink} pathLink
   * @param {string[]} pathLink.launched - ['unspread', 'spread']
   * @param {Function} [callback]
   */},{key:'unspreadByPath',value:function unspreadByPath(pathGraph,pathLink,callback){var _this2=this;this.graphSpreading.unspreadByPathId(pathLink.id,{process:pathLink.id},undefined,function(){if(callback)callback();else _this2.removeFromLaunched(pathLink.id,'unspread')})}/**
   * Reacts to insert new spread link. Link can be inserted with field process as step in queue or with field launched as start of queue.
   * If passed callback, then not be called removeFromLaunched.
   * 
   * @param {SpreadLink} spreadLink
   * @param {Function} [callback]
   */},{key:'spreadBySpread',value:function spreadBySpread(spreadLink,callback){var _this3=this;var context={},process=false;if(spreadLink.process&&typeof spreadLink.process[0]=='string'){context.process=spreadLink.process[0];process=true}else if(spreadLink.launched&&typeof spreadLink.launched[0]=='string'){context.process=spreadLink.id}else{if(callback)callback();return}this.graphSpreading.spreadFromSpreadLink(spreadLink,context,undefined,function(){if(process){_this3.graphSpreading.spreadGraph.update(spreadLink.id,{process:{remove:context.process}})}if(callback)callback();else _this3.removeFromLaunched(context.process,'spread')})}/**
   * Reacts to remove spread link.
   * If passed callback, then not be called removeFromLaunched.
   * 
   * @param {SpreadLink} spreadLink
   * @param {Function} [callback]
   */},{key:'unspreadBySpread',value:function unspreadBySpread(spreadLink,callback){var _this4=this;var context={process:{}},process=false,launched=false;if(spreadLink.process&&typeof spreadLink.process[0]=='string'){context.process=spreadLink.process[0];launched=process=context.process}else if(spreadLink.launched&&typeof spreadLink.launched[0]=='string'){context.process=spreadLink.id;launched=spreadLink.id}else{if(callback)callback();return}this.graphSpreading.unspreadFromRemovedSpreadLinkByPrevId(spreadLink.id,context,undefined,function(){if(process){_this4.graphSpreading.spreadGraph.removed.update(spreadLink.id,{process:{remove:context.process}})}if(callback)callback();else _this4.removeFromLaunched(launched,'unspread')})}/**
   * Reacts to insert a new spreader and reacts to update launched remove unspread, but spread still exists. This method triggers the first step of the second spread queue.
   * If passed callback, then not be called removeFromLaunched.
   * 
   * @param {SpreaderGraph} spreaderGraph
   * @param {SpreaderLink} spreaderLink
   * @param {string[]} spreaderLink.launched - ['spread']
   * @param {Function} [callback]
   */},{key:'spreadBySpreader',value:function spreadBySpreader(spreaderGraph,spreaderLink,callback){var _graphSpreading$sprea,_this5=this;this.graphSpreading.spreadNewSpreadLink((_graphSpreading$sprea={},_defineProperty(_graphSpreading$sprea,this.graphSpreading.spreadGraph.constantField,spreaderLink[spreaderGraph.constantField]),_defineProperty(_graphSpreading$sprea,this.graphSpreading.spreadGraph.variableField,spreaderLink[spreaderGraph.variableField]),_defineProperty(_graphSpreading$sprea,'spreader',spreaderLink.id),_graphSpreading$sprea),{process:spreaderLink.id},function(){if(callback)callback();else _this5.removeFromLaunched(spreaderLink.id,'spread')})}/**
   * Reacts to remove spreader link and reacts to update source or target in spreader. Then it launched two queues, unspread and spread. This method triggers the first step of the first unspread queue. After removal of unspread from launched from spreader, you need to start the second queue with method spreadBySpreader.
   * If passed callback, then not be called removeFromLaunched.
   * 
   * @param {SpreaderGraph} spreaderGraph
   * @param {SpreaderLink} spreaderLink
   * @param {string[]} spreaderLink.launched - ['unspread', 'spread']
   * @param {Function} [callback]
   */},{key:'unspreadBySpreader',value:function unspreadBySpreader(spreaderGraph,spreaderLink,callback){var _this6=this;this.graphSpreading.spreadGraph.remove({spreader:spreaderLink.id},function(error,count){if(callback)callback();else _this6.removeFromLaunched(spreaderLink.id,'unspread')},{modifier:{process:{add:spreaderLink.id}}})}}]);return QueueSpreading}();exports.QueueSpreading=QueueSpreading;
//# sourceMappingURL=queue.js.map