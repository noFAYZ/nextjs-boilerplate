"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PageLoader, PageLoaderWrapper, withPageLoader } from '@/components/ui/page-loader'
import { useLoading, usePageLoading } from '@/lib/contexts/loading-context'
import { Upload, Download, Save, Trash2, RefreshCw } from 'lucide-react'

// Example 1: Basic loading operations
export function BasicLoadingExample() {
  const { showLoading, showSuccess, showError, hideLoading, withLoading } = useLoading()

  const simulateOperation = (duration: number, shouldFail: boolean = false) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error('Operation failed for demo purposes'))
        } else {
          resolve('Success!')
        }
      }, duration)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Loading Operations</CardTitle>
        <CardDescription>
          Demonstrate manual loading control and automatic promise wrapping
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => showLoading('Manual loading...')}
            variant="outline"
          >
            Show Loading
          </Button>
          
          <Button 
            onClick={hideLoading}
            variant="outline"
          >
            Hide Loading
          </Button>
          
          <Button 
            onClick={() => showSuccess('Operation completed!')}
            variant="outline"
          >
            Show Success
          </Button>
          
          <Button 
            onClick={() => showError('Something went wrong!')}
            variant="outline"
          >
            Show Error
          </Button>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => withLoading(
              simulateOperation(2000), 
              'Processing request...'
            )}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Auto Success (2s)
          </Button>
          
          <Button 
            onClick={() => withLoading(
              simulateOperation(1500, true), 
              'Attempting operation...'
            )}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Auto Error (1.5s)
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Example 2: Progress tracking
export function ProgressExample() {
  const { showLoading, setProgress, showSuccess, hideLoading } = useLoading()

  const simulateUpload = async () => {
    showLoading('Uploading file...')
    
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i)
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    showSuccess('File uploaded successfully!')
  }

  const simulateDownload = async () => {
    showLoading('Downloading file...')
    
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i)
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    showSuccess('Download complete!')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Tracking</CardTitle>
        <CardDescription>
          Demonstrate progress bars during long operations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={simulateUpload}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Simulate Upload
          </Button>
          
          <Button 
            onClick={simulateDownload}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Simulate Download
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Example 3: Page-level loading
export function PageLoadingExample() {
  const [pageLoading, setPageLoading] = useState(false)
  const [data, setData] = useState<string | null>(null)
  const { withLoading } = usePageLoading()

  const loadData = async () => {
    setPageLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setData('Data loaded successfully!')
    } catch (error) {
      setData(null)
    } finally {
      setPageLoading(false)
    }
  }

  const clearData = () => {
    setData(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Page-Level Loading</CardTitle>
        <CardDescription>
          Demonstrate page loading with PageLoaderWrapper
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PageLoaderWrapper 
          isLoading={pageLoading} 
          message="Loading page data..."
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={loadData}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Load Data
              </Button>
              
              <Button 
                onClick={clearData}
                variant="outline"
              >
                Clear Data
              </Button>
            </div>
            
            {data && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">{data}</p>
              </div>
            )}
            
            {!data && !pageLoading && (
              <div className="p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">No data loaded</p>
              </div>
            )}
          </div>
        </PageLoaderWrapper>
      </CardContent>
    </Card>
  )
}

// Example 4: HOC Pattern
const DataDisplay = ({ data }: { data?: string }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">HOC Loading Example</h3>
    {data ? (
      <div className="p-4 bg-muted rounded-lg">
        <p>{data}</p>
      </div>
    ) : (
      <div className="p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    )}
  </div>
)

const DataDisplayWithLoading = withPageLoader(DataDisplay, 'Loading data...')

export function HOCExample() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<string>('')

  const loadData = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setData('Data loaded via HOC pattern!')
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Higher-Order Component Pattern</CardTitle>
        <CardDescription>
          Demonstrate the withPageLoader HOC
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={loadData} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Load with HOC
        </Button>
        
        <DataDisplayWithLoading isLoading={loading} data={data} />
      </CardContent>
    </Card>
  )
}

// Main examples container
export function LoadingExamples() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Unified Loading System Examples</h1>
        <p className="text-muted-foreground">
          Interactive examples demonstrating the LogoLoader-based loading system
        </p>
      </div>
      
      <div className="grid gap-6">
        <BasicLoadingExample />
        <ProgressExample />
        <PageLoadingExample />
        <HOCExample />
      </div>
    </div>
  )
}