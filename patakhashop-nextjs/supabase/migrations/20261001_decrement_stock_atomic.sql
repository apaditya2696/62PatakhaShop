-- ============================================================
-- Migration: 20261001_decrement_stock_atomic.sql
-- Description: Postgres RPC Function for Atomic Stock Decrements
-- Prevents race conditions and overselling during flash sales
-- ============================================================

CREATE OR REPLACE FUNCTION decrement_stock_atomic(
  p_id TEXT,
  p_qty INT
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  in_stock BOOLEAN,
  stock_quantity INT
) AS $$
BEGIN
  RETURN QUERY
  UPDATE products
  SET stock_quantity = stock_quantity - p_qty,
      in_stock = CASE WHEN (stock_quantity - p_qty) > 0 THEN true ELSE false END
  WHERE products.id = p_id
    AND products.stock_quantity >= p_qty
    AND products.in_stock = true
  RETURNING products.id, products.name, products.in_stock, products.stock_quantity;
END;
$$ LANGUAGE plpgsql;
