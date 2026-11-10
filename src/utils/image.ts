// 업로드 전 이미지 축소 (긴 변 기준 px)
const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.85;

export const MAX_PHOTO_COUNT = 5;
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

export const resizeImage = async (file: File): Promise<Blob> => {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));

  // 이미 작은 이미지는 원본 사용
  if (scale === 1 && file.size < 1024 * 1024) {
    bitmap.close();
    return file;
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('이미지를 변환하지 못했어요.'))), 'image/jpeg', JPEG_QUALITY);
  });
};
