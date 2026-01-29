'use client';

/**
 * Forecast Envelope Selector Component
 * Allows users to select which envelope to view forecast for
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';

interface Envelope {
  id: string;
  name: string;
  type: string;
  currentBalance?: number;
  budgetLimit?: number;
}

interface ForecastEnvelopeSelectorProps {
  envelopes: Envelope[];
  selectedEnvelopeId?: string | null;
  onSelect: (envelopeId: string) => void;
  isLoading?: boolean;
}

export function ForecastEnvelopeSelector({
  envelopes,
  selectedEnvelopeId,
  onSelect,
  isLoading = false,
}: ForecastEnvelopeSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEnvelopes = (envelopes || []).filter((env) =>
    env.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    env.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedEnvelope = (envelopes || []).find((e) => e.id === selectedEnvelopeId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Envelope</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search envelopes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Current Selection */}
        {selectedEnvelope && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Selected</p>
            <p className="font-semibold">{selectedEnvelope.name}</p>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <Badge variant="outline">{selectedEnvelope.type}</Badge>
              <span className="text-muted-foreground">
                Balance: ${selectedEnvelope.currentBalance?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        )}

        {/* Envelope List */}
        <ScrollArea className="h-96 border rounded-lg p-4">
          <div className="space-y-2">
            {filteredEnvelopes.length > 0 ? (
              filteredEnvelopes.map((envelope) => (
                <button
                  key={envelope.id}
                  onClick={() => onSelect(envelope.id)}
                  disabled={isLoading}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedEnvelopeId === envelope.id
                      ? 'bg-primary text-primary-foreground border border-primary'
                      : 'bg-secondary hover:bg-secondary/80 border border-secondary'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{envelope.name}</p>
                      <p className="text-xs opacity-75 mt-1">{envelope.type}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        ${envelope.currentBalance?.toFixed(2) || '0.00'}
                      </p>
                      {envelope.budgetLimit && (
                        <p className="text-xs opacity-75">
                          of ${envelope.budgetLimit.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  {envelope.budgetLimit && envelope.currentBalance !== undefined && (
                    <div className="mt-2 h-1.5 bg-background/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/50"
                        style={{
                          width: `${Math.min(
                            (envelope.currentBalance / envelope.budgetLimit) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No envelopes found</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Info */}
        <p className="text-xs text-muted-foreground text-center">
          {(envelopes || []).length} envelope{(envelopes || []).length !== 1 ? 's' : ''} available
        </p>
      </CardContent>
    </Card>
  );
}
