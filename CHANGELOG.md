# Change Log


### 0.2.1（2020/10/20）

- [feat] : 逻辑关系中，被控组件存在多值时，增加值的 `或`、`且` 关系
- [feat] : 逻辑关系比较增加值类型条件
- [fix] : 修复 `cascader` 值类型转换未递归问题


### 0.2.0（2020/10/12）

- [feat] : 增加widget显隐属性默认值，逻辑配置面板，不符合条件时回退到默认值
- [feat] : 逻辑配置面板，可配置自定义脚本，可直接使用ctx全局变量，关于ctx可参考button的[ctx](http://epage.didichuxing.com/examples/widgets/button.html#schema-option%E5%AE%9A%E4%B9%89)

### 0.1.8（2020/09/22）

- [fix] : 修复包内部import依赖大小写问题 [epage#8](https://github.com/didi/epage/issues/8)

### 0.1.7（2020/08/18）

- [fix] : 修复上个版本增加`json`类型忽略`undefined`情况导致渲染报错

### 0.1.6（2020/08/17）

- [feat] : 增加`json`表单类型校验

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