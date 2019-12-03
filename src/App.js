import React, {Component} from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

/* import Login from './pages/login/login'
import Admin from './pages/admin/admin' */

import asyncComponent from "./components/AsyncComponent.js";
// 异步动态导入组件
const AsyncLogin = asyncComponent(() => import("./pages/login/login"));
const AsyncAdmin = asyncComponent(() => import("./pages/admin/admin"));


/*
应用的根组件
 */
export default class App extends Component {


  render () {
    return (
      <BrowserRouter>
        <Switch> {/*只匹配其中一个*/}
          <Route path='/login' component={AsyncLogin}></Route>
          <Route path='/' component={AsyncAdmin}></Route>
        </Switch>
      </BrowserRouter>
    )
  }
}