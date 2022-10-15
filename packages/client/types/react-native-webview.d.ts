// https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md#communicating-between-js-and-native
declare const ReactNativeWebView: {
  postMessage: (data: string) => void;
};
