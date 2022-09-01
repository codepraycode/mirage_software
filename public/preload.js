// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const { contextBridge, ipcRenderer } = require("electron");
const os = require('os');

const si = require('systeminformation');

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

        softwareInfo: async() => { 
            const data = await si.system();//.then(data=>console.log("System: ", data))

            let {model,uuid} = data;
            const arch = os.arch()

            const sofware_info = {
                host_id: uuid,
                host_model: model,
                host_arch: arch,
                host_name: os.hostname(),
                host_os: os.version(),            
            }
            
            return sofware_info
        },
    });

    // ipcRenderer.send('get_app_path');

    // ipcRenderer.on('app_path', (event, arg) => {
    //     // console.log("Arg Received on app_path", arg);
    //     contextBridge.exposeInMainWorld("appPath", arg.appPath);
    //     contextBridge.exposeInMainWorld("inProd", arg.inProd);

    // });

})