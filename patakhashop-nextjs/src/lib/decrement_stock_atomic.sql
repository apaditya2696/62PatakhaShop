-- ============================================================================
-- Atomic Stock Decrement RPC Function for Supabase / PostgreSQL
-- Prevents race conditions and overselling during peak Diwali traffic.
-- ============================================================================

CREATE OR REPLACE FUNCTION decrement_stock_atomic(
  p_product_id TEXT,
  p_quantity INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_stock INT;
  v_updated_stock INT;
BEGIN
  -- 1. Lock the product row for update to prevent concurrent race conditions
  SELECT stock INTO v_current_stock
  FROM products
  WHERE id = p_product_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'PRODUCT_NOT_FOUND',
      'message', 'Product with ID ' || p_product_id || ' does not exist.'
    );
  END IF;

  -- 2. Check if sufficient stock is available
  IF v_current_stock < p_quantity THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'INSUFFICIENT_STOCK',
      'current_stock', v_current_stock,
      'requested_quantity', p_quantity,
      'message', 'Only ' || v_current_stock || ' items remaining in stock.'
    );
  END IF;

  -- 3. Atomically decrement stock
  UPDATE products
  SET stock = stock - p_quantity,
      in_stock = (stock - p_quantity > 0),
      updated_at = NOW()
  WHERE id = p_product_id
  RETURNING stock INTO v_updated_stock;

  RETURN jsonb_build_object(
    'success', true,
    'product_id', p_product_id,
    'previous_stock', v_current_stock,
    'new_stock', v_updated_stock,
    'in_stock', (v_updated_stock > 0)
  );
END;
$$;
