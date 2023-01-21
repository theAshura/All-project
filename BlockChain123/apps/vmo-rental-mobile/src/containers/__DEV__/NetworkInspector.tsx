import NetworkLogger, {
  startNetworkLogging,
} from 'react-native-network-logger';
import React, { FC, useRef, useState } from 'react';
import { Portal } from 'react-native-portalize';
// import RNShake from 'react-native-shake';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import { PanGestureHandler } from 'react-native-gesture-handler';
import View from '@namo-workspace/ui/view/View';
import Console from './Console';

const USE_NATIVE_DRIVER = false;

startNetworkLogging({ maxRequests: 100 });

const NetworkInspector: FC = () => {
  const [showButton, setShowButton] = useState(true);
  const [showNetwork, setShowNetwork] = useState(false);
  const [tab, setTab] = useState(1);
  const { x, y } = useRef(new Animated.ValueXY({ x: 0, y: 60 })).current;
  return (
    <>
      {showButton && (
        <Portal>
          <PanGestureHandler
            onGestureEvent={Animated.event(
              [
                {
                  nativeEvent: { absoluteX: x, absoluteY: y },
                },
              ],
              { useNativeDriver: USE_NATIVE_DRIVER }
            )}
          >
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  opacity: 0.2,
                },
                {
                  transform: [
                    {
                      translateX: x,
                    },
                    { translateY: y },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={1}
                onLongPress={() => setShowButton(false)}
                style={{
                  padding: 5,
                  backgroundColor: '#cdcdcd',
                }}
                onPress={() => setShowNetwork(true)}
              >
                <Text>Show</Text>
              </TouchableOpacity>
            </Animated.View>
          </PanGestureHandler>
        </Portal>
      )}
      {showNetwork && (
        <Portal>
          <SafeAreaView style={StyleSheet.absoluteFill}>
            <View flexGrow={1}>
              {tab === 1 && <NetworkLogger theme={'dark'} />}
              {tab === 2 && <Console />}
            </View>
            <View flexRow justifySpaceBetween alignCenter px={3}>
              <View flexGrow={1} flexRow>
                <TouchableOpacity
                  style={{
                    alignSelf: 'center',
                    padding: 5,
                    backgroundColor: '#cdcdcd',
                  }}
                  onPress={() => setTab(1)}
                >
                  <Text>Network</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    alignSelf: 'center',
                    padding: 5,
                    marginLeft: 4,
                    backgroundColor: '#cdcdcd',
                  }}
                  onPress={() => setTab(2)}
                >
                  <Text>Console</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{
                  alignSelf: 'center',
                  padding: 5,
                  backgroundColor: '#cdcdcd',
                }}
                onPress={() => setShowNetwork(false)}
              >
                <Text>Hide the debug</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Portal>
      )}
    </>
  );
};

export default NetworkInspector;
