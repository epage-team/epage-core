
export default class Script{
  constructor(ctx) {
    this.ctx = ctx
  }

  exec(script){
    try {
      /* eslint-disable no-new-func */
      const fun = new Function('ctx', script)
      return fun(this.ctx)
    } catch (e) {
      console.log(e)
    }
  }
}
