/**
 * Created by ljunb on 2016/12/22.
 * 用于左右滑出内容的可滚动组件，需手动调用previousAction、nextAction来进行操作
 */
import React, {Component, PropTypes} from 'react'
import {
    StyleSheet,
    View,
    Text,
    LayoutAnimation,
    Animated
} from 'react-native'

const propTypes = {
    title: PropTypes.string.isRequired,
    style: View.propTypes.style,
    onScrollEnd: PropTypes.func
}

class AMScrollableDateView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showNext: false,
            showPrevious: false,

            titleStyle: props.titleStyle,
            centerPrompt: props.title,
            nextPrompt: '',
            previousPrompt: '',
            positionValue: new Animated.Value(0),
        }
    }

    previousAction(string) {
        this.setState({
            showPrevious: true,
            previousPrompt: string
        }, () => {
            Animated.timing(this.state.positionValue, {
                toValue: 1,
            }).start(() => {
                this.setState({
                    centerPrompt: string
                }, () => {
                    this.state.positionValue.setValue(0)
                    this.props.onScrollEnd && this.props.onScrollEnd(string)
                })
            })
        })
    }

    nextAction(string) {
        this.setState({
            showNext: true,
            nextPrompt: string
        }, () => {
            Animated.timing(this.state.positionValue, {
                toValue: -1,
            }).start(() => {
                this.setState({
                    centerPrompt: string
                }, () => {
                    this.state.positionValue.setValue(0)
                    this.props.onScrollEnd && this.props.onScrollEnd(string)
                })
            })
        })
    }

    render() {
        const {style} = this.props
        const { titleStyle } = this.state
        let width = 80
        let height = 40
        if (style) {
            width = style.width ? style.width : width
            height = style.height ? style.height : height
        }

        const {previousPrompt, centerPrompt, nextPrompt, positionValue} = this.state

        let centerPosition = positionValue.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [-width, 0, width]
        })

        let leftPosition = positionValue.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [-width * 2, -width, 0]
        })

        let rightPosition = positionValue.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [0, width, width * 2]
        })

        return (
            <View style={[styles.container, {width, height}, style]}>
                <Animated.View style={[styles.leftView, {left: leftPosition, width, height}]}>
                    <Text style={titleStyle}>{previousPrompt}</Text>
                </Animated.View>
                <Animated.View style={[styles.centerView, {left: centerPosition, width, height}]}>
                    <Text style={titleStyle}>{centerPrompt}</Text>
                </Animated.View>
                <Animated.View style={[styles.rightView, {left: rightPosition, width, height}]}>
                    <Text style={titleStyle}>{nextPrompt}</Text>
                </Animated.View>
            </View>
        )
    }
}

AMScrollableDateView.propTypes = propTypes

AMScrollableDateView.defaultProps = {
    title: '请设置内容',
    onScrollEnd: ()=>{}
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden'
    },
    leftView: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        // backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center'
    },
    centerView: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        // backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightView: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        // backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default AMScrollableDateView