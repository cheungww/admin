import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {
  Form,
  Icon,
  Input,
  Button,
  Modal,
  message
} from 'antd'
import {connect} from 'react-redux'

import './login.less'
import logo from '../../assets/images/logo.jpg'
import {login} from '../../redux/actions'
import UserForm from '../user/user-form'
import {reqAddOrUpdateUser, reqRoles} from "../../api/index";

const Item = Form.Item // 不能写在import之前

/*
登陆的路由组件
 */
class Login extends Component {

  state = {
    roles: [], // 所有角色列表
    isShow: false, // 是否显示确认框
  }

  handleSubmit = (event) => {

    // 阻止事件的默认行为
    event.preventDefault()

    // 对所有表单字段进行检验
    this.props.form.validateFields(async (err, values) => {
      // 检验成功
      if (!err) {
        // console.log('提交登陆的ajax请求', values)
        // 请求登陆
        const {username, password} = values

        // 调用分发异步action的函数 => 发登陆的异步请求, 有了结果后更新状态
        this.props.login(username, password)

      } else {
        console.log('检验失败!')
      }
    });

    // 得到form对象
    // const form = this.props.form
    // // 获取表单项的输入数据
    // const values = form.getFieldsValue()
    // console.log('handleSubmit()', values)
  }

  /*
  对密码进行自定义验证
  */
  /*
   用户名/密码的的合法性要求
     1). 必须输入
     2). 必须大于等于4位
     3). 必须小于等于12位
     4). 必须是英文、数字或下划线组成
    */
  validatePwd = (rule, value, callback) => {
    // console.log('validatePwd()', rule, value)
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

  /*
  显示注册界面
   */
  showAdd = async () => {
    this.user = null // 去除前面保存的user
    this.setState({isShow: true})
    // 获取所有角色列表
    const {data} = await reqRoles()
    this.setState({roles: data})
  }

  /*
  注册新用户
   */
  addUser = async (event) => {
    
    // 对所有表单字段进行检验
    this.form.validateFields(async (err, values) => {
      // 检验成功
      if (!err) {
        // 1. 收集输入数据
        const user = this.form.getFieldsValue()
        
        
        // console.log('注册用户：', user);
        
        // 2. 提交添加的请求
        const result = await reqAddOrUpdateUser(user)
        // 3. 更新列表显示
        if(result.status===0) {
          // 关闭对话框
          this.setState({isShow: false})
          // 清空表单
          this.form.resetFields()
          message.success(`注册用户成功`)
        } else {
          message.error(result.msg)
        }

      } else {
        message.error('输入的账号或密码不符合要求')
      }
    })
  }

  render () {

    const { isShow, roles } = this.state;

    // 如果用户已经登陆, 自动跳转到管理界面
    const user = this.props.user
    if(user && user._id) {
      return <Redirect to='/home'/>
    }

    // 得到具强大功能的form对象
    const form = this.props.form
    const { getFieldDecorator } = form;

    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo"/>
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className="login-content">
          {
          user.errorMsg && 
            function() {
              message.error(user.errorMsg) 
              user.errorMsg = ''
            }()
          }
          <h2>用户登陆</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
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
                getFieldDecorator('username', { // 配置对象: 属性名是特定的一些名称
                  // 声明式验证: 直接使用别人定义好的验证规则进行验证
                  rules: [
                    { required: true, whitespace: true, message: '用户名必须输入' },
                    { min: 2, message: '用户名至少2位' },
                    { max: 12, message: '用户名最多12位' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
                  ],
                  initialValue: '', // 初始值
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="用户名"
                  />
                )
              }
            </Item>
            <Form.Item>
              {
                getFieldDecorator('password', {
                  rules: [
                    {
                      validator: this.validatePwd
                    }
                  ]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码"
                  />
                )
              }

            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登陆
              </Button>
            </Form.Item>
          </Form>
          <Button type='primary' className="register-button" onClick={this.showAdd}>注册</Button>
          <Modal
            title={'注册用户'}
            visible={isShow}
            onOk={this.addUser}
            onCancel={() => {
              this.form.resetFields()
              this.setState({isShow: false})
            }}
          >
            <UserForm
              setForm={form => this.form = form}
              roles={roles}
            />
          </Modal>
        </section>
      </div>
    )
  }
}

/*
包装Form组件生成一个新的组件: Form(Login)
新组件会向Form组件传递一个强大的对象属性: form
 */
const WrapLogin = Form.create()(Login)
export default connect(
  state => ({user: state.user}),
  {login}
)(WrapLogin)


/*
1. 前台表单验证
2. 收集表单输入数据
 */
