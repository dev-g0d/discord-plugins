/**
 * @name FakeNitroStream
 * @author DEV/g0d
 * @authorLink https://dev-g0d.github.io
 * @description ปลดล็อก Nitro Stream [1080p++ และ 60FPS]
 * @version 1.0.0
 */

module.exports = class FakeNitroStream {
    constructor() {
        this.userProxyCache = new WeakMap();
    }

    start() {
        const Patcher = BdApi.Patcher;
        const Webpack = BdApi.Webpack;
        const UI = BdApi.UI;
        
        try {
            this.patchUserStore(Webpack);
            UI.showToast("ปลดล็อค Stream Nitro", { type: "success" });

        } catch (err) {
            Patcher.unpatchAll("FakeNitroStream"); 
            UI.showToast("FakeNitroStream Crash! Check console for details.", { type: "error" });
        }
    }

    stop() {
        BdApi.Patcher.unpatchAll("FakeNitroStream");
        this.userProxyCache = new WeakMap(); 
        BdApi.UI.showToast("FakeNitroStream: Disabled", { type: "info" });
    }
    patchUserStore(Webpack) {
        const Patcher = BdApi.Patcher;
        const UserStore = Webpack.getStore("UserStore");

        if (!UserStore) {
            return;
        }

        Patcher.after("FakeNitroStream", UserStore, "getCurrentUser", (_, __, user) => {
            if (!user) return user;
            
            if (this.userProxyCache.has(user)) {
                return this.userProxyCache.get(user);
            }

            const userProxy = new Proxy(user, {
                get: (target, prop) => {
                    if (prop === 'premiumType') {
                        return 2; 
                    }
                    return target[prop];
                }
            });

            this.userProxyCache.set(user, userProxy);

            return userProxy;
        });
    }
};
