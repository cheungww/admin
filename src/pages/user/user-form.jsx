import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option

/*
添加/修改用户的form组件
 */
class UserForm extends PureComponent {

  static propTypes = {
    setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
    roles: PropTypes.array.isRequired,
    user: PropTypes.object
  }

  // 设置默认 props
  static defaultProps = {
    user: {}
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

  // 寻找角色对应的id
  findRoleId = (roles, RoleName) => {
    let index;
    roles.forEach((role, i) => {
      if (role.name === RoleName) {
        index = i;
        return;
      }
    });
    return roles[index]._id;
  }

  UNSAFE_componentWillMount () {
    this.props.setForm(this.props.form)
  }

  render() {

    const {roles, user} = this.props
    const { getFieldDecorator } = this.props.form
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
      <Form {...formItemLayout}>
        <Item label='用户名'>
          {
            getFieldDecorator('username', { // 配置对象: 属性名是特定的一些名称
              // 声明式验证: 直接使用别人定义好的验证规则进行验证
              rules: [
                { required: true, whitespace: true, message: '用户名必须输入' },
                { min: 2, message: '用户名至少2位' },
                { max: 12, message: '用户名最多12位' },
                // { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
              ],
              initialValue: user.username,
            })(
              <Input placeholder='请输入用户名'/>
            )
          }
        </Item>

        {
          user._id ? null : (
            <Item label='密码'>
              {
                getFieldDecorator('password', {
                  rules: [
                    { required: true, whitespace: true},
                    {
                      validator: this.validatePwd
                    }
                  ],
                  initialValue: user.password,
                })(
                  <Input type='password' placeholder='请输入密码'/>
                )
              }
            </Item>
          )
        }

        <Item label='手机号'>
          {
            getFieldDecorator('phone', {
              initialValue: user.phone,
            })(
              <Input placeholder='请输入手机号'/>
            )
          }
        </Item>
        <Item label='邮箱'>
          {
            getFieldDecorator('email', {
              initialValue: user.email,
            })(
              <Input placeholder='请输入邮箱'/>
            )
          }
        </Item>

        <Item label='角色'>
          {
            getFieldDecorator('role_id', { // 默认角色是系统管理员
              initialValue: user.role_id || (roles.length && this.findRoleId(roles, "系统管理员")),
            })(
              <Select>
                {
                  roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UserForm)