import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

// Day.js set default timezone
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault(process.env.LOCAL_TIMEZONE || 'Asia/Tokyo')

/**
 * Timezone を意識しながら Date フォーマットする
 * @param  baseDate Date (UTC など Timezone 付き)
 * @param fmt dayjs format string
 * @returns formatted string
 */
export const formatLocalDate = (
  baseDate: Date | string,
  fmt = 'YYYY/MM/DD HH:mm'
): string => {
  return dayjs(baseDate).tz().format(fmt)
}

/**
 * Timezone を意識しながら 文字列からDate型に変換する
 * @param   Datestring - ISO Date 形式
 * @returns Date
 */
export const localDate = (dateString?: string) => {
  return dateString ? dayjs(dateString).tz().toDate() : dayjs().tz().toDate()
}

/**
 * 指定ミリ秒スリープする
 * Promise を返すので利用する側でawaitして
 * @param sleepms スリープ時間 ミリ秒
 * @returns Promise
 */
export const sleep = (sleepms: number) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve('OK')
    }, sleepms)
  )
}

/**
 * FILE 関連ユーティリティ
 */
export const getFileExtension = (filename: string) => {
  const extention = filename.split('.').pop() ?? 'bad-file'
  return extention.toLowerCase()
}

const acceptableImageExtensions = ['jpg', 'jpeg', 'png', 'gif', '.webp']
export const getAccesstableImageExtensions = () => acceptableImageExtensions
export const isImageFileByExt = (ext: string): boolean =>
  acceptableImageExtensions.includes(ext)

const accesstableImageTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]
export const getAccesstableImageTypes = () => accesstableImageTypes
export const isImageFileByType = (type: string): boolean =>
  accesstableImageTypes.includes(type)

export const isImageFile = (file: File): boolean => {
  const ext = getFileExtension(file.name)
  const type = file.type
  return isImageFileByType(type) || isImageFileByExt(ext)
}

const accessiblePdfTypes = ['application/pdf']
export const getAccesstablePdfTypes = () => accessiblePdfTypes

const fileExtention2Type: { [k: string]: string } = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  pdf: 'application/pdf',
}
export const getFileTypeByExtention = (ext: string) =>
  fileExtention2Type[ext] ?? 'application/octet-stream'
