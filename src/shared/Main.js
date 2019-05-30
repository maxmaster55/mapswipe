/**
 * @author Pim de Witte (pimdewitte.me/pimdewitte95@gmail.com). Copyright MSF UK 2016.
 *
 * Main is the main class that is called from both Android and iOS on application startup.
 * It initializes the application and controls which scene is rendered to the end user through
 * the Navigator component.
 */

// @flow

import * as React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Button from 'apsl-react-native-button';
import { createStackNavigator } from 'react-navigation';
import Login from './views/Login';
import BuildingFootprintValidator from './views/BuildingFootprint';
import ChangeDetectionScreen from './views/ChangeDetection';
import Mapper from './views/Mapper';
import ProjectNav from './views/ProjectNav';
import Tutorial from './views/Tutorial';
import WebviewWindow from './views/WebviewWindow';

const MessageBarAlert = require('react-native-message-bar').MessageBar;
const { MessageBarManager } = require('react-native-message-bar');
const Modal = require('react-native-modalbox');

const ProjectView = require('./views/ProjectView');
const GLOBAL = require('./Globals');


const style = StyleSheet.create({
    startButton: {
        backgroundColor: '#ff0000',
        // backgroundColor: '#0d1949',
        alignItems: 'stretch',
        height: 50,
        padding: 12,
        borderRadius: 5,
        borderWidth: 0.1,
        position: 'absolute',
        bottom: 20,
        left: 20,
        width: 260,
    },
    pic: {
        height: 150,
        width: 150,
    },
    mainContainer: {
        height: GLOBAL.SCREEN_HEIGHT,
        width: GLOBAL.SCREEN_WIDTH,
        flex: 1,
        marginTop: GLOBAL.TOP_OFFSET,
    },
    header: {
        fontWeight: '700',
        color: '#212121',
        fontSize: 18,
    },
    modal: {
        padding: 20,
    },
    modal3: {
        marginTop: 10,
        height: 300,
        width: 300,
        backgroundColor: '#ffffff',
        borderRadius: 2,
        alignItems: 'center',
    },
});

type State = {
    isDisabled: bool,
    level: number,
    levelObject: Object,
};

class Main extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            isDisabled: false,
            level: GLOBAL.DB.getLevel(),
            levelObject: GLOBAL.DB.getLevelObject(),
        };
    }

    /**
     * Starts the level up timer and register the notification bar
     */
    componentDidMount() {
        const parent = this;
        // GLOBAL.ANALYTICS.logEvent('mapswipe_open');
        MessageBarManager.registerMessageBar(parent.alert);

        parent.checkInterval = setInterval(() => {
            if (GLOBAL.DB.getPendingLevelUp() > 0) {
                parent.openModal3(GLOBAL.DB.getPendingLevelUp());
                GLOBAL.DB.setPendingLevelUp(-1);
            }
        }, 500);
    }

    componentWillUnmount() {
        clearInterval(this.checkInterval);
    }

    alert: ?React.ComponentType<{}>;

    checkInterval: IntervalID;

    modal3: ?Modal;

    openModal3(level: number) {
        this.setState({
            levelObject: GLOBAL.DB.getCustomLevelObject(level),
            level,
        });
        if (this.modal3) {
            this.modal3.open();
        }
    }

    closeModal3() {
        // $FlowFixMe
        this.modal3.close();
        GLOBAL.DB.stopPopup();
    }

    render() {
        const { isDisabled, level, levelObject } = this.state;
        return (
            <View style={style.mainContainer}>
                <RootStack />
                <Modal
                    style={[style.modal, style.modal3]}
                    backdropType="blur"
                    position="center"
                    ref={(r) => { this.modal3 = r; }}
                    isDisabled={isDisabled}
                >
                    <Text style={style.header}>
                        {`You are now level ${level}`}
                    </Text>
                    <Image style={style.pic} key={level} source={levelObject.badge} />
                    <Button
                        style={style.startButton}
                        onPress={this.closeModal3}
                        textStyle={{ fontSize: 13, color: '#ffffff', fontWeight: '700' }}
                    >
                    Close
                    </Button>
                </Modal>
                <MessageBarAlert ref={(r) => { this.alert = r; }} />
            </View>
        );
    }
}

const RootStack = createStackNavigator(
    {
        BuildingFootprintValidator,
        ChangeDetectionScreen,
        Tutorial,
        ProjectNav,
        ProjectView,
        Mapper,
        Login,
        WebviewWindow,
    },
    {
        initialRouteName: 'Tutorial',
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false,
        },
    },
);

module.exports = Main;
