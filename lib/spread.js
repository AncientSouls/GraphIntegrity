'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _get=function get(object,property,receiver){if(object===null)object=Function.prototype;var desc=Object.getOwnPropertyDescriptor(object,property);if(desc===undefined){var parent=Object.getPrototypeOf(object);if(parent===null){return undefined}else{return get(parent,property,receiver)}}else if('value'in desc){return desc.value}else{var getter=desc.get;if(getter===undefined){return undefined}return getter.call(receiver)}};function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called')}return call&&(typeof call==='object'||typeof call==='function')?call:self}function _inherits(subClass,superClass){if(typeof superClass!=='function'&&superClass!==null){throw new TypeError('Super expression must either be null or a function, not '+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass}/**
 * This method allows you to use SpreadGraph class to its inheritance chain.
 * Fields launched, process, prev, path and root is required!
 * Manage fields launched and process.
 * 
 * @param {Class} ParentClassGraph
 * @return {Class} SpreadGraph
 * @description `import { factorySpreadGraph } from 'ancient-graph-spreading';`
 */function factorySpreadGraph(ParentClassGraph){var SpreadGraph=function(_ParentClassGraph){_inherits(SpreadGraph,_ParentClassGraph);/**
     * @param {} collection - A pointer to the collection dannymineobhodimye daapteru to work with the graph. This may be a connection to the SQL database and table name, for example, or a collection of Mongo. 
     * @param {Object} fields - Comparison of the data in the collection of data in the graph. It is necessary for the adapter.
     * @param {Object} config - Additional config.
     * @param {String} config.constantField - Constant field in graph
     * @param {String} config.variableField - Spreadable field in graph
     */function SpreadGraph(collection,selector,config){_classCallCheck(this,SpreadGraph);var _this=_possibleConstructorReturn(this,(SpreadGraph.__proto__||Object.getPrototypeOf(SpreadGraph)).apply(this,arguments));if(config.constantField)_this.constantField=config.constantField;else throw new Error('config.constantField is not defined');if(config.variableField)_this.variableField=config.variableField;else throw new Error('config.variableField is not defined');return _this}/**
     * Default spreading handler. If spread specified link allowed, callback it link, else callback undefined.
     * 
     * @param {Object} [prevSpreadLink]
     * @param {PathGraph} [pathGraph]
     * @param {Object} [pathLink]
     * @param {Object} newSpreadLink 
     * @param {Object} [context]
     * @param {SpreadGraph~_spreadingHandlerCallback} [callback]
     */_createClass(SpreadGraph,[{key:'_spreadingHandler',value:function _spreadingHandler(prevSpreadLink,pathGraph,pathLink,newSpreadLink,context,callback){callback(newSpreadLink)}/**
     * Responce from _spreadingHandler method.
     *
     * @callback SpreadGraph~_spreadingHandlerCallback
     * @param {Object} [newSpreadLink] 
     *//**
     * Default unspreading handler. If unspread specified link allowed, callback it link, else callback undefined.
     * It called in cases of dispute. When respread, if this method not replaced, will be respreaded all spread links.
     * 
     * @param {Object} spreadLink 
     * @param {Object} [context]
     * @param {SpreadGraph~_unspreadingHandlerCallback} [callback]
     */},{key:'_unspreadingHandler',value:function _unspreadingHandler(spreadLink,context,callback){callback(true)}/**
     * Responce from _unspreadingHandler method.
     *
     * @callback SpreadGraph~_unspreadingHandlerCallback
     * @param {Boolean} [premission = true]
     *//**
     * Parent insert with parser of context.process.
     */},{key:'insert',value:function insert(modifier,callback,context){if(context&&context.process){modifier.process=[context.process]}return _get(SpreadGraph.prototype.__proto__||Object.getPrototypeOf(SpreadGraph.prototype),'insert',this).call(this,modifier,callback,context)}/**
     * The method is strictly designed so that the class inherits from ExistedGraph.
     * Adds to process field custom value from context.
     */},{key:'remove',value:function remove(selector,callback,context){if(context&&context.process){if(!context.modifier)context.modifier={};context.modifier.process={add:context.process}}return _get(SpreadGraph.prototype.__proto__||Object.getPrototypeOf(SpreadGraph.prototype),'remove',this).call(this,selector,callback,context)}}]);return SpreadGraph}(ParentClassGraph);return SpreadGraph};exports.factorySpreadGraph=factorySpreadGraph;
//# sourceMappingURL=spread.js.map