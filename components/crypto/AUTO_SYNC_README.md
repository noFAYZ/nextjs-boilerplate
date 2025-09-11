# Auto-Sync Wallet System

## Overview

The Auto-Sync system automatically synchronizes crypto wallets when users log in for the first time each day or after a long absence. It provides real-time sync statistics and progress tracking in the wallets dock.

## Features

### 🚀 Auto-Sync Triggers
- **First Daily Login**: Automatically syncs all wallets when user logs in for the first time each day
- **Long Absence**: Triggers sync if user hasn't logged in for 6+ hours (configurable)
- **Manual Sync**: Users can trigger sync manually at any time

### 📊 Live Sync Stats
- Real-time sync progress in wallets dock
- Sync status indicators (syncing, success, error, warning)
- Progress bars and completion percentages
- Last sync time tracking

### 🔄 Smart Retry Logic
- Automatic retry on failed syncs (up to 3 attempts by default)
- Exponential backoff delay between retries
- Graceful error handling and reporting

### 🎨 Visual Indicators
- **Dock Icon**: Changes based on sync status (spinning, success, error)
- **Badge**: Shows sync progress or error count
- **Progress Bar**: Real-time sync progress
- **Status Colors**: Green (success), Blue (syncing), Red (error), Amber (warning)

## Components

### Core Hook: `useAutoSync`
```typescript
const {
  syncStats,      // Current sync statistics
  shouldAutoSync, // Whether auto-sync should trigger
  triggerSync,    // Manual sync trigger
  startAutoSync,  // Start auto-sync process
} = useAutoSync({
  dailySyncEnabled: true,           // Enable daily sync
  longAbsenceThresholdHours: 6,     // Hours for long absence trigger
  maxRetries: 3,                    // Max retry attempts
  retryDelayMs: 2000               // Base retry delay
});
```

### Sync Statistics
```typescript
interface SyncStats {
  totalWallets: number;     // Total wallets
  syncedWallets: number;    // Successfully synced
  failedWallets: number;    // Failed syncs
  syncingWallets: number;   // Currently syncing
  lastSyncTime: Date | null; // Last successful sync
  isAutoSyncing: boolean;   // Sync in progress
  syncProgress: number;     // Progress percentage (0-100)
}
```

### Visual Components

#### LiveSyncStats
```tsx
<LiveSyncStats 
  variant="compact|detailed" 
  showProgress={true}
  showLastSync={true}
  showTrigger={true}
/>
```

#### SyncStatusIndicator
```tsx
<SyncStatusIndicator 
  variant="minimal|compact|detailed"
  showProgress={true}
  showLastSync={true}
  showTrigger={true}
/>
```

#### AutoSyncProvider
Manages auto-sync notifications and prompts:
```tsx
<AutoSyncProvider>
  {children}
</AutoSyncProvider>
```

## Integration

### 1. Provider Setup
The AutoSyncProvider is already integrated in the main providers:
```tsx
// components/providers/providers.tsx
<DockProvider>
  <AutoSyncProvider>
    <OnboardingGuard>
      {children}
    </OnboardingGuard>
  </AutoSyncProvider>
</DockProvider>
```

### 2. Wallets Dock Integration
The WalletsDock component automatically shows:
- Live sync progress in dock header
- Sync status icons and badges
- Manual sync buttons
- Progress bars during sync

### 3. Storage Keys
The system uses localStorage to track:
- `moneymappr_last_wallet_sync`: Last successful sync time
- `moneymappr_last_login`: Last login timestamp
- `moneymappr_auto_sync_settings`: User preferences

## Sync Process Flow

1. **Login Detection**: System detects user login
2. **Trigger Check**: Determines if auto-sync should trigger
3. **Sync Initiation**: Starts syncing all wallets in parallel
4. **Progress Tracking**: Updates real-time statistics
5. **Retry Logic**: Retries failed syncs with backoff
6. **Completion**: Updates dock status and notifications
7. **Storage Update**: Records sync completion time

## Configuration

### Auto-Sync Options
```typescript
interface AutoSyncOptions {
  dailySyncEnabled?: boolean;        // Default: true
  longAbsenceThresholdHours?: number; // Default: 6
  maxRetries?: number;               // Default: 3
  retryDelayMs?: number;            // Default: 2000
}
```

### Sync Triggers
- **Daily**: First login of the day (00:00 - 23:59)
- **Long Absence**: More than 6 hours since last login
- **Manual**: User-initiated sync
- **Error Recovery**: After connection is restored

## Error Handling

### Retry Strategy
1. **Initial Attempt**: Direct sync call
2. **First Retry**: 2 second delay
3. **Second Retry**: 4 second delay  
4. **Third Retry**: 6 second delay
5. **Final Failure**: Mark wallet as failed

### Error Types
- **Network Error**: Connection issues
- **API Error**: Server-side problems
- **Timeout Error**: Request timeout
- **Auth Error**: Authentication failure

## User Experience

### Automatic Sync Prompt
When auto-sync is triggered, users see:
- Notification in dock
- Overlay prompt (dismissible)
- Progress indicators
- Success/failure feedback

### Manual Sync Controls
- Sync button in dock header
- Individual wallet sync options
- Bulk sync operations
- Retry failed syncs

### Status Feedback
- Toast notifications for completion
- Visual status indicators
- Progress bars and percentages
- Last sync time display

## Performance Considerations

### Efficient Syncing
- Parallel wallet processing
- Debounced status updates
- Minimal DOM updates
- Smart re-render prevention

### Memory Management
- Cleanup on unmount
- Event listener removal
- Timer cleanup
- State reset on errors

## Accessibility

### Screen Reader Support
- ARIA labels for sync status
- Live region updates
- Keyboard navigation
- Focus management

### Visual Accessibility
- High contrast indicators
- Color-blind friendly status
- Clear visual hierarchy
- Reduced motion support

## Testing

### Manual Testing
1. Clear localStorage
2. Login to trigger auto-sync
3. Verify progress indicators
4. Test retry logic with network issues
5. Check dock updates and notifications

### Test Scenarios
- First time user login
- Daily login trigger
- Long absence trigger
- Network failure recovery
- Multiple wallet sync
- Error state handling

## Future Enhancements

### Planned Features
- **Selective Sync**: Choose which wallets to sync
- **Sync Scheduling**: Custom sync intervals
- **Background Sync**: Service worker integration
- **Conflict Resolution**: Handle sync conflicts
- **Advanced Analytics**: Detailed sync metrics

### Performance Improvements
- **Incremental Sync**: Only sync changed data
- **Caching Strategy**: Smart cache management
- **Batch Processing**: Optimize API calls
- **Priority Queue**: High-priority wallet sync

## Troubleshooting

### Common Issues
1. **Sync Not Triggering**: Check localStorage values
2. **Progress Not Updating**: Verify hook dependencies
3. **Dock Not Showing Status**: Check provider setup
4. **Retries Not Working**: Verify error handling
5. **Performance Issues**: Check for memory leaks

### Debug Tips
- Check console for auto-sync logs
- Inspect localStorage keys
- Monitor network requests
- Verify component re-renders
- Test with different network conditions