async function testProductsApi() {
  try {
    const res = await fetch('http://localhost:3000/api/products')
    const data = await res.json()
    console.log('API Response Status:', res.status)
    console.log('Source:', data.source)
    console.log('Product Count:', data.count)
    console.log('First Product:', data.products[0])
    console.log('Last Product:', data.products[data.products.length - 1])
  } catch (err) {
    console.error('Error fetching /api/products:', err)
  }
}

testProductsApi()
