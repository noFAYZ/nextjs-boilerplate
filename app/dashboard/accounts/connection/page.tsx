'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Eye, User, FileText, Upload } from 'lucide-react';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PhUser } from '@/components/icons';
import { HugeiconsCsv01, HugeiconsUpload03 } from '@/components/icons/icons';

export default function IntegrationNewPage() {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [activeTab, setActiveTab] = useState('api-sync');

  const handleConnect = () => {
    console.log('Connecting with:', { apiKey, apiSecret });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      {/* Main Card */}
      <Card>
        <CardContent className="px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}
          >
            <TabsList   variant={'outline'}>
              <TabsTrigger
                value="api-sync"
              variant={'outline'}
              size={'sm'}
              >
                API Sync
              </TabsTrigger>
              <TabsTrigger
                value="csv"
                variant={'outline'}
                size={'sm'}
              >
                CSV
              </TabsTrigger>
              <TabsTrigger
                value="oauth"
                variant={'outline'}
                size={'sm'}
              >
                OAuth
              </TabsTrigger>
            </TabsList>

            {/* API Sync Tab */}
            <TabsContent value="api-sync" className="mt-6 space-y-6">
              <div className="space-y-4">
                {/* API Key Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">API Key</label>
                  <div className="relative">
                    <Input
                      placeholder="Enter here"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="pr-20"
                    />
                    <Button className="absolute right-6 top-1/2 -translate-y-1/2 text-sm  font-medium" variant={'link'}>
                      Paste
                    </Button>
                  </div>
                </div>

                {/* API Secret Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">API Secret</label>
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="Enter here"
                      value={apiSecret}
                      onChange={(e) => setApiSecret(e.target.value)}
                      className="pr-20"
                    />
                    <Button className="absolute right-6 top-1/2 -translate-y-1/2 text-sm  font-medium" variant={'link'}>
                      Paste
                    </Button>
                  </div>
                </div>

                {/* Connect Button */}
                <div className='flex justify-center'>   <Button
                  className=" mt-4"
                  size="sm"
                  disabled={!apiKey || !apiSecret}
                  onClick={handleConnect}
                >
                  Connect
                </Button></div>
             
              </div>

              {/* Security Features */}
              <div className="space-y-2 mt-8">
                <div className="flex items-start gap-3 p-2 bg-muted/30 rounded-xl border border-border">
                  <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm ">Secure Connection</h3>
                    <p className="text-xs text-muted-foreground">
                      All data is exchanged over a secure, encrypted connection to protect your information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 bg-muted/30 rounded-xl border border-border">
                  <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <Eye className="h-5 w-5 " />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Read-Only Access</h3>
                    <p className="text-xs text-muted-foreground">
                      This integration has read-only access and cannot make changes to your account or move funds.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 bg-muted/30 rounded-xl border border-border">
                  <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <PhUser className="h-5 w-5 " />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">User-Controlled Permissions</h3>
                    <p className="text-xs text-muted-foreground">
                      You are in control. You can review and revoke access at any time from your account settings.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* CSV Tab */}
            <TabsContent value="csv" className="mt-6 space-y-6">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <HugeiconsCsv01 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Upload CSV File</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop your Coinbase transaction CSV file here, or click to browse
                  </p>
                  <Button variant="outline" size="xs">
                    <HugeiconsUpload03 className="h-4 w-4 mr-1" />
                    Select File
                  </Button>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-sm">How to export from Coinbase:</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Log in to your Coinbase account</li>
                    <li>Go to Settings → Reports</li>
                    <li>Select the date range you want to export</li>
                    <li>Click "Generate Report" and download the CSV file</li>
                    <li>Upload the CSV file here</li>
                  </ol>
                </div>
              </div>
            </TabsContent>

            {/* OAuth Tab */}
            <TabsContent value="oauth" className="mt-6 space-y-6">
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="mx-auto h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 " />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Connect with OAuth</h3>
                  <p className="text-xs text-muted-foreground mb-6 max-w-md mx-auto">
                    The most secure way to connect your Coinbase account. You&apos;ll be redirected to Coinbase to authorize access.
                  </p>
                  <Button size="sm" className="">
                    <Shield className="h-4 w-4 mr-1" />
                    Connect with Coinbase
                  </Button>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Why OAuth is more secure:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>No need to share API keys or passwords</li>
                    <li>Coinbase controls and manages the connection</li>
                    <li>Easy to revoke access from Coinbase settings</li>
                    <li>Automatic token refresh for uninterrupted access</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

 
      <Accordion type="single" collapsible className="w-full" >
  <AccordionItem value="instructions" >
    <AccordionTrigger className="text-base font-semibold bg-background border border-border  px-4" >
      Step-by-Step Instructions
    </AccordionTrigger>
    <AccordionContent>
      <Card className="border-border">
        <CardContent className="pt-4">
          <ol className="space-y-4">
            <li className="flex gap-4">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                1
              </div>
              <p className="text-sm">Login to your Coinbase account.</p>
            </li>

            <li className="flex gap-4">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                2
              </div>
              <p className="text-sm">
                Click on your Profile icon and go to the Settings.
              </p>
            </li>

            <li className="flex gap-4">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                3
              </div>
              <p className="text-sm">In Settings open the API Keys Tab.</p>
            </li>

            <li className="flex gap-4">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                4
              </div>
              <p className="text-sm">
                In Secret API Keys section click on the Create API Key button.
              </p>
            </li>

            <li className="flex gap-4">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                5
              </div>
              <p className="text-sm">Set API key nickname.</p>
            </li>

            <li className="flex gap-4">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                6
              </div>
              <p className="text-sm">
                Keep the ED25519 option as Signature algorithm.
              </p>
            </li>

            <li className="flex gap-4">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                7
              </div>
              <p className="text-sm">Click the Create and Download button.</p>
            </li>

            <li className="flex gap-4">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                8
              </div>
              <p className="text-sm">
                Copy/paste your API key and API Secret into CoinStats.
              </p>
            </li>
          </ol>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground text-center">
              Problems with connection?{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 underline font-medium"
              >
                Contact Support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </AccordionContent>
  </AccordionItem>
</Accordion>


    </div>
  );
}
