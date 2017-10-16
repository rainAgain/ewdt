//export const domain = (process.env.NODE_ENV === 'production') ?'':'http://192.168.199.251:8080';
export const actionUrl = (process.env.NODE_ENV==='production')?'/fileUpload/files':'http://192.168.199.251:8080/fileUpload/files';
export const iconUrl = (process.env.NODE_ENV==='production')?'/fileUpload/headImg':'http://192.168.199.251:8080/fileUpload/headImg';

//export const domain = (process.env.NODE_ENV === 'production') ?'':'http://www.ju2c.com';

export const domain = (process.env.NODE_ENV === 'production') ?'':'/mock';

/**
 * [userIcon 用户头像]
 * @param  {[type]} userId [用户id]
 * @return {[type]}        [头像链接]
 */
export function userIcon (userId){
  return `http://jutu-app.oss-cn-shanghai.aliyuncs.com/ICON/${userId}.jpg`
}
