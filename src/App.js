import React from 'react'
import { componentFromStream, createEventHandler } from 'recompose'
import { map, startWith, tap } from 'rxjs/operators'
import { combineLatest } from 'rxjs'
import User from './UserContainer'
import './App.css'

const App = componentFromStream(prop$ => {
  const { handler, stream } = createEventHandler()

  const value$ = stream.pipe(
    map(e => e.target.value),
    startWith('')
  )

  return combineLatest(prop$, value$).pipe(
    // do / tap -  Transparently perform actions or side-effects, such as logging.
    // If you are using as a pipeable operator, do is known as tap!
    // do(nextOrObserver: function, error: function, complete: function): Observable
    tap(console.log),

    //Apply projection with each value from source.
    //map(project: Function, thisArg: any): Observable
    map(([props, value]) => (
      <div className="App">
        <div className="field-input">
          <input
            onChange={handler}
            placeholder="Search for GitHub username"
            className="input"
          />
        </div>
        <User user={value} />
      </div>
    ))
  )
})

export default App
