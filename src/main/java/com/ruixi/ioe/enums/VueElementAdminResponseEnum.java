package com.ruixi.ioe.enums;/**
 *@className VueElementAdminResponseEnum
 *@description  TODO
 *@author liang
 *@date 2022/7/7 7:34 下午
 */public enum VueElementAdminResponseEnum {

     SUCCESS(20000,"成功"),
     PARAM_ERROR(20000,"参数异常"),
     ILLEGAL_TOKEN(50008,"非法令牌"),
     OTHER_CLIENTS_LOGGED_IN(50012,"其他客户端登录"),
     TOKEN_EXPIRED(50014,"令牌已过期"),
     SYSTEM_ERROR(99999,"系统异常");

     private Integer code;
     private String message;

     VueElementAdminResponseEnum(Integer code, String message) {
          this.code = code;
          this.message = message;
     }

     public Integer getRespCode() {
          return code;
     }

     public String getRespDesc() {
          return message;
     }



}
