const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'supersecretkey123';

export function getUserId() {
  let userId = localStorage.getItem('walgraph_userId');
  if (!userId) {
    userId = prompt('Enter a username (for demo):') || '';
    localStorage.setItem('walgraph_userId', userId);
  }
  return userId;
}

export async function createGraph(graphData: any) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const userId = getUserId();
  const response = await fetch(`${API_BASE_URL}/api/graphs`, {
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
  const response = await fetch(`${API_BASE_URL}/api/graphs/${id}`);
  return response.json();
}

export async function updateGraph(id: string, graphData: any) {
  const response = await fetch(`${API_BASE_URL}/api/graphs/${id}`, {
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
  const response = await fetch(`${API_BASE_URL}/api/graphs/${id}`, {
    method: 'DELETE',
    headers: {
      'x-api-key': API_KEY,
    },
  });
  return response.json();
}

export async function listGraphs() {
  const response = await fetch(`${API_BASE_URL}/api/graphs`);
  return response.json();
}

export async function listSavedGraphs() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const userId = getUserId();
  const response = await fetch(`${API_BASE_URL}/api/graphs?userId=${encodeURIComponent(userId)}`);
  return response.json();
}

export async function fetchGraphByBlobId(blobId: string) {
  const WALRUS_AGGREGATOR_URL = "https://walrus-testnet-aggregator.natsai.xyz";
  const response = await fetch(`${WALRUS_AGGREGATOR_URL}/v1/blobs/${blobId}`);
  if (!response.ok) throw new Error("Blob not found or fetch failed");
  return response.json();
}

export async function deleteSavedGraph(graphId: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const response = await fetch(`${API_BASE_URL}/api/graphs/${graphId}`, {
    method: 'DELETE',
    headers: {
      'x-api-key': API_KEY,
    },
  });
  return response.json();
} 