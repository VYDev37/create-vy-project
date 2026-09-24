# GORM Patterns & Best Practices

## 1. Connection & Migration
- Open connections using `gorm.Open(postgres.Open(dsn), &gorm.Config{})` or `sqlite.Open(dsn)`.
- Run migrations via `db.AutoMigrate(&models.User{}, ...)` inside `internal/scripts/auto_migrate.go`.

## 2. Repositories & Encapsulation
- Keep all database queries encapsulated inside `internal/repositories/`.
- Handle errors gracefully and propagate domain/SQL errors up to the service layer.
- Use explicit struct pointers and avoid raw untyped queries where possible.

---

## 3. Database Transactions (`db.Transaction`)
When a business operation touches multiple tables or requires multi-step atomic integrity (e.g., User + Profile creation, Order + Payment status), always wrap the operation in a transaction block:

```go
func (s *userService) RegisterWithProfile(req RegisterRequest) error {
    return s.db.Transaction(func(tx *gorm.DB) error {
        // Create user within transaction
        user := models.User{
            Username: req.Username,
            Email:    req.Email,
            Password: req.Password,
        }
        if err := tx.Create(&user).Error; err != nil {
            return err // Auto-rollback
        }

        // Create associated profile/wallet within transaction
        profile := models.Profile{
            UserID: user.ID,
            Bio:    "Default bio",
        }
        if err := tx.Create(&profile).Error; err != nil {
            return err // Auto-rollback
        }

        return nil // Auto-commit
    })
}
```

---

## 4. Concurrency Control: Optimistic vs. Pessimistic

Do **NOT** default to pessimistic locking everywhere. Choose the appropriate strategy based on contention and business risk:

### A. Optimistic Concurrency Control (OCC) - Recommended for Low Contention
Use OCC for low-to-medium contention resources (e.g., profile edits, settings, document drafting, blog posts). OCC avoids blocking other transactions and prevents deadlocks.

**Model Definition:**
```go
type Document struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    Title     string    `json:"title"`
    Content   string    `json:"content"`
    Version   int       `gorm:"default:1" json:"version"` // OCC version tag
    UpdatedAt time.Time `json:"updated_at"`
}
```

**OCC Update Implementation:**
```go
func (r *documentRepository) UpdateWithOCC(doc *models.Document, expectedVersion int) error {
    result := r.db.Model(&models.Document{}).
        Where("id = ? AND version = ?", doc.ID, expectedVersion).
        Updates(map[string]interface{}{
            "title":   doc.Title,
            "content": doc.Content,
            "version": expectedVersion + 1,
        })

    if result.Error != nil {
        return result.Error
    }
    if result.RowsAffected == 0 {
        return errors.New("conflict: record was modified by another request (OCC conflict)")
    }
    return nil
}
```

### B. Pessimistic Concurrency Control (PCC) - Strictly for High-Contention Critical Assets
Use `SELECT ... FOR UPDATE` only for critical zero-sum, high-contention operations (e.g., wallet balance deductions, limited flash-sale stock, flight/cinema seat bookings).

**PCC Implementation with GORM:**
```go
import "gorm.io/gorm/clause"

func (s *walletService) DeductBalance(userID uint, amount float64) error {
    return s.db.Transaction(func(tx *gorm.DB) error {
        var wallet models.Wallet

        // Acquire row-level lock (SELECT ... FOR UPDATE)
        if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
            Where("user_id = ?", userID).
            First(&wallet).Error; err != nil {
            return err
        }

        if wallet.Balance < amount {
            return errors.New("insufficient balance")
        }

        wallet.Balance -= amount
        if err := tx.Save(&wallet).Error; err != nil {
            return err
        }

        // Record ledger entry in same transaction
        transactionRecord := models.LedgerEntry{
            WalletID: wallet.ID,
            Amount:   -amount,
            Type:     "DEBIT",
        }
        return tx.Create(&transactionRecord).Error
    })
}
```

---

## 4. Database Indexing Strategy (When to Index vs When NOT to Index)

Indexes are critical for read query latency, but each index adds significant write overhead (`INSERT`, `UPDATE`, `DELETE`) and memory consumption (RAM).

### When to Index (High Value)
1. **Primary & Foreign Keys:**
   - Always index foreign key columns (e.g. `user_id`, `tenant_id`, `order_id`) used in `JOIN` conditions or `ON DELETE CASCADE`.
   - GORM: `gorm:"index"` or `gorm:"primaryKey"`
2. **Frequently Filtered Columns in `WHERE` Clauses (High Cardinality):**
   - Columns with many distinct values (e.g., `email`, `username`, `slug`, `uuid`).
   - GORM: `gorm:"size:255;not null;uniqueIndex"`
3. **Columns Used for Ordering (`ORDER BY`) and Range Queries:**
   - Sorting by timestamp in paginated feeds (e.g., `created_at DESC` or `deleted_at`).
   - GORM: `gorm:"index:idx_created_at"` or `gorm:"index"` on `DeletedAt`.
4. **Composite (Multi-Column) Indexes:**
   - When queries frequently filter on multiple fields together (e.g., `WHERE tenant_id = ? AND status = ?`).
   - **Leftmost Prefix Rule:** Index `(tenant_id, status)` can satisfy queries on `tenant_id` and `(tenant_id, status)`, but NOT `status` alone.
   - GORM: `gorm:"index:idx_tenant_status,priority:1"` on `TenantID`, `priority:2` on `Status`.

### When NOT to Index (Avoid Index Bloat)
1. **Low-Cardinality Columns Alone:**
   - Boolean columns (e.g., `is_active`, `is_verified`, `gender`) where 50%+ of rows share the same value. The query planner will skip index scan and perform a sequential table scan anyway. (Exception: composite index `(tenant_id, is_active)`).
2. **Small or Static Tables:**
   - Tables with fewer than a few hundred rows (e.g. lookup codes, roles). A full table scan in memory is faster than traversing B-tree index blocks.
3. **Frequently Updated / High-Throughput Write Columns:**
   - Columns updated on every request (e.g. `last_active_at`, `view_count`, `retry_attempts`). Updating an indexed column forces the DB engine to re-balance B-trees on disk.
4. **Large Text or Blob Columns Without Prefix:**
   - Do NOT index arbitrary long `VARCHAR(1000+)` or `TEXT` fields directly. Use prefix indexing or full-text search indexes (`GIN` / `GiST` in PostgreSQL).

