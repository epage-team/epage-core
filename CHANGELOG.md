# Change Log

### 0.5.2（2021/4/1）

- [feat] : `store.addWidget(widget)` 优化，widget可以为如`input`形式字符串，也可以为`{ widget: 'input', ...}` 完整schema
- [feat] : `util.flattenSchema` 导出增加对象增加 `rootSchema`引用。可以通过`store.updateWidgetOption(rootSchema.key, {...})`更新`rootSchema.option`选项

### 0.5.1（2021/2/21）

- [fix] : 添加`vuedraggable`依赖，作为拖拽能力

### 0.5.0（2021/2/20）

- [feat] : 对外暴露`drag`模块，当前支持vue模块拖动，为自定义容器组件提供能力，依赖`vuedraggable`
- [feat] : 对外暴露`hook`模块，定制设计器及渲染器时可使用，一般用于设计器插件中，可参考`epage`设计器hook使用，能力如下：

```js
const syncHook = new hook.SyncHook() // 同步串行任务，不接受上一个任务结果
syncHook.tap(callback) // 将callback添加到同步任务队列
syncHook.call(args) // 将arguments分别传给任务队列的callback中

const syncWaterHook = new hook.SyncWaterfallHook() // 同步串行任务，接受上一个任务结果
// 用法同上，只是会将每个任务结果作为参数传给下个任务
```
- [feat] : 对外暴露`render`模块，直接提供`render.VueRender`，实验阶段的`ReactRender`可通过以下方式引入

```js
import ReactRender from 'epage-core/src/render/ReactRender'
```
方式
- 
### 0.4.1（2021/1/18）

- [fix] : 修复widget被二次添加时，widget.Setting生命周期没有再次使用问题

### 0.4.0（2020/12/31）

- [feat] : 开放单一widget样式配置，自定义高级背景配置
- [feat] : 新增`text` widget能力，支持`{{$f[schema.name]]}}`表达式运算

### 0.3.0（2020/11/04）

- [feat] : 增加整体页面配置(背景色、间距等)，对外暴露`style`模块，目前包含`{ Background }`
- [feat] : 字典能力补充，未发版

### 0.2.1~0.2.2（2020/10/20）

- [feat] : 逻辑关系中，被控组件存在多值时，增加值的 `或`、`且` 关系
- [feat] : 逻辑关系比较增加值类型条件
- [fix] : 修复 `cascader` 值类型转换未递归问题
- [fix] : 多个逻辑关系，改变值时出现未知现象，添加容错


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