import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'

function isValidImageMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 4) return false
  // JPEG: 0xFF 0xD8 0xFF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return true
  // PNG: 0x89 0x50 0x4E 0x47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return true
  // WEBP: RIFF...WEBP
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return true
  // AVIF: ftypavif at byte offset 4
  if (buffer.length >= 12 && buffer.toString('ascii', 4, 12).includes('ftyp')) return true
  return false
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const password = formData.get('password') as string | null

    const ADMIN_KEY = process.env.ADMIN_KEY || 'patakha62admin'
    if (password !== ADMIN_KEY) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Invalid Admin Password' }, { status: 401 })
    }

    if (!file) {
      return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 })
    }

    // 1. Enforce 2MB Maximum File Size Limit
    const MAX_SIZE = 2 * 1024 * 1024 // 2MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: 'File size exceeds 2MB limit. Please upload a smaller image.' }, { status: 413 })
    }

    const rawBytes = await file.arrayBuffer()
    const rawBuffer = Buffer.from(rawBytes)

    // 2. Validate Real File Signature (Magic Bytes)
    if (!isValidImageMagicBytes(rawBuffer)) {
      return NextResponse.json({ success: false, error: 'Invalid image format. Allowed formats: JPEG, PNG, WEBP, AVIF.' }, { status: 400 })
    }

    // 3. Compress & Resize Image with Sharp (Max 1200px width/height, WebP quality 75)
    const compressedBuffer = await sharp(rawBuffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer()

    // Generate sanitized clean file name
    const sanitizedOriginalName = (file.name || 'image').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()
    const cleanFileName = `prod_upload_${Date.now()}_${sanitizedOriginalName}.webp`

    // 4. Upload to Supabase Storage if configured
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.storage
        .from('product-images')
        .upload(cleanFileName, compressedBuffer, {
          contentType: 'image/webp',
          upsert: true,
        })

      if (!error && data) {
        const { data: publicUrlData } = supabaseAdmin.storage
          .from('product-images')
          .getPublicUrl(cleanFileName)

        return NextResponse.json({
          success: true,
          imageUrl: publicUrlData.publicUrl,
          storage: 'supabase',
        })
      }
    }

    // 5. Fallback local file save
    const targetDir = path.join(process.cwd(), 'public', 'products')
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }

    const targetFilePath = path.join(targetDir, cleanFileName)
    fs.writeFileSync(targetFilePath, compressedBuffer)

    return NextResponse.json({
      success: true,
      imageUrl: `/products/${cleanFileName}`,
      storage: 'local',
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process image upload: ' + String(error) }, { status: 500 })
  }
}
