/**
 * Created by ljunb on 2016/12/22.
 */
import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Platform,
    Dimensions,
    ListView,
    LayoutAnimation,
    UIManager,
    Button
} from 'react-native'
import AMScrollableView from './AMScrollableDateView'

const {width, height} = Dimensions.get('window')
const isAndroid = Platform.OS === 'android'
const navigationBarH = isAndroid ? 50 : 64
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
const datas = ['测试row', '测试row', '测试row', '测试row', '测试row', '测试row', '测试row']

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
        this._onScroll = this._onScroll.bind(this)
        this.currentDate = new Date()
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            }),
            position: navigationBarH,
            scrollPosition: navigationBarH + scrollBarH
        }
    }

    componentDidMount() {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    _compareDate(d1, d2) {
        let dayStr1 = `${d1.getFullYear()}${d1.getMonth() + 1}${d1.getDate()}`
        let dayStr2 = `${d2.getFullYear()}${d2.getMonth() + 1}${d2.getDate()}`
        return dayStr1 === dayStr2
    }

    _createDateStr(calculate) {
        let aDayMS = 1000 * 60 * 60 * 24 * calculate
        let newMS = this.currentDate.getTime() + aDayMS
        let newDate = new Date(newMS)

        this.currentDate = newDate

        // 月份&日期转成 XX 格式
        let month = (newDate.getMonth() + 1) < 10 ? `0${newDate.getMonth() + 1}` : newDate.getMonth() + 1
        let day = newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate()

        if (this._compareDate(new Date(), newDate)) {
            return `${month}-${day}  今天`
        }
        // eg: 12-22 周四
        return `${month}-${day}  ${weekDayMap[newDate.getDay()]}`
    }

    _onScroll(evt) {
        const {contentOffset} = evt.nativeEvent;

        LayoutAnimation.linear()
        this.setState({
            position: contentOffset.y <= 0 ? navigationBarH : navigationBarH - scrollBarH,
            scrollPosition: contentOffset.y <= 0 ? navigationBarH + scrollBarH : navigationBarH
        })
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={[styles.scrollBar, {top: this.state.position}]}>
                    <Button
                        title="前一天"
                        onPress={()=>{
                            this.scrollableView.previousAction(this._createDateStr(-1))
                        }}
                    />
                    <AMScrollableView
                        ref={scrollableView => this.scrollableView = scrollableView}
                        style={{backgroundColor: '#069DD4', width: 120}}
                        title={this._createDateStr(0)}
                        titleStyle={{color: '#fff'}}
                        onScrollEnd={obj => alert(obj)}
                    />
                    <Button
                        title="后一天"
                        onPress={()=>{
                            this.scrollableView.nextAction(this._createDateStr(1))
                        }}
                    />
                </View>
                <ListView
                    style={[styles.listView, {top: this.state.scrollPosition, height: height - this.state.scrollPosition}]}
                    dataSource={this.state.dataSource.cloneWithRows(datas)}
                    renderRow={data => <Text style={{height: 100}}>{data}</Text>}
                    onScroll={this._onScroll}
                />
                <Header title="Demo示例"/>
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
        backgroundColor: '#f5f5f5',
        position: 'absolute',
        top: 0,
        left: 0
    },
    scrollBar: {
        height: scrollBarH,
        width: width,
        backgroundColor: '#069DD4',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        position: 'absolute',
        left: 0
    },
    listView: {
        width: width,
        height: 400,
        paddingHorizontal: 20,
        position: 'absolute',
        left: 0
    }
})