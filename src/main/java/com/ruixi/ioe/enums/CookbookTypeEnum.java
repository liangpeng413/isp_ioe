package com.ruixi.ioe.enums;

/**
 * @author liang
 * @className CookbookTypeEnum
 * @description TODO
 * @date 2022/7/24 9:48 下午
 */
public enum CookbookTypeEnum {
    SKU_AND_COOKBOOKID("1","商品关联菜谱"),
    MEMBERID_AND_COOKBOOKID("2","用户关联菜谱"),
    HOMEPAGE_AND_COOKBOOKID("3","首页瀑布流与菜谱关联"),
    KEYWORDSEARCH_AND_COOKBOOKID("4","搜索词与菜谱关联");

    private String code;
    private String message;

    CookbookTypeEnum(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public String getRespCode() {
        return code;
    }

    public String getRespDesc() {
        return message;
    }
}
