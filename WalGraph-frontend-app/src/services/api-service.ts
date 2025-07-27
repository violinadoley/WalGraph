const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'enterprise-test-key-12345';

export async function createGraph(graphData: Record<string, unknown>, userId: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const response = await fetch(`${API_BASE_URL}/api/v1/graphs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({ ...graphData, userId }),
  });
  return response.json();
}

export async function getGraph(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/graphs/${id}`, {
    headers: {
      'x-api-key': API_KEY,
    },
  });
  return response.json();
}

export async function updateGraph(id: string, graphData: Record<string, unknown>) {
  const response = await fetch(`${API_BASE_URL}/api/v1/graphs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify(graphData),
  });
  return response.json();
}

export async function deleteGraph(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/graphs/${id}`, {
    method: 'DELETE',
    headers: {
      'x-api-key': API_KEY,
    },
  });
  return response.json();
}

export async function listGraphs() {
  const response = await fetch(`${API_BASE_URL}/api/v1/graphs`, {
    headers: {
      'x-api-key': API_KEY,
    },
  });
  return response.json();
}

export async function listSavedGraphs(userId: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const response = await fetch(`${API_BASE_URL}/api/v1/graphs?userId=${encodeURIComponent(userId)}`, {
    headers: {
      'x-api-key': API_KEY,
    },
  });
  return response.json();
}

export async function fetchGraphByBlobId(blobId: string) {
  const WALRUS_AGGREGATOR_URL = "https://walrus-testnet-aggregator.natsai.xyz";
  const response = await fetch(`${WALRUS_AGGREGATOR_URL}/v1/blobs/${blobId}`);
  if (!response.ok) throw new Error("Blob not found or fetch failed");
  return response.json();
}

export async function deleteSavedGraph(graphId: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const response = await fetch(`${API_BASE_URL}/api/v1/graphs/${graphId}`, {
    method: 'DELETE',
    headers: {
      'x-api-key': API_KEY,
    },
  });
  return response.json();
} 