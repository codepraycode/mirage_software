// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const { contextBridge, ipcRenderer } = require("electron");

// after loading, add certain apis to the windows api
process.once("loaded", () => {

    // contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);
    contextBridge.exposeInMainWorld("api", {
        request: (channel, data = {}) => {
            return ipcRenderer.invoke(channel, data)
        },

        response: (channel, callback) => {
            ipcRenderer.on(channel, (event, ...args) => {
                callback(args)
            })
        },
    });


})