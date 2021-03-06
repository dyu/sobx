[s](https://github.com/adamhaile/s) object/pojo observables for [surplus](https://github.com/adamhaile/s)

App.tsx
```tsx
import * as Surplus from 'surplus'; Surplus;
import { $$, observable } from 'sobx'

export interface Greeting {
    msg: string
}
export const GreetingV = ({pojo}: {pojo: Greeting}) =>
<div>
  <b>{$$(pojo.msg)}</b>
</div>

export class App {
    p = {
        disabled: false,
        msg: 'hey',
        msgs: ['hi'],
        greeting: {
            msg: 'hello' 
        } as Greeting,
        greetings: [
            observable({ msg: 'ciao' })
        ] as Greeting[]
    }
    
    constructor() {
        observable(this.p, {})
    }
    
    append(suffix: string) {
        let p = this.p
        p.msg += suffix
        p.greeting.msg += suffix
        p.msgs.push(suffix)
        p.greetings.push(observable({ msg: suffix }))
        p.disabled = !p.disabled
    }
}
export const AppV = (self: App) => {
    let p = self.p; p = p['$'];
    return (
<div>
  <button type="button" onClick={() => self.append('!')}>!</button>
  <div>{$$(p.msg)}</div>
  <GreetingV pojo={p.greeting} />
  {p.msgs.map(msg =>
    <button type="button" disabled={$$(p.disabled)}>
      {msg}
    </button>
  )}
  {p.greetings.map(greeting => <GreetingV pojo={greeting} />)}
</div>
)}
```

main.ts
```ts
import S from 's-js'
import { App, AppV } from './App'

const view = S.root(() => AppV(new App()))
document.body.appendChild(view)
```
