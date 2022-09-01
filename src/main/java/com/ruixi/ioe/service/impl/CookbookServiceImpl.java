package com.ruixi.ioe.service.impl;

import com.alibaba.fastjson.JSON;
import com.ruixi.ioe.core.ReturnCode;
import com.ruixi.ioe.dao.CookbookTools;
import com.ruixi.ioe.dao.CookbookToolsQuery;
import com.ruixi.ioe.dao.page.PageResult;
import com.ruixi.ioe.dto.CreateCookbookParamDTO;
import com.ruixi.ioe.enums.CookbookTypeEnum;
import com.ruixi.ioe.mapper.CookbookToolsMapper;
import com.ruixi.ioe.service.CookbookService;
import com.ruixi.ioe.utils.HttpClientUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.client.HttpClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author liang
 * @className CookbookServiceImpl
 * @description TODO
 * @date 2022/7/24 8:36 下午
 */
@Slf4j
@Service
public class CookbookServiceImpl implements CookbookService {
    @Autowired
    private CookbookToolsMapper cookbookToolsMapper;

    @Value("${create.cookbook.sku.url}")
    private String aiUrl;

    @Override
    public Map<String, Object> getList(CookbookToolsQuery param) {
        Map<String, Object> ret = new HashMap<>(3);
        param.setStartPage((param.getPageNo()-1)*param.getPageSize());
        List<CookbookTools> list = cookbookToolsMapper.selectByQueryPage(param);
        int totalRowSize = cookbookToolsMapper.selectByQueryCount(param);
        ret.put("code", ReturnCode.SUCCESS);
        ret.put("message", ReturnCode.getReturnMsg(ReturnCode.SUCCESS));
        ret.put("pageResult", new PageResult(param.getPageNo(), totalRowSize, param.getPageSize(), list));
        return  ret;
    }

    @Override
    public void createCookbookTools(CreateCookbookParamDTO param) {
        try {
            CookbookTools tools = new CookbookTools();
            String queryCookbookValue = null;
            //用户关联菜谱
            if(CookbookTypeEnum.MEMBERID_AND_COOKBOOKID.getRespCode().equals(param.getAssociationType())){
                tools.setSkuCode(param.getSkuCode());
                tools.setMemberId(param.getMemberId());
                //调用算法接口
                HashMap<String, String> map = new HashMap<>();
                map.put("key","search_menu_rec:"+param.getMemberId());
                map.put("keyGroup","search_menu_rec:%s");
                String[] split = param.getCookbookIds().split(",");
                HashMap<String, Double> values = new HashMap<>();
                DecimalFormat df = new DecimalFormat( "0.000" );
                for (String s : split) {
                    values.put(s,Double.parseDouble(df.format(Math.random())));
                }
                queryCookbookValue = JSON.toJSONString(values);
                map.put("value",queryCookbookValue);
                //拼装关联菜谱字段数据
                tools.setCookbookId(queryCookbookValue);
                String url = "http://cp-sf-sit.recommend-ranking.sitgw.yonghui.cn/admin/utils/setRedisValues";
                log.info("请求算法创建用户+sku+cookbookID关系,req:{}",JSON.toJSONString(map));
                String res = HttpClientUtils.sendPostByJson(url, JSON.toJSONString(map));
                log.info("请求算法创建用户+sku+cookbookID关系,res:{}",res);
                if("success".equals(res)){
                    log.info("操作成功");
                }
            }else if(CookbookTypeEnum.SKU_AND_COOKBOOKID.getRespCode().equals(param.getAssociationType()) || CookbookTypeEnum.KEYWORDSEARCH_AND_COOKBOOKID.getRespCode().equals(param.getAssociationType())){
                tools.setSkuCode(param.getSkuCode());
                //调用算法接口
                HashMap<String, String> map = new HashMap<>();
                map.put("key","menu_2:g2m:"+param.getSkuCode());
                map.put("keyGroup","menu_2:g2m:%s");
                String[] split = param.getCookbookIds().split(",");
                StringBuilder builder = new StringBuilder();
                for (String s : split) {
                    builder.append(s+":"+s+"菜谱"+s+":"+s+"菜谱;");
                }
                log.info("菜谱关联商品："+builder.toString());
                queryCookbookValue = JSON.toJSONString(builder.toString());
                map.put("value",builder.toString());
                //拼装关联菜谱字段数据
                tools.setCookbookId(queryCookbookValue);
                String url = null;
                if(CookbookTypeEnum.KEYWORDSEARCH_AND_COOKBOOKID.getRespCode().equals(param.getAssociationType())){
                    url = "http://cp-sf-sit.recommend-ranking.sitgw.yonghui.cn/admin/utils/setRedisValues?type=2";
                }else{
                    url = "http://cp-sf-sit.recommend-ranking.sitgw.yonghui.cn/admin/utils/setRedisValues?type=1";
                }

                log.info("请求算法创建sku+cookbookID关系,req:{}",JSON.toJSONString(map));
                String res = HttpClientUtils.sendPostByJson(url, JSON.toJSONString(map));
                log.info("请求算法创建sku+cookbookID关系,res:{}",res);
                if("success".equals(res)){
                    log.info("操作成功");
                }
            }else if(CookbookTypeEnum.HOMEPAGE_AND_COOKBOOKID.getRespCode().equals(param.getAssociationType()) || CookbookTypeEnum.SCENE_AND_COOKBOOKID.getRespCode().equals(param.getAssociationType())) {
                //调用算法接口
                HashMap<String, String> map = new HashMap<>();
                if(CookbookTypeEnum.SCENE_AND_COOKBOOKID.getRespCode().equals(param.getAssociationType())){
                    String desc = param.getShopID()+"@"+param.getSceneID();
                    tools.setShopID(param.getShopID());
                    tools.setSceneID(param.getSceneID());
                    String key = "menu_page_rec:" + desc;
                    map.put("key", key);
                    map.put("keyGroup", "menu_page_rec:%s:%s");
                }else{
                    tools.setShopID(param.getShopID());
                    map.put("key", "hot_menu_rec:" + param.getShopID());
                    map.put("keyGroup", "hot_menu_rec:%s");
                }
                String[] split = param.getCookbookIds().split(",");
                HashMap<String, Double> values = new HashMap<>();
                DecimalFormat df = new DecimalFormat("0.000");
                for (String s : split) {
                    values.put(s, Double.parseDouble(df.format(Math.random())));
                }
                queryCookbookValue = JSON.toJSONString(values);
                map.put("value", queryCookbookValue);
                //拼装关联菜谱字段数据
                tools.setCookbookId(queryCookbookValue);
                String url = "http://cp-sf-sit.recommend-ranking.sitgw.yonghui.cn/admin/utils/setRedisValues";
                log.info("请求算法创建首页瀑布流菜谱推荐shopid+cookbookID关系,req:{}", JSON.toJSONString(map));
                String res = HttpClientUtils.sendPostByJson(url, JSON.toJSONString(map));
                log.info("请求算法创建首页瀑布流菜谱推荐shopid+cookbookID关系,res:{}", res);
                if ("success".equals(res)) {
                    log.info("操作成功");
                }
            }
            tools.setCookbookId(queryCookbookValue);
            tools.setAssociationType(param.getAssociationType());
            tools.setCreateUserName(param.getCreateUserName());
            tools.setCreateTime(new Date());
            cookbookToolsMapper.insertSelective(tools);
        } catch (Exception e) {
            log.error("创建菜谱工具失败",e);
        }
    }
}
