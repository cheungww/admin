import React, { Component } from 'react';
import { Form, Icon, Input, Button, message } from 'antd';
import { Redirect } from "react-router-dom";

import './login.less';
import logo from '../../assets/images/logo.jpg';
import { reqLogin } from '../../api/index';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';

import Password from 'antd/lib/input/Password';

const { Item: FormItem } = Form;

class Login extends Component {

  handleSubmit = (event) => {
    event.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { username, password } = values;
        const result = await reqLogin(username, password);
        if (result.status === 0) {
          message.success('登录成功');

          const user = result.data;
          memoryUtils.user = user; // 保存在内存中
          storageUtils.saveUser(user); // 保存在local中
          // 跳转到管理界面 (不需要再回退回到登陆)
          this.props.history.replace('/');
        } else {
          message.error(result.msg);
        }
      } else {
        console.log('检验失败');
      }
    })

    // const { form } = this.props;
    // const values = form.getFieldsValue();
    // console.log('handleSubmit', values);
    
  }

  validatePwd = (rule, value, callback) => {
    console.log('validatePwd()', rule, value)
    if(!value) {
      callback('密码必须输入')
    } else if (value.length<4) {
      callback('密码长度不能小于4位')
    } else if (value.length>12) {
      callback('密码长度不能大于12位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须是英文、数字或下划线组成')
    } else {
      callback() // 验证通过
    }
    // callback('xxxx') // 验证失败, 并指定提示的文本
  }

  render () {

    // 如果用户已经登陆, 自动跳转到管理界面
    const user = memoryUtils.user
    if(user && user._id) {
      return <Redirect to='/'/>
    }
    
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo"/>
          <h1>React项目：后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {
                /*
              用户名/密码的的合法性要求
                1). 必须输入
                2). 必须大于等于4位
                3). 必须小于等于12位
                4). 必须是英文、数字或下划线组成
               */
              }
              {
                getFieldDecorator('username', { // 声明式验证: 直接使用别人定义好的验证规则进行验证
                  rules: [
                    { required: true, whitespace: true, message: "用户必须输入用户名" },
                    { min: 4, messgae: '用户名至少要4位' },
                    { max: 12, message: '用户名最多12位' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: '必须是英文、数字或下划线组成,且不允许空格'}
                  ],
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Username"
                  />
                )
              }
            </FormItem>
            <FormItem>
              {
                getFieldDecorator('password', {
                  rules: [
                    {
                      validator: this.validatePwd
                    }
                  ]})(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="Password"
                  />
                )
              }
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </FormItem>
          </Form>
        </section>
      </div>
    );
  }
}


const WrapLogin = Form.create()(Login);
export default WrapLogin;

/*
1. 前台表单验证
2. 收集表单输入数据
 */

 
/*
1. 高阶函数
    1). 一类特别的函数
        a. 接受函数类型的参数
        b. 返回值是函数
    2). 常见
        a. 定时器: setTimeout()/setInterval()
        b. Promise: Promise(() => {}) then(value => {}, reason => {})
        c. 数组遍历相关的方法: forEach()/filter()/map()/reduce()/find()/findIndex()
        d. 函数对象的bind()
        e. Form.create()() / getFieldDecorator()()
    3). 高阶函数更新动态, 更加具有扩展性

2. 高阶组件
    1). 本质就是一个函数
    2). 接收一个组件(被包装组件), 返回一个新的组件(包装组件), 包装组件会向被包装组件传入特定属性
    3). 作用: 扩展组件的功能
    4). 高阶组件也是高阶函数: 接收一个组件函数, 返回是一个新的组件函数
 */
/*
包装Form组件生成一个新的组件: Form(Login)
新组件会向Form组件传递一个强大的对象属性: form
 */