import axios from "request/axios";
import API from "request/api";
import OSS from "ali-oss";

const ossService = {
  /**
   * 上传单个文件
   */
  upload: async (
    {
      file,
      title = null,
      bucket = null,
      space = null,
      folder = null,
      type = 1,
      options,
    },
    callback,
    error,
    end
  ) => {
    try {
      const ossParams = await ossService.token({
        file_name: file.name,
        bucket,
        space,
        folder,
      });

      const uploadRes = await ossService.put(file, ossParams, type, options);
      callback && callback(uploadRes);
      end && end();

      await ossService.storeCallback({
        file_name: space,
        path: ossParams.key,
        bucket: ossParams.bucket,
        title,
      });
    } catch (e) {
      console.error(e);
      error && error();
      end && end();
    }
  },
  /** 
   *  获取token授权
   *  'file_name' => 'required|string', // 文件名
      'bucket' => 'string', // bucket名
      'space' => 'string', // 空间名，例如avatar
      'folder' => 'string' // 文件夹名
   */
  token: (params = {}) => {
    return axios.post(API.ossToken, params);
  },
  /**
   *
   * @param {*} file
   * @param {*} params
   * @param {*} type 1 直接上传 2 分片上传
   * @param {*} options 当type=2时才有用
   * @returns
   */
  put: (file, params, type = 1, options) => {
    const { region, accessKeyId, accessKeySecret, stsToken, bucket, key } =
      params;
    const client = new OSS({
      region,
      accessKeyId,
      accessKeySecret,
      stsToken,
      bucket,
      timeout: 1800000,
    });
    switch (type) {
      case 1:
        return client.put(key, file);
      case 2:
        return client.multipartUpload(key, file, options);
    }
  },
  /** 
   *  上传成功后回调
   *  'file_name' => 'required|string', // 文件类型，例如avatar
      'path' => 'required|string', // token返回的bucket存储位置
      'bucket' => 'required|string', // bucket名
      'title' => 'string' // 文件展示名称
   */
  storeCallback: (params) => {
    return axios.post(API.ossStore, params);
  },
};

export default ossService;
