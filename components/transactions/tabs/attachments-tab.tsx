'use client';

import { TransactionAttachments } from '@/app/(protected)/accounts/components';
import type { UnifiedTransaction } from '@/lib/types';

interface AttachmentsTabProps {
  transaction: UnifiedTransaction;
}

export function AttachmentsTab({ transaction }: AttachmentsTabProps) {
  return (
    <div className="space-y-4">
      <TransactionAttachments
        transactionId={transaction.id}
        onUpload={async (file) => {
          console.log('Upload attachment:', file);
        }}
        onDelete={async (attachmentId) => {
          console.log('Delete attachment:', attachmentId);
        }}
      />
    </div>
  );
}
