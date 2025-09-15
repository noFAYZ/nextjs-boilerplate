import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('SSE endpoint called');

  // Get auth token from query params for testing
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  console.log('SSE auth token received:', token ? 'Present' : 'Missing');

  // Create SSE response
  const encoder = new TextEncoder();

  const customReadable = new ReadableStream({
    start(controller) {
      console.log('SSE stream started');

      // Send connection established message
      const connectionMessage = {
        type: 'connection_established',
        timestamp: new Date().toISOString(),
        message: 'SSE connection established'
      };

      const data = `data: ${JSON.stringify(connectionMessage)}\n\n`;
      controller.enqueue(encoder.encode(data));

      // Send heartbeat every 30 seconds
      const heartbeatInterval = setInterval(() => {
        try {
          const heartbeatMessage = {
            type: 'heartbeat',
            timestamp: new Date().toISOString()
          };

          const heartbeatData = `data: ${JSON.stringify(heartbeatMessage)}\n\n`;
          controller.enqueue(encoder.encode(heartbeatData));
          console.log('SSE heartbeat sent');
        } catch (error) {
          console.log('SSE heartbeat failed, closing stream:', error);
          clearInterval(heartbeatInterval);
          controller.close();
        }
      }, 30000);

      // Send test sync message after 5 seconds
      setTimeout(() => {
        try {
          const testMessage = {
            type: 'wallet_sync_progress',
            walletId: 'test-wallet',
            progress: 50,
            status: 'syncing',
            message: 'Test sync in progress',
            timestamp: new Date().toISOString()
          };

          const testData = `data: ${JSON.stringify(testMessage)}\n\n`;
          controller.enqueue(encoder.encode(testData));
          console.log('SSE test message sent');
        } catch (error) {
          console.log('SSE test message failed:', error);
        }
      }, 5000);

      // Clean up on close
      request.signal.addEventListener('abort', () => {
        console.log('SSE connection aborted');
        clearInterval(heartbeatInterval);
        controller.close();
      });
    }
  });

  return new NextResponse(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}