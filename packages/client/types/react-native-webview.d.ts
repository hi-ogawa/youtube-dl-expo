// https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md#communicating-between-js-and-native
interface Window {
  ReactNativeWebView: {
    postMessage: (data: any) => void;
  };
}
