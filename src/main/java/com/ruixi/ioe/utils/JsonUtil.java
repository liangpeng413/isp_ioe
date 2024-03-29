package com.ruixi.ioe.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.TypeReference;

import java.util.List;

@SuppressWarnings({ "rawtypes" })
public class JsonUtil {

    /**
     * 将java类型的对象转换为JSON格式的字符串
     * @param object java类型的对象
     * @return JSON格式的字符串
     */
    public static <T> String toJson(T object) {
        return JSON.toJSONString(object);
    }

    /**
     * 将JSON格式的字符串转换为java类型的对象或者java数组类型的对象，不包括java集合类型
     * @param json JSON格式的字符串
     * @param clz java类型或者java数组类型，不包括java集合类型
     * @return java类型的对象或者java数组类型的对象，不包括java集合类型的对象
     */
    /*public static <T> T toObject(String json, Class<T> clz) {
        return JSON.parseObject(json, clz);
    }*/

    /**
     * 将JSON格式的字符串转换为List<T>类型的对象
     * @param json JSON格式的字符串
     * @param clz 指定泛型集合里面的T类型
     * @return List<T>类型的对象
     */
   /* public static <T> List<T> toList(String json, Class<T> clz) {
        return JSON.parseArray(json, clz);
    }*/

	/**
	 * 将JSON格式的字符串转换成任意Java类型的对象
	 *
	 * @param json
	 *            JSON格式的字符串
	 * @param type
	 *            任意Java类型
	 * @return 任意Java类型的对象
	 */
	public static <T> T toObject(String json, TypeReference<T> type) {
		return JSON.parseObject(json, type);
	}


	public static <T> T jsonToObject(String json, Class<T> clazz) {
		return JSON.parseObject(json, clazz);
	}

    /**
     * son 转 集合
     * @param str
     * @param clz
     * @return
     */
	public static <T> List<T> toCollection(String str, Class<T> clz) {
		JSONArray jsonarray = JSONArray.parseArray(str);
		List<T> list = JSONArray.parseArray(str, clz);
		return list;
	}

	public static void main(String[] args) {
	}

}
