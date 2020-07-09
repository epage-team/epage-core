# Change Log


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