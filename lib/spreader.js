'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called')}return call&&(typeof call==='object'||typeof call==='function')?call:self}function _inherits(subClass,superClass){if(typeof superClass!=='function'&&superClass!==null){throw new TypeError('Super expression must either be null or a function, not '+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass}/**
 * This method allows you to use SpreaderGraph class to its inheritance chain.
 * If using this graph, then in the spreadGraph field spreader is required.
 * 
 * @param {Class} ParentClassGraph
 * @return {Class} SpreaderGraph
 * @description `import { factorySpreaderGraph } from 'ancient-graph-spreading';`
 */function factorySpreaderGraph(ParentClassGraph){var SpreaderGraph=function(_ParentClassGraph){_inherits(SpreaderGraph,_ParentClassGraph);/**
     * @param {} collection - A pointer to the collection dannymineobhodimye daapteru to work with the graph. This may be a connection to the SQL database and table name, for example, or a collection of Mongo. 
     * @param {Object} fields - Comparison of the data in the collection of data in the graph. It is necessary for the adapter.
     * @param {Object} config - Additional config.
     * @param {String} config.constantField - Constant field in graph
     * @param {String} config.variableField - Spreadable field in graph
     */function SpreaderGraph(collection,selector,config){_classCallCheck(this,SpreaderGraph);var _this=_possibleConstructorReturn(this,(SpreaderGraph.__proto__||Object.getPrototypeOf(SpreaderGraph)).apply(this,arguments));if(config.constantField)_this.constantField=config.constantField;else throw new Error('config.constantField is not defined');if(config.variableField)_this.variableField=config.variableField;else throw new Error('config.variableField is not defined');return _this}return SpreaderGraph}(ParentClassGraph);return SpreaderGraph};exports.factorySpreaderGraph=factorySpreaderGraph;
//# sourceMappingURL=spreader.js.map