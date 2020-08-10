# Change Log

### 0.1.5（2020/08/10）

- [feat] : 增加`Context`及`Scirpt`模块，方便在自定义脚本中增加context环境

```js
import { Context, Script } from 'epage-core'
const { $render } = this.$root.$options.extension
const { script } = this.schema.option
const ctx = new Context({
  $el,
  $render,
  store,
  instance: this,
  state: {
    loading: this.loading
  }
})
const sc = new Script(ctx)
sc.exec(script)
```


### 0.1.4（2020/08/01）

- [feat] : 添加基础widget默认值

### 0.1.3（2020/07/22）

- [feat] : 添加 `schema.base.RootSchema` 模块默认样式属性

### 0.1.2

- [feat] : 添加 `schema.base` 子模块导出

```js
import { schema } from 'epage-core'

console.log(schema.base)
// { input: Schema, select: Schema, ...}
```

### 0.1.1

- [feat] : 添加 `TypeBuilder` 导出

### 0.1.0

- [feat] : 从 [epage](https://github.com/didi/epage) 项目抽离核心项目，作为设计器(epage)及渲染器(如epage-iview)的核心依赖