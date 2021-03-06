import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Input , Button} from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import {reg, regCaptcha} from '../../../services/auth';
import {set as setGlobalData} from '../../../global_data'
import * as check from '../../../utils/check';
import './index.less';

class Index extends Component {

  state={
    username: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    code: ''
  }

  bindUsernameInput = (e) => {
    console.log('e', e.target.value);
    this.setState({
      username: e.target.value
    });
  }

  bindPasswordInput = (e) => {
    this.setState({
      password: e.target.value
    });
  }

  bindConfirmPasswordInput = (e) => {
    this.setState({
      confirmPassword: e.target.value
    });
  }

  bindMobileInput = (e) => {
    this.setState({
      mobile: e.target.value
    });
  }

  bindCodeInput = (e) => {
    this.setState({
      code: e.target.value
    });
  }

  clearInput = (key) => {
    switch (key) {
      case 'clear-username':
        this.setState({
          username: ''
        });
        break;
      case 'clear-password':
        this.setState({
          password: ''
        });
        break;
      case 'clear-confirm-password':
        this.setState({
          confirmPassword: ''
        });
        break;
      case 'clear-mobile':
        this.setState({
          mobile: ''
        });
        break;
      case 'clear-code':
        this.setState({
          code: ''
        });
        break;
    }
  }

  requestRegister = (wxCode) => {

    reg({
      username: this.state.username,
      password: this.state.password,
      mobile: this.state.mobile,
      code: this.state.code,
      wxCode: wxCode
    }).then(res => {
      setGlobalData('hasLogin', true);
      Taro.setStorageSync('userInfo', res.data.userInfo);
      Taro.setStorage({
        key: "token",
        data: res.data.token,
        success: function() {
          Taro.switchTab({
            url: '/pages/ucenter/index/index'
          });
        }
      });
    })

  }

  startRegister = () => {
    const {password, username, confirmPassword, code, mobile} = this.state;
    console.log('this.state', this.state);
    if (password.length < 6 || username.length < 6) {
      Taro.showModal({
        title: '????????????',
        content: '??????????????????????????????6???',
        showCancel: false
      });
      return false;
    }

    if (password != confirmPassword) {
      Taro.showModal({
        title: '????????????',
        content: '?????????????????????',
        showCancel: false
      });
      return false;
    }

    if (mobile.length == 0 || code.length == 0) {
      Taro.showModal({
        title: '????????????',
        content: '?????????????????????????????????',
        showCancel: false
      });
      return false;
    }

    if (!check.isValidPhone(this.state.mobile)) {
      Taro.showModal({
        title: '????????????',
        content: '????????????????????????',
        showCancel: false
      });
      return false;
    }

    Taro.login({
      success: (res) => {
        if (!res.code) {
          Taro.showModal({
            title: '????????????',
            content: '????????????',
            showCancel: false
          });
        }

        this.requestRegister(res.code);
      }
    });
  }

  sendCode = () => {
    const {mobile} = this.state;

    if (mobile.length == 0) {
      Taro.showModal({
        title: '????????????',
        content: '?????????????????????',
        showCancel: false
      });
      return false;
    }

    if (!check.isValidPhone(mobile)) {
      Taro.showModal({
        title: '????????????',
        content: '????????????????????????',
        showCancel: false
      });
      return false;
    }

    regCaptcha({
      mobile: mobile
    }).then(res => {
      console.log('res', res);
      Taro.showModal({
        title: '????????????',
        content: '??????????????????',
        showCancel: false
      });
    })
  }

  render() {
    const {username, password, confirmPassword, mobile, code} = this.state;
    return (
      <View className='container'>
        <View className='form-box'>

          <View className='form-item'>
            <Input className='username' value={username} onInput={this.bindUsernameInput} placeholder='?????????' focus />
            {
              username && username.length > 0 && <View className='clear'><AtIcon value='close-circle' size='14' color='#666' onClick={() => this.clearInput('clear-username')} /></View>
            }

          </View>

          <View className='form-item'>
            <Input className='password' value={password} password onInput={this.bindPasswordInput} placeholder='??????' />
            { password && password.length > 0 && <View className='clear'><AtIcon value='close-circle' size='14' color='#666' onClick={() => this.clearInput('clear-password')} /></View>}
          </View>

          <View className='form-item'>
            <Input className='password' value={confirmPassword} password onInput={this.bindConfirmPasswordInput} placeholder='????????????' />
            { confirmPassword && confirmPassword.length > 0 && <View className='clear'><AtIcon value='close-circle' size='14' color='#666' onClick={() => this.clearInput('clear-confirm-password')} /></View>}
          </View>

          <View className='form-item'>
            <Input className='mobile' value={mobile} onInput={this.bindMobileInput} placeholder='?????????' />
            { mobile && mobile.length > 0 && <View className='clear'><AtIcon value='close-circle' size='14' color='#666' name='close' onClick={() => this.clearInput('clear-mobile')} /></View>}
          </View>

          <View className='form-item-code'>
            <View className='form-item code-item'>
              <Input className='code' value={code} onInput={this.bindCodeInput} placeholder='?????????' />
              { code && code.length > 0 && <View className='clear'><AtIcon value='close-circle' size='14' color='#666' onClick={() => this.clearInput('clear-code')} /></View>}
            </View>
            <View className='code-btn' onClick={this.sendCode}>???????????????</View>
          </View>

          <Button type='primary' className='register-btn' onClick={this.startRegister}>??????</Button>

        </View>
      </View>
    );
  }
}
export default Index;
