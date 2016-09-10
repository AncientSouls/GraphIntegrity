'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class with methods for easy subscription to spreading on graph events.
 * 
 * @class
 * @description `import { QueueSpreading } from 'ancient-graph-spreading';`
 */
var QueueSpreading = function () {

  /**
   * @param {GraphSpreading} graphSpreading
   */
  function QueueSpreading(graphSpreading) {
    _classCallCheck(this, QueueSpreading);

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


  _createClass(QueueSpreading, [{
    key: '_getGraph',
    value: function _getGraph(linkId) {}

    /**
     * Reacts to end of method triggered from launched or process link. If there are no other processes spreading links performed for the start, remove launched token.
     * 
     * @param {ExistedGraph} launchedGraph
     * @param {string} launchedLinkId
     * @param {string} launchedToRemove
     */

  }, {
    key: 'mayBeEndedLaunched',
    value: function mayBeEndedLaunched(launchedLinkId, launchedToRemove) {
      var launchedGraph = this._getGraph(launchedLinkId);
      this.graphSpreading.spreadGraph.count({ process: launchedLinkId }, undefined, function (error, count) {
        if (!count) {
          launchedGraph.update({ id: launchedLinkId, launched: launchedToRemove }, { launched: { remove: launchedToRemove } }, function (error, count) {
            if (error) throw error;
            if (!count) {
              if (launchedGraph.removed) {
                launchedGraph.removed.update({ id: launchedLinkId, launched: launchedToRemove }, { launched: { remove: launchedToRemove } }, function (error, count) {
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

  }, {
    key: 'insertedPathLink',
    value: function insertedPathLink(pathGraph, pathLink) {
      var _this = this;

      this.graphSpreading.spreadByPathLink(pathGraph, pathLink, { process: pathLink.id }, undefined, function () {
        _this.mayBeEndedLaunched(pathLink.id, 'spread');
      });
    }

    /**
     * Reacts to update source or target in path. Then it launched two queues, unspread and spread. This method triggers the first step of the first unspread queue. After removal of unspread from launched from path, you need to start the second queue with method updatedLaunchedUnspreadPathLink.
     * 
     * @param {PathGraph} pathGraph
     * @param {PathLink} pathLink
     * @param {string[]} pathLink.launched - ['unspread', 'spread']
     */

  }, {
    key: 'updatedSourceOrTargetPathLink',
    value: function updatedSourceOrTargetPathLink(pathGraph, pathLink) {
      var _this2 = this;

      this.graphSpreading.unspreadByPathId(pathLink.id, { process: pathLink.id }, undefined, function () {
        _this2.mayBeEndedLaunched(pathLink.id, 'unspread');
      });
    }

    /**
     * Reacts to update launched remove unspread, but spread still exists. This method triggers the first step of the second spread queue.
     * 
     * @param {PathGraph} pathGraph
     * @param {PathLink} pathLink
     * @param {string[]} pathLink.launched - ['spread']
     */

  }, {
    key: 'updatedLaunchedUnspreadPathLink',
    value: function updatedLaunchedUnspreadPathLink(pathGraph, pathLink) {
      this.insertedPathLink(pathGraph, pathLink);
    }

    /**
     * Reacts to remove path. Similar to the method updatedSourceOrTargetPathLink, but the work is gone  with pathGraph.removed.
     * 
     * @param {PathGraph} pathGraph
     * @param {PathLink} pathLink
     * @param {string[]} pathLink.launched - ['unspread']
     */

  }, {
    key: 'removedPathLink',
    value: function removedPathLink(pathGraph, pathLink) {
      var _this3 = this;

      this.graphSpreading.unspreadByPathId(pathLink.id, { process: pathLink.id }, undefined, function () {
        _this3.mayBeEndedLaunched(pathLink.id, 'unspread');
      });
    }

    /**
     * Reacts to insert new spread link. Link can be inserted with field process as step in queue or with field launched as start of queue.
     * 
     * @param {SpreadLink} spreadLink
     * @param {string[]} [pathLink.launched]
     * @param {string[]} [pathLink.process]
     */

  }, {
    key: 'insertedSpreadLink',
    value: function insertedSpreadLink(spreadLink) {
      var _this4 = this;

      var context = {},
          process = false;
      if (spreadLink.process && typeof spreadLink.process[0] == 'string') {
        context.process = spreadLink.process[0];
        process = true;
      } else if (spreadLink.launched && typeof spreadLink.launched[0] == 'string') {
        context.process = spreadLink.id;
      } else {
        throw new Error('SpreadLink should have `launched` or `process` field.');
      }
      this.graphSpreading.spreadFromSpreadLink(spreadLink, context, undefined, function () {
        if (process) {
          _this4.graphSpreading.spreadGraph.update(spreadLink.id, { process: { remove: context.process } });
        }
        _this4.mayBeEndedLaunched(context.process, 'spread');
      });
    }

    /**
     * Reacts to remove spread link.
     * 
     * @param {SpreadLink} spreadLink
     */

  }, {
    key: 'removedSpreadLink',
    value: function removedSpreadLink(spreadLink) {
      var _this5 = this;

      var context = { process: {} },
          process = false,
          launched = false;
      if (spreadLink.process && typeof spreadLink.process[0] == 'string') {
        context.process = spreadLink.process[0];
        launched = process = context.process;
      } else if (spreadLink.launched && typeof spreadLink.launched[0] == 'string') {
        context.process = spreadLink.id;
        launched = spreadLink.id;
      } else {
        throw new Error('SpreadLink ' + spreadLink.id + ' should have `launched` or `process` field.');
      }
      this.graphSpreading.unspreadFromRemovedSpreadLinkByPrevId(spreadLink.id, context, undefined, function () {
        if (process) {
          _this5.graphSpreading.spreadGraph.removed.update(spreadLink.id, { process: { remove: context.process } });
        }
        _this5.mayBeEndedLaunched(launched, 'unspread');
      });
    }
  }]);

  return QueueSpreading;
}();

exports.QueueSpreading = QueueSpreading;
//# sourceMappingURL=queue.js.map