/**
 * Created by ljunb on 2016/12/22.
 */
import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Platform,
    Dimensions,
    ScrollView
} from 'react-native'
import AMScrollableView from './AMScrollableDateView'

const { width, height } = Dimensions.get('window')
const isAndroid = Platform.OS === 'android'
const scrollBarH = 80
const weekDayMap = {
    0: '周日',
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六',
}

const Header = ({title}) => {
    return (
        <View style={styles.header}>
            <Text style={{color: '#000'}}>{title}</Text>
        </View>
    )
}

export default class Root extends Component {
    constructor(props) {
        super(props)
        this._createDateStr = this._createDateStr.bind(this)
        this.currentDate = new Date()
    }

    _compareDate(d1, d2) {
        let dayStr1 = `${d1.getFullYear()}${d1.getMonth()+1}${d1.getDate()}`
        let dayStr2 = `${d2.getFullYear()}${d2.getMonth()+1}${d2.getDate()}`
        return dayStr1 === dayStr2
    }

    _createDateStr(calculate) {
        let aDayMS = 1000 * 60 * 60 * 24 * calculate
        let newMS= this.currentDate.getTime() + aDayMS
        let newDate = new Date(newMS)

        this.currentDate = newDate

        // 月份&日期转成 XX 格式
        let month = (newDate.getMonth()+1) < 10 ? `0${newDate.getMonth()+1}` : newDate.getMonth()+1
        let day = newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate()

        if (this._compareDate(new Date(), newDate)) {
            return `${month}-${day}  今天`
        }
        // eg: 12-22 周四
        return `${month}-${day}  ${weekDayMap[newDate.getDay()]}`
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Header title="Demo示例"/>
                <View style={styles.scrollBar}>
                    <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={()=>{
                            this.scrollableView.previousAction(this._createDateStr(-1))
                        }}
                    >
                        <Text style={{color: '#fff'}}>前一天</Text>
                    </TouchableOpacity>
                    <AMScrollableView
                        ref={scrollableView => this.scrollableView = scrollableView}
                        style={{backgroundColor: '#069DD4', width: 120}}
                        title={this._createDateStr(0)}
                        titleStyle={{color: '#fff'}}
                    />
                    <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={()=>{
                            this.scrollableView.nextAction(this._createDateStr(1))
                        }}
                    >
                        <Text style={{color: '#fff'}}>后一天</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        height: isAndroid ? 50 : 64,
        paddingTop: isAndroid ? 0 : 20,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
    },
    scrollBar: {
        height: scrollBarH,
        backgroundColor: '#069DD4',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20
    }
})