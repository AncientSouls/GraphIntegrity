##### Подготовка графов

Объявим все необходимые графы. Данные будут "воображаемые" и представлены только в качестве идентификаторов `'users/*'` и `'items/*'`.

```js
import { Graph } from 'ancient-graph/lib/adapters/object.js';
import { PathGraph, SpreadGraph, GraphSpreading } from 'ancient-graph-spreading';

var rules = new Graph(
  [],
  { id: 'id', source: 'source', target: 'target', author: 'author' },
  (index, link) => { return 'rules/'+index; }
);

var rights = new Graph(
  [],
  { id: 'id', source: 'source', target: 'target', prev: 'prev', path: 'path', root: 'root', rule: 'rule' },
  (index, link) => { return 'rights/'+index; }
);

var nesting = new Graph(
  [],
  { id: 'id', source: 'source', target: 'target' },
  (index, link) => { return 'nesting/'+index; }
);

var nestingPathGraph = new PathGraph(nesting, 'source', 'target');
var rightsSpreadGraph = new SpreadGraph(rights, 'source', 'target', (spreadLink, pathGraph, pathLink, newSpreadLink, callback) => {
  callback(newSpreadLink);
});
```

Допустим при создании пользователей наше приложение для него автоматически создаёт право.

```js
rights.insert({ source: 'users/0', target: 'users/0' }); // 'rights/0'
rights.insert({ source: 'users/1', target: 'users/1' }); // 'rights/1'
rights.insert({ source: 'users/2', target: 'users/2' }); // 'rights/2'
```

Допустим мы хотим что бы это право наследовалось на все вложенные в `'users/0'` элементы. Для этого мы будем наблюдать за изменениями графа вложенности и поддерживал распространение графа `rights` по графу `nesting`.

```js
nestingPathGraph.graph.on('link', (oldLink, newLink) => {
  graphSpreading.spreadByPathLink(nestingPathGraph, newLink);
});

nestingPathGraph.graph.on('unlink', (oldLink, newLink) => {
  graphSpreading.unspreadByPathId(oldLink.id);
});
```

Будет логично так-же следить за изменениями в графе прав, и продолжать их распространение или удаление.

```js
rightsSpreadGraph.graph.on('link', (oldLink, newLink) => {
  if (!oldLink || oldLink[rightsSpreadGraph.variableField] != newLink[rightsSpreadGraph.variableField]) {
    graphSpreading.spreadFromSpreadLink(newLink);
  }
});

rightsSpreadGraph.graph.on('unlink', (oldLink, newLink) => {
  if (!newLink || oldLink[rightsSpreadGraph.variableField] != newLink[rightsSpreadGraph.variableField]) {
    graphSpreading.unspreadFromRemovedSpreadLinkByPrevId(oldLink.id);
  }
});
```

##### Пользователь и его собственность

Допустим пользователь создал `'items/0'`.
Допустим система позволяет делать с не вложенными куда-либо, свободными, данными что угодно и кому угодно.
Допустим пользователь вкладывает `'items/0'` в себя.

```js
nesting.insert({ source: 'users/0', target: 'items/0' }); // 'nesting/0'
```

Это приводит к асинхронному вызову события `insert` для графа `nesting`.
В результате появляется связь `rights/1`

```js
rights.fetch({ target: 'items/0' });
// [{ id: 'right/1', source: 'users/0', target: 'items/0', prev: 'rights/0', path: 'nesting/0', root: 'rights/0' }]
```

// Повторим это несколько раз что бы создать более сложное дерево вложенности.

```js
nesting.insert({ source: 'items/0', target: 'items/1' }); // 'nesting/1'
nesting.insert({ source: 'items/1', target: 'items/2' }); // 'nesting/2'
nesting.insert({ source: 'users/0', target: 'items/3' }); // 'nesting/3'
nesting.insert({ source: 'items/3', target: 'items/4' }); // 'nesting/4'
```

При этом кроме связей вложенности от каждой вершины в графе `nesting` будет существовать связь в графе `rights` ведущая к `'users/0'` как к владельцу.

В результате получится примерно такое дерево вложенности:

* `'users/0'` with `'rights/0'`
  * `'items/0'` with `'rights/3'` by `'nesting/0'`
    * `'items/1'` with `'rights/4'` by `'nesting/1'`
      * `'items/2'` with `'rights/6'` by `'nesting/2'`
  * `'items/3'` with `'rights/5'` by `'nesting/3'`
    * `'items/4'` with `'rights/7'` by `'nesting/4'`
* `'users/1'` with `'rights/1'`
* `'users/2'` with `'rights/2'`

##### Подготовка правил

Допустим правило это желание пользователя предоставить права другому пользоватулю. Наличие правила не значит что будет предоставлено право. Право должно предоставляться только если у пользователя создавшего правило есть права на каждую вершину в дереве от указанной вершини и ниже. При этом если дерево `nesting`, `rights` или `rules` меняется нужно удостоверится что уже выданные права лигитимны, и нельзя распротраниться на новые данные.

Добавим к имеющимся реакциям повторный анализ выданных по некоторому правилу прав.

```js
rightsSpreadGraph.graph.on('unlink', (oldLink, newLink) => {
  if (!newLink || oldLink[rightsSpreadGraph.variableField] != newLink[rightsSpreadGraph.variableField]) {
    rules.each({ target: oldLink[rightsSpreadGraph.variableField] }, undefined, (rule) => {
      // If rule illegal, then remove all rights of this rule
      rightsSpreadGraph.graph.fetch({
        [rightsSpreadGraph.constantField]: rule.author,
        [rightsSpreadGraph.variableField]: rule.target
      }, undefined, (error, rightLinks) => {
        if (!rightLinks.length) {
          rightsSpreadGraph.graph.remove({ rule: rule.id });
        }
      });
    });
  }
});
```
Добавим реакции на изменения правил.

```js
rules.on('insert', (oldLink, newLink) => {
  graphSpreading.spreadNewSpreadLink({
    [rightsSpreadGraph.constantField]: newLink.source,
    [rightsSpreadGraph.variableField]: newLink.target,
    rule: newLink.id
  });
});

rules.on('remove', (oldLink, newLink) => {
  rights.remove({ rule: oldLink.id });
});

rules.on('update', (oldLink, newLink) => {
  if (oldLink.source != newLink.source) {
    rightsSpreadGraph.update({
      rule: oldLink.id,
      [rightsSpreadGraph.constantField]: newLink.source,
    });
  } else {
    rights.remove({ rule: oldLink.id });
    graphSpreading.spreadNewSpreadLink({
      [rightsSpreadGraph.constantField]: newLink.source,
      [rightsSpreadGraph.variableField]: newLink.target,
      rule: newLink.id
    });
  }
});
```

##### Передача прав

Допустим `'users/0'` решил предоставить `'users/1'` права на данные от `'items/1'` и глубже по дереву `nesting`.

```js
rules.insert({ source: 'users/1', target: 'items/1', author: 'users/0' }); // 'rules/0'
```

Посмотрим какие права после этого существуют для `'users/1'`:

```js
rights.fetch({ source: 'users/1' });
/**
 * [
 *   { id: 'rights/1', source: 'users/1', target: 'users/1' },
 *   { id: 'rights/8', source: 'users/1', target: 'items/1', rule: 'rules/0' },
 *   { id: 'rights/9', source: 'users/1', target: 'items/2', prev: 'rights/8', path: 'nesting/2', root: 'rights/8' },
 * ]
 */
```

##### Передача переданных прав

Допустим появился пользователь `'users/2'`.
Допустим `'users/1'` решил предоставить `'users/2'` права на данные от `'items/2'` и глубже по дереву `nesting`.

```js
rules.insert({ source: 'users/2', target: 'items/2', author: 'users/1' }); // 'rules/1'
```

Посмотрим какие права после этого существуют для `'users/2'`:

```js
rights.fetch({ source: 'users/2' });
/**
 * [
 *   { id: 'rights/2', source: 'users/2', target: 'users/2' },
 *   { id: 'rights/10', source: 'users/2', target: 'items/2', rule: 'rules/1' },
 * ]
 */
```

##### Удаление правила

> В этом примере можно опустить возможность распространять права на правила.

Допустим пользователь `'users/0'` решил отобрать права предоставленные `'users/0'`.

```js
rules.remove('rules/0');
```

Это значит что право `'rights/7'` и все унаследованные связи считающие его корнем (`'rights/8'`), более не лигитимны. Они будут удалены. При удалении `'rights/8'` сработает проверка лигитимности правила `'rules/1'`, и так-как у `'users/1'` больше нет прав на `'items/2'`, значит право не может быть предоставлено и оно будет удалено.  Иначе говоря - остануться только права выданные на `'users/0'`. Правило `'rules/1'` выданное для `'users/2'` не было удалено, однако оно больше не создаёт прав, так как его автор не имеет на это прав.

```js
rights.fetch('rights/8');
// []
rights.fetch('rights/9');
// []
rights.fetch('rights/10');
// []
```