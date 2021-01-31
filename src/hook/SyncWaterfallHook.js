import Hook from './Hook'
// 串行同步
export default class SyncWaterfallHook extends Hook {
  constructor () {
    super()
  }
  call (...args) {
    const [first, ...others] = this.tasks
    return others.reduce((ret, task) => task(ret), first(...args))
    
  }
}
