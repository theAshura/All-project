import React, { useEffect, useState } from 'react';
import View from '@namo-workspace/ui/view/View';
import Text from '@namo-workspace/ui/view/Text';
import { Button, ScrollView } from 'react-native';

const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;
const originalConsoleInfo = console.info;

const eventListener = {
  listener: [],
  addEvent: function (fn) {
    this.listener.push(fn);
    return () => (this.listener = this.listener.filter((i) => i !== fn));
  },
  removeEvent: function (fn) {
    this.listener = this.listener.filter((i) => i !== fn);
  },
};

let logstorage = [];

console.log = (...arg) => {
  originalConsoleLog(...arg);
  const l = { type: 'log', arg };
  logstorage.push(l);
  eventListener.listener.forEach((fn) => fn(l));
};
console.warn = (...arg) => {
  originalConsoleWarn(...arg);
  const l = { type: 'warn', arg };
  logstorage.push(l);
  eventListener.listener.forEach((fn) => fn(l));
};
console.error = (...arg) => {
  originalConsoleError(...arg);
  const l = { type: 'error', arg };
  logstorage.push(l);
  eventListener.listener.forEach((fn) => fn(l));
};
console.info = (...arg) => {
  originalConsoleInfo(...arg);
  const l = { type: 'info', arg };
  logstorage.push(l);
  eventListener.listener.forEach((fn) => fn(l));
};

const colors = {
  warn: '#FFCC00',
  error: 'red',
  info: '#ffffff',
  log: '#ffffff',
};

const Console = () => {
  const [logs, setLogs] = useState(logstorage);
  useEffect(() => {
    return eventListener.addEvent((log) => {
      setLogs((p) => [...p, log]);
    });
  }, []);
  return (
    <View flexGrow={1} style={{ backgroundColor: '#333333' }}>
      <View alignStart>
        <Button
          title={'Clear'}
          onPress={() => {
            setLogs([]);
            logstorage = [];
          }}
        />
      </View>
      <ScrollView style={{ flex: 1 }}>
        {logs.map((i, index) => (
          <View
            flexRow
            key={index}
            style={{
              paddingHorizontal: 15,
              paddingVertical: 5,
              marginHorizontal: 10,
              backgroundColor: '#555',
              borderRadius: 5,
              marginBottom: 10,
              marginTop: 10,
              minHeight: 40,
              alignItems: 'center',
              borderLeftWidth: 5,
              borderColor:
                i.type === 'warn' || i.type === 'error'
                  ? colors[i.type]
                  : 'transparent',
            }}
          >
            <Text
              style={{
                color: colors[i.type],
                width: 50,
              }}
            >
              {i.type?.toUpperCase?.()}
            </Text>
            <Text style={{ marginLeft: 5, color: '#fff' }}>
              {i.arg.map((arg, index) => (
                <Text key={String(index)}>
                  {arg?.message ? 'Message: ' + arg.message + '\n' : ''}
                  {arg?.stack
                    ? 'Stack: ' + JSON.stringify(arg.stack)
                    : JSON.stringify(arg)}
                </Text>
              ))}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Console;
