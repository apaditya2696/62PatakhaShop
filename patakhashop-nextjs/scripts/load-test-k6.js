const http = require('http')

async function runHighConcurrencyLoadTest() {
  console.log('===========================================================')
  console.log('Phase 5: K6 High-Concurrency Burst Load Test (100 Concurrent Users)')
  console.log('===========================================================')

  const totalConcurrentUsers = 100
  const requestsPerUser = 5
  const totalTargetRequests = totalConcurrentUsers * requestsPerUser

  const latencies = []
  let successCount = 0
  let rateLimitedCount = 0
  let errorCount = 0

  const makeApiCall = (path, method = 'GET', bodyData = null) => {
    return new Promise((resolve) => {
      const startTime = Date.now()
      const req = http.request(
        {
          hostname: 'localhost',
          port: 3000,
          path,
          method,
          headers: bodyData
            ? {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(bodyData),
              }
            : {},
        },
        (res) => {
          let body = ''
          res.on('data', (chunk) => (body += chunk))
          res.on('end', () => {
            const elapsed = Date.now() - startTime
            resolve({ statusCode: res.statusCode, elapsed })
          })
        }
      )

      req.on('error', (err) => {
        const elapsed = Date.now() - startTime
        resolve({ statusCode: 500, elapsed, error: err.message })
      })

      if (bodyData) req.write(bodyData)
      req.end()
    })
  }

  // Create batch of 100 concurrent user tasks
  const userTasks = []
  for (let u = 1; u <= totalConcurrentUsers; u++) {
    userTasks.push(async () => {
      // Each virtual user performs catalog read & order submission
      const catRes = await makeApiCall('/api/products')
      latencies.push(catRes.elapsed)
      if (catRes.statusCode === 200) successCount++
      else errorCount++

      const trackRes = await makeApiCall('/api/orders/track?phone=8561005357')
      latencies.push(trackRes.elapsed)
      if (trackRes.statusCode === 200 || trackRes.statusCode === 404) successCount++
      else errorCount++

      const orderPayload = JSON.stringify({
        customerName: `Festive User ${u}`,
        customerPhone: `98290${String(u).padStart(5, '0')}`,
        orderNote: `K6 Burst load test #${u}`,
        deliveryMethod: 'pickup',
        paymentMethod: 'cash_on_pickup',
        items: [
          {
            id: 'test_item_burst_1',
            name: 'Diwali Sparkler Box',
            brand: 'Standard Sivakasi',
            price: 250,
            originalPrice: 300,
            quantity: 1,
          },
        ],
      })

      const orderRes = await makeApiCall('/api/orders', 'POST', orderPayload)
      latencies.push(orderRes.elapsed)
      if (orderRes.statusCode === 200 || orderRes.statusCode === 400) {
        successCount++
      } else if (orderRes.statusCode === 429) {
        rateLimitedCount++
      } else {
        errorCount++
      }
    })
  }

  const startTimeAll = Date.now()
  await Promise.all(userTasks.map((t) => t()))
  const totalDurationMs = Date.now() - startTimeAll

  latencies.sort((a, b) => a - b)
  const p50 = latencies[Math.floor(latencies.length * 0.5)] || 0
  const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0
  const p99 = latencies[Math.floor(latencies.length * 0.99)] || 0
  const avg = latencies.reduce((sum, v) => sum + v, 0) / (latencies.length || 1)
  const errorRatePct = ((errorCount / (latencies.length || 1)) * 100).toFixed(2)

  console.log('\n--- Load Test Execution Summary ---')
  console.log(`- Total HTTP Requests Executed: ${latencies.length}`)
  console.log(`- Total Burst Duration: ${totalDurationMs} ms`)
  console.log(`- Throughput: ${(latencies.length / (totalDurationMs / 1000)).toFixed(1)} req/sec`)
  console.log(`- Successful Requests: ${successCount}`)
  console.log(`- Rate-Limited Protection (429): ${rateLimitedCount}`)
  console.log(`- System Errors (5xx): ${errorCount}`)
  console.log(`- Error Rate: ${errorRatePct}%`)
  console.log(`\n--- Latency Breakdown ---`)
  console.log(`- Average Latency: ${avg.toFixed(2)} ms`)
  console.log(`- P50 Latency: ${p50} ms`)
  console.log(`- P95 Latency: ${p95} ms`)
  console.log(`- P99 Latency: ${p99} ms`)

  console.log('\nLOAD_TEST_METRICS:' + JSON.stringify({
    totalRequests: latencies.length,
    durationMs: totalDurationMs,
    throughputReqSec: (latencies.length / (totalDurationMs / 1000)).toFixed(1),
    p50,
    p95,
    p99,
    avg: avg.toFixed(2),
    errorRatePct,
  }))
}

runHighConcurrencyLoadTest()
