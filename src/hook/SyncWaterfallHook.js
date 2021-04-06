import Hook from './Hook'
// 串行同步
export default class SyncWaterfallHook extends Hook {
  constructor () {
    super()
    this.tasks = []
  }

  call (parm) {
    const [first, ...others] = this.tasks
    if (typeof first !== 'function') return parm
    return others.reduce((ret, task) => task(ret), first(parm))
  }
}
