import { Menu } from "electron";

export function createApplicationMenu() {
  const menu = Menu.buildFromTemplate([
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);
}
