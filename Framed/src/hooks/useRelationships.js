import { useState, useEffect, useCallback } from 'react';
import {
  recordFlowRun,
  recordManualConnection,
  getSuggestions,
  getRelatedBlocks,
  getTopPairs,
  exportGraph,
} from '../utils/relationships';

export default function useRelationships(activeBlockId) {
  const [suggestions, setSuggestions] = useState([]);
  const [topPairs, setTopPairs] = useState([]);
  const [relatedBlocks, setRelatedBlocks] = useState([]);

  // Refresh suggestions when active block changes
  useEffect(() => {
    if (!activeBlockId) {
      setSuggestions([]);
      return;
    }
    getSuggestions(activeBlockId).then(setSuggestions);
  }, [activeBlockId]);

  // Load top pairs on mount and refresh periodically
  const refreshTopPairs = useCallback(() => {
    getTopPairs(10).then(setTopPairs);
  }, []);

  useEffect(() => {
    refreshTopPairs();
  }, [refreshTopPairs]);

  // Load related blocks for active block
  useEffect(() => {
    if (!activeBlockId) {
      setRelatedBlocks([]);
      return;
    }
    getRelatedBlocks(activeBlockId).then(setRelatedBlocks);
  }, [activeBlockId]);

  const recordRun = useCallback(async (flow, blocks, outcome) => {
    await recordFlowRun(flow, blocks, outcome);
    refreshTopPairs();
    if (activeBlockId) {
      getSuggestions(activeBlockId).then(setSuggestions);
    }
  }, [activeBlockId, refreshTopPairs]);

  const recordConnection = useCallback(async (fromId, toId, appContext) => {
    await recordManualConnection(fromId, toId, appContext);
    refreshTopPairs();
    if (activeBlockId) {
      getSuggestions(activeBlockId).then(setSuggestions);
    }
  }, [activeBlockId, refreshTopPairs]);

  const getExport = useCallback(() => exportGraph(), []);

  return {
    suggestions,
    topPairs,
    relatedBlocks,
    recordRun,
    recordConnection,
    refreshTopPairs,
    exportGraph: getExport,
  };
}
