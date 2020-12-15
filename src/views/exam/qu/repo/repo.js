import { postRequest } from '@/utils/request'

/**
 * 题库详情
 * @param data
 */
export function fetchDetail(data) {
  return postRequest('gateway/exam/api/repo/detail', data)
}

/**
 * 保存题库
 * @param data
 */
export function saveData(data) {
  return postRequest('gateway/exam/api/repo/save', data)
}

/**
 * 保存题库
 * @param data
 */
export function fetchList(data) {
  return postRequest('gateway/exam/api/repo/list', data)
}

/**
 * 题库批量操作
 * @param data
 */
export function batchAction(data) {
  return postRequest('gateway/exam/api/repo/batch-action', data)
}
