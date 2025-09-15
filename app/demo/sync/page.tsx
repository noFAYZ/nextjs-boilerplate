'use client'

import { useWalletSyncProgress, WalletSyncProgress } from "@/lib/hooks/use-realtime-sync";

export default function WalletSyncDashboard() {
    const { walletStates, isConnected, error } = useWalletSyncProgress();
  
    return (
      <div className="wallet-sync-dashboard">
        <div className="connection-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
          {error && <div className="error">{error}</div>}
        </div>
  
        <div className="wallet-list">
          {Object.entries(walletStates).map(([walletId, state]) => (
            <WalletSyncCard key={walletId} walletId={walletId} state={state} />
          ))}
        </div>
      </div>
    );
  }
  
  function WalletSyncCard({ walletId, state }: { walletId: string; state: WalletSyncProgress }) {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'completed': return '#22c55e';
        case 'failed': return '#ef4444';
        case 'syncing':
        case 'syncing_assets':
        case 'syncing_transactions': return '#3b82f6';
        default: return '#6b7280';
      }
    };
  
    return (
      <div className="wallet-sync-card" style={{ borderLeft: `4px solid ${getStatusColor(state.status)}` }}>
        <div className="wallet-header">
          <h3>Wallet {walletId.substring(0, 8)}...</h3>
          <span className="status">{state.status.replace('_', ' ').toUpperCase()}</span>
        </div>
  
        <div className="progress-section">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${state.progress}%`,
                backgroundColor: getStatusColor(state.status)
              }}
            />
          </div>
          <span className="progress-text">{state.progress}%</span>
        </div>
  
        {state.message && (
          <div className="status-message">{state.message}</div>
        )}
  
        {state.error && (
          <div className="error-message">Error: {state.error}</div>
        )}
  
        {state.syncedData && state.syncedData.length > 0 && (
          <div className="synced-data">
            Synced: {state.syncedData.join(', ')}
          </div>
        )}
      </div>
    );
  }