import Env from './env'

let config = {
    env: Env,
    'development': {
        'WEIBO_AUTH_URL': 'http://127.0.0.1:8080/api/auth/loginTest',
        'domain': '127.0.0.1',
        'QQ_AUTH_URL': 'http://127.0.0.1:8080/api/auth/loginTest',
        env: Env
    },
    'production': {
        'WEIBO_AUTH_URL': 'https://api.weibo.com/oauth2/authorize?client_id=1078042542&redirect_uri=https://gunxueqiu.site/api/auth/weibo/callback',
        'domain': '.gunxueqiu.site',
        'QQ_AUTH_URL': 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=1109532005&redirect_uri=https://gunxueqiu.site/api/auth/qq/callback',
        env: Env
    }
}[Env]
export default config
