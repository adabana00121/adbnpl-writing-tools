import { useState, useMemo } from "react";

/**
 * 收據資料管理 Hook
 * 負責處理項目增刪改、總金額計算
 */
const useReceiptGenerator = (initialItems = []) => {
  const [items, setItems] = useState(
    initialItems.length > 0
      ? initialItems
      : [{ id: 1, name: "短篇小說 / 同人", count: 3500, price: 0.5 }]
  );

  // 新增項目
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), name: "新增項目", count: 1, price: 0 },
    ]);
  };

  // 移除項目
  const removeItem = (id) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  // 更新項目內容
  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // 計算總金額 (自動依賴 items 更新)
  const totalPrice = useMemo(() => {
    return items.reduce((acc, item) => {
      const count = parseFloat(item.count) || 0;
      const price = parseFloat(item.price) || 0;
      return acc + count * price;
    }, 0);
  }, [items]);

  return {
    items,
    totalPrice,
    addItem,
    removeItem,
    updateItem,
  };
};

export default useReceiptGenerator;
