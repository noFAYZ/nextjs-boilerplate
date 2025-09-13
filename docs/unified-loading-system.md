# Unified Loading System Documentation

The MoneyMappr frontend now includes a comprehensive unified loading system that uses the beautiful LogoLoader component across all pages and operations. This system provides consistent loading states, success feedback, and error handling throughout the application.

## Overview

The unified loading system consists of several key components:

1. **LoadingProvider** - Context provider for global loading state
2. **PageLoader** - Page-level loading component
3. **PageLoaderWrapper** - Wrapper component for conditional loading
4. **LogoLoader, SuccessLoader, FailLoader** - Animated icons for different states

## Components

### LoadingProvider

The main context provider that manages global loading state and provides loading utilities throughout the app.

**Features:**
- Global loading overlay with LogoLoader animation
- Success and error states with appropriate icons
- Progress tracking for long operations
- Auto-hide for success/error states
- Promise wrapper for automatic loading states

### PageLoader

A full-screen loading component specifically designed for page-level loading.

```tsx
import { PageLoader } from '@/components/ui/page-loader'

// Basic usage
<PageLoader message="Loading your profile..." />

// With custom size
<PageLoader message="Loading..." size="xl" />

// Inline loading (not full-screen)
<PageLoader message="Loading..." fullScreen={false} />
```

### PageLoaderWrapper

A conditional wrapper that shows loading or content based on state.

```tsx
import { PageLoaderWrapper } from '@/components/ui/page-loader'

<PageLoaderWrapper 
  isLoading={isLoading} 
  message="Loading data..."
>
  <YourContent />
</PageLoaderWrapper>
```

## Hook Usage

### useLoading

The main hook for accessing loading functionality.

```tsx
import { useLoading } from '@/lib/contexts/loading-context'

function MyComponent() {
  const { 
    state, 
    showLoading, 
    showSuccess, 
    showError, 
    hideLoading, 
    setProgress, 
    withLoading 
  } = useLoading()

  // Manual loading control
  const handleManualOperation = async () => {
    showLoading('Processing...')
    try {
      await someOperation()
      showSuccess('Operation completed!')
    } catch (error) {
      showError('Operation failed')
    }
  }

  // Automatic loading with promise wrapper
  const handleAutoOperation = async () => {
    try {
      await withLoading(
        someAsyncOperation(), 
        'Processing your request...'
      )
      // Success state shown automatically
    } catch (error) {
      // Error state shown automatically
    }
  }

  // Progress tracking
  const handleProgressOperation = async () => {
    showLoading('Uploading file...')
    
    // Update progress during operation
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i)
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    showSuccess('Upload complete!')
  }
}
```

### usePageLoading

Simplified hook for page-level loading.

```tsx
import { usePageLoading } from '@/lib/contexts/loading-context'

function MyPage() {
  const { isLoading, startLoading, stopLoading, withLoading } = usePageLoading()

  const loadData = async () => {
    try {
      await withLoading(fetchData(), 'Loading page data...')
    } catch (error) {
      // Error handled automatically
    }
  }
}
```

## Usage Examples

### 1. Page-Level Loading

```tsx
'use client'

import { useState, useEffect } from 'react'
import { PageLoader } from '@/components/ui/page-loader'
import { usePageLoading } from '@/lib/contexts/loading-context'

export default function MyPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const { isLoading, withLoading } = usePageLoading()

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await withLoading(
          fetch('/api/data').then(res => res.json()),
          'Loading page data...'
        )
        setData(result)
      } catch (err) {
        setError(err.message)
      }
    }
    
    loadData()
  }, [])

  if (isLoading) {
    return <PageLoader message="Loading your data..." />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FailLoader className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-destructive mb-2">
            Something went wrong
          </h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Your page content */}
    </div>
  )
}
```

### 2. Form Submission with Loading

```tsx
import { useLoading } from '@/lib/contexts/loading-context'

function ContactForm() {
  const { withLoading } = useLoading()
  
  const handleSubmit = async (formData) => {
    try {
      await withLoading(
        submitForm(formData),
        'Sending your message...'
      )
      // Success state shown automatically
    } catch (error) {
      // Error state shown automatically
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

### 3. File Upload with Progress

```tsx
function FileUploader() {
  const { showLoading, setProgress, showSuccess, showError } = useLoading()

  const handleUpload = async (file) => {
    showLoading('Uploading file...')
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100
          setProgress(progress)
        }
      })

      await new Promise((resolve, reject) => {
        xhr.onload = () => resolve(xhr.response)
        xhr.onerror = () => reject(new Error('Upload failed'))
        xhr.open('POST', '/api/upload')
        xhr.send(formData)
      })

      showSuccess('File uploaded successfully!')
    } catch (error) {
      showError('Upload failed. Please try again.')
    }
  }
}
```

### 4. Higher-Order Component Pattern

```tsx
import { withPageLoader } from '@/components/ui/page-loader'

// Wrap your component to add automatic loading support
const MyPageWithLoading = withPageLoader(
  MyPage,
  'Loading page content...' // Optional custom message
)

function App() {
  const [isLoading, setIsLoading] = useState(true)

  return <MyPageWithLoading isLoading={isLoading} />
}
```

## Integration with Existing Code

### Updating Existing Pages

To migrate existing pages to use the unified loading system:

1. **Replace custom loading screens:**
   ```tsx
   // Old way
   if (isLoading) {
     return <div className="loading-spinner">Loading...</div>
   }

   // New way
   if (isLoading) {
     return <PageLoader message="Loading your data..." />
   }
   ```

2. **Replace manual loading states:**
   ```tsx
   // Old way
   const [loading, setLoading] = useState(false)
   
   const handleAction = async () => {
     setLoading(true)
     try {
       await someAction()
       showSuccessToast()
     } catch (error) {
       showErrorToast()
     } finally {
       setLoading(false)
     }
   }

   // New way
   const { withLoading } = useLoading()
   
   const handleAction = async () => {
     try {
       await withLoading(someAction(), 'Processing...')
       // Success handled automatically
     } catch (error) {
       // Error handled automatically
     }
   }
   ```

3. **Replace error screens:**
   ```tsx
   // Use FailLoader component for consistency
   if (error) {
     return (
       <div className="error-screen">
         <FailLoader className="w-16 h-16" />
         <h2>Something went wrong</h2>
         <p>{error}</p>
       </div>
     )
   }
   ```

## Best Practices

1. **Use appropriate loading messages** - Be specific about what's loading
2. **Handle all states** - Loading, success, error, and empty states
3. **Consistent error handling** - Use FailLoader for all error states
4. **Progress indication** - Use progress bars for long operations
5. **Auto-hide timers** - Success states auto-hide after 2s, errors after 3s
6. **Accessibility** - All loading states include appropriate ARIA labels

## Configuration

The LoadingProvider can be configured with custom styles:

```tsx
<LoadingProvider 
  overlayClassName="custom-overlay-styles"
>
  <App />
</LoadingProvider>
```

## Migration Guide

### For Existing Components

1. Import the new loading hooks
2. Replace manual loading state management
3. Update loading UI to use PageLoader or LogoLoader
4. Use withLoading for async operations
5. Replace custom error screens with FailLoader

### For New Components

1. Use useLoading or usePageLoading hooks
2. Implement loading states with PageLoader
3. Use withLoading wrapper for async operations
4. Follow the consistent error handling patterns

This unified system ensures a consistent, beautiful loading experience across the entire MoneyMappr application while reducing code duplication and improving maintainability.