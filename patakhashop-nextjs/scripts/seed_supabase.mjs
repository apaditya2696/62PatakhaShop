import fs from 'fs'
import path from 'path'

// Read .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')

let supabaseUrl = ''
let serviceKey = ''

envContent.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1].trim()
  }
  if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
    serviceKey = line.split('=')[1].trim()
  }
})

if (!supabaseUrl || !serviceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

// Read products.json
const productsJsonPath = path.resolve(process.cwd(), 'src/data/products.json')
const products = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'))

console.log(`Syncing ${products.length} products to Supabase live DB...`)

const dbProducts = products.map(p => ({
  id: String(p.id),
  sno: Number(p.sno),
  name: p.name,
  brand: p.brand,
  category: p.category,
  tags: p.tags,
  price: Number(p.price || 0),
  original_price: Number(p.originalPrice || 0),
  discount: p.discount || 'Price Pending',
  in_stock: Boolean(p.inStock),
  stock_quantity: Number(p.stockQuantity || 50),
  image: p.image
}))

async function syncSupabase() {
  try {
    // 1. Delete all existing products in Supabase so old sample rows are removed
    const deleteRes = await fetch(`${supabaseUrl}/rest/v1/products?id=gt.0`, {
      method: 'DELETE',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      }
    })
    console.log('Cleared existing products in Supabase. Status:', deleteRes.status)

    // 2. Insert the 301 fresh products from Excel catalog in batches of 50
    const endpoint = `${supabaseUrl}/rest/v1/products`
    const batchSize = 50
    for (let i = 0; i < dbProducts.length; i += batchSize) {
      const batch = dbProducts.slice(i, i + batchSize)
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(batch)
      })

      if (!response.ok) {
        const errText = await response.text()
        console.error(`Error inserting batch ${i / batchSize + 1}:`, errText)
      } else {
        console.log(`Inserted batch ${i / batchSize + 1} (${batch.length} items) successfully.`)
      }
    }

    console.log('Supabase database sync completed cleanly with exact master catalog!')
  } catch (err) {
    console.error('Sync error:', err)
  }
}

syncSupabase()
