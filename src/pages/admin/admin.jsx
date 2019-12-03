import React, {Component} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import { Layout } from 'antd'
import {connect} from 'react-redux'

import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
/* 
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import NotFound from '../not-found/not-found' */
// import Order from '../order/order'


import asyncComponent from "../../components/AsyncComponent.js";

// 异步动态导入组件
const AsyncHome = asyncComponent(() => import("../home/home"));
const AsyncCategory = asyncComponent(() => import("../category/category"));
const AsyncProduct = asyncComponent(() => import("../product/product"));
const AsyncRole = asyncComponent(() => import("../role/role"));
const AsyncUser = asyncComponent(() => import("../user/user"));
const AsyncBar = asyncComponent(() => import("../charts/bar"));
const AsyncLine = asyncComponent(() => import("../charts/line"));
const AsyncPie = asyncComponent(() => import("../charts/pie"));
const AsyncNotFound = asyncComponent(() => import("../not-found/not-found"));

const { Footer, Sider, Content } = Layout

/*
后台管理的路由组件
 */
class Admin extends Component {
  render () {
    const user = this.props.user
    // 如果内存没有存储user ==> 当前没有登陆
    if(!user || !user._id) {
      // 自动跳转到登陆(在render()中)
      return <Redirect to='/login'/>
    }
    return (
      <Layout style={{minHeight: '100%'}}>
        <Sider>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{margin: 20, backgroundColor: '#fff'}}>
            <Switch>
              <Redirect exact from='/' to='/home'/>
              <Route path='/home' component={AsyncHome}/>
              <Route path='/category' component={AsyncCategory}/>
              <Route path='/product' component={AsyncProduct}/>
              <Route path='/role' component={AsyncRole}/>
              <Route path='/user' component={AsyncUser}/>
              <Route path='/charts/bar' component={AsyncBar}/>
              <Route path='/charts/line' component={AsyncLine}/>
              <Route path='/charts/pie' component={AsyncPie}/>
              {/* <Route path="/order" component={Order}/> */}
              <Route component={AsyncNotFound}/> {/*上面没有一个匹配, 直接显示*/}
            </Switch>
          </Content>
          <Footer style={{textAlign: 'center', color: '#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}


export default connect(
  state => ({user: state.user}),
  {}
)(Admin)