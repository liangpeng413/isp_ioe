package com.ruixi.ioe.core.util;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class ListPageUtil {

	/**
	 * 每页显示条数
	 */
	private int pageSize;

	/**
	 * 总页数
	 */
	private int pageCount;

	/**
	 * 原集合
	 */
	private List data;

	private Integer total;

	public ListPageUtil(List data, int pageSize) {
		if (data == null || data.isEmpty()) {
			throw new IllegalArgumentException("data must be not empty!");
		}
		this.data = data;
		this.pageSize = pageSize;
		this.pageCount = data.size() / pageSize;
		if (data.size() % pageSize != 0) {
			this.pageCount++;
		}
	}


	public ListPageUtil(List data,Integer total, int pageSize) {
		if (data == null) {
			throw new IllegalArgumentException("data must be not empty!");
		}
		this.data = data;
		this.total = total;
		this.pageSize = pageSize;
		this.pageCount = total / pageSize;
		if (total % pageSize != 0) {
			this.pageCount++;
		}
	}

	/**
	 * 得到分页后的数据
	 *
	 * @param pageNum
	 *            页码
	 * @return 分页后结果
	 */
	public List getPagedList(int pageNum) {
		int fromIndex = (pageNum - 1) * pageSize;
		if (fromIndex >= data.size()) {
			return Collections.emptyList();
		}
		int toIndex = pageNum * pageSize;
		if (toIndex >= data.size()) {
			toIndex = data.size();
		}
		return data.subList(fromIndex, toIndex);
	}

	public int getPageSize() {
		return pageSize;
	}

	public List getData() {
		return data;
	}

	public int getPageCount() {
		return pageCount;
	}

	public static void main(String[] args) {
		Integer[] array = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 };
		List list = Arrays.asList(array);
		ListPageUtil pager = new ListPageUtil(list, 10);

		System.out.println(pager.getPageCount());
		List page1 = pager.getPagedList(1);
		System.out.println(page1);
		List page2 = pager.getPagedList(2);
		System.out.println(page2);
		List page3 = pager.getPagedList(3);
		System.out.println(page3);
	}
}
