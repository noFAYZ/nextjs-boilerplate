# Archived Code - MoneyMappr Frontend

This directory contains archived code that has been replaced or is no longer in use.
Files are preserved here (not deleted) for reference and potential rollback.

## Archive Date: 2026-01-28

### Budget Versions

#### budgets-v2/ (ARCHIVED)
- **Archived**: 2026-01-28
- **Reason**: Replaced by budgets-v3 hybrid YNAB/Monarch approach
- **Contains**: Envelope-focused budget implementation with envelope UI store
- **Safe to delete after**: 2026-03-28 (60 days)
- **Git commit before archival**: [see below]
- **Status**: Production moved to budgets-v3

**Archived components**:
- `components-budgets-v2/`: All budgets-v2 components (envelope-modal, dialogs, etc.)
- `app-budgets-v2/`: Budgets-v2 page and routing

### Backup Files

#### pages/
- **budgets-v2-page.backup.tsx**: Development backup from budgets-v2 page
- **budgets-v3-page.old.tsx**: Previous version of budgets-v3 page
- **Safe to delete after**: 2026-02-28 (30 days)

## Recovery Instructions

If you need to restore any code:

1. **Check git history** for the last commit before archival:
   ```bash
   git log --oneline --all -- app/\(protected\)/budgets-v2
   git log --oneline --all -- components/budgets-v2
   ```

2. **Copy files back** from UNUSED to original location:
   ```bash
   # Example: restore budgets-v2
   cp -r UNUSED/budget-versions/app-budgets-v2 app/\(protected\)/budgets-v2
   cp -r UNUSED/budget-versions/components-budgets-v2 components/budgets-v2
   ```

3. **Test thoroughly** before committing:
   ```bash
   npm run build
   npm run dev
   # Test budget routes and functionality
   ```

## Why Archived?

**budgets-v3** provides:
- ✅ Modern YNAB/Monarch hybrid approach
- ✅ Income allocation workflow
- ✅ Enhanced insights and analytics
- ✅ Better UX with drawer-based category details
- ✅ Streamlined category management

**budgets-v2** used:
- ❌ Envelope-only approach
- ❌ Complex envelope-specific state management
- ❌ Older UI patterns
- ❌ Limited analytics

## File Structure

```
UNUSED/
├── README.md (this file)
├── pages/
│   ├── budgets-v2-page.backup.tsx
│   └── budgets-v3-page.old.tsx
└── budget-versions/
    ├── app-budgets-v2/
    │   └── (entire budgets-v2 app directory)
    └── components-budgets-v2/
        └── (entire budgets-v2 components directory)
```

## Notes

- All archived code is preserved in git history
- No functionality is lost - everything from v2 exists in v3 or base budgets page
- Cleanup timeline: safe to permanently delete March 28, 2026
- Questions? Check git log for migration details
