import { openDB } from 'idb';

const DB_NAME = 'framed';
const DB_VERSION = 2;

function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        db.createObjectStore('images', { keyPath: 'blockId' });
      }
      if (oldVersion < 2) {
        const relStore = db.createObjectStore('relationships', { keyPath: 'edge_id' });
        relStore.createIndex('by_source', 'source_id', { unique: false });
        relStore.createIndex('by_target', 'target_id', { unique: false });
        relStore.createIndex('by_app', 'app_context', { unique: false });
      }
    },
  });
}

// --- Images ---

export async function saveImage(blockId, dataUrl) {
  const db = await getDB();
  await db.put('images', { blockId, dataUrl });
}

export async function loadImage(blockId) {
  const db = await getDB();
  const record = await db.get('images', blockId);
  return record?.dataUrl || null;
}

export async function deleteImage(blockId) {
  const db = await getDB();
  await db.delete('images', blockId);
}

// --- Relationships ---

function edgeId(sourceId, targetId, appContext) {
  return `${sourceId}::${targetId}::${appContext || '_'}`;
}

export async function getEdge(sourceId, targetId, appContext) {
  const db = await getDB();
  return db.get('relationships', edgeId(sourceId, targetId, appContext));
}

export async function putEdge(edge) {
  const db = await getDB();
  await db.put('relationships', edge);
}

export async function getEdgesFrom(sourceId) {
  const db = await getDB();
  return db.getAllFromIndex('relationships', 'by_source', sourceId);
}

export async function getEdgesTo(targetId) {
  const db = await getDB();
  return db.getAllFromIndex('relationships', 'by_target', targetId);
}

export async function getAllEdges() {
  const db = await getDB();
  return db.getAll('relationships');
}

export async function deleteEdgesForBlock(blockId) {
  const db = await getDB();
  const tx = db.transaction('relationships', 'readwrite');
  const store = tx.objectStore('relationships');
  const all = await store.getAll();
  for (const edge of all) {
    if (edge.source_id === blockId || edge.target_id === blockId) {
      await store.delete(edge.edge_id);
    }
  }
  await tx.done;
}

export { edgeId };
