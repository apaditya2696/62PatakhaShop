import { NextResponse } from 'next/server'
import { getProductReviews, saveProductReview, ProductReview } from '@/lib/reviews'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('productId')
  if (!productId) {
    return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 })
  }

  const reviews = getProductReviews(productId)
  return NextResponse.json({ success: true, reviews })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, author, rating, comment } = body

    if (!productId || !author || !rating || !comment) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 })
    }

    const newReview: ProductReview = {
      id: 'rev-' + Date.now(),
      productId: String(productId),
      author: String(author).trim(),
      rating: Number(rating) || 5,
      comment: String(comment).trim(),
      date: new Date().toISOString().split('T')[0],
      verified: true,
    }

    saveProductReview(newReview)
    return NextResponse.json({ success: true, review: newReview })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
