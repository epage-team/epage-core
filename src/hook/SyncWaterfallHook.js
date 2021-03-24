import Hook from './Hook'
// 串行同步
export default class SyncWaterfallHook extends Hook {
  constructor () {
    super()
    this.tasks = []
  }

  call (...args) {
    const [first, ...others] = this.tasks
    if (!Array.isArray(first)) return args
    return others.reduce((ret, task) => task(ret), first(...args))
  }
}
