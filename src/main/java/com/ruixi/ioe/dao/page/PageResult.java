package com.ruixi.ioe.dao.page;



import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;


public class PageResult {
	/**
	 * 分页数据
	 */
	private List resultList;
	/**
	 * 每页显示记录数
	 */
	private int perPageRowSize;
	/**
	 * 当前页
	 */
	private int curPageNumber;
	/**
	 * 总记录数
	 */
	private int totalRowSize;
	/**
	 * 总页数
	 */
	private int pageSize;
	/**
	 *
	 * @param curPageNumber 当前页
	 * @param totalRowSize 总记录数
	 * @param perPageRowSize 每页显示记录数
	 * @param resultList 分页数据
	 */
	public PageResult(int curPageNumber, int totalRowSize, int perPageRowSize, List resultList){
		init(curPageNumber,totalRowSize,perPageRowSize,resultList);
	}

	private void init(int curPageNumber, int totalRowSize, int perPageRowSize,List resultList) {
		this.totalRowSize = totalRowSize;
		this.perPageRowSize = perPageRowSize;
		this.resultList = (resultList == null) ? new ArrayList() : resultList ;
		this.curPageNumber = PageUtil.repairCurPage(totalRowSize,perPageRowSize,curPageNumber);
		this.pageSize = PageUtil.getPageTotalSize(totalRowSize, perPageRowSize);
	}
	/**
	 * 获取所有的记录数目
	 * @return int
	 */
	public int getTotalRowSize(){
		return totalRowSize;
	}
	/**
	 * 获取当前页含有的记录数目
	 * @return int
	 */
	public int getCurPageRowSize(){
		return resultList.size();
	}
	/**
	 * 获取每一页显示记录数
	 * @return int
	 */
	public int getPerPageRowSize(){
		return perPageRowSize;
	}
	/**
	 *
	 * @param index 当前分页记录的索引号，从0开始。
	 * @return Object
	 */
	public Object getResult(int index){
		return resultList.get(index);
	}

	/**
	 * 获取总页数
	 * @return int
	 */
	public int getPageSize(){
		return pageSize;
	}
	/**
	 * 获取当前页号
	 * @return int
	 */
	public int getCurPageNumber(){
		return curPageNumber;
	}
	/**
	 * 获取下页页号
	 * @return int
	 */
	public int getNextPage(){
		if(isNextPageAvailable()){
			return getCurPageNumber()+1;
		}else{
			return getCurPageNumber();
		}
	}
	/**
	 * 获取上页页号
	 * @return int
	 */
	public int getPreviousPage(){
		if(isPreviousPageAvailable()){
			return getCurPageNumber()-1;
		}else{
			return getCurPageNumber();
		}
	}
	/**
	 * 当前页是否第一页
	 * @return boolean
	 */
	public boolean isFirstPage(){
		return getCurPageNumber()<=1;
	}

	/**
	 * 当前页是否最后一页
	 * @return boolean
	 */
	public boolean isLastPage(){
		return getCurPageNumber() >= getPageSize();
	}
	/**
	 * 是否有下一页
	 * @return boolean
	 */
	public boolean isNextPageAvailable(){
		return !isLastPage();
	}
	/**
	 * 是否有上一页
	 * @return boolean
	 */
	public boolean isPreviousPageAvailable(){
		return !isFirstPage();
	}

	/**
	 * 获取迭代器
	 * @return Iterator
	 */
	public Iterator iterator(){
		return resultList.iterator();
	}
	/**
	 * 存入已经分好页的对象List集合
	 * @param resultList
	 */
	public void setResultList(List resultList){
		this.resultList = resultList;
	}
	public void setCurPageNumber(int curPageNumber) {
		this.curPageNumber = curPageNumber;
	}

	public List getResultList(){
		return this.resultList;
	}

}

