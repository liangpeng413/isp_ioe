package com.ruixi.ioe.core.util;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

/**
 * @ClassName IdUtils
 * @Desc 批次号生成
 * @Author chenwei1@9fbank.cc
 * @Date 2019/8/3016:12
 * @Version 1.0
 **/
public class IdUtils {
    /**
     * 创建批次号
     * @return
     */
    public static String createNewBatchNo(String prefix){
        Date date=new Date();
        SimpleDateFormat sdf=new SimpleDateFormat("yyyyMMddHHmmss");
        String time=sdf.format(date);
        Random r = new Random();
        String batchNo="";
        boolean b=true;
        while(b){
            int x = r.nextInt(999999);
            if(x > 100000) {
                batchNo=time+x;
                b=false;
            }
        }
        return prefix+batchNo;
    }
}
