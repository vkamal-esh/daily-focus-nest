module.exports = {
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
    ]
  },
  win: {
    target: "nsis"
  },
  mac: {
    target: "dmg"
  }
}