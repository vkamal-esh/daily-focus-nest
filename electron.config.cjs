module.exports = {
  appId: "com.dailyfocus.nest",
  productName: "Daily Focus Nest",
  directories: {
    output: "electron-dist"
  },
  files: [
    "dist/**/*",
    "dist-electron/**/*"
  ],
  extraMetadata: {
    main: "dist-electron/main.js"
  },
  linux: {
    target: [
      {
        target: "AppImage",
        arch: ["x64"]
      },
      {
        target: "deb",
        arch: ["x64"]
      }
    ],
    category: "Utility"
  },
  win: {
    target: "nsis"
  },
  mac: {
    target: "dmg"
  }
}