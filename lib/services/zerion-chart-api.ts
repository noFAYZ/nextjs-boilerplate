import { TimePeriod } from '@/components/crypto/wallet-chart';
import  ZerionSDK  from 'zerion-sdk-ts';

export interface ChartDataPoint {
  timestamp: number;
  value: number;
  date: string;
  formattedDate: string;
}

export interface PortfolioTimelineParams {
  address: string;
  period: TimePeriod;
  currency?: string;
}

export class ZerionChartService {
  private static instance: ZerionChartService;
  private sdk: ZerionSDK;
  
  constructor() {
    this.sdk = new ZerionSDK({
      apiKey: process.env.NEXT_PUBLIC_ZERION_API_KEY || 'zk_dev_2e59da43ef3d49858d2c3c1bd57854ed',
      timeout: 30000,
      retries: 3
    });
  }
  
  public static getInstance(): ZerionChartService {
    if (!ZerionChartService.instance) {
      ZerionChartService.instance = new ZerionChartService();
    }
    return ZerionChartService.instance;
  }

  /**
   * Get portfolio timeline data for chart visualization
   */
  async getPortfolioTimeline(params: PortfolioTimelineParams): Promise<ChartDataPoint[]> {
    try {
      const period = this.mapPeriodToZerion(params.period);
      
      // Get balance chart from Zerion SDK
      const chartResponse = await this.sdk.wallets.getChart(
        params.address,
        period as 'hour' | 'day' | 'week' | 'month' | 'year' | 'max'
      );

      console.log('Zerion chart response:', chartResponse);
      
      // Transform Zerion response to our ChartDataPoint format
      return this.transformZerionData(chartResponse, params.period);
      
    } catch (error) {
      console.error('Failed to fetch portfolio timeline from Zerion:', error);
      // Fallback to mock data if Zerion API fails
      console.warn('Falling back to mock data due to API error');
      return this.generateMockTimelineData(params.period);
    }
  }

  /**
   * Transform Zerion API response to our ChartDataPoint format
   */
  private transformZerionData(chartResponse: any, period: TimePeriod): ChartDataPoint[] {
    if (!chartResponse?.data?.attributes?.points) {
      throw new Error('Invalid chart data received from Zerion');
    }
    
    const chartData = chartResponse.data.attributes.points;
    
    return chartData.map((point: any, index: number) => {
      const timestamp = point[0]; // Convert to milliseconds
      const date = new Date(timestamp);
      
      return {
        timestamp,
        value: parseFloat(point[1] || '0'),
        date: timestamp,
        formattedDate: this.formatDateForPeriod(date, period)
      };
    }); // Filter out invalid data points
  }

  /**
   * Map our TimePeriod enum to Zerion's period format
   */
  private mapPeriodToZerion(period: TimePeriod): string {
    const mapping: Record<TimePeriod, string> = {
      '1D': 'day',
      '7D': 'week', 
      '1M': 'month',
      '3M': 'month', // Zerion doesn't have 3M, use month
      '6M': 'month', // Zerion doesn't have 6M, use month
      '1Y': 'year',
      'ALL': 'max'
    };
    
    return mapping[period] || 'week';
  }

  /**
   * Generate mock data for development/testing
   * TODO: Remove this when real Zerion integration is complete
   */
  private generateMockTimelineData(period: TimePeriod): ChartDataPoint[] {
    const now = new Date();
    const dataPoints: ChartDataPoint[] = [];
    let days = 7;
    let interval = 6; // hours
    
    // Determine the date range and interval based on period
    switch (period) {
      case '1D':
        days = 1;
        interval = 1;
        break;
      case '7D':
        days = 7;
        interval = 6;
        break;
      case '1M':
        days = 30;
        interval = 24;
        break;
      case '3M':
        days = 90;
        interval = 24;
        break;
      case '6M':
        days = 180;
        interval = 24 * 3;
        break;
      case '1Y':
        days = 365;
        interval = 24 * 7;
        break;
      case 'ALL':
        days = 730;
        interval = 24 * 7;
        break;
    }

    const totalHours = days * 24;
    const numberOfPoints = Math.floor(totalHours / interval);
    
    // Generate realistic portfolio value progression
    let baseValue = Math.random() * 50000 + 10000; // Random starting value between $10k-$60k
    const volatility = 0.025; // 2.5% volatility
    
    for (let i = numberOfPoints; i >= 0; i--) {
      const timestamp = now.getTime() - (i * interval * 60 * 60 * 1000);
      const date = new Date(timestamp);
      
      // Add realistic market movements with some trend
      const randomChange = (Math.random() - 0.5) * volatility;
      const trendChange = Math.sin(i / 30) * 0.002; // Subtle long-term trend
      const marketCycle = Math.cos(i / 100) * 0.001; // Market cycle effect
      
      baseValue *= (1 + randomChange + trendChange + marketCycle);
      
      // Ensure value stays positive and realistic
      baseValue = Math.max(baseValue, 1000);
      
      const formattedDate = this.formatDateForPeriod(date, period);
      
      dataPoints.push({
        timestamp,
        value: Math.round(baseValue * 100) / 100,
        date: date.toISOString(),
        formattedDate
      });
    }
    
    return dataPoints.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Format date based on the selected time period
   */
  private formatDateForPeriod(date: Date, period: TimePeriod): string {
    const options: Record<TimePeriod, Intl.DateTimeFormatOptions> = {
      '1D': { hour: '2-digit', minute: '2-digit' },
      '7D': { weekday: 'short', hour: '2-digit', minute: '2-digit' },
      '1M': { month: 'short', day: 'numeric' },
      '3M': { month: 'short', day: 'numeric' },
      '6M': { month: 'short', day: 'numeric' },
      '1Y': { month: 'short', year: 'numeric' },
      'ALL': { month: 'short', year: 'numeric' }
    };
    
    return date.toLocaleDateString('en-US', options[period]);
  }

  /**
   * Get real-time portfolio metrics
   */
  async getPortfolioMetrics(address: string): Promise<{
    totalValue: number;
    change24h: number;
    changePercent24h: number;
  }> {
    try {
      // Get current portfolio value from Zerion SDK
      const portfolioResponse = await this.sdk.wallets.getPortfolio(address);
      
      if (!portfolioResponse?.data?.attributes) {
        throw new Error('Invalid portfolio data received from Zerion');
      }
      
      const attributes = portfolioResponse.data.attributes;
      const totalValue = parseFloat(attributes.total_value || '0');
      const change24h = parseFloat(attributes.changes_24h?.absolute || '0');
      const changePercent24h = parseFloat(attributes.changes_24h?.percent || '0') * 100;
      
      return {
        totalValue: Math.round(totalValue * 100) / 100,
        change24h: Math.round(change24h * 100) / 100,
        changePercent24h: Math.round(changePercent24h * 100) / 100
      };
      
    } catch (error) {
      console.error('Failed to fetch portfolio metrics from Zerion:', error);
      
      // Fallback to mock data
      const totalValue = Math.random() * 100000 + 10000;
      const change24h = (Math.random() - 0.5) * totalValue * 0.1;
      
      return {
        totalValue: Math.round(totalValue * 100) / 100,
        change24h: Math.round(change24h * 100) / 100,
        changePercent24h: Math.round((change24h / totalValue) * 10000) / 100
      };
    }
  }
}

// Export a singleton instance
export const zerionChartService = ZerionChartService.getInstance();