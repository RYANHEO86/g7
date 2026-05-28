import { addSelectedItemIfCompleteHandler, updateSelectedItemQuantityHandler } from './productOptions';
import { toggleCartItemSelectionHandler, selectAllCartItemsHandler, setCartOptionHandler, openCartDeleteModalHandler, openCartOptionModalHandler, recalculateCartHandler } from './cartHandlers';
import { findMatchingOptionHandler, initCartOptionSelectionHandler } from './cartOptionChange';
import { initCartKeyHandler, getCartKeyHandler, clearCartKeyHandler, regenerateCartKeyHandler, saveToStorageHandler, loadFromStorageHandler } from './storageHandlers';
import { getDisplayPriceHandler } from './getDisplayPrice';
import { formatCurrencyHandler, getCurrencySymbol } from './formatCurrency';
import { loadPreferredCurrencyHandler, savePreferredCurrencyHandler } from './loadPreferredCurrency';
import { setThemeHandler, initThemeHandler } from './setThemeHandler';
/**
 * ryan-offset 템플릿의 모든 커스텀 핸들러
 *
 * 네이밍 규칙: 'ryan-offset.[핸들러명]'
 *
 * @example
 * // 레이아웃 JSON에서 사용
 * {
 *   "handler": "custom",
 *   "name": "addSelectedItemIfComplete",
 *   "params": { ... }
 * }
 *
 * // 또는 풀네임으로
 * {
 *   "handler": "ryan-offset.addSelectedItemIfComplete",
 *   "params": { ... }
 * }
 */
export declare const handlers: {
    'ryan-offset.addSelectedItemIfComplete': typeof addSelectedItemIfCompleteHandler;
    'ryan-offset.updateSelectedItemQuantity': typeof updateSelectedItemQuantityHandler;
    'ryan-offset.getDisplayPrice': typeof getDisplayPriceHandler;
    'ryan-offset.formatCurrency': typeof formatCurrencyHandler;
    'ryan-offset.getCurrencySymbol': typeof getCurrencySymbol;
    'ryan-offset.loadPreferredCurrency': typeof loadPreferredCurrencyHandler;
    'ryan-offset.savePreferredCurrency': typeof savePreferredCurrencyHandler;
    setTheme: typeof setThemeHandler;
    initTheme: typeof initThemeHandler;
    toggleCartItemSelection: typeof toggleCartItemSelectionHandler;
    selectAllCartItems: typeof selectAllCartItemsHandler;
    setCartOption: typeof setCartOptionHandler;
    openCartDeleteModal: typeof openCartDeleteModalHandler;
    openCartOptionModal: typeof openCartOptionModalHandler;
    recalculateCart: typeof recalculateCartHandler;
    findMatchingOption: typeof findMatchingOptionHandler;
    initCartOptionSelection: typeof initCartOptionSelectionHandler;
    initCartKey: typeof initCartKeyHandler;
    getCartKey: typeof getCartKeyHandler;
    clearCartKey: typeof clearCartKeyHandler;
    regenerateCartKey: typeof regenerateCartKeyHandler;
    saveToStorage: typeof saveToStorageHandler;
    loadFromStorage: typeof loadFromStorageHandler;
};
/**
 * 핸들러 맵 (handlerMap alias)
 *
 * index.ts에서 import할 때 사용
 */
export declare const handlerMap: {
    'ryan-offset.addSelectedItemIfComplete': typeof addSelectedItemIfCompleteHandler;
    'ryan-offset.updateSelectedItemQuantity': typeof updateSelectedItemQuantityHandler;
    'ryan-offset.getDisplayPrice': typeof getDisplayPriceHandler;
    'ryan-offset.formatCurrency': typeof formatCurrencyHandler;
    'ryan-offset.getCurrencySymbol': typeof getCurrencySymbol;
    'ryan-offset.loadPreferredCurrency': typeof loadPreferredCurrencyHandler;
    'ryan-offset.savePreferredCurrency': typeof savePreferredCurrencyHandler;
    setTheme: typeof setThemeHandler;
    initTheme: typeof initThemeHandler;
    toggleCartItemSelection: typeof toggleCartItemSelectionHandler;
    selectAllCartItems: typeof selectAllCartItemsHandler;
    setCartOption: typeof setCartOptionHandler;
    openCartDeleteModal: typeof openCartDeleteModalHandler;
    openCartOptionModal: typeof openCartOptionModalHandler;
    recalculateCart: typeof recalculateCartHandler;
    findMatchingOption: typeof findMatchingOptionHandler;
    initCartOptionSelection: typeof initCartOptionSelectionHandler;
    initCartKey: typeof initCartKeyHandler;
    getCartKey: typeof getCartKeyHandler;
    clearCartKey: typeof clearCartKeyHandler;
    regenerateCartKey: typeof regenerateCartKeyHandler;
    saveToStorage: typeof saveToStorageHandler;
    loadFromStorage: typeof loadFromStorageHandler;
};
/**
 * 핸들러 타입 정의 (TypeScript 자동완성용)
 */
export type RyanOffsetHandlers = typeof handlers;
export { addSelectedItemIfCompleteHandler, updateSelectedItemQuantityHandler, getDisplayPriceHandler, formatCurrencyHandler, getCurrencySymbol, loadPreferredCurrencyHandler, savePreferredCurrencyHandler, setThemeHandler, initThemeHandler, toggleCartItemSelectionHandler, selectAllCartItemsHandler, setCartOptionHandler, openCartDeleteModalHandler, openCartOptionModalHandler, recalculateCartHandler, findMatchingOptionHandler, initCartOptionSelectionHandler, initCartKeyHandler, getCartKeyHandler, clearCartKeyHandler, regenerateCartKeyHandler, saveToStorageHandler, loadFromStorageHandler, };
