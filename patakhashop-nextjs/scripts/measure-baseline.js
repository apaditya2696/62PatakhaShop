const http = require('http');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const start = process.hrtime.bigint();
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const end = process.hrtime.bigint();
        const durationMs = Number(end - start) / 1e6;
        resolve({ statusCode: res.statusCode, durationMs });
      });
    });
    req.on('error', (err) => reject(err));
    if (postData) req.write(postData);
    req.end();
  });
}

function calculatePercentiles(latencies) {
  const sorted = latencies.slice().sort((a, b) => a - b);
  const p50Idx = Math.floor(sorted.length * 0.50);
  const p95Idx = Math.floor(sorted.length * 0.95);
  return {
    p50: sorted[p50Idx].toFixed(2),
    p95: sorted[p95Idx].toFixed(2),
    min: sorted[0].toFixed(2),
    max: sorted[sorted.length - 1].toFixed(2),
    avg: (sorted.reduce((a, b) => a + b, 0) / sorted.length).toFixed(2)
  };
}

async function runBenchmark() {
  console.log('--- Starting Baseline Latency Benchmark (50 Requests Each) ---');

  // 1. GET /api/products (50 calls)
  const productsLatencies = [];
  for (let i = 0; i < 50; i++) {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/products',
      method: 'GET'
    });
    productsLatencies.push(res.durationMs);
  }
  const productsStats = calculatePercentiles(productsLatencies);

  // 2. POST /api/orders (50 benchmark calls)
  const orderLatencies = [];
  for (let i = 0; i < 50; i++) {
    const postData = JSON.stringify({
      customerName: `Benchmark Test ${i}`,
      customerPhone: '9829012345',
      orderNote: 'Baseline Latency Measurement',
      deliveryMethod: 'pickup',
      paymentMethod: 'cash_on_pickup',
      items: [{ id: '1270', name: '12 Shot (Mercury)', brand: 'Mercury', price: 250, quantity: 1 }]
    });

    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/orders',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, postData);
    orderLatencies.push(res.durationMs);
  }
  const orderStats = calculatePercentiles(orderLatencies);

  console.log('BENCHMARK_RESULTS:' + JSON.stringify({ productsStats, orderStats }));
}

runBenchmark().catch(console.error);
