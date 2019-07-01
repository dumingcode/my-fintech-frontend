
const user = {
    state: { userinfo: {}},
    mutations: {
        login (state, userObj) {
            console.log(userObj)
            state.userinfo.nickName = userObj.nickName
            state.userinfo.location = userObj.location
            state.userinfo.profileImageUrl = userObj.profile_image_url
            state.userinfo.uid = userObj.uid
        },
        logout (state, vm) {
            // 恢复登陆用户
            state.userinfo = {}
            // 恢复默认样式
            const themeLink = document.querySelector('link[name="theme"]');
            themeLink.setAttribute('href', '');
            // 清空打开的页面等数据，但是保存主题数据
            let theme = '';
            if (localStorage.theme) {
                theme = localStorage.theme;
            }

            if (theme) {
                localStorage.theme = theme;
            }
        }
    }
};

export default user;
