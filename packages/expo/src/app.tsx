import { toIpcClientReceiveEval } from "@-/common";
import Constants from "expo-constants";
import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import { ipcServer } from "./ipc";

export function App() {
  const refWebView = React.useRef<WebView>(null);

  return (
    <View style={{ flex: 1, marginTop: Constants.statusBarHeight }}>
      <WebView
        ref={refWebView}
        source={{ uri: WEB_VIEW_URI }}
        onMessage={async (e) => {
          const request = JSON.parse(e.nativeEvent.data);
          const response = await ipcServer.handle(request);
          refWebView.current?.injectJavaScript(
            toIpcClientReceiveEval(response)
          );
        }}
      />
    </View>
  );
}

//
// web view uri
//

function getWebViewUri(): string {
  if (Constants.manifest?.packagerOpts?.dev) {
    const port = Constants.expoConfig?.extra?.["DEV_WEB_VIEW_PORT"];
    if (!port) {
      throw new Error("DEV_WEB_VIEW_PORT is not defined");
    }
    // e.g. exp://192.168.xxx.xxx:19000  =>  http://192.168.xxx.xxx:18182
    return Constants.experienceUrl
      .replace(/\d+$/, port)
      .replace("exp://", "http://");
  }

  // how to access bundled client assets?
  throw new Error("TODO");
}

const WEB_VIEW_URI = getWebViewUri();
