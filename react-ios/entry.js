'use strict'


import { createStore,applyMiddleware  } from 'redux'
import { Provider  } from 'react-redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
const loggerMiddleware = createLogger()



import React, {
  Component,View, Text, ScrollView,StyleSheet,Image,
  Navigator,TabBarIOS,AsyncStorage,StatusBar
} from 'react-native';


// import BottomBar from '../lib/bottom-bar'

import * as navigators from '../common/navigators'

import Home from './home'
import User from '../common/user'
import Community from '../common/shequ'
import Tickets from '../common/tickets'
import Global from '../common/global'

import {app} from '../common/reducer/app'

import {STORAGE_TOKEN} from '../common/const/data'

import {setTokenAndLogin,loginByToken} from '../common/action/functions'

const store = createStore(
  app,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
)



export default class MainEntry extends  Component{

    state = {
        homeInit:true,
        globalInit:false,
        communityInit:false,
        ticketsInit:false,
        userInit:false,
        currentTab:0
    };

    constructor(props){
        super(props);

        let navigator = props.navigator;

    }
    componentDidMount(){
        AsyncStorage.getItem(STORAGE_TOKEN).then((value)=>{
            console.log(value);

            if(value != null){
                store.dispatch(setTokenAndLogin(value));
            }
        }).catch((error) => {
            console.warn(error);
        }).done();
    }
    static defaultProps = {
            tabs:[{
                icon:require('../images/home.png'),
                icon_active:require('../images/home-active.png'),
                name:"首页",
                init:true,
                key:"home"
            },
            //{
            //     icon:require('../images/special.png'),
            //     icon_active:require('../images/special-active.png'),
            //     name:"我要购",
            //     key:"global"
            //
            // },
            {
                icon:require('../images/community.png'),
                icon_active:require('../images/community-active.png'),
                name:"社区",
                key:"community"

            },{
                icon:require('../images/tickets.png'),
                icon_active:require('../images/tickets-active.png'),
                name:"优惠券",
                key:"tickets"
            },{
                icon:require('../images/me.png'),
                icon_active:require('../images/me-active.png'),
                name:"我",
                key:"my"

            }]
    };

    handleTabPress(index){
        this.props.tabs[index].init = true;
        this.setState({currentTab:index});
    }

    _renderTabContent(key){
      switch (key) {
        case 'home':
            return <Home navigator={this.props.navigator}/>
        case 'global':
            return <Global navigator={this.props.navigator}/>
        case 'community':
            return <Community navigator={this.props.navigator}/>
        case 'tickets':
            return <Tickets navigator={this.props.navigator}/>
        case 'my':
            return <User navigator={this.props.navigator}/>
          break;
        default:
          return <View></View>

      }
    }
    render(){
      let style_visible = {position:"absolute",left:0,right:0,top:0,bottom:0};
      let style_invisible = {position:"absolute",opacity:0};

        return(
            <Provider store={store}>
            <View style={{flex:1}}>


                <TabBarIOS style={{flex:1}} tintColor="#e23351" barTintColor="white">
                    {this.props.tabs.map((tab,index)=>{
                         return (
                           <TabBarIOS.Item title={tab.name}
                              icon={tab.icon}
                              selectedIcon={tab.icon_active}
                              selected={index == this.state.currentTab}
                              onPress={() => {
                                          this.setState({
                                            currentTab: index,
                                          });
                                        }}
                              key={index}>

                                {this._renderTabContent(tab.key)}

                            </TabBarIOS.Item>
                          )
                        })}
                </TabBarIOS>
            </View>

            </Provider>

        )
    }

}
