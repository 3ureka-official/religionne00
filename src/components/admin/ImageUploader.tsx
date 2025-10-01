'use client'

import { useRef, useState } from 'react'
import { Box, Typography, IconButton, Dialog } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ZoomInIcon from '@mui/icons-material/ZoomIn'

interface ImageUploaderProps {
  images: string[]
  onImagesChange: (files: File[]) => void
  onImageRemove: (index: number) => void
  maxImages?: number
}

export default function ImageUploader({ 
  images, 
  onImagesChange, 
  onImageRemove, 
  maxImages = 15 
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // 画像ファイルを処理する共通関数
  const processImageFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'))
    const newFiles = imageFiles.slice(0, maxImages - images.length)
    
    if (newFiles.length > 0) {
      onImagesChange(newFiles)
    }
  }

  // ファイル選択
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFiles(e.target.files)
    }
  }

  // ドラッグ&ドロップのハンドラ
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    processImageFiles(e.dataTransfer.files)
  }

  // アップロードボタンのクリック
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // 画像プレビューを開く
  const handleImageClick = (e: React.MouseEvent, imageUrl: string) => {
    e.stopPropagation()
    setPreviewImage(imageUrl)
    setPreviewOpen(true)
  }

  // プレビューを閉じる
  const handlePreviewClose = () => {
    setPreviewOpen(false)
    setPreviewImage(null)
  }

  return (
    <Box>
      <input
        type="file"
        accept="image/jpeg, image/png"
        multiple
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* ドラッグ&ドロップエリア */}
      <Box
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleUploadClick}
        sx={{
          border: isDragging ? '2px dashed #007AFF' : '2px dashed #aaa',
          borderRadius: 2,
          p: 4,
          mb: 2,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragging ? 'rgba(0, 122, 255, 0.05)' : 'transparent',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: '#007AFF',
            bgcolor: 'rgba(0, 122, 255, 0.02)',
          }
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: isDragging ? '#007AFF' : '#aaa', mb: 1 }} />
        <Typography sx={{ fontSize: 16, fontWeight: 'bold', color: isDragging ? '#007AFF' : 'text.primary', mb: 0.5 }}>
          {isDragging ? '画像をドロップ' : '画像をドラッグ&ドロップ'}
        </Typography>
        <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
          またはクリックして画像を選択
        </Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 1 }}>
          対応形式: JPG, PNG（中央が正方形で切り取られます）
        </Typography>
      </Box>

      {/* 画像プレビュー */}
      {images.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {images.map((preview, index) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                width: 120,
                height: 120,
                border: '1px solid #ddd',
                borderRadius: 1,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  '& .preview-overlay': {
                    opacity: 1,
                  }
                }
              }}
              onClick={(e) => handleImageClick(e, preview)}
            >
              {/* 正方形にクロップして表示 */}
              <Box
                component="img"
                src={preview}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover', // 中央を切り取り
                  objectPosition: 'center', // 中央基準
                }}
              />
              
              {/* ホバー時のプレビューアイコン */}
              <Box
                className="preview-overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  bgcolor: 'rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                }}
              >
                <ZoomInIcon sx={{ color: 'white', fontSize: 32 }} />
              </Box>

              {/* 削除ボタン */}
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  onImageRemove(index)
                }}
                sx={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  bgcolor: 'rgba(0, 0, 0, 0.54)',
                  color: 'white',
                  p: 0.5,
                  zIndex: 2,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.74)',
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {/* 画像プレビューモーダル */}
      <Dialog
        open={previewOpen}
        onClose={handlePreviewClose}
        maxWidth={false}
        onClick={handlePreviewClose}
        PaperProps={{
          sx: {
            bgcolor: 'transparent',
            boxShadow: 'none',
            overflow: 'visible',
          }
        }}
      >
        <Box sx={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
          {/* 閉じるボタン */}
          <IconButton
            onClick={handlePreviewClose}
            sx={{
              position: 'absolute',
              top: -40,
              right: 0,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              color: 'black',
              zIndex: 1,
              '&:hover': {
                bgcolor: 'white',
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* プレビュー画像（正方形に切り取り） */}
          {previewImage && (
            <Box
              sx={{
                width: '600px',
                height: '600px',
                position: 'relative',
                bgcolor: '#D9D9D9',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <Box
                component="img"
                src={previewImage}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover', // 中央を切り取り
                  objectPosition: 'center', // 中央基準
                }}
              />
            </Box>
          )}
        </Box>
      </Dialog>
    </Box>
  )
}