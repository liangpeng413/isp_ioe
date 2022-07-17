package com.ruixi.ioe.response;

import com.github.pagehelper.PageInfo;
import com.ruixi.ioe.core.ReturnCode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhangxiongbiao on 16-11-16.
 */
public class ResponseResult {
    public static ResponseJson getOkResponse(){
        ObjectResponse objectResponse = new ObjectResponse();
        objectResponse.setCode(ReturnCode.SUCCESS);
        objectResponse.setMessage(ReturnCode.getReturnMsg(ReturnCode.SUCCESS));
        return objectResponse;
    }

    public static ResponseJson getOkResponse(Object obj){
        ObjectResponse objectResponse = new ObjectResponse();
        objectResponse.setCode(ReturnCode.SUCCESS);
        objectResponse.setMessage(ReturnCode.getReturnMsg(ReturnCode.SUCCESS));
        objectResponse.setResp(obj);
        return objectResponse;
    }
    public static ResponseJson getErrorResponse(String code,String message){
        EmptyResponse emptyResponse = new EmptyResponse();
        emptyResponse.setCode(code);
        emptyResponse.setMessage(message);
        return emptyResponse;
    }

    public static ResponseJson getSuccessResponse(String message){
        EmptyResponse emptyResponse = new EmptyResponse();
        emptyResponse.setCode(ReturnCode.SUCCESS);
        emptyResponse.setMessage(message);
        return emptyResponse;
    }

    public static ResponseJson getOkListResponse(List list){
        ObjectResponse objectResponse = new ObjectResponse();
        objectResponse.setCode(ReturnCode.SUCCESS);
        objectResponse.setMessage(ReturnCode.getReturnMsg(ReturnCode.SUCCESS));
        Map<String,Object> result = new HashMap<String,Object>();
        objectResponse.setResp(result);
        result.put("result",list);
        return objectResponse;
    }

    public static ResponseJson getPageResponse(PageInfo page) {
        ObjectResponse objectResponse = new ObjectResponse();
        objectResponse.setCode(ReturnCode.SUCCESS);
        objectResponse.setMessage(ReturnCode.getReturnMsg(ReturnCode.SUCCESS));
        Map<String,Object> result = new HashMap<String,Object>();
        objectResponse.setResp(result);
        result.put("result",page.getList());
        result.put("currentPage",page.getPageNum());
        result.put("pageSize",page.getPageSize());
        result.put("totalRowSize",page.getTotal());
        result.put("pageCount",page.getPages());
        return objectResponse;
    }
}
