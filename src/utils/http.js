const axios = require('axios')
const qs = require('qs')
import { router } from '../router/index'
const baseUrl = ''
axios.defaults.timeout = 60000
axios.defaults.withCredentials = true

function checkStatus (response) {
    // loading
    if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
        return response
    }
    return {
        status: 404,
        msg: '网络异常'
    }
}

function checkCode (res) {
    if (res.status === 404) {
        return false
    }
    return res
}

module.exports = {
    post (url, data, contentType = true) {
        let ct = ''
        if (contentType) {
            ct = 'application/x-www-form-urlencoded'
            data = qs.stringify(data)
        } else {
            ct = 'application/json'
        }
        return axios({
            headers: {
                'Content-Type': ct
            },
            method: 'post',
            baseURL: baseUrl,
            url,
            data
        }).then((response) => {
            return checkStatus(response)
        }).then((res) => {
            return checkCode(res)
        }).catch(error => this.httpHandleErr(error))
    },
    put (url, data, contentType = true) {
        let ct = ''
        if (contentType) {
            ct = 'application/x-www-form-urlencoded'
            data = qs.stringify(data)
        } else {
            ct = 'application/json'
        }
        return axios({
            headers: {
                'Content-Type': ct
            },
            method: 'put',
            baseURL: baseUrl,
            url,
            data
        }).then((response) => {
            return checkStatus(response)
        }).then((res) => {
            return checkCode(res)
        }).catch(error => this.httpHandleErr(error))
    },
    delete (url, data, contentType = true) {
        let ct = ''
        if (contentType) {
            ct = 'application/x-www-form-urlencoded'
            data = qs.stringify(data)
        } else {
            ct = 'application/json'
        }
        return axios({
            headers: {
                'Content-Type': ct
            },
            method: 'delete',
            baseURL: baseUrl,
            url,
            data
        }).then((response) => {
            return checkStatus(response)
        }).then((res) => {
            return checkCode(res)
        }).catch(error => this.httpHandleErr(error))
    },
    get (url = '', data, _responseType = 'json') {
        return axios({
            method: 'get',
            baseURL: baseUrl,
            url,
            params: data,
            responseType: _responseType
        }).then((response) => {
            return checkStatus(response)
        }).then((res) => {
            return checkCode(res)
        }).catch(error => this.httpHandleErr(error))
    },
    httpHandleErr (error) {
        if (error && error.response) {
            switch (error.response.status) {
                case 401:
                    router.replace({
                        name: 'login'
                    })
                    break
                case 402:
                    console.log(error)
                    break
                case 403:
                    console.log(error)
                    break
                default:
                    console.log(error)
            }
        }
    }
}
