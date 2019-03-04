import React from 'react'
import { ReactComponent as Preloader } from './ball-triangle.svg'
import { componentFromStream } from 'recompose'
import {
  debounceTime,
  filter,
  map,
  switchMap,
  pluck,
  catchError,
  delay
} from 'rxjs/operators'
import { of, merge } from 'rxjs'

import { ajax } from 'rxjs/ajax'
import UserComponent from './UserComponent'
import Error from './Error'

import './User.css'

const formatUrl = user => `https://api.github.com/users/${user}`

const User = componentFromStream(prop$ => {
  const loading$ = of(
    <div className={'loading'}>
      <Preloader />
    </div>
  )

  const getUser$ = prop$.pipe(
    debounceTime(1000),
    // pluck expects prop.user at some point. pluck grabs user,
    // so we don’t need to destructure our props every time.
    pluck('user'),
    //Ensures that user exists and isn’t an empty string.
    filter(user => user && user.length),
    map(formatUrl),
    /* switchMap’s for switching from one observable to another.
    Let’s say the user enters a username, and we fetch it inside switchMap.
    If the user enters something new before the result comes back
    switchMap will cancel that previous fetch and focus on the current one. 
    */
    switchMap(url =>
      //Turn multiple observables into a single observable.
      //merge(input: Observable): Observable
      merge(
        loading$,
        ajax(url).pipe(
          //pluck(properties: ...args): Observable
          //Select properties to emit.
          pluck('response'),
          delay(1500),
          map(UserComponent),
          //componentFromStream callback must return an observable.
          //We can achieve that with 'of'
          //'Of' emits variable amount of values in a sequence and then emits a complete notification.
          //of(...values, scheduler: Scheduler): Observable
          catchError(error => of(<Error {...error} />))
        )
      )
    )
  )
  return getUser$
})

export default User
