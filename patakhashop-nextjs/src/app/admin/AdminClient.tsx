'use client'

import React, { useState, useEffect, useMemo, useRef, useTransition, memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import CustomSelect from '@/components/CustomSelect'
import PwaInstallBanner from '@/components/PwaInstallBanner'
import styles from './AdminClient.module.css'

function StatusSelect({
  status,
  onSelect,
  lang = 'en',
}: {
  status: string
  onSelect: (newStatus: string) => void
  lang?: 'en' | 'hi'
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const isHi = lang === 'hi'
  const STATUS_OPTIONS = [
    { value: 'pending', label: isHi ? 'लंबित (पेंडिंग)' : 'Pending', colorClass: styles.status_pending },
    { value: 'confirmed', label: isHi ? 'भुगतान प्राप्त (कन्फर्म)' : 'Confirmed & Paid', colorClass: styles.status_confirmed },
    { value: 'delivered', label: isHi ? 'डिलीवर हो गया' : 'Delivered', colorClass: styles.status_delivered },
    { value: 'cancelled', label: isHi ? 'रद्द कर दिया' : 'Cancelled', colorClass: styles.status_cancelled },
  ]

  const currentOption = STATUS_OPTIONS.find((o) => o.value === status) || STATUS_OPTIONS[0]

  return (
    <div
      ref={containerRef}
      className={styles.statusControlGroup}
      onClick={(e) => e.stopPropagation()}
      style={{ position: 'relative' }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`${styles.statusBadge} ${currentOption.colorClass}`}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'left',
          cursor: 'pointer'
        }}
      >
        <span>{currentOption.label}</span>
        <span style={{ fontSize: '9px', marginLeft: '6px', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
      </button>

      {open && (
        <div className={styles.statusDropdownMenu}>
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.statusDropdownOption} ${opt.value === status ? styles.statusDropdownOptionActive : ''}`}
              onClick={() => {
                onSelect(opt.value)
                setOpen(false)
              }}
            >
              <span>{opt.label}</span>
              {opt.value === status && <span className={styles.checkIcon}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}// ── i18n Bilingual Dictionary (English / Hindi हिंदी) ──
const ADMIN_I18N = {
  en: {
    portalTitle: 'Admin Portal',
    live: 'Live',
    subTitle: 'Hawa Mahal Bazar, Jaipur • Central Inventory & Orders',
    viewStore: 'View Store',
    addProduct: '＋ Add Product',
    printReport: 'Print Report',
    newCounterOrder: '⚡ Counter Order',
    logout: 'Logout',
    tabInventory: 'Inventory',
    tabOrders: 'Orders',
    tabEnquiries: 'Enquiries',
    totalProducts: 'Total Products',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    lowStock: 'Low Stock (<10)',
    stockValuation: 'Stock Valuation',
    searchPlaceholder: 'Search products by name, brand, or category...',
    allBrands: 'All Brands',
    allCategories: 'All Categories',
    allStatus: 'All Status',
    sno: 'S.No',
    productName: 'Product Name',
    category: 'Category',
    price: 'Sale Price',
    mrp: 'Original MRP',
    stockQty: 'Stock Quantity',
    status: 'Status',
    actions: 'Actions',
    edit: 'Edit Product',
    quick: 'Quick Edit',
    delete: 'Delete',
    createCounterTitle: '⚡ Create Counter / Walk-in Order',
    createCounterSub: 'Create instant bill for phone, WhatsApp, or in-store walk-in customers.',
    custNameLabel: 'Customer Name',
    custNameHolder: 'e.g. Ramesh Sharma / रमेश शर्मा',
    custPhoneLabel: 'Mobile Number (WhatsApp)',
    custPhoneHolder: 'e.g. 9829012345',
    orderNoteLabel: 'Order Note / Pickup Instructions',
    orderNoteHolder: 'e.g. Counter Cash Billing / Hawa Mahal Pickup',
    searchProductLabel: '+ Search & Add Firework Product',
    generateBillBtn: '⚡ Generate Order & Print Bill',
    creatingBill: 'Creating Bill...',
    cancelBtn: 'Cancel',
    itemHeader: 'Item',
    qtyHeader: 'Qty',
    rateHeader: 'Rate',
    totalHeader: 'Total',
    totalItems: 'Total Items:',
    grandTotal: 'Grand Total:',
    noItemsYet: 'No items added yet. Search a product above to start billing.',
    orderId: 'Order ID',
    customer: 'Customer Details',
    items: 'Ordered Items',
    amount: 'Amount',
    date: 'Date & Time',
    printReceipt: 'Print Receipt',
    downloadCsv: 'Export CSV',
    pending: 'Pending',
    confirmed: 'Confirmed & Paid',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  },
  hi: {
    portalTitle: 'एडमिन पोर्टल (बिलिंग)',
    live: 'लाइव',
    subTitle: 'हवा महल बाजार, जयपुर • पटाखा स्टॉक एवं ऑर्डर कंट्रोल',
    viewStore: 'दुकान देखें',
    addProduct: '＋ नया पटाखा जोड़ें',
    printReport: 'स्टॉक रिपोर्ट प्रिंट करें',
    newCounterOrder: '⚡ नया बिल बनाएं',
    logout: 'लॉगआउट',
    tabInventory: 'पटाखा स्टॉक',
    tabOrders: 'ग्राहक ऑर्डर लिस्ट',
    tabEnquiries: 'पूछताछ',
    totalProducts: 'कुल पटाखे (वैरायटी)',
    inStock: 'उपलब्ध (स्टॉक में)',
    outOfStock: 'खत्म (आउट ऑफ स्टॉक)',
    lowStock: 'कम स्टॉक (<10 नग)',
    stockValuation: 'कुल स्टॉक वैल्यू',
    searchPlaceholder: 'नाम, ब्रांड या कैटेगरी से पटाखा खोजें...',
    allBrands: 'सभी ब्रांड्स',
    allCategories: 'सभी श्रेणियां (कैटेगरी)',
    allStatus: 'सभी स्थिति',
    sno: 'क्र.सं.',
    productName: 'पटाखे का नाम',
    category: 'श्रेणी (कैटेगरी)',
    price: 'बिक्री रेट (₹)',
    mrp: 'मूल MRP (₹)',
    stockQty: 'स्टॉक मात्रा (नग)',
    status: 'स्थिति (स्टेटस)',
    actions: 'कार्रवाई (एक्शन)',
    edit: 'बदलाव करें (एडिट)',
    quick: 'त्वरित अपडेट',
    delete: 'हटाएं',
    createCounterTitle: '⚡ काउंटर / वॉक-इन ग्राहक बिल बनाएं',
    createCounterSub: 'फोन, व्हाट्सएप या दुकान पर आए ग्राहकों का तुरंत बिल बनाएं।',
    custNameLabel: 'ग्राहक का नाम',
    custNameHolder: 'उदाहरण: रमेश शर्मा / Ramesh Sharma',
    custPhoneLabel: 'मोबाइल नंबर (व्हाट्सएप)',
    custPhoneHolder: 'उदा: 9829012345',
    orderNoteLabel: 'ऑर्डर नोट / निर्देश',
    orderNoteHolder: 'उदा: नकद भुगतान / काउंटर पिकअप',
    searchProductLabel: '+ पटाखा खोजें और बिल में जोड़ें',
    generateBillBtn: '⚡ बिल बनाएं और रसीद प्रिंट करें',
    creatingBill: 'बिल बन रहा है...',
    cancelBtn: 'रद्द करें',
    itemHeader: 'पटाखा नाम',
    qtyHeader: 'मात्रा',
    rateHeader: 'दर (रेट)',
    totalHeader: 'कुल',
    totalItems: 'कुल पटाखे (नग):',
    grandTotal: 'कुल राशि:',
    noItemsYet: 'अभी कोई पटाखा नहीं जोड़ा गया है। ऊपर खोजें और जोड़ें।',
    orderId: 'ऑर्डर नंबर',
    customer: 'ग्राहक विवरण',
    items: 'पटाखे (सामान)',
    amount: 'कुल राशि',
    date: 'दिनांक व समय',
    printReceipt: 'रसीद प्रिंट करें',
    downloadCsv: 'CSV डाउनलोड करें',
    pending: 'लंबित (पेंडिंग)',
    confirmed: 'भुगतान प्राप्त (कन्फर्म)',
    delivered: 'डिलीवर हो गया',
    cancelled: 'रद्द कर दिया',
  },
}

interface Product {
  id: string
  sno: number
  name: string
  brand: string
  category: string
  tags: string
  price: number
  originalPrice: number
  discount: string
  inStock: boolean
  stockQuantity?: number
  image: string
}

interface OrderItem {
  id: string
  name: string
  brand: string
  price: number
  quantity: number
}

interface Order {
  orderId: string
  customerName: string
  customerPhone: string
  orderNote: string
  items: OrderItem[]
  subtotal: number
  totalSavings: number
  totalCount: number
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  createdAt: string
}

interface Lead {
  id: string
  name: string
  email: string
  mobile: string
  requirement: string
  createdAt: string
  status: string
}

type TabType = 'products' | 'orders' | 'leads'

// ── SVG Icons (no emojis) ──────────────────────────────
const IconLock = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)
const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)
const IconBox = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>
)
const IconCart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
)
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
)
const IconEdit = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)
const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)
const IconPhone = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)
const IconUpload = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
)
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
const IconTruck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
)
const IconWhatsApp = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
)
const IconInventory = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
)
const IconSuccess = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)
const IconPrint = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
)
const IconDownload = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)
const IconZap = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

// ── Main Component ─────────────────────────────────────
export default function AdminClient() {
  const [isAuthChecking, setIsAuthChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('products')

  // Products State
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_stock' | 'out_of_stock' | 'low_stock'>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [toastState, setToastState] = useState<{ message: string; onUndo?: () => void } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 25

  // Quick 120ms debounce for lag-free typing in admin
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 100)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Add Product Modal State
  const [showAddModal, setShowAddModal] = useState(false)
  const [newProdName, setNewProdName] = useState('')
  const [newProdBrand, setNewProdBrand] = useState('Sony')
  const [newProdCategory, setNewProdCategory] = useState('sky shots')
  const [newProdTags, setNewProdTags] = useState('')
  const [newProdPrice, setNewProdPrice] = useState('')
  const [newProdMRP, setNewProdMRP] = useState('')
  const [newProdQty, setNewProdQty] = useState('50')
  const [newProdImage, setNewProdImage] = useState('/logo-62.png')
  const [newProdInStock, setNewProdInStock] = useState(true)
  const [uploadingAddImg, setUploadingAddImg] = useState(false)

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editName, setEditName] = useState('')
  const [editBrand, setEditBrand] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editTags, setEditTags] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editMRP, setEditMRP] = useState('')
  const [editQty, setEditQty] = useState('50')
  const [editImage, setEditImage] = useState('')
  const [editInStock, setEditInStock] = useState(true)
  const [uploadingEditImg, setUploadingEditImg] = useState(false)

  // Orders State
  const [orders, setOrders] = useState<Order[]>([])
  const [orderSearch, setOrderSearch] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'delivered' | 'cancelled'>('all')
  const [downloadedOrderIds, setDownloadedOrderIds] = useState<string[]>([])
  const [orderReceiptFilter, setOrderReceiptFilter] = useState<'all' | 'new' | 'downloaded'>('all')
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isEditingOrder, setIsEditingOrder] = useState(false)
  const [editOrderItems, setEditOrderItems] = useState<OrderItem[]>([])
  const [selectedProductToAdd, setSelectedProductToAdd] = useState('')
  const [savingOrderEdit, setSavingOrderEdit] = useState(false)

  // Counter POS Walk-in / Phone Order Creation Modal
  const [showNewOrderModal, setShowNewOrderModal] = useState(false)
  const [newOrderCustName, setNewOrderCustName] = useState('')
  const [newOrderCustPhone, setNewOrderCustPhone] = useState('')
  const [newOrderNote, setNewOrderNote] = useState('Counter / Walk-in Customer')
  const [newOrderItems, setNewOrderItems] = useState<OrderItem[]>([])
  const [newOrderProdPick, setNewOrderProdPick] = useState('')
  const [creatingOrder, setCreatingOrder] = useState(false)

  // Quick Inline Price/Stock Editing Mode
  const [inlineEditId, setInlineEditId] = useState<string | null>(null)
  const [inlinePrice, setInlinePrice] = useState<string>('')

  // Custom Confirmation Modal State (Mobile Bottom Sheet / Desktop Centered Dialog)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    confirmText: string
    cancelText: string
    variant?: 'danger' | 'warning' | 'primary'
    onConfirm: () => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => { },
  })

  const requestConfirm = (options: {
    title?: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'primary'
    onConfirm: () => void
  }) => {
    setConfirmModal({
      isOpen: true,
      title: options.title || (lang === 'hi' ? 'पुष्टि करें' : 'Confirm Action'),
      message: options.message,
      confirmText: options.confirmText || (lang === 'hi' ? 'हां, जारी रखें' : 'Yes, Confirm'),
      cancelText: options.cancelText || (lang === 'hi' ? 'रद्द करें' : 'Cancel'),
      variant: options.variant || 'danger',
      onConfirm: options.onConfirm,
    })
  }
  const [inlineMRP, setInlineMRP] = useState<string>('')
  const [inlineQty, setInlineQty] = useState<string>('')
  const [savingInline, setSavingInline] = useState(false)

  // Prevent background scrolling when modal or drawer is open
  useEffect(() => {
    if (selectedOrder || showAddModal || editingProduct || showNewOrderModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedOrder, showAddModal, editingProduct])

  const toggleOrderExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedOrderIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  // Load downloaded order IDs from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('62_downloaded_orders')
      if (saved) {
        setDownloadedOrderIds(JSON.parse(saved))
      }
    } catch { }
  }, [])

  const markOrdersAsDownloaded = (ids: string[]) => {
    setDownloadedOrderIds(prev => {
      const updated = Array.from(new Set([...prev, ...ids]))
      try {
        localStorage.setItem('62_downloaded_orders', JSON.stringify(updated))
      } catch { }
      return updated
    })
  }

  const markOrderAsNew = (id: string) => {
    setDownloadedOrderIds(prev => {
      const updated = prev.filter(x => x !== id)
      try {
        localStorage.setItem('62_downloaded_orders', JSON.stringify(updated))
      } catch { }
      return updated
    })
  }

  // Leads State
  const [leads, setLeads] = useState<Lead[]>([])
  const [leadSearch, setLeadSearch] = useState('')

  // Bilingual Language State (English / Hindi हिंदी)
  const [lang, setLang] = useState<'en' | 'hi'>('hi')

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('62_admin_lang') as 'en' | 'hi'
      if (savedLang === 'en' || savedLang === 'hi') {
        setLang(savedLang)
      }
    } catch { }
  }, [])

  const toggleLang = () => {
    const nextLang = lang === 'en' ? 'hi' : 'en'
    setLang(nextLang)
    try {
      localStorage.setItem('62_admin_lang', nextLang)
    } catch { }
  }

  const t = ADMIN_I18N[lang]

  const [isPendingTab, startTabTransition] = useTransition()

  const handleTabSwitch = (newTab: TabType) => {
    startTabTransition(() => {
      setActiveTab(newTab)
    })
  }

  // Lock scroll and force dark background while verifying auth session (prevents scroll white gap)
  useEffect(() => {
    if (isAuthChecking) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      document.body.style.backgroundColor = '#0A0A0D'
      document.documentElement.style.backgroundColor = '#0A0A0D'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [isAuthChecking])

  // Check stored auth session on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('62_admin_auth') || localStorage.getItem('62_admin_auth')
      if (saved === 'true') {
        const savedPass = sessionStorage.getItem('62_admin_pass') || localStorage.getItem('62_admin_pass') || 'patakha62admin'
        setPassword(savedPass)
        setIsAuthenticated(true)
        loadAllData(savedPass)
      }
    } catch { }
    finally {
      setIsAuthChecking(false)
    }
  }, [])

  // Real-time background auto-sync for active tab (polls every 10s, screen unlock & online reconnect)
  useEffect(() => {
    if (!isAuthenticated || !password) return

    const syncActiveTab = () => {
      if (activeTab === 'products') loadProducts()
      else if (activeTab === 'orders') loadOrders(password)
      else if (activeTab === 'leads') loadLeads(password)
    }

    const syncInterval = setInterval(syncActiveTab, 10000)

    const handleSyncTrigger = () => {
      if (document.visibilityState === 'visible') {
        syncActiveTab()
      }
    }

    window.addEventListener('focus', handleSyncTrigger)
    window.addEventListener('online', handleSyncTrigger)
    document.addEventListener('visibilitychange', handleSyncTrigger)

    return () => {
      clearInterval(syncInterval)
      window.removeEventListener('focus', handleSyncTrigger)
      window.removeEventListener('online', handleSyncTrigger)
      document.removeEventListener('visibilitychange', handleSyncTrigger)
    }
  }, [isAuthenticated, password, activeTab])

  // Lock scroll only when bottom sheet modal is open
  useEffect(() => {
    if (showAddModal || !!editingProduct || showNewOrderModal) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else if (!isAuthChecking) {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    return () => {
      if (!isAuthChecking) {
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
      }
    }
  }, [showAddModal, editingProduct, showNewOrderModal, isAuthChecking])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (data.success) {
        setIsAuthenticated(true)
        try {
          sessionStorage.setItem('62_admin_auth', 'true')
          sessionStorage.setItem('62_admin_pass', password)
          localStorage.setItem('62_admin_auth', 'true')
          localStorage.setItem('62_admin_pass', password)
        } catch { }
        loadAllData(password)
      } else {
        setLoginError(data.error || 'Invalid credentials')
      }
    } catch {
      setLoginError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const loadAllData = (pwd: string) => {
    loadProducts()
    loadOrders(pwd)
    loadLeads(pwd)
  }

  const areProductsEqual = (a: Product[], b: Product[]) => {
    if (a.length !== b.length) return false
    if (a.length === 0) return true
    return (
      a[0].id === b[0].id &&
      a[0].inStock === b[0].inStock &&
      a[0].stockQuantity === b[0].stockQuantity &&
      a[a.length - 1].id === b[b.length - 1].id
    )
  }

  const areOrdersEqual = (a: Order[], b: Order[]) => {
    if (a.length !== b.length) return false
    if (a.length === 0) return true
    return (
      a[0].orderId === b[0].orderId &&
      a[0].status === b[0].status &&
      a[a.length - 1].orderId === b[b.length - 1].orderId
    )
  }

  const areLeadsEqual = (a: Lead[], b: Lead[]) => {
    if (a.length !== b.length) return false
    if (a.length === 0) return true
    return (
      a[0].id === b[0].id &&
      a[0].status === b[0].status &&
      a[a.length - 1].id === b[b.length - 1].id
    )
  }

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const json = await res.json()
      if (json.success && json.products) {
        setProducts(prev => (areProductsEqual(prev, json.products) ? prev : json.products))
      }
    } catch { }
  }

  const loadOrders = async (pwd: string) => {
    try {
      const res = await fetch(`/api/orders?password=${pwd}`)
      const json = await res.json()
      if (json.success && json.orders) {
        setOrders(prev => (areOrdersEqual(prev, json.orders) ? prev : json.orders))
      }
    } catch { }
  }

  const loadLeads = async (pwd: string) => {
    try {
      const res = await fetch(`/api/leads?password=${pwd}`)
      const json = await res.json()
      if (json.success && json.leads) {
        setLeads(prev => (areLeadsEqual(prev, json.leads) ? prev : json.leads))
      }
    } catch { }
  }

  const handleLogout = () => {
    requestConfirm({
      title: lang === 'hi' ? '🚪 एडमिन लॉगआउट' : '🚪 Logout Confirmation',
      message: lang === 'hi'
        ? 'क्या आप एडमिन पोर्टल से लॉगआउट करना चाहते हैं? आपकी वर्तमान सेशन समाप्त हो जाएगी।'
        : 'Are you sure you want to log out of the Admin Portal? Your current session will end.',
      confirmText: lang === 'hi' ? 'हां, लॉगआउट करें' : 'Yes, Logout',
      cancelText: lang === 'hi' ? 'रद्द करें' : 'Cancel',
      variant: 'danger',
      onConfirm: () => {
        try {
          sessionStorage.removeItem('62_admin_auth')
          sessionStorage.removeItem('62_admin_pass')
          localStorage.removeItem('62_admin_auth')
          localStorage.removeItem('62_admin_pass')
        } catch { }
        setIsAuthenticated(false)
        setPassword('')
      },
    })
  }

  const handleUploadImage = async (file: File, isEdit: boolean) => {
    if (isEdit) setUploadingEditImg(true)
    else setUploadingAddImg(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('password', password || sessionStorage.getItem('62_admin_pass') || '')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.success && data.imageUrl) {
        if (isEdit) setEditImage(data.imageUrl)
        else setNewProdImage(data.imageUrl)
        showToast('Image uploaded successfully')
      } else {
        alert(data.error || 'Failed to upload image')
      }
    } catch {
      alert('Error uploading image file')
    } finally {
      if (isEdit) setUploadingEditImg(false)
      else setUploadingAddImg(false)
    }
  }

  const openEditModal = (p: Product) => {
    setEditingProduct(p)
    setEditName(p.name)
    setEditBrand(p.brand)
    setEditCategory(p.category)
    setEditTags(p.tags)
    setEditPrice(String(p.price))
    setEditMRP(String(p.originalPrice))
    setEditQty(String(p.stockQuantity !== undefined ? p.stockQuantity : (p.inStock ? 50 : 0)))
    setEditImage(p.image)
    setEditInStock(p.inStock)
  }

  const handleEditProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    setLoading(true)
    try {
      const qVal = parseInt(editQty) || 0
      const res = await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProduct.id,
          name: editName.trim(),
          brand: editBrand.trim(),
          category: editCategory.trim(),
          tags: editTags.trim(),
          price: parseFloat(editPrice),
          originalPrice: parseFloat(editMRP) || parseFloat(editPrice),
          stockQuantity: qVal,
          inStock: qVal > 0 ? editInStock : false,
          image: editImage.trim() || editingProduct.image,
          password: password || sessionStorage.getItem('62_admin_pass'),
        }),
      })
      const data = await res.json()
      if (data.success && data.product) {
        setProducts(prev => prev.map(item => (item.id === editingProduct.id ? data.product : item)))
        setEditingProduct(null)
        showToast(`Updated "${editName}" successfully`)
      } else {
        alert(data.error || 'Failed to update product')
      }
    } catch {
      alert('Error saving product changes')
    } finally {
      setLoading(false)
    }
  }

  const toggleStock = async (p: Product) => {
    // Safety check if marking a high-inventory item (>10 pcs) Out of Stock
    if (p.inStock && (p.stockQuantity ?? 50) > 10) {
      const qty = p.stockQuantity ?? 50
      requestConfirm({
        title: lang === 'hi' ? '⚠️ आउट ऑफ स्टॉक की पुष्टि' : '⚠️ Mark Out of Stock',
        message: lang === 'hi'
          ? `"${p.name}" में अभी ${qty} नग स्टॉक उपलब्ध है। क्या आप सचमुच इसे Out of Stock मार्क करना चाहते हैं?`
          : `"${p.name}" currently has ${qty} pcs in stock. Are you sure you want to mark it Out of Stock?`,
        confirmText: lang === 'hi' ? 'हां, Out of Stock मार्क करें' : 'Yes, Mark Out of Stock',
        cancelText: lang === 'hi' ? 'रद्द करें' : 'Cancel',
        variant: 'danger',
        onConfirm: () => executeToggleStock(p),
      })
      return
    }
    executeToggleStock(p)
  }

  const executeToggleStock = async (p: Product) => {

    const newStock = !p.inStock
    setUpdatingId(p.id)
    setProducts(prev => prev.map(item => (item.id === p.id ? { ...item, inStock: newStock } : item)))
    try {
      const res = await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: p.id,
          inStock: newStock,
          password: password || sessionStorage.getItem('62_admin_pass'),
        }),
      })
      const data = await res.json()
      if (data.success) {
        showToast(
          `"${p.name}" — ${newStock ? 'Now In Stock' : 'Marked Out of Stock'}`,
          () => toggleStock({ ...p, inStock: newStock })
        )
      } else {
        setProducts(prev => prev.map(item => (item.id === p.id ? { ...item, inStock: !newStock } : item)))
      }
    } catch {
      setProducts(prev => prev.map(item => (item.id === p.id ? { ...item, inStock: !newStock } : item)))
    } finally {
      setUpdatingId(null)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProdName.trim() || !newProdPrice) return
    setLoading(true)
    try {
      const qVal = parseInt(newProdQty) || 50
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProdName.trim(),
          brand: newProdBrand.trim(),
          category: newProdCategory.trim(),
          tags: newProdTags.trim(),
          price: parseFloat(newProdPrice),
          originalPrice: parseFloat(newProdMRP) || parseFloat(newProdPrice),
          stockQuantity: qVal,
          inStock: qVal > 0 ? newProdInStock : false,
          image: newProdImage.trim() || '/logo-62.png',
          password: password || sessionStorage.getItem('62_admin_pass'),
        }),
      })
      const data = await res.json()
      if (data.success && data.product) {
        setProducts(prev => [data.product, ...prev])
        setShowAddModal(false)
        showToast(`Product "${newProdName}" added successfully`)
        setNewProdName(''); setNewProdPrice(''); setNewProdMRP('')
        setNewProdQty('50'); setNewProdTags(''); setNewProdImage('/logo-62.png')
      }
    } catch {
      alert('Failed to add product.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return
    try {
      const pwd = password || sessionStorage.getItem('62_admin_pass')
      const res = await fetch(`/api/products?id=${p.id}&password=${pwd}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setProducts(prev => prev.filter(item => item.id !== p.id))
        showToast(`Deleted "${p.name}"`)
      }
    } catch { }
  }

  const handleOrderStatus = async (orderId: string, newStatus: string) => {
    const previousOrders = orders
    // Optimistic UI update (0ms instant response)
    setOrders(prev => prev.map(o => (o.orderId === orderId ? { ...o, status: newStatus as Order['status'] } : o)))

    try {
      const pwd = password || sessionStorage.getItem('62_admin_pass')
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus, password: pwd }),
      })
      const data = await res.json()
      if (data.success) {
        showToast(`Order ${orderId} updated to ${newStatus.toUpperCase()}`)
      } else {
        // Revert on error
        setOrders(previousOrders)
        alert(data.error || 'Failed to update status')
      }
    } catch {
      // Revert on network error
      setOrders(previousOrders)
      showToast('Network error: Could not update order status')
    }
  }

  // ── Admin Order Modification Logic (Handling Defective / Unavailable Items) ──
  const startEditingOrder = (order: Order) => {
    setIsEditingOrder(true)
    setEditOrderItems(JSON.parse(JSON.stringify(order.items || [])))
    setSelectedProductToAdd('')
  }

  const cancelEditingOrder = () => {
    setIsEditingOrder(false)
    setEditOrderItems([])
    setSelectedProductToAdd('')
  }

  const handleUpdateItemQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItemFromOrder(index)
      return
    }
    setEditOrderItems(prev => {
      const copy = [...prev]
      copy[index] = { ...copy[index], quantity: newQty }
      return copy
    })
  }

  const handleRemoveItemFromOrder = (index: number) => {
    setEditOrderItems(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddProductToOrder = (productId: string) => {
    if (!productId) return
    const prod = products.find(p => String(p.id) === String(productId))
    if (!prod) return

    setEditOrderItems(prev => {
      // Check if product already exists in order
      const existingIdx = prev.findIndex(item => String(item.id) === String(prod.id))
      if (existingIdx !== -1) {
        const copy = [...prev]
        copy[existingIdx].quantity += 1
        return copy
      }
      return [
        ...prev,
        {
          id: String(prod.id),
          name: prod.name,
          brand: prod.brand || 'Original Sivakasi',
          price: prod.price,
          quantity: 1,
        }
      ]
    })
    setSelectedProductToAdd('')
  }

  const handleSaveOrderEdit = async () => {
    if (!selectedOrder) return
    if (editOrderItems.length === 0) {
      alert('Order must contain at least 1 item. If customer cancelled everything, you can mark order status as Cancelled.')
      return
    }

    setSavingOrderEdit(true)
    const newSubtotal = editOrderItems.reduce((sum, it) => sum + (it.price * it.quantity), 0)
    const newTotalCount = editOrderItems.reduce((sum, it) => sum + it.quantity, 0)
    // Recalculate savings based on original prices where available
    const newSavings = editOrderItems.reduce((sum, it) => {
      const p = products.find(prod => String(prod.id) === String(it.id))
      if (p && p.originalPrice > p.price) {
        return sum + ((p.originalPrice - p.price) * it.quantity)
      }
      return sum
    }, 0)

    try {
      const pwd = password || sessionStorage.getItem('62_admin_pass')
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.orderId,
          items: editOrderItems,
          subtotal: newSubtotal,
          totalSavings: newSavings,
          totalCount: newTotalCount,
          password: pwd,
        }),
      })
      const data = await res.json()
      if (data.success) {
        const updatedOrder: Order = {
          ...selectedOrder,
          items: editOrderItems,
          subtotal: newSubtotal,
          totalSavings: newSavings,
          totalCount: newTotalCount,
        }

        setSelectedOrder(updatedOrder)
        setOrders(prev => prev.map(o => (o.orderId === selectedOrder.orderId ? updatedOrder : o)))
        setIsEditingOrder(false)
        showToast(`Order ${selectedOrder.orderId} modified successfully! Subtotal: ₹${newSubtotal.toLocaleString('en-IN')}`)
      } else {
        alert(data.error || 'Failed to update order items')
      }
    } catch {
      alert('Error updating order items')
    } finally {
      setSavingOrderEdit(false)
    }
  }

  const showToast = (msg: string, onUndo?: () => void) => {
    setToastState({ message: msg, onUndo })
    setTimeout(() => setToastState(null), 4500)
  }

  // ── Quick Inline Product Edit Handlers ──
  const startInlineEdit = (p: Product) => {
    setInlineEditId(p.id)
    setInlinePrice(String(p.price))
    setInlineMRP(String(p.originalPrice))
    setInlineQty(String(p.stockQuantity !== undefined ? p.stockQuantity : (p.inStock ? 50 : 0)))
  }

  const cancelInlineEdit = () => {
    setInlineEditId(null)
    setInlinePrice('')
    setInlineMRP('')
    setInlineQty('')
  }

  const saveInlineEdit = async (p: Product) => {
    const newPriceVal = parseFloat(inlinePrice)
    const newMRPVal = parseFloat(inlineMRP) || newPriceVal
    const newQtyVal = parseInt(inlineQty) || 0

    if (isNaN(newPriceVal) || newPriceVal < 0) {
      alert('Please enter a valid price.')
      return
    }

    setSavingInline(true)
    try {
      const pwd = password || sessionStorage.getItem('62_admin_pass')
      const res = await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: p.id,
          name: p.name,
          brand: p.brand,
          category: p.category,
          tags: p.tags,
          price: newPriceVal,
          originalPrice: newMRPVal,
          stockQuantity: newQtyVal,
          inStock: newQtyVal > 0,
          image: p.image,
          password: pwd,
        }),
      })
      const data = await res.json()
      if (data.success && data.product) {
        setProducts(prev => prev.map(item => (item.id === p.id ? data.product : item)))
        showToast(`Saved ${p.name}: ₹${newPriceVal} | Stock: ${newQtyVal} pcs`)
        cancelInlineEdit()
      } else {
        alert(data.error || 'Failed to save inline update')
      }
    } catch {
      alert('Error saving product update')
    } finally {
      setSavingInline(false)
    }
  }

  // ── Manual / Walk-in POS Order Handlers ──
  const handleAddWalkinItem = (productId: string) => {
    if (!productId) return
    const prod = products.find(p => String(p.id) === String(productId))
    if (!prod) return

    setNewOrderItems(prev => {
      const existing = prev.find(item => item.id === prod.id)
      if (existing) {
        return prev.map(item => item.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, {
        id: prod.id,
        name: prod.name,
        brand: prod.brand,
        price: prod.price,
        quantity: 1,
      }]
    })
    setNewOrderProdPick('')
  }

  const handleCreateWalkinOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newOrderItems.length === 0) {
      alert('Please select at least 1 product for this counter order.')
      return
    }

    setCreatingOrder(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: newOrderCustName.trim() || 'Store Walk-in Customer',
          customerPhone: newOrderCustPhone.trim() || '8561005357',
          orderNote: newOrderNote.trim() || 'Manual Counter Booking',
          deliveryMethod: 'pickup',
          paymentMethod: 'cash_on_pickup',
          items: newOrderItems,
        }),
      })

      const data = await res.json()
      if (data.success && data.order) {
        setOrders(prev => [data.order, ...prev])
        setShowNewOrderModal(false)
        setNewOrderCustName('')
        setNewOrderCustPhone('')
        setNewOrderItems([])
        showToast(`Counter Order #${data.order.orderId} created successfully!`)
        // Auto prompt receipt print
        printOrderReceipt(data.order)
      } else {
        alert(data.error || 'Failed to create order')
      }
    } catch {
      alert('Error creating walk-in order')
    } finally {
      setCreatingOrder(false)
    }
  }

  // ── Generate Printable Stock Report ───────────────────
  const generatePrintReport = () => {
    requestConfirm({
      title: lang === 'hi' ? '🖨️ स्टॉक रिपोर्ट प्रिंट' : '🖨️ Print Stock Report',
      message: lang === 'hi'
        ? 'क्या आप पूरी स्टॉक वैल्यूएशन रिपोर्ट तैयार करके प्रिंट करना चाहते हैं?'
        : 'Are you sure you want to generate and print the full inventory stock report?',
      confirmText: lang === 'hi' ? 'हां, प्रिंट करें' : 'Yes, Print Report',
      cancelText: lang === 'hi' ? 'रद्द करें' : 'Cancel',
      variant: 'warning',
      onConfirm: () => executePrintReport(),
    })
  }

  const executePrintReport = () => {
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

    const inStock = products.filter(p => p.inStock)
    const outOfStock = products.filter(p => !p.inStock)
    const totalStockValue = inStock.reduce((sum, p) => sum + (p.price * (p.stockQuantity ?? 50)), 0)
    const totalMRPValue = inStock.reduce((sum, p) => sum + (p.originalPrice * (p.stockQuantity ?? 50)), 0)

    // Category breakdown
    const categoryMap: Record<string, { total: number; inStock: number; qty: number }> = {}
    products.forEach(p => {
      const cat = p.category || 'Uncategorized'
      if (!categoryMap[cat]) categoryMap[cat] = { total: 0, inStock: 0, qty: 0 }
      categoryMap[cat].total++
      if (p.inStock) {
        categoryMap[cat].inStock++
        categoryMap[cat].qty += (p.stockQuantity ?? 50)
      }
    })

    // Brand breakdown
    const brandMap: Record<string, { total: number; inStock: number }> = {}
    products.forEach(p => {
      const brand = p.brand || 'Unknown'
      if (!brandMap[brand]) brandMap[brand] = { total: 0, inStock: 0 }
      brandMap[brand].total++
      if (p.inStock) brandMap[brand].inStock++
    })

    const productRows = products
      .slice()
      .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
      .map((p, i) => {
        const qty = p.stockQuantity !== undefined ? p.stockQuantity : (p.inStock ? 50 : 0)
        const stockVal = p.inStock ? (p.price * qty).toLocaleString('en-IN') : '—'
        const statusColor = p.inStock ? '#166534' : '#991b1b'
        const statusBg = p.inStock ? '#dcfce7' : '#fee2e2'
        const discount = p.originalPrice > p.price
          ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
          : 0
        return `
          <tr class="${i % 2 === 0 ? 'even' : ''}">
            <td class="center muted">${i + 1}</td>
            <td><strong>${p.name}</strong></td>
            <td>${p.brand}</td>
            <td class="capitalize">${p.category}</td>
            <td class="right">&#x20B9;${p.price.toLocaleString('en-IN')}</td>
            <td class="right muted">&#x20B9;${p.originalPrice.toLocaleString('en-IN')}</td>
            <td class="center">${discount > 0 ? discount + '%' : '—'}</td>
            <td class="center">
              <span class="qty-badge ${qty > 10 ? 'qty-ok' : (qty > 0 ? 'qty-low' : 'qty-zero')}"
              >${qty > 0 ? qty + ' pcs' : '0'}</span>
            </td>
            <td class="center">
              <span class="status-badge" style="color:${statusColor};background:${statusBg}">
                ${p.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
              </span>
            </td>
            <td class="right">${p.inStock ? '&#x20B9;' + stockVal : '—'}</td>
          </tr>`
      }).join('')

    const categoryRows = Object.entries(categoryMap)
      .sort((a, b) => b[1].inStock - a[1].inStock)
      .map(([cat, data], i) => `
        <tr class="${i % 2 === 0 ? 'even' : ''}">
          <td class="capitalize"><strong>${cat}</strong></td>
          <td class="center">${data.total}</td>
          <td class="center" style="color:#166534;font-weight:700">${data.inStock}</td>
          <td class="center" style="color:#991b1b;font-weight:700">${data.total - data.inStock}</td>
          <td class="center">${data.qty} pcs</td>
          <td class="center">
            <div class="bar-wrap"><div class="bar" style="width:${data.total > 0 ? Math.round((data.inStock / data.total) * 100) : 0}%"></div></div>
            ${data.total > 0 ? Math.round((data.inStock / data.total) * 100) : 0}%
          </td>
        </tr>`).join('')

    const brandRows = Object.entries(brandMap)
      .sort((a, b) => b[1].inStock - a[1].inStock)
      .slice(0, 15)
      .map(([brand, data], i) => `
        <tr class="${i % 2 === 0 ? 'even' : ''}">
          <td><strong>${brand}</strong></td>
          <td class="center">${data.total}</td>
          <td class="center" style="color:#166534;font-weight:700">${data.inStock}</td>
          <td class="center" style="color:#991b1b;font-weight:700">${data.total - data.inStock}</td>
        </tr>`).join('')

    const pendingOrders = orders.filter(o => o.status === 'pending').length
    const confirmedOrders = orders.filter(o => o.status === 'confirmed').length
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length
    const totalRevenue = orders.filter(o => o.status === 'confirmed' || o.status === 'delivered')
      .reduce((sum, o) => sum + o.subtotal, 0)

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>62 Patakha Shop — Stock Report — ${dateStr}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',sans-serif;font-size:11px;color:#1a1a1a;background:#fff;padding:0}
    @page{size:A4 landscape;margin:14mm 12mm}

    /* HEADER */
    .header{display:flex;align-items:flex-start;justify-content:space-between;padding:18px 24px 14px;background:linear-gradient(135deg,#0D0D0F 0%,#1a1208 100%);color:#fff;border-radius:8px;margin-bottom:16px}
    .brand{display:flex;align-items:center;gap:12px}
    .brand-badge{width:44px;height:44px;background:#FF8F00;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:20px;color:#fff;letter-spacing:-1px}
    .brand-name{font-size:20px;font-weight:800;color:#fff}
    .brand-sub{font-size:11px;color:#a1a1aa;margin-top:2px}
    .report-meta{text-align:right}
    .report-title{font-size:14px;font-weight:700;color:#F59E0B;margin-bottom:4px}
    .report-date{font-size:11px;color:#a1a1aa}
    .report-stamp{display:inline-block;margin-top:6px;background:#F59E0B;color:#0D0D0F;padding:2px 10px;border-radius:4px;font-size:10px;font-weight:800;letter-spacing:0.5px}

    /* SUMMARY GRID */
    .summary-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-bottom:16px}
    .stat-box{border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;text-align:center}
    .stat-label{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#6b7280;margin-bottom:6px}
    .stat-val{font-size:24px;font-weight:800;line-height:1;letter-spacing:-1px}
    .green{color:#166534}
    .red{color:#991b1b}
    .amber{color:#92400e}
    .blue{color:#1e40af}
    .purple{color:#5b21b6}

    /* SECTION */
    .section{margin-bottom:18px}
    .section-title{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;color:#374151;margin-bottom:8px;padding-bottom:5px;border-bottom:2px solid #F59E0B;display:flex;align-items:center;gap:6px}
    .section-title::before{content:'';display:inline-block;width:4px;height:14px;background:#F59E0B;border-radius:2px}

    /* TWO COL */
    .two-col{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px}

    /* TABLES */
    table{width:100%;border-collapse:collapse;font-size:10.5px}
    thead tr{background:#111827;color:#fff}
    th{padding:7px 8px;text-align:left;font-weight:700;font-size:9.5px;text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap}
    td{padding:6px 8px;border-bottom:1px solid #f3f4f6;vertical-align:middle}
    tr.even td{background:#f9fafb}
    .center{text-align:center}
    .right{text-align:right}
    .muted{color:#6b7280}
    .capitalize{text-transform:capitalize}

    /* BADGES */
    .status-badge{display:inline-block;padding:2px 7px;border-radius:4px;font-size:9px;font-weight:800;letter-spacing:0.3px}
    .qty-badge{display:inline-block;padding:2px 7px;border-radius:4px;font-size:9.5px;font-weight:700}
    .qty-ok{background:#dcfce7;color:#166534}
    .qty-low{background:#fef9c3;color:#713f12}
    .qty-zero{background:#fee2e2;color:#991b1b}

    /* BAR */
    .bar-wrap{display:inline-block;width:48px;height:6px;background:#e5e7eb;border-radius:3px;margin-right:4px;vertical-align:middle}
    .bar{height:6px;background:#16a34a;border-radius:3px}

    /* ORDER BOXES */
    .order-stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:12px}
    .order-box{border-radius:6px;padding:10px 12px;text-align:center}
    .order-box .lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px}
    .order-box .val{font-size:22px;font-weight:800;line-height:1}

    /* FOOTER */
    .footer{margin-top:24px;padding-top:10px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;color:#9ca3af;font-size:9px}
    .footer strong{color:#374151}

    /* PRINT ONLY */
    @media print{
      body{padding:0}
      .no-print{display:none!important}
      thead{display:table-header-group}
    }
    @media screen{
      body{padding:20px;max-width:1100px;margin:0 auto}
      .print-btn{display:inline-flex;align-items:center;gap:6px;background:#F59E0B;color:#000;border:none;padding:10px 20px;border-radius:8px;font-weight:700;font-size:14px;cursor:pointer;margin-bottom:16px;font-family:'Inter',sans-serif}
      .print-btn:hover{background:#FCD34D}
    }
  </style>
</head>
<body>

  <div class="no-print" style="margin-bottom:8px">
    <button class="print-btn" onclick="window.print()">&#128438; Print / Save as PDF</button>
    <span style="font-size:12px;color:#6b7280;margin-left:12px">Tip: In print dialog, set Layout to <strong>Landscape</strong> for best results.</span>
  </div>

  <!-- HEADER -->
  <div class="header">
    <div class="brand">
      <div class="brand-badge">62</div>
      <div>
        <div class="brand-name">Patakha Shop</div>
        <div class="brand-sub">Hawa Mahal Bazar, Jaipur &bull; Est. 1964</div>
      </div>
    </div>
    <div class="report-meta">
      <div class="report-title">&#128202; Stock Availability Report</div>
      <div class="report-date">Generated: ${dateStr} at ${timeStr}</div>
      <div class="report-stamp">CONFIDENTIAL &bull; ADMIN USE ONLY</div>
    </div>
  </div>

  <!-- SUMMARY -->
  <div class="section">
    <div class="section-title">Inventory Summary</div>
    <div class="summary-grid">
      <div class="stat-box"><div class="stat-label">Total SKUs</div><div class="stat-val">${products.length}</div></div>
      <div class="stat-box"><div class="stat-label">In Stock</div><div class="stat-val green">${inStock.length}</div></div>
      <div class="stat-box"><div class="stat-label">Out of Stock</div><div class="stat-val red">${outOfStock.length}</div></div>
      <div class="stat-box"><div class="stat-label">Brands Active</div><div class="stat-val amber">${Object.keys(brandMap).length}</div></div>
      <div class="stat-box"><div class="stat-label">Stock Value (Sale)</div><div class="stat-val blue" style="font-size:15px">&#x20B9;${totalStockValue.toLocaleString('en-IN')}</div></div>
      <div class="stat-box"><div class="stat-label">MRP Value</div><div class="stat-val purple" style="font-size:15px">&#x20B9;${totalMRPValue.toLocaleString('en-IN')}</div></div>
    </div>
  </div>

  <!-- CATEGORY + BRAND BREAKDOWN -->
  <div class="two-col">
    <div class="section">
      <div class="section-title">Category Breakdown</div>
      <table>
        <thead>
          <tr>
            <th>Category</th><th class="center">Total</th><th class="center">In Stock</th><th class="center">Out</th><th class="center">Stock Qty</th><th class="center">Coverage</th>
          </tr>
        </thead>
        <tbody>${categoryRows}</tbody>
      </table>
    </div>
    <div class="section">
      <div class="section-title">Brand Breakdown (Top 15)</div>
      <table>
        <thead>
          <tr>
            <th>Brand</th><th class="center">Total</th><th class="center">In Stock</th><th class="center">Out</th>
          </tr>
        </thead>
        <tbody>${brandRows}</tbody>
      </table>

      <!-- Orders Summary -->
      <div style="margin-top:14px">
        <div class="section-title" style="margin-bottom:8px">Orders Summary</div>
        <div class="order-stat-row">
          <div class="order-box" style="background:#fef9c3">
            <div class="lbl" style="color:#713f12">Pending</div>
            <div class="val" style="color:#92400e">${pendingOrders}</div>
          </div>
          <div class="order-box" style="background:#dcfce7">
            <div class="lbl" style="color:#166534">Confirmed</div>
            <div class="val" style="color:#166534">${confirmedOrders}</div>
          </div>
          <div class="order-box" style="background:#dbeafe">
            <div class="lbl" style="color:#1e40af">Delivered</div>
            <div class="val" style="color:#1e40af">${deliveredOrders}</div>
          </div>
          <div class="order-box" style="background:#f0fdf4;border:1px solid #bbf7d0">
            <div class="lbl" style="color:#166534">Revenue (Confirmed+Delivered)</div>
            <div class="val" style="color:#166534;font-size:15px">&#x20B9;${totalRevenue.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- FULL PRODUCT TABLE -->
  <div class="section">
    <div class="section-title">Complete Product Inventory (${products.length} items)</div>
    <table>
      <thead>
        <tr>
          <th style="width:32px">#</th>
          <th>Product Name</th>
          <th>Brand</th>
          <th>Category</th>
          <th class="right">Sale Price</th>
          <th class="right">MRP</th>
          <th class="center">Disc.</th>
          <th class="center">Stock Qty</th>
          <th class="center">Status</th>
          <th class="right">Stock Value</th>
        </tr>
      </thead>
      <tbody>${productRows}</tbody>
    </table>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div>62 Patakha Shop &bull; Hawa Mahal Bazar, Jaipur &bull; +91 85610 05357</div>
    <div><strong>Report generated:</strong> ${dateStr} ${timeStr} &bull; Total products: ${products.length} &bull; In stock: ${inStock.length}</div>
    <div>This report is for internal use only. &copy; 62 Patakha Shop ${now.getFullYear()}</div>
  </div>

</body>
</html>`

    // Print directly on the current page using a hidden iframe without opening any new tab
    let printFrame = document.getElementById('admin-print-iframe') as HTMLIFrameElement
    if (!printFrame) {
      printFrame = document.createElement('iframe')
      printFrame.id = 'admin-print-iframe'
      printFrame.style.position = 'fixed'
      printFrame.style.right = '0'
      printFrame.style.bottom = '0'
      printFrame.style.width = '0'
      printFrame.style.height = '0'
      printFrame.style.border = '0'
      document.body.appendChild(printFrame)
    }

    const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument
    if (frameDoc && printFrame.contentWindow) {
      frameDoc.open()
      frameDoc.write(html)
      frameDoc.close()
      setTimeout(() => {
        printFrame.contentWindow?.focus()
        printFrame.contentWindow?.print()
      }, 300)
    }
  }

  // ── Downloadable / Printable Customer Order Receipt (On the same page) ──
  const printOrderReceipt = (order: Order) => {
    const now = new Date(order.createdAt || Date.now())
    const dateFormatted = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    const timeFormatted = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

    const rows = order.items.map((it) => `
      <tr style="page-break-inside: avoid; break-inside: avoid;">
        <td style="padding: 3.5px 6px; border-bottom: 1px solid #e5e7eb; font-size: 11px;">
          <span style="font-weight: 700; color: #111;">${it.name}</span>
          ${it.brand ? `<span style="font-size: 9px; color: #6b7280; font-weight: 600; text-transform: uppercase; margin-left: 5px;">(${it.brand})</span>` : ''}
        </td>
        <td style="padding: 3.5px 6px; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: 700; font-size: 11px;">${it.quantity}</td>
        <td style="padding: 3.5px 6px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 11px; color: #374151;">&#x20B9;${it.price.toLocaleString('en-IN')}</td>
        <td style="padding: 3.5px 6px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 700; font-size: 11px; color: #111;">&#x20B9;${(it.quantity * it.price).toLocaleString('en-IN')}</td>
      </tr>
    `).join('')

    const receiptHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Receipt — ${order.orderId}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    @page { size: A4 portrait; margin: 4mm 6mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #fff; color: #111827; padding: 10px 14px; max-width: 680px; margin: 0 auto; font-size: 11px; line-height: 1.3; }
    .receipt-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 14px; background: #ffffff; page-break-inside: avoid; break-inside: avoid; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 6px; border-bottom: 1.5px dashed #d1d5db; margin-bottom: 8px; page-break-inside: avoid; break-inside: avoid; }
    .brand-title { font-size: 15px; font-weight: 800; color: #111; letter-spacing: -0.3px; }
    .brand-sub { font-size: 10px; color: #4b5563; margin-top: 1px; }
    .badge-order { background: #fef3c7; color: #92400e; padding: 2px 7px; border-radius: 4px; font-weight: 800; font-size: 11px; text-align: right; display: inline-block; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; margin-bottom: 8px; padding: 6px 10px; background: #f9fafb; border-radius: 6px; border: 1px solid #f0f0f0; page-break-inside: avoid; break-inside: avoid; }
    .info-label { font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.4px; color: #6b7280; font-weight: 700; margin-bottom: 1px; }
    .info-val { font-size: 11px; font-weight: 700; color: #111; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    th { background: #f3f4f6; padding: 4px 6px; text-align: left; font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.4px; color: #374151; font-weight: 800; }
    .totals-box { margin-top: 6px; border-top: 1.5px solid #111; padding-top: 5px; page-break-inside: avoid; break-inside: avoid; }
    .total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; font-size: 11px; color: #374151; }
    .grand-total { font-size: 14px; font-weight: 800; color: #111; border-top: 1px dashed #d1d5db; padding-top: 4px; margin-top: 3px; }
    .footer { text-align: center; margin-top: 8px; padding-top: 5px; border-top: 1px solid #e5e7eb; font-size: 9px; color: #6b7280; page-break-inside: avoid; break-inside: avoid; }
    @media print {
      body { padding: 0; max-width: 100%; }
      .receipt-card { border: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="receipt-card">
    <div class="header">
      <div>
        <div class="brand-title">&#127879; 62 PATAKHA SHOP</div>
        <div class="brand-sub">Hawa Mahal Bazar, Jaipur, Rajasthan &bull; +91 85610 05357</div>
        <div class="brand-sub">Govt. Authorized Licensed Green Fireworks Store</div>
      </div>
      <div style="text-align: right;">
        <span class="badge-order">${order.orderId}</span>
        <div style="font-size: 10px; color: #6b7280; margin-top: 3px;">${dateFormatted} &bull; ${timeFormatted}</div>
        <div style="font-size: 10px; font-weight: 700; color: ${order.status === 'confirmed' ? '#15803d' : '#b45309'}; text-transform: uppercase; margin-top: 2px;">Status: ${order.status}</div>
      </div>
    </div>

    <div class="info-grid">
      <div>
        <div class="info-label">Customer Name</div>
        <div class="info-val">${order.customerName || 'Customer'}</div>
      </div>
      <div>
        <div class="info-label">Contact Phone</div>
        <div class="info-val">${order.customerPhone || 'N/A'}</div>
      </div>
      <div style="grid-column: span 2;">
        <div class="info-label">Order Note / Fulfillment</div>
        <div class="info-val" style="font-weight: 500;">${order.orderNote || 'Store Pickup / Express Dispatch'}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Purchased Item</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Price</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div class="totals-box">
      <div class="total-row">
        <span>Items Purchased:</span>
        <span style="font-weight: 700;">${order.totalCount} items</span>
      </div>
      ${order.totalSavings > 0 ? `
      <div class="total-row" style="color: #15803d;">
        <span>Total Savings Discount:</span>
        <span style="font-weight: 700;">-&#x20B9;${order.totalSavings.toLocaleString('en-IN')}</span>
      </div>
      ` : ''}
      <div class="total-row grand-total">
        <span>Grand Total Amount:</span>
        <span>&#x20B9;${order.subtotal.toLocaleString('en-IN')}</span>
      </div>
    </div>

    <div class="footer">
      <p style="font-weight: 600; color: #374151; margin-bottom: 2px;">Thank you for celebrating with 62 Patakha Shop!</p>
      <p>Showroom: 62, Hawa Mahal Bazar, Near Old Vidhan Sabha, Kanwar Nagar, Jaipur &bull; Support: +91 85610 05357</p>
    </div>
  </div>
</body>
</html>`

    // Print directly on the same page via hidden iframe
    let printFrame = document.getElementById('admin-print-iframe') as HTMLIFrameElement
    if (!printFrame) {
      printFrame = document.createElement('iframe')
      printFrame.id = 'admin-print-iframe'
      printFrame.style.position = 'fixed'
      printFrame.style.right = '0'
      printFrame.style.bottom = '0'
      printFrame.style.width = '0'
      printFrame.style.height = '0'
      printFrame.style.border = '0'
      document.body.appendChild(printFrame)
    }

    const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument
    if (frameDoc && printFrame.contentWindow) {
      frameDoc.open()
      frameDoc.write(receiptHtml)
      frameDoc.close()
      markOrdersAsDownloaded([order.orderId])
      setTimeout(() => {
        printFrame.contentWindow?.focus()
        printFrame.contentWindow?.print()
      }, 300)
    }
  }

  // ── Batch Download / Print Receipts ──
  const printBatchReceipts = (targetOrders: Order[]) => {
    if (targetOrders.length === 0) {
      alert('No orders to download / print.')
      return
    }

    const receiptCardsHtml = targetOrders.map((order) => {
      const now = new Date(order.createdAt || Date.now())
      const dateFormatted = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      const timeFormatted = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

      const rows = order.items.map((it) => `
        <tr style="page-break-inside: avoid; break-inside: avoid;">
          <td style="padding: 3.5px 6px; border-bottom: 1px solid #e5e7eb; font-size: 11px;">
            <span style="font-weight: 700; color: #111;">${it.name}</span>
            ${it.brand ? `<span style="font-size: 9px; color: #6b7280; font-weight: 600; text-transform: uppercase; margin-left: 5px;">(${it.brand})</span>` : ''}
          </td>
          <td style="padding: 3.5px 6px; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: 700; font-size: 11px;">${it.quantity}</td>
          <td style="padding: 3.5px 6px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 11px; color: #374151;">&#x20B9;${it.price.toLocaleString('en-IN')}</td>
          <td style="padding: 3.5px 6px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 700; font-size: 11px; color: #111;">&#x20B9;${(it.quantity * it.price).toLocaleString('en-IN')}</td>
        </tr>
      `).join('')

      return `
      <div class="receipt-card">
        <div class="header">
          <div>
            <div class="brand-title">&#127879; 62 PATAKHA SHOP</div>
            <div class="brand-sub">Hawa Mahal Bazar, Jaipur, Rajasthan &bull; +91 85610 05357</div>
            <div class="brand-sub">Govt. Authorized Licensed Green Fireworks Store</div>
          </div>
          <div style="text-align: right;">
            <span class="badge-order">${order.orderId}</span>
            <div style="font-size: 10px; color: #6b7280; margin-top: 3px;">${dateFormatted} &bull; ${timeFormatted}</div>
            <div style="font-size: 10px; font-weight: 700; color: ${order.status === 'confirmed' ? '#15803d' : '#b45309'}; text-transform: uppercase; margin-top: 2px;">Status: ${order.status}</div>
          </div>
        </div>

        <div class="info-grid">
          <div>
            <div class="info-label">Customer Name</div>
            <div class="info-val">${order.customerName || 'Customer'}</div>
          </div>
          <div>
            <div class="info-label">Contact Phone</div>
            <div class="info-val">${order.customerPhone || 'N/A'}</div>
          </div>
          <div style="grid-column: span 2;">
            <div class="info-label">Order Note / Fulfillment</div>
            <div class="info-val" style="font-weight: 500;">${order.orderNote || 'Store Pickup / Express Dispatch'}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Purchased Item</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div class="totals-box">
          <div class="total-row">
            <span>Items Purchased:</span>
            <span style="font-weight: 700;">${order.totalCount} items</span>
          </div>
          ${order.totalSavings > 0 ? `
          <div class="total-row" style="color: #15803d;">
            <span>Total Savings Discount:</span>
            <span style="font-weight: 700;">-&#x20B9;${order.totalSavings.toLocaleString('en-IN')}</span>
          </div>
          ` : ''}
          <div class="total-row grand-total">
            <span>Grand Total Amount:</span>
            <span>&#x20B9;${order.subtotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div class="footer">
          <p style="font-weight: 600; color: #374151; margin-bottom: 2px;">Thank you for celebrating with 62 Patakha Shop!</p>
          <p>Showroom: 62, Hawa Mahal Bazar, Near Old Vidhan Sabha, Kanwar Nagar, Jaipur &bull; Support: +91 85610 05357</p>
        </div>
      </div>
      `
    }).join('')

    const batchHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Batch Receipts (${targetOrders.length} Orders)</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    @page { size: A4 portrait; margin: 4mm 6mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #fff; color: #111827; padding: 10px 14px; }
    .receipt-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 14px; background: #ffffff; max-width: 680px; margin: 0 auto 20px auto; page-break-after: always; break-after: page; page-break-inside: avoid; break-inside: avoid; }
    .receipt-card:last-child { page-break-after: avoid; break-after: avoid; margin-bottom: 0; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 6px; border-bottom: 1.5px dashed #d1d5db; margin-bottom: 8px; page-break-inside: avoid; break-inside: avoid; }
    .brand-title { font-size: 15px; font-weight: 800; color: #111; letter-spacing: -0.3px; }
    .brand-sub { font-size: 10px; color: #4b5563; margin-top: 1px; }
    .badge-order { background: #fef3c7; color: #92400e; padding: 2px 7px; border-radius: 4px; font-weight: 800; font-size: 11px; text-align: right; display: inline-block; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; margin-bottom: 8px; padding: 6px 10px; background: #f9fafb; border-radius: 6px; border: 1px solid #f0f0f0; page-break-inside: avoid; break-inside: avoid; }
    .info-label { font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.4px; color: #6b7280; font-weight: 700; margin-bottom: 1px; }
    .info-val { font-size: 11px; font-weight: 700; color: #111; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    th { background: #f3f4f6; padding: 4px 6px; text-align: left; font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.4px; color: #374151; font-weight: 800; }
    .totals-box { margin-top: 6px; border-top: 1.5px solid #111; padding-top: 5px; page-break-inside: avoid; break-inside: avoid; }
    .total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; font-size: 11px; color: #374151; }
    .grand-total { font-size: 14px; font-weight: 800; color: #111; border-top: 1px dashed #d1d5db; padding-top: 4px; margin-top: 3px; }
    .footer { text-align: center; margin-top: 8px; padding-top: 5px; border-top: 1px solid #e5e7eb; font-size: 9px; color: #6b7280; page-break-inside: avoid; break-inside: avoid; }
    @media print {
      body { padding: 0; max-width: 100%; }
      .receipt-card { border: none; padding: 0; margin-bottom: 0; }
    }
  </style>
</head>
<body>
  ${receiptCardsHtml}
</body>
</html>`

    let printFrame = document.getElementById('admin-print-iframe') as HTMLIFrameElement
    if (!printFrame) {
      printFrame = document.createElement('iframe')
      printFrame.id = 'admin-print-iframe'
      printFrame.style.position = 'fixed'
      printFrame.style.right = '0'
      printFrame.style.bottom = '0'
      printFrame.style.width = '0'
      printFrame.style.height = '0'
      printFrame.style.border = '0'
      document.body.appendChild(printFrame)
    }

    const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument
    if (frameDoc && printFrame.contentWindow) {
      frameDoc.open()
      frameDoc.write(batchHtml)
      frameDoc.close()
      markOrdersAsDownloaded(targetOrders.map(o => o.orderId))
      showToast(`Batch processing ${targetOrders.length} receipts... Marked as downloaded.`)
      setTimeout(() => {
        printFrame.contentWindow?.focus()
        printFrame.contentWindow?.print()
      }, 350)
    }
  }

  // ── Export Enquiries / Leads to Excel-Compatible CSV ──
  const exportLeadsToCsv = (leadsToExport: Lead[]) => {
    if (!leadsToExport || leadsToExport.length === 0) {
      alert('No enquiries found to export.')
      return
    }

    // Escape CSV cell value for Excel compliance
    const escapeCsv = (val: string | number | undefined | null) => {
      if (val === undefined || val === null) return '""'
      const str = String(val).replace(/"/g, '""').replace(/\r\n/g, ' ').replace(/[\r\n]/g, ' ')
      return `"${str}"`
    }

    const headers = [
      'S.No.',
      'Enquiry ID',
      'Date & Time (IST)',
      'Customer Name',
      'Mobile Number',
      'WhatsApp Link',
      'Email Address',
      'Status',
      'Customer Requirement / Message'
    ]

    const csvRows = leadsToExport.map((lead, idx) => {
      const dt = new Date(lead.createdAt || Date.now())
      const formattedDate = dt.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })

      // Clean mobile number and format as text for Excel with tab/apostrophe so leading zeroes or country codes are not lost
      const cleanPhone = (lead.mobile || '').trim()
      const waLink = cleanPhone ? `https://wa.me/${cleanPhone.replace(/[^0-9]/g, '')}` : ''

      return [
        idx + 1,
        escapeCsv(lead.id || `ENQ-${idx + 1}`),
        escapeCsv(formattedDate),
        escapeCsv(lead.name || 'Anonymous'),
        // Using ="" prevents Excel from truncating large numbers or stripping leading characters
        cleanPhone ? `="${cleanPhone}"` : '""',
        escapeCsv(waLink),
        escapeCsv(lead.email || 'N/A'),
        escapeCsv(lead.status || 'New'),
        escapeCsv(lead.requirement || 'No message provided')
      ].join(',')
    })

    // Prepend UTF-8 BOM (\uFEFF) so Excel opens Hindi characters & special characters perfectly without garbling
    const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...csvRows].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const today = new Date().toISOString().slice(0, 10)
    link.href = url
    link.setAttribute('download', `62_Patakha_Shop_Customer_Enquiries_${today}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    showToast(`Successfully exported ${leadsToExport.length} enquiries to Excel CSV.`)
  }

  const brands = useMemo(() => Array.from(new Set(products.map(p => p.brand).filter(Boolean))).sort(), [products])
  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category).filter(Boolean))).sort(), [products])

  // Reset to page 1 whenever filters or search query change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, selectedBrand, selectedCategory, statusFilter])

  const filteredProducts = useMemo(() => {
    const rawSearch = debouncedSearch.trim().toLowerCase()
    const searchTokens = rawSearch ? rawSearch.split(/\s+/).filter(Boolean) : []

    return products.filter(p => {
      // 1. Text Search matching across all relevant product fields (Name, Brand, Category, Tags, ID, Price, MRP)
      if (searchTokens.length > 0) {
        const nameStr = (p.name || '').toLowerCase()
        const brandStr = (p.brand || '').toLowerCase()
        const catStr = (p.category || '').toLowerCase()
        const tagsStr = (p.tags || '').toLowerCase()
        const idStr = String(p.id || '').toLowerCase()
        const priceStr = String(p.price || '')
        const mrpStr = String(p.originalPrice || '')

        const fullText = `${nameStr} ${brandStr} ${catStr} ${tagsStr} ${idStr} ${priceStr} ${mrpStr}`

        // Every token typed must be found in the product text
        const matchesAllTokens = searchTokens.every(token => fullText.includes(token))
        if (!matchesAllTokens) return false
      }

      // 2. Brand Filter
      if (selectedBrand !== 'all' && (p.brand || '').toLowerCase() !== selectedBrand.toLowerCase()) {
        return false
      }

      // 3. Category Filter
      if (selectedCategory !== 'all' && (p.category || '').toLowerCase() !== selectedCategory.toLowerCase()) {
        return false
      }

      // 4. Stock Status Filter
      if (statusFilter === 'in_stock' && !p.inStock) return false
      if (statusFilter === 'out_of_stock' && p.inStock) return false
      if (statusFilter === 'low_stock') {
        const q = p.stockQuantity !== undefined ? p.stockQuantity : (p.inStock ? 50 : 0)
        if (!p.inStock || q > 10) return false
      }

      return true
    })
  }, [products, debouncedSearch, selectedBrand, selectedCategory, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredProducts.slice(start, start + pageSize)
  }, [filteredProducts, currentPage, pageSize])


  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      // 1. Order Status Filter (pending / confirmed / delivered / cancelled)
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) {
        return false
      }

      // 2. Receipt download status filter
      const isDownloaded = downloadedOrderIds.includes(o.orderId)
      if (orderReceiptFilter === 'new' && isDownloaded) return false
      if (orderReceiptFilter === 'downloaded' && !isDownloaded) return false

      // 3. Search filter
      if (!orderSearch.trim()) return true
      const q = orderSearch.toLowerCase()
      return o.orderId.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerPhone.includes(q)
    })
  }, [orders, orderSearch, orderReceiptFilter, orderStatusFilter, downloadedOrderIds])

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      if (!leadSearch.trim()) return true
      const q = leadSearch.toLowerCase()
      return l.name.toLowerCase().includes(q) || l.mobile.includes(q) || l.email.toLowerCase().includes(q) || l.requirement.toLowerCase().includes(q)
    })
  }, [leads, leadSearch])

  const inStockCount = products.filter(p => p.inStock).length
  const outOfStockCount = products.length - inStockCount
  const lowStockCount = products.filter(p => {
    const q = p.stockQuantity !== undefined ? p.stockQuantity : (p.inStock ? 50 : 0)
    return p.inStock && q <= 10
  }).length
  const totalStockWorth = products.filter(p => p.inStock).reduce((sum, p) => sum + (p.price * (p.stockQuantity ?? 50)), 0)

  // Order Counts by Status
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length
  const confirmedOrdersCount = orders.filter(o => o.status === 'confirmed').length
  const deliveredOrdersCount = orders.filter(o => o.status === 'delivered').length

  // ── Auth Verification Screen (Prevents Login Flash on Reload) ───────────
  if (isAuthChecking) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          background: '#0A0A0D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          touchAction: 'none',
          width: '100vw',
          height: '100dvh'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <Image
            src="/logo-62.png"
            alt="62 Patakha Shop"
            width={64}
            height={64}
            style={{ objectFit: 'contain' }}
            priority
          />
          <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--adm-gold)', letterSpacing: '0.3px' }}>
            ⚡ Verifying Admin Session...
          </div>
        </div>
      </div>
    )
  }

  // ── Login Screen ─────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginLogoWrap}>
            <Image
              src="/logo-62.png"
              alt="62 Patakha Shop"
              width={64}
              height={64}
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <h2 className={styles.loginTitle}>62 Patakha Admin</h2>
          <p className={styles.loginSub}>Enter the master password to access your control panel.</p>

          <form onSubmit={handleLogin} className={styles.loginForm}>
            <input
              type="password"
              placeholder="Master password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={styles.passInput}
              required
              autoFocus
            />
            {loginError && <p className={styles.errorText}>{loginError}</p>}
            <button type="submit" className={styles.btnLogin} disabled={loading}>
              {loading ? 'Verifying...' : 'Access Dashboard'}
            </button>
          </form>

          <p className={styles.hint}>Default key: <code>patakha62admin</code></p>
        </div>
      </div>
    )
  }

  // ── Dashboard ─────────────────────────────────────────
  return (
    <div className={styles.dashboard}>
      {/* PWA Mobile App Install Prompt Banner */}
      <PwaInstallBanner />

      {/* Toast with 1-Click Undo */}
      {toastState && (
        <div className={styles.toast} style={{ justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconSuccess />
            <span>{toastState.message}</span>
          </div>
          {toastState.onUndo && (
            <button
              type="button"
              onClick={() => {
                const undoFn = toastState.onUndo
                setToastState(null)
                if (undoFn) undoFn()
              }}
              style={{
                background: 'var(--adm-gold)',
                color: '#0A0A0D',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              ↩ {lang === 'hi' ? 'पूर्ववत (Undo)' : 'Undo'}
            </button>
          )}
        </div>
      )}

      {/* Custom Confirmation Modal (Mobile Bottom Sheet / Desktop Centered Modal) */}
      {confirmModal.isOpen && (
        <div className={styles.modalBackdrop} onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}>
          <div
            className={styles.modalCard}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '440px', width: '100%', borderRadius: '18px' }}
          >
            <div className={styles.modalHead} style={{ borderBottom: '1px solid var(--adm-border)', padding: '16px 18px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--adm-text)', letterSpacing: '-0.2px' }}>
                {confirmModal.title}
              </h3>
              <button
                type="button"
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className={styles.modalClose}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody} style={{ padding: '20px 18px 16px', gap: '12px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--adm-sub)', lineHeight: 1.55 }}>
                {confirmModal.message}
              </p>
            </div>

            <div className={styles.modalFooter} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '14px 18px' }}>
              <button
                type="button"
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className={styles.btnModalCancel}
              >
                {confirmModal.cancelText}
              </button>
              <button
                type="button"
                onClick={() => {
                  const fn = confirmModal.onConfirm
                  setConfirmModal(prev => ({ ...prev, isOpen: false }))
                  if (fn) fn()
                }}
                className={styles.btnModalSubmit}
                style={{
                  background: confirmModal.variant === 'danger' ? 'var(--adm-red)' : confirmModal.variant === 'warning' ? 'var(--adm-gold)' : 'var(--adm-gold)',
                  color: confirmModal.variant === 'danger' ? '#FFFFFF' : '#0A0A0D'
                }}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <header className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div className={styles.topBarLeft}>
            <div className={styles.shopLogoWrap}>
              <Image
                src="/logo-62.png"
                alt="62 Patakha Shop Logo"
                width={40}
                height={40}
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <div className={styles.dashTitleWrap}>
              <div className={styles.dashBrandRow}>
                <h1 className={styles.dashTitle}>62 Patakha Shop</h1>
                <span className={styles.adminBadge}>Admin Portal</span>
                <span className={styles.liveIndicator}>
                  <span className={styles.liveDot} /> Live
                </span>
              </div>
              <p className={styles.dashSub}>Hawa Mahal Bazar, Jaipur • Central Inventory & Orders</p>
            </div>
          </div>

          <div className={styles.topBarRight}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnStore}
              title="Open customer storefront in a new tab"
            >
              <span>{t.viewStore}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>

            {activeTab === 'products' && (
              <div className={styles.topActionsRow}>
                <button onClick={() => setShowAddModal(true)} className={styles.btnAddProd}>
                  <IconPlus /> {t.addProduct}
                </button>
                <button onClick={generatePrintReport} className={styles.btnPrint} title="Generate printable stock report">
                  <IconPrint /> {t.printReport}
                </button>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className={styles.topActionsRow}>
                <button onClick={() => setShowNewOrderModal(true)} className={styles.btnAddProd} style={{ background: '#16a34a', color: '#fff' }}>
                  <IconPlus /> {t.newCounterOrder}
                </button>
              </div>
            )}

            <button onClick={handleLogout} className={styles.btnLogout} title="Logout of Admin Panel">
              <IconLogout /> {t.logout}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabNav}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'products' ? styles.tabActive : ''}`}
            onClick={() => handleTabSwitch('products')}
          >
            <IconBox />
            <span className={styles.tabBtnText}>{t.tabInventory}</span>
            <span className={styles.tabCount}>{products.length}</span>
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'orders' ? styles.tabActive : ''}`}
            onClick={() => handleTabSwitch('orders')}
          >
            <IconCart />
            <span className={styles.tabBtnText}>{t.tabOrders}</span>
            <span className={styles.tabCount}>{orders.length}</span>
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'leads' ? styles.tabActive : ''}`}
            onClick={() => handleTabSwitch('leads')}
          >
            <IconMail />
            <span className={styles.tabBtnText}>{t.tabEnquiries}</span>
            <span className={styles.tabCount}>{leads.length}</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className={styles.contentArea}>

        {/* ── TAB 1: PRODUCTS ── */}
        {activeTab === 'products' && (
          <div>
            {/* Stats: 5-card interactive filter & valuation cards */}
            <div className={styles.statsGrid}>
              {/* 1. All Products */}
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('all')
                  setCurrentPage(1)
                  showToast('Showing all products')
                }}
                className={`${styles.statCard} ${styles.statCardClickable} ${statusFilter === 'all' ? styles.statCardActive : ''}`}
                title="Click to view all products"
                aria-pressed={statusFilter === 'all'}
              >
                <span className={styles.statLabel}>{t.totalProducts}</span>
                <span className={styles.statVal}>{products.length}</span>
                <span className={`${styles.statHint} ${statusFilter === 'all' ? styles.statHintActive : ''}`}>
                  {statusFilter === 'all' ? '● Active view' : 'Click to view all'}
                </span>
              </button>

              {/* 2. In Stock */}
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('in_stock')
                  setCurrentPage(1)
                  showToast(`Filtered to In-Stock (${inStockCount} items)`)
                }}
                className={`${styles.statCard} ${styles.statCardClickable} ${statusFilter === 'in_stock' ? styles.statCardActive : ''}`}
                title="Click to filter products in stock"
                aria-pressed={statusFilter === 'in_stock'}
              >
                <span className={styles.statLabel}>{t.inStock}</span>
                <span className={`${styles.statVal} ${styles.valGreen}`}>{inStockCount}</span>
                <span className={`${styles.statHint} ${statusFilter === 'in_stock' ? styles.statHintActive : ''}`}>
                  {statusFilter === 'in_stock' ? '● Filter applied' : 'Click to filter'}
                </span>
              </button>

              {/* 3. Low Stock */}
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('low_stock')
                  setCurrentPage(1)
                  showToast(`Filtered to Low-Stock items (${lowStockCount} items)`)
                }}
                className={`${styles.statCard} ${styles.statCardClickable} ${statusFilter === 'low_stock' ? styles.statCardActive : ''}`}
                style={{
                  borderColor: statusFilter === 'low_stock' ? 'var(--adm-gold)' : (lowStockCount > 0 ? 'rgba(234, 179, 8, 0.4)' : undefined),
                  background: statusFilter === 'low_stock' ? 'rgba(201, 158, 82, 0.08)' : (lowStockCount > 0 ? 'rgba(234, 179, 8, 0.04)' : undefined)
                }}
                title="Click to filter items with ≤ 10 stock quantity"
                aria-pressed={statusFilter === 'low_stock'}
              >
                <span className={styles.statLabel}>⚠️ {t.lowStock}</span>
                <span className={styles.statVal} style={{ color: '#d97706' }}>{lowStockCount}</span>
                <span className={`${styles.statHint} ${statusFilter === 'low_stock' ? styles.statHintActive : ''}`}>
                  {statusFilter === 'low_stock' ? '● Filter applied' : 'Click to view low stock'}
                </span>
              </button>

              {/* 4. Out of Stock */}
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('out_of_stock')
                  setCurrentPage(1)
                  showToast(`Filtered to Out-of-Stock (${outOfStockCount} items)`)
                }}
                className={`${styles.statCard} ${styles.statCardClickable} ${statusFilter === 'out_of_stock' ? styles.statCardActive : ''}`}
                title="Click to filter products out of stock"
                aria-pressed={statusFilter === 'out_of_stock'}
              >
                <span className={styles.statLabel}>{t.outOfStock}</span>
                <span className={`${styles.statVal} ${styles.valRed}`}>{outOfStockCount}</span>
                <span className={`${styles.statHint} ${statusFilter === 'out_of_stock' ? styles.statHintActive : ''}`}>
                  {statusFilter === 'out_of_stock' ? '● Filter applied' : 'Click to filter'}
                </span>
              </button>

              {/* 5. Stock Valuation */}
              <button
                type="button"
                onClick={() => {
                  generatePrintReport()
                  showToast('Stock Valuation Report opened')
                }}
                className={`${styles.statCard} ${styles.statCardClickable}`}
                title="Click to generate full printable stock inventory & valuation breakdown report"
              >
                <span className={styles.statLabel}>{t.stockValuation}</span>
                <span className={styles.statVal} style={{ fontSize: '20px', color: 'var(--adm-gold)' }}>₹{totalStockWorth.toLocaleString('en-IN')}</span>
                <span className={styles.statHint}>
                  Click for report 🖨️
                </span>
              </button>
            </div>

            {/* Filters */}
            <div className={styles.searchBarRow}>
              <div className={styles.searchInputWrap}>
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className={styles.dashSearch}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      color: 'var(--adm-muted)',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                    }}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className={styles.filterRow}>
                <CustomSelect
                  value={selectedCategory}
                  onChange={val => setSelectedCategory(val)}
                  options={[
                    { value: 'all', label: 'All Categories' },
                    ...categories.map(c => ({ value: c, label: c })),
                  ]}
                  variant="admin"
                  ariaLabel="Filter by category"
                />
                <CustomSelect
                  value={selectedBrand}
                  onChange={val => setSelectedBrand(val)}
                  options={[
                    { value: 'all', label: 'All Brands' },
                    ...brands.map(b => ({ value: b, label: b })),
                  ]}
                  variant="admin"
                  ariaLabel="Filter by brand"
                />
                <CustomSelect
                  value={statusFilter}
                  onChange={val => setStatusFilter(val as any)}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'in_stock', label: `In Stock (${inStockCount})` },
                    { value: 'low_stock', label: `⚠️ Low Stock (${lowStockCount})` },
                    { value: 'out_of_stock', label: `Out of Stock (${outOfStockCount})` },
                  ]}
                  variant="admin"
                  ariaLabel="Filter by status"
                />
              </div>
            </div>

            {/* Desktop Table */}
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>#</th>
                    <th style={{ width: 56 }}>Image</th>
                    <th>{t.productName}</th>
                    <th>{t.category}</th>
                    <th style={{ width: 100 }}>{t.price}</th>
                    <th style={{ width: 100 }}>{t.mrp}</th>
                    <th style={{ width: 110 }}>{t.stockQty}</th>
                    <th style={{ width: 130 }}>{t.status}</th>
                    <th style={{ width: 120 }}>{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--adm-muted)' }}>
                        <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>No products match your search</div>
                        <div style={{ fontSize: '13px' }}>Try searching for a different keyword or clear your filters</div>
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((p, idx) => (
                      <ProductRow
                        key={p.id}
                        product={p}
                        index={(currentPage - 1) * pageSize + idx + 1}
                        isUpdating={updatingId === p.id}
                        isInlineEditing={inlineEditId === p.id}
                        inlinePrice={inlinePrice}
                        inlineMRP={inlineMRP}
                        inlineQty={inlineQty}
                        savingInline={savingInline}
                        onStartInline={() => startInlineEdit(p)}
                        onCancelInline={cancelInlineEdit}
                        onSaveInline={() => saveInlineEdit(p)}
                        setInlinePrice={setInlinePrice}
                        setInlineMRP={setInlineMRP}
                        setInlineQty={setInlineQty}
                        onToggleStock={() => toggleStock(p)}
                        onEditProduct={() => openEditModal(p)}
                        onDelete={() => handleDeleteProduct(p)}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className={styles.mobileProductCards}>
              {paginatedProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 16px', background: 'var(--adm-surface)', borderRadius: '12px', border: '1px solid var(--adm-border)', color: 'var(--adm-muted)' }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px', color: 'var(--adm-text)' }}>No products match your search</div>
                  <div style={{ fontSize: '13px' }}>Try searching for a different keyword or clear your filters</div>
                </div>
              ) : (
                paginatedProducts.map((p) => {
                  const qty = p.stockQuantity !== undefined ? p.stockQuantity : (p.inStock ? 50 : 0)
                  return (
                    <div key={p.id} className={`${styles.mobileProductCard} ${!p.inStock ? styles.rowOutOfStock : ''}`}>
                      <div className={styles.mobileCardTop}>
                        <div className={styles.mobileThumb} onClick={() => openEditModal(p)}>
                          <Image
                            src={p.image} alt={p.name} width={58} height={58}
                            style={{ objectFit: 'contain', width: 58, height: 58 }}
                            onError={e => { (e.target as HTMLImageElement).src = '/logo-62.png' }}
                          />
                        </div>
                        <div className={styles.mobileCardInfo}>
                          <div className={styles.mobileCardName} onClick={() => openEditModal(p)}>{p.name}</div>
                          <div className={styles.mobileCardMeta}>{p.brand} &middot; <span style={{ textTransform: 'capitalize' }}>{p.category}</span></div>
                        </div>
                      </div>

                      {/* Prices & Stock (Interactive or Inline Quick Editing) */}
                      {inlineEditId === p.id ? (
                        <div className={styles.mobileInlineEditBox}>
                          <div className={styles.mobileInlineRow}>
                            <div className={styles.mobileInlineField}>
                              <label>Selling Price (₹)</label>
                              <input
                                type="number"
                                value={inlinePrice}
                                onChange={e => setInlinePrice(e.target.value)}
                                className={styles.inlineInput}
                                autoFocus
                              />
                            </div>
                            <div className={styles.mobileInlineField}>
                              <label>MRP (₹)</label>
                              <input
                                type="number"
                                value={inlineMRP}
                                onChange={e => setInlineMRP(e.target.value)}
                                className={styles.inlineInput}
                              />
                            </div>
                            <div className={styles.mobileInlineField}>
                              <label>Stock (pcs)</label>
                              <input
                                type="number"
                                value={inlineQty}
                                onChange={e => setInlineQty(e.target.value)}
                                className={styles.inlineInput}
                              />
                            </div>
                          </div>
                          <div className={styles.mobileInlineActions}>
                            <button
                              type="button"
                              onClick={() => saveInlineEdit(p)}
                              disabled={savingInline}
                              className={styles.btnSaveInline}
                            >
                              {savingInline ? 'Saving...' : '✓ Save Changes'}
                            </button>
                            <button
                              type="button"
                              onClick={cancelInlineEdit}
                              className={styles.btnCancelInline}
                            >
                              ✕ Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.mobileCardPrices}>
                          <span
                            className={styles.priceVal}
                            onClick={() => startInlineEdit(p)}
                            title="Tap to quick edit price"
                            style={{ cursor: 'pointer' }}
                          >
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                          {p.originalPrice > p.price && (
                            <span
                              className={styles.textMuted}
                              style={{ textDecoration: 'line-through', cursor: 'pointer' }}
                              onClick={() => startInlineEdit(p)}
                              title="Tap to quick edit MRP"
                            >
                              ₹{p.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                          <span
                            onClick={() => startInlineEdit(p)}
                            style={{ cursor: 'pointer' }}
                            title="Tap to quick edit stock"
                            className={`${styles.stockQtyBadge} ${!p.inStock || qty === 0 ? styles.qtyLow : qty <= 10 ? styles.qtyWarning : styles.qtyGood}`}
                          >
                            {qty <= 10 && qty > 0 ? '⚠️ ' : ''}{qty} pcs in stock
                          </span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className={styles.mobileCardActions}>
                        <button
                          onClick={() => toggleStock(p)}
                          disabled={updatingId === p.id}
                          className={`${styles.statusToggleBtn} ${p.inStock ? styles.btnInStock : styles.btnOutStock}`}
                        >
                          {p.inStock ? 'In Stock' : 'Out of Stock'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (inlineEditId === p.id) {
                              cancelInlineEdit()
                            } else {
                              startInlineEdit(p)
                            }
                          }}
                          className={`${styles.btnQuickMobile} ${inlineEditId === p.id ? styles.btnQuickMobileActive : ''}`}
                          title="Quick Price & Stock Edit"
                        >
                          <IconZap />
                        </button>
                        <button onClick={() => openEditModal(p)} className={styles.btnEditFull} title="Full Edit">
                          <IconEdit /> Edit
                        </button>
                        <button onClick={() => handleDeleteProduct(p)} className={styles.btnDelete} title="Delete">
                          <IconTrash />
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', padding: '16px 20px', background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', flexWrap: 'wrap', gap: '12px' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>
                  Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to <strong>{Math.min(currentPage * pageSize, filteredProducts.length)}</strong> of <strong>{filteredProducts.length}</strong> items
                </span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage(p => Math.max(1, p - 1))
                      window.scrollTo({ top: 300, behavior: 'smooth' })
                    }}
                    style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #d1d5db', background: currentPage === 1 ? '#f3f4f6' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600, color: currentPage === 1 ? '#9ca3af' : '#374151' }}
                  >
                    ← Previous
                  </button>
                  <span style={{ fontSize: '13px', fontWeight: 700, padding: '0 8px' }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage(p => Math.min(totalPages, p + 1))
                      window.scrollTo({ top: 300, behavior: 'smooth' })
                    }}
                    style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #d1d5db', background: currentPage === totalPages ? '#f3f4f6' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600, color: currentPage === totalPages ? '#9ca3af' : '#374151' }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: ORDERS ── */}
        {activeTab === 'orders' && (
          <div>
            {(() => {
          const unprintedOrders = orders.filter(o => !downloadedOrderIds.includes(o.orderId))
          const downloadedOrdersList = orders.filter(o => downloadedOrderIds.includes(o.orderId))

          return (
            <div className={styles.ordersSection}>
              {/* Batch Download / Actions Toolbar */}
              <div style={{
                background: 'var(--adm-surface)',
                border: '1px solid var(--adm-border)',
                borderRadius: '14px',
                padding: '16px 18px',
                marginBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--adm-gold-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--adm-gold)',
                      flexShrink: 0,
                    }}>
                      <IconPrint />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--adm-text)', letterSpacing: '-0.2px' }}>
                        Customer Order Receipts
                      </h3>
                      <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: 'var(--adm-muted)' }}>
                        Instant single-page printing &amp; receipt download.
                      </p>
                    </div>
                  </div>

                  {unprintedOrders.length > 0 ? (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: '#fef3c7',
                      border: '1px solid #fde68a',
                      color: '#b45309',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }} />
                      {unprintedOrders.length} New Unprinted
                    </span>
                  ) : (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      color: '#065f46',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}>
                      <IconCheck />
                      All Downloaded
                    </span>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                  paddingTop: '10px',
                  borderTop: '1px solid var(--adm-border)',
                }}>
                  {/* Smart Download: Only New Unprinted Orders */}
                  <button
                    type="button"
                    disabled={unprintedOrders.length === 0}
                    onClick={() => printBatchReceipts(unprintedOrders)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      background: unprintedOrders.length > 0 ? 'var(--adm-gold)' : 'var(--adm-surface2)',
                      color: unprintedOrders.length > 0 ? '#111827' : 'var(--adm-muted)',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      cursor: unprintedOrders.length > 0 ? 'pointer' : 'not-allowed',
                      boxShadow: unprintedOrders.length > 0 ? '0 2px 6px rgba(234, 179, 8, 0.25)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                    title="Smart download: only prints newly arrived receipts that haven't been downloaded yet"
                  >
                    <span>⚡ Download New ({unprintedOrders.length})</span>
                  </button>

                  {/* Batch Download All Orders */}
                  <button
                    type="button"
                    disabled={orders.length === 0}
                    onClick={() => printBatchReceipts(orders)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      background: 'var(--adm-surface)',
                      border: '1px solid var(--adm-border2)',
                      color: 'var(--adm-text)',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '12.5px',
                      cursor: orders.length > 0 ? 'pointer' : 'not-allowed',
                      transition: 'all 0.15s ease',
                    }}
                    title="Download / Print all order receipts in a single batch"
                  >
                    <span>Download All ({orders.length})</span>
                  </button>

                  {/* Reset/Clear tracking option if needed */}
                  {downloadedOrdersList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Reset download status for all ${downloadedOrdersList.length} orders? They will all be marked as New again.`)) {
                          setDownloadedOrderIds([])
                          try { localStorage.removeItem('62_downloaded_orders') } catch { }
                          showToast('All order receipts marked as New.')
                        }
                      }}
                      style={{
                        padding: '8px 12px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--adm-muted)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        marginLeft: 'auto',
                      }}
                      title="Reset download status so all orders appear as new unprinted again"
                    >
                      Reset Status
                    </button>
                  )}
                </div>
              </div>

              {/* ── Sleek Executive Order Filter Box ── */}
              <div style={{
                background: 'var(--adm-surface)',
                border: '1px solid var(--adm-border2)',
                borderRadius: '14px',
                padding: '12px 14px',
                marginBottom: '16px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                {/* Search Bar */}
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    type="text"
                    placeholder={lang === 'hi' ? 'ऑर्डर नंबर, नाम या फोन से खोजें...' : 'Search order ID, name, or phone...'}
                    value={orderSearch}
                    onChange={e => setOrderSearch(e.target.value)}
                    className={styles.dashSearch}
                    style={{
                      paddingLeft: '36px',
                      paddingRight: orderSearch ? '32px' : '14px',
                      height: '40px',
                      fontSize: '13.5px'
                    }}
                  />
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', opacity: 0.5 }}>🔍</span>
                  {orderSearch && (
                    <button
                      type="button"
                      onClick={() => setOrderSearch('')}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--adm-muted)',
                        fontSize: '14px',
                        cursor: 'pointer',
                        padding: '2px 4px'
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter Pill Track 1: Order Status (Flex Wrap - Zero Horizontal Scroll) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: 'var(--adm-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {lang === 'hi' ? 'ऑर्डर स्थिति (Status)' : 'ORDER STATUS'}
                    </span>
                    {orderStatusFilter !== 'all' && (
                      <button
                        type="button"
                        onClick={() => setOrderStatusFilter('all')}
                        style={{ fontSize: '11px', color: 'var(--adm-gold)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                      >
                        {lang === 'hi' ? 'रीसेट' : 'Clear Filter'}
                      </button>
                    )}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexWrap: 'wrap',
                    width: '100%'
                  }}>
                    {(['all', 'pending', 'confirmed', 'delivered', 'cancelled'] as const).map(st => {
                      const count = st === 'all'
                        ? orders.length
                        : st === 'pending'
                          ? pendingOrdersCount
                          : st === 'confirmed'
                            ? confirmedOrdersCount
                            : st === 'delivered'
                              ? deliveredOrdersCount
                              : orders.filter(o => o.status === 'cancelled').length

                      const label = st === 'all'
                        ? (lang === 'hi' ? 'सभी' : 'All')
                        : st === 'pending'
                          ? (lang === 'hi' ? 'पेंडिंग' : 'Pending')
                          : st === 'confirmed'
                            ? (lang === 'hi' ? 'कन्फर्म' : 'Confirmed')
                            : st === 'delivered'
                              ? (lang === 'hi' ? 'डिलीवर्ड' : 'Delivered')
                              : (lang === 'hi' ? 'रद्द' : 'Cancelled')

                      const isAct = orderStatusFilter === st
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setOrderStatusFilter(st)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '8px',
                            fontSize: '11.5px',
                            fontWeight: isAct ? 800 : 600,
                            cursor: 'pointer',
                            flex: '1 1 auto',
                            textAlign: 'center',
                            border: isAct ? '1.5px solid var(--adm-gold)' : '1px solid var(--adm-border2)',
                            background: isAct ? 'var(--adm-gold)' : 'var(--adm-surface2)',
                            color: isAct ? '#0A0A0D' : 'var(--adm-sub)',
                            boxShadow: isAct ? '0 2px 8px var(--adm-gold-glow)' : 'none',
                            transition: 'all 0.18s ease'
                          }}
                        >
                          {label} ({count})
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Filter Pill Track 2: Receipt Print Status (Equal 3-Column Grid) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', paddingTop: '4px', borderTop: '1px solid var(--adm-border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--adm-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {lang === 'hi' ? 'रसीद स्थिति (Receipts)' : 'RECEIPT STATUS'}
                  </span>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '6px',
                    width: '100%'
                  }}>
                    <button
                      type="button"
                      onClick={() => setOrderReceiptFilter('all')}
                      style={{
                        padding: '5px 6px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: orderReceiptFilter === 'all' ? 800 : 600,
                        cursor: 'pointer',
                        textAlign: 'center',
                        width: '100%',
                        border: orderReceiptFilter === 'all' ? '1.5px solid var(--adm-gold)' : '1px solid var(--adm-border2)',
                        background: orderReceiptFilter === 'all' ? 'var(--adm-gold-dim)' : 'var(--adm-surface2)',
                        color: orderReceiptFilter === 'all' ? 'var(--adm-gold)' : 'var(--adm-muted)'
                      }}
                    >
                      All ({orders.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderReceiptFilter('new')}
                      style={{
                        padding: '5px 6px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: orderReceiptFilter === 'new' ? 800 : 600,
                        cursor: 'pointer',
                        textAlign: 'center',
                        width: '100%',
                        border: orderReceiptFilter === 'new' ? '1.5px solid #eab308' : '1px solid var(--adm-border2)',
                        background: orderReceiptFilter === 'new' ? 'rgba(234, 179, 8, 0.18)' : 'var(--adm-surface2)',
                        color: orderReceiptFilter === 'new' ? '#ca8a04' : 'var(--adm-muted)'
                      }}
                    >
                      ★ New ({unprintedOrders.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderReceiptFilter('downloaded')}
                      style={{
                        padding: '5px 6px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: orderReceiptFilter === 'downloaded' ? 800 : 600,
                        cursor: 'pointer',
                        textAlign: 'center',
                        width: '100%',
                        border: orderReceiptFilter === 'downloaded' ? '1.5px solid #22c55e' : '1px solid var(--adm-border2)',
                        background: orderReceiptFilter === 'downloaded' ? 'rgba(34, 197, 94, 0.15)' : 'var(--adm-surface2)',
                        color: orderReceiptFilter === 'downloaded' ? '#16a34a' : 'var(--adm-muted)'
                      }}
                    >
                      ✓ Printed ({downloadedOrdersList.length})
                    </button>
                  </div>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className={styles.emptyCard}>
                  <div className={styles.emptyIconWrap}><IconCart /></div>
                  <h3>No Orders Found</h3>
                  <p>
                    {orderReceiptFilter === 'new'
                      ? 'All current orders have already been downloaded! New incoming orders will appear here automatically.'
                      : orderReceiptFilter === 'downloaded'
                        ? 'No downloaded order receipts yet.'
                        : 'No orders match your search and filter criteria.'}
                  </p>
                </div>
              ) : (
                <div className={styles.ordersGrid}>
                  {filteredOrders.map(order => (
                    <OrderCard
                      key={order.orderId}
                      order={order}
                      isDownloaded={downloadedOrderIds.includes(order.orderId)}
                      isExpanded={expandedOrderIds.includes(order.orderId)}
                      onSelectOrder={setSelectedOrder}
                      onStatusChange={handleOrderStatus}
                      onToggleExpand={toggleOrderExpand}
                      onMarkNew={(id) => {
                        markOrderAsNew(id)
                        showToast(`Marked ${id} as New / Unprinted.`)
                      }}
                      onPrintReceipt={printOrderReceipt}
                      lang={lang}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })()}
          </div>
        )}

        {/* ── TAB 3: LEADS ── */}
        {activeTab === 'leads' && (
          <div>
            <div className={styles.leadsSection}>
            {/* Leads Toolbar: Title, Stats & 1-Click CSV Download */}
            <div style={{
              background: 'var(--adm-surface)',
              border: '1px solid var(--adm-border)',
              borderRadius: '12px',
              padding: '16px 18px',
              marginBottom: '16px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--adm-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconMail /> Customer Enquiries
                  </h3>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '99px',
                    background: 'var(--adm-gold-dim)',
                    border: '1px solid var(--adm-gold)',
                    color: 'var(--adm-gold)',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}>
                    {leads.length} Total Received
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--adm-muted)' }}>
                  All customer queries submitted through the Contact Us page &amp; footer form.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {/* 1-Click Excel CSV Export Button */}
                <button
                  type="button"
                  disabled={leads.length === 0}
                  onClick={() => exportLeadsToCsv(filteredLeads.length > 0 && leadSearch.trim() ? filteredLeads : leads)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 18px',
                    background: leads.length > 0 ? '#107c41' : 'var(--adm-surface2)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: leads.length > 0 ? 'pointer' : 'not-allowed',
                    boxShadow: leads.length > 0 ? '0 3px 10px rgba(16, 124, 65, 0.35)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                  title="Export all customer enquiries neatly arranged in an Excel-compatible CSV file"
                >
                  <IconDownload />
                  <span>
                    {leadSearch.trim() && filteredLeads.length < leads.length
                      ? `Export Filtered CSV (${filteredLeads.length})`
                      : `Download Excel CSV (${leads.length})`}
                  </span>
                </button>
              </div>
            </div>

            <div className={styles.searchBarRow}>
              <input
                type="text"
                placeholder="Search by name, mobile, email, or requirement..."
                value={leadSearch}
                onChange={e => setLeadSearch(e.target.value)}
                className={styles.dashSearch}
              />
            </div>

            {filteredLeads.length === 0 ? (
              <div className={styles.emptyCard}>
                <div className={styles.emptyIconWrap}><IconMail /></div>
                <h3>No Enquiries Yet</h3>
                <p>Customer submissions from the Contact Us page will appear here automatically.</p>
              </div>
            ) : (
              <div className={styles.leadsGrid}>
                {filteredLeads.map(lead => (
                  <div key={lead.id} className={styles.leadCard}>
                    <div className={styles.leadHead}>
                      <h3 className={styles.leadName}>{lead.name}</h3>
                      <span className={styles.leadTime}>{new Date(lead.createdAt).toLocaleString('en-IN')}</span>
                    </div>

                    <div className={styles.leadContactRow}>
                      <a href={`tel:${lead.mobile}`} className={styles.phoneLink}>
                        <IconPhone /> {lead.mobile}
                      </a>
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} className={styles.emailLink}>{lead.email}</a>
                      )}
                      <a
                        href={`https://wa.me/${lead.mobile.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.name)}%2C%20regarding%20your%20inquiry%20at%2062%20Patakha%20Shop...`}
                        target="_blank" rel="noreferrer"
                        className={styles.waChatLink}
                      >
                        <IconWhatsApp /> WhatsApp
                      </a>
                    </div>

                    <div className={styles.leadRequirement}>
                      <p className={styles.reqLabel}>Requirement / Message</p>
                      <p className={styles.reqText}>{lead.requirement || 'No custom note provided.'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>

      {/* ── ADD PRODUCT MODAL ── */}
      {showAddModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHead}>
              <h3>Add New Product</h3>
              <button onClick={() => setShowAddModal(false)} className={styles.modalClose} aria-label="Close"><IconX /></button>
            </div>

            <form onSubmit={handleAddProduct} className={styles.modalForm}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Product Name *</label>
                  <input type="text" placeholder="e.g. 240 Shots Grand Sky Show" value={newProdName} onChange={e => setNewProdName(e.target.value)} required />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Brand *</label>
                    <input type="text" placeholder="Sony, Mercury, Azad..." value={newProdBrand} onChange={e => setNewProdBrand(e.target.value)} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Category *</label>
                    <input type="text" placeholder="sky shots, sparkler, rockets..." value={newProdCategory} onChange={e => setNewProdCategory(e.target.value)} required />
                  </div>
                </div>

                <div className={styles.formRow3}>
                  <div className={styles.formGroup}>
                    <label>Sale Price (&#x20B9;) *</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="1200"
                      value={newProdPrice}
                      onKeyDown={e => { if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault() }}
                      onChange={e => setNewProdPrice(e.target.value.replace(/[^0-9.]/g, ''))}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>MRP (&#x20B9;)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="2400"
                      value={newProdMRP}
                      onKeyDown={e => { if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault() }}
                      onChange={e => setNewProdMRP(e.target.value.replace(/[^0-9.]/g, ''))}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Stock (Pieces) *</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="50"
                      value={newProdQty}
                      onKeyDown={e => { if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault() }}
                      onChange={e => setNewProdQty(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Product Image</label>
                  <div className={styles.imageUploadBox}>
                    <div className={styles.imgPreviewWrap}>
                      <img src={newProdImage} alt="Preview" className={styles.modalImgPreview} onError={e => { (e.target as HTMLImageElement).src = '/logo-62.png' }} />
                    </div>
                    <div className={styles.uploadControls}>
                      <label className={styles.uploadFileBtn}>
                        <IconUpload /> {uploadingAddImg ? 'Uploading...' : 'Upload Image'}
                        <input type="file" accept="image/*" disabled={uploadingAddImg} style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleUploadImage(f, false) }} />
                      </label>
                      <input type="text" placeholder="Or paste image URL / path" value={newProdImage} onChange={e => setNewProdImage(e.target.value)} className={styles.uploadPathInput} />
                    </div>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Tags (Comma separated)</label>
                  <input type="text" placeholder="Mega Aerial, 240 Shot, Wedding Special" value={newProdTags} onChange={e => setNewProdTags(e.target.value)} />
                </div>

                <div className={styles.checkboxRow}>
                  <label>
                    <input type="checkbox" checked={newProdInStock} onChange={e => setNewProdInStock(e.target.checked)} />
                    Make visible in shop immediately
                  </label>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <div className={styles.modalActions}>
                  <button type="button" onClick={() => setShowAddModal(false)} className={styles.btnModalCancel}>Cancel</button>
                  <button type="submit" disabled={loading || uploadingAddImg} className={styles.btnModalSubmit}>
                    {loading ? 'Saving...' : 'Save & Publish Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT PRODUCT MODAL ── */}
      {editingProduct && (
        <div className={styles.modalBackdrop} onClick={() => setEditingProduct(null)}>
          <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHead}>
              <h3>Edit Product</h3>
              <button onClick={() => setEditingProduct(null)} className={styles.modalClose} aria-label="Close"><IconX /></button>
            </div>

            <form onSubmit={handleEditProductSubmit} className={styles.modalForm}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Product Name *</label>
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} required />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Brand *</label>
                    <input type="text" value={editBrand} onChange={e => setEditBrand(e.target.value)} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Category *</label>
                    <input type="text" value={editCategory} onChange={e => setEditCategory(e.target.value)} required />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Sale Price (&#x20B9;) *</label>
                    <input
                      type="number"
                      min="0"
                      value={editPrice}
                      onKeyDown={e => { if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault() }}
                      onChange={e => setEditPrice(e.target.value.replace(/[^0-9.]/g, ''))}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>MRP (&#x20B9;)</label>
                    <input
                      type="number"
                      min="0"
                      value={editMRP}
                      onKeyDown={e => { if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault() }}
                      onChange={e => setEditMRP(e.target.value.replace(/[^0-9.]/g, ''))}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Product Image</label>
                  <div className={styles.imageUploadBox}>
                    <div className={styles.imgPreviewWrap}>
                      <img src={editImage || '/logo-62.png'} alt="Preview" className={styles.modalImgPreview} onError={e => { (e.target as HTMLImageElement).src = '/logo-62.png' }} />
                    </div>
                    <div className={styles.uploadControls}>
                      <label className={styles.uploadFileBtn}>
                        <IconUpload /> {uploadingEditImg ? 'Uploading...' : 'Replace Image'}
                        <input type="file" accept="image/*" disabled={uploadingEditImg} style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleUploadImage(f, true) }} />
                      </label>
                      <input type="text" placeholder="Image URL or /products/..." value={editImage} onChange={e => setEditImage(e.target.value)} className={styles.uploadPathInput} />
                    </div>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Tags (Comma separated)</label>
                  <input type="text" value={editTags} onChange={e => setEditTags(e.target.value)} />
                </div>

                {/* Stock Section */}
                <div className={styles.stockSectionBox}>
                  <div className={styles.stockBoxHead}>
                    <span className={styles.stockSectionTitle}>
                      <IconInventory /> Stock &amp; Inventory
                    </span>
                    <span className={`${styles.stockQtyBadge} ${parseInt(editQty) > 0 && editInStock ? styles.qtyGood : styles.qtyLow}`}>
                      {parseInt(editQty) > 0 && editInStock ? `${editQty} pcs in stock` : 'Out of stock'}
                    </span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Available Stock (Pieces)</label>
                      <input
                        type="number" min="0" value={editQty} placeholder="50" required
                        onChange={e => {
                          const val = e.target.value
                          setEditQty(val)
                          if (parseInt(val) > 0 && !editInStock) setEditInStock(true)
                          else if (parseInt(val) === 0) setEditInStock(false)
                        }}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Shop Visibility</label>
                      <select
                        value={editInStock && parseInt(editQty) > 0 ? 'in_stock' : 'out_of_stock'}
                        onChange={e => {
                          const isIn = e.target.value === 'in_stock'
                          setEditInStock(isIn)
                          if (isIn && parseInt(editQty) <= 0) setEditQty('25')
                          else if (!isIn) setEditQty('0')
                        }}
                        className={styles.stockSelect}
                      >
                        <option value="in_stock">In Stock — Live on Shop</option>
                        <option value="out_of_stock">Out of Stock — Hidden</option>
                      </select>
                    </div>
                  </div>

                  <p className={styles.stockHint}>
                    <strong>Note:</strong> Stock decreases automatically only when you mark an order as Confirmed/Paid. WhatsApp-only inquiries do not deduct stock.
                  </p>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <div className={styles.modalActions}>
                  <button type="button" onClick={() => setEditingProduct(null)} className={styles.btnModalCancel}>Cancel</button>
                  <button type="submit" disabled={loading || uploadingEditImg} className={styles.btnModalSubmit}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ── VIEW ORDER DETAILS MODAL ── */}
      {selectedOrder && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedOrder(null)}>
          <div
            className={styles.modalCard}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '640px', width: '100%', boxSizing: 'border-box' }}
          >
            <div className={styles.modalHead}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className={styles.orderIdBadge} style={{ margin: 0 }}>
                  {selectedOrder.orderId}
                </span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  borderRadius: '5px',
                  background: selectedOrder.status === 'confirmed'
                    ? 'rgba(34,197,94,0.12)'
                    : selectedOrder.status === 'delivered'
                      ? 'rgba(99,102,241,0.12)'
                      : selectedOrder.status === 'cancelled'
                        ? 'rgba(239,68,68,0.12)'
                        : 'rgba(234,179,8,0.15)',
                  color: selectedOrder.status === 'confirmed'
                    ? '#16a34a'
                    : selectedOrder.status === 'delivered'
                      ? '#6366f1'
                      : selectedOrder.status === 'cancelled'
                        ? '#dc2626'
                        : '#d97706',
                }}>
                  {selectedOrder.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className={styles.modalClose}
                aria-label="Close"
              >
                <IconX />
              </button>
            </div>

            <div className={styles.modalBody} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Order Info & Customer Details */}
              <div style={{
                background: 'var(--adm-surface2)',
                borderRadius: '10px',
                padding: '14px 16px',
                border: '1px solid var(--adm-border)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--adm-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Customer Name
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--adm-text)', marginTop: '2px' }}>
                    {selectedOrder.customerName || 'Anonymous Customer'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: 'var(--adm-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Phone &amp; WhatsApp
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
                    <a href={`tel:${selectedOrder.customerPhone}`} style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--adm-gold)' }}>
                      {selectedOrder.customerPhone}
                    </a>
                    {selectedOrder.customerPhone && (
                      <a
                        href={`https://wa.me/${selectedOrder.customerPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 700,
                          color: '#16a34a',
                          background: 'rgba(34,197,94,0.12)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <IconWhatsApp /> WhatsApp
                      </a>
                    )}
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '11px', color: 'var(--adm-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Date &amp; Time Placed
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--adm-text)', marginTop: '2px' }}>
                    {new Date(selectedOrder.createdAt).toLocaleString('en-IN', {
                      weekday: 'short',
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </div>
                </div>

                {selectedOrder.orderNote && (
                  <div style={{ gridColumn: '1 / -1', background: 'rgba(234,179,8,0.08)', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(234,179,8,0.2)' }}>
                    <div style={{ fontSize: '11px', color: '#b45309', textTransform: 'uppercase', fontWeight: 700 }}>
                      Customer Note / Instructions
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--adm-text)', marginTop: '3px', fontStyle: 'italic' }}>
                      &ldquo;{selectedOrder.orderNote}&rdquo;
                    </div>
                  </div>
                )}
              </div>

              {/* Itemized Order Breakdown Table & Modification Controls */}
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--adm-text)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Purchased Items ({(isEditingOrder ? editOrderItems : selectedOrder.items).reduce((s, it) => s + it.quantity, 0)})</span>
                    {isEditingOrder && (
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '2px 8px', borderRadius: '4px' }}>
                        ✏️ Edit Mode Active
                      </span>
                    )}
                  </div>
                  {!isEditingOrder ? (
                    <button
                      type="button"
                      onClick={() => startEditingOrder(selectedOrder)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 10px',
                        background: 'var(--adm-surface2)',
                        border: '1px solid var(--adm-border2)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'var(--adm-gold)',
                        cursor: 'pointer',
                      }}
                      title="Remove defective items, adjust quantities, or add replacement crackers"
                    >
                      <IconEdit /> Modify / Replace Items
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={cancelEditingOrder}
                        style={{
                          padding: '4px 10px',
                          background: 'transparent',
                          border: '1px solid var(--adm-border2)',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--adm-muted)',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={savingOrderEdit}
                        onClick={handleSaveOrderEdit}
                        style={{
                          padding: '4px 12px',
                          background: 'var(--adm-gold)',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#111827',
                          cursor: savingOrderEdit ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {savingOrderEdit ? 'Saving...' : '✓ Save Changes'}
                      </button>
                    </div>
                  )}
                </div>

                <div style={{
                  border: '1px solid var(--adm-border)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: 'var(--adm-surface)',
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: 'var(--adm-surface2)', borderBottom: '1px solid var(--adm-border)', textAlign: 'left' }}>
                        <th style={{ padding: '8px 12px', color: 'var(--adm-muted)', fontWeight: 700, fontSize: '11px' }}>ITEM</th>
                        <th style={{ padding: '8px 12px', color: 'var(--adm-muted)', fontWeight: 700, fontSize: '11px', textAlign: 'center' }}>QTY</th>
                        <th style={{ padding: '8px 12px', color: 'var(--adm-muted)', fontWeight: 700, fontSize: '11px', textAlign: 'right' }}>RATE</th>
                        <th style={{ padding: '8px 12px', color: 'var(--adm-muted)', fontWeight: 700, fontSize: '11px', textAlign: 'right' }}>TOTAL</th>
                        {isEditingOrder && (
                          <th style={{ padding: '8px 12px', color: 'var(--adm-muted)', fontWeight: 700, fontSize: '11px', textAlign: 'center' }}>ACTION</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {(isEditingOrder ? editOrderItems : selectedOrder.items || []).map((it, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--adm-border)' }}>
                          <td style={{ padding: '10px 12px' }}>
                            <div style={{ fontWeight: 700, color: 'var(--adm-text)' }}>{it.name}</div>
                            {it.brand && (
                              <div style={{ fontSize: '11px', color: 'var(--adm-muted)' }}>{it.brand}</div>
                            )}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            {isEditingOrder ? (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateItemQuantity(idx, it.quantity - 1)}
                                  style={{
                                    width: '24px', height: '24px', borderRadius: '4px',
                                    border: '1px solid var(--adm-border2)', background: 'var(--adm-surface2)',
                                    cursor: 'pointer', fontWeight: 800, fontSize: '12px', color: 'var(--adm-text)'
                                  }}
                                >
                                  –
                                </button>
                                <span style={{ minWidth: '24px', fontWeight: 800, textAlign: 'center' }}>{it.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateItemQuantity(idx, it.quantity + 1)}
                                  style={{
                                    width: '24px', height: '24px', borderRadius: '4px',
                                    border: '1px solid var(--adm-border2)', background: 'var(--adm-surface2)',
                                    cursor: 'pointer', fontWeight: 800, fontSize: '12px', color: 'var(--adm-text)'
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontWeight: 600 }}>{it.quantity}</span>
                            )}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--adm-muted)' }}>₹{it.price.toLocaleString('en-IN')}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: 'var(--adm-text)' }}>
                            ₹{(it.quantity * it.price).toLocaleString('en-IN')}
                          </td>
                          {isEditingOrder && (
                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleRemoveItemFromOrder(idx)}
                                style={{
                                  background: 'rgba(239,68,68,0.1)',
                                  border: '1px solid rgba(239,68,68,0.25)',
                                  borderRadius: '6px',
                                  color: '#dc2626',
                                  padding: '4px 8px',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                                title="Remove defective or unavailable product from order"
                              >
                                Remove
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Add Replacement / Alternative Product Row in Edit Mode */}
                  {isEditingOrder && (
                    <div style={{
                      padding: '12px 14px',
                      background: 'var(--adm-surface2)',
                      borderTop: '1px solid var(--adm-border)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      flexWrap: 'wrap',
                    }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--adm-text)' }}>
                        + Add Replacement Item:
                      </span>
                      <select
                        value={selectedProductToAdd}
                        onChange={e => {
                          setSelectedProductToAdd(e.target.value)
                          handleAddProductToOrder(e.target.value)
                        }}
                        style={{
                          flex: 1,
                          minWidth: '220px',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--adm-border2)',
                          background: 'var(--adm-surface)',
                          color: 'var(--adm-text)',
                          fontSize: '12.5px',
                          outline: 'none',
                        }}
                      >
                        <option value="">-- Choose product to add --</option>
                        {products
                          .filter(p => p.inStock)
                          .map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.brand}) — ₹{p.price}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Total Summary Box */}
              <div style={{
                background: 'var(--adm-surface2)',
                borderRadius: '8px',
                padding: '12px 16px',
                border: '1px solid var(--adm-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                {(isEditingOrder ? editOrderItems : selectedOrder.items).length > 0 && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--adm-muted)' }}>
                      <span>Items Count</span>
                      <span style={{ fontWeight: 700, color: 'var(--adm-text)' }}>
                        {(isEditingOrder ? editOrderItems : selectedOrder.items).reduce((s, it) => s + it.quantity, 0)} items
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, color: 'var(--adm-text)', paddingTop: '6px', borderTop: '1px dashed var(--adm-border)' }}>
                      <span>{isEditingOrder ? 'Revised Total Amount' : 'Grand Total Amount'}</span>
                      <span style={{ color: 'var(--adm-gold)' }}>
                        ₹{(isEditingOrder
                          ? editOrderItems.reduce((sum, it) => sum + (it.price * it.quantity), 0)
                          : selectedOrder.subtotal
                        ).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className={styles.modalFooter} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--adm-muted)' }}>Status:</label>
                <div style={{ minWidth: '150px' }}>
                  <StatusSelect
                    status={selectedOrder.status}
                    onSelect={(newSt) => {
                      handleOrderStatus(selectedOrder.orderId, newSt)
                      setSelectedOrder(prev => prev ? { ...prev, status: newSt as Order['status'] } : null)
                    }}
                    lang={lang}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {/* 1-Click WhatsApp Revised Summary to Customer */}
                {selectedOrder.customerPhone && (
                  <a
                    href={`https://wa.me/${selectedOrder.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${selectedOrder.customerName || 'Customer'},\nRegarding your order *${selectedOrder.orderId}* with 62 Patakha Shop:\nYour revised order total is *₹${selectedOrder.subtotal.toLocaleString('en-IN')}* (${selectedOrder.totalCount} items).\nThank you for choosing 62 Patakha Shop!`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '8px 14px',
                      background: 'rgba(34,197,94,0.12)',
                      border: '1px solid rgba(34,197,94,0.3)',
                      borderRadius: '8px',
                      color: '#15803d',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                    title="Send updated order summary directly to customer on WhatsApp"
                  >
                    <IconWhatsApp /> Send WhatsApp Update
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => printOrderReceipt(selectedOrder)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    background: 'var(--adm-gold)',
                    color: '#111827',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                  }}
                >
                  <IconPrint /> Download / Print Receipt
                </button>
                <button
                  type="button"
                  onClick={() => {
                    cancelEditingOrder()
                    setSelectedOrder(null)
                  }}
                  className={styles.btnModalCancel}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Counter Walk-in / Phone Order Creator ── */}
      {showNewOrderModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowNewOrderModal(false)}>
          <div className={styles.modalCard} onClick={e => e.stopPropagation()} style={{ maxWidth: '650px', width: '100%', boxSizing: 'border-box' }}>
            <div className={styles.modalHead}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: 'var(--adm-text)', letterSpacing: '-0.2px' }}>⚡ Create Counter / Walk-in Order</h3>
                <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'var(--adm-muted)' }}>Create instant bill for phone, WhatsApp, or in-store walk-in customers.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewOrderModal(false)}
                className={styles.modalClose}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWalkinOrder} className={styles.modalForm}>
              <div className={styles.modalBody} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Customer Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Sharma / रमेश शर्मा"
                      value={newOrderCustName}
                      onChange={e => setNewOrderCustName(e.target.value.replace(/[^\w\s\u0900-\u097F]/g, ''))}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Mobile Number (WhatsApp)</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9829012345"
                      maxLength={10}
                      value={newOrderCustPhone}
                      onChange={e => setNewOrderCustPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Order Note / Pickup Instructions</label>
                  <input
                    type="text"
                    placeholder="e.g. Counter Cash Billing / Hawa Mahal Pickup"
                    value={newOrderNote}
                    onChange={e => setNewOrderNote(e.target.value)}
                  />
                </div>

                {/* Product Selector — Inline searchable, no native dropdown overflow */}
                <WalkinProductPicker
                  products={products}
                  lang={lang}
                  onAdd={(productId) => {
                    setNewOrderProdPick(productId)
                    handleAddWalkinItem(productId)
                    setNewOrderProdPick('')
                  }}
                />

                {/* Added Items List */}
                {newOrderItems.length > 0 ? (
                  <div style={{ marginTop: '12px', borderTop: '1px solid var(--adm-border)', paddingTop: '10px' }}>
                    <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ color: 'var(--adm-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
                          <th style={{ textAlign: 'left', paddingBottom: '6px' }}>Item</th>
                          <th style={{ textAlign: 'center', paddingBottom: '6px' }}>Qty</th>
                          <th style={{ textAlign: 'right', paddingBottom: '6px' }}>Rate</th>
                          <th style={{ textAlign: 'right', paddingBottom: '6px' }}>Total</th>
                          <th style={{ width: '30px' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {newOrderItems.map((it, idx) => (
                          <tr key={idx} style={{ borderTop: '1px solid var(--adm-border)' }}>
                            <td style={{ padding: '8px 0', fontWeight: 600 }}>{it.name}</td>
                            <td style={{ textAlign: 'center', padding: '8px 0' }}>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (it.quantity > 1) {
                                      setNewOrderItems(prev => prev.map((x, i) => i === idx ? { ...x, quantity: x.quantity - 1 } : x))
                                    } else {
                                      setNewOrderItems(prev => prev.filter((_, i) => i !== idx))
                                    }
                                  }}
                                  style={{
                                    width: '28px', height: '28px', borderRadius: '6px',
                                    border: '1px solid var(--adm-border2)', background: 'var(--adm-surface)',
                                    cursor: 'pointer', fontWeight: 700, fontSize: '14px', color: 'var(--adm-text)',
                                    touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                  }}
                                >
                                  –
                                </button>
                                <span style={{ minWidth: '22px', fontWeight: 700, fontSize: '13.5px', color: 'var(--adm-text)' }}>{it.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewOrderItems(prev => prev.map((x, i) => i === idx ? { ...x, quantity: x.quantity + 1 } : x))
                                  }}
                                  style={{
                                    width: '28px', height: '28px', borderRadius: '6px',
                                    border: '1px solid var(--adm-border2)', background: 'var(--adm-surface)',
                                    cursor: 'pointer', fontWeight: 700, fontSize: '14px', color: 'var(--adm-text)',
                                    touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td style={{ textAlign: 'right', padding: '8px 0', color: 'var(--adm-muted)' }}>₹{it.price}</td>
                            <td style={{ textAlign: 'right', padding: '8px 0', fontWeight: 700, color: 'var(--adm-gold)' }}>₹{(it.quantity * it.price).toLocaleString('en-IN')}</td>
                            <td style={{ textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => setNewOrderItems(prev => prev.filter((_, i) => i !== idx))}
                                style={{
                                  background: 'none', border: 'none', color: 'var(--adm-red)',
                                  cursor: 'pointer', fontSize: '15px', padding: '6px',
                                  touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
                                }}
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Bill Summary */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '2px dashed var(--adm-border)' }}>
                      <span style={{ fontSize: '13px', color: 'var(--adm-muted)' }}>
                        Total Items: <strong>{newOrderItems.reduce((s, it) => s + it.quantity, 0)}</strong>
                      </span>
                      <span style={{ fontSize: '17px', fontWeight: 800, color: 'var(--adm-text)' }}>
                        Grand Total: <strong style={{ color: 'var(--adm-gold)' }}>₹{newOrderItems.reduce((s, it) => s + (it.price * it.quantity), 0).toLocaleString('en-IN')}</strong>
                      </span>
                    </div>
                  </div>
                ) : (
                  <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--adm-muted)', textAlign: 'center' }}>
                    No items added yet. Search a product above to start billing.
                  </p>
                )}
              </div>

              <div className={styles.modalFooter}>
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => setShowNewOrderModal(false)}
                    className={styles.btnModalCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingOrder || newOrderItems.length === 0}
                    className={styles.btnModalSubmit}
                  >
                    {creatingOrder ? 'Creating Bill...' : '⚡ Generate Order & Print Bill'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Walkin Product Picker (Inline Custom Searchable, No Native Dropdown Overflow) ──
function WalkinProductPicker({
  products,
  lang = 'hi',
  onAdd,
}: {
  products: Product[]
  lang?: 'en' | 'hi'
  onAdd: (productId: string) => void
}) {
  const [query, setQuery] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const isHi = lang === 'hi'

  // Returns ALL matching products without artificial 30-item slice cut-off
  const filtered = React.useMemo(() => {
    if (!query.trim()) return products
    const q = query.toLowerCase()
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      String(p.price).includes(q)
    )
  }, [products, query])

  // Close on outside click/tap
  React.useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [open])

  function handleSelect(p: Product) {
    onAdd(p.id)
    setQuery('')
    setOpen(false)
  }

  const handlePick = (e: React.SyntheticEvent, p: Product) => {
    e.preventDefault()
    e.stopPropagation()
    handleSelect(p)
  }

  return (
    <div
      ref={containerRef}
      style={{
        background: 'var(--adm-surface2)',
        padding: '14px',
        borderRadius: '10px',
        border: '1px solid var(--adm-border)',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--adm-text)', margin: 0 }}>
          {isHi ? '+ पटाखा खोजें और बिल में जोड़ें' : '+ Search & Add Firework Product'}
        </label>
        <span style={{ fontSize: '11px', color: 'var(--adm-muted)', fontWeight: 600 }}>
          {filtered.length} {isHi ? 'पटाखे उपलब्ध' : `product${filtered.length !== 1 ? 's' : ''} available`}
        </span>
      </div>

      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          placeholder={isHi ? '🔍 पटाखा नाम या ब्रांड लिखकर खोजें...' : '🔍 Type product name or brand to search...'}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
          style={{
            width: '100%',
            padding: '10px 36px 10px 12px',
            borderRadius: '8px',
            border: '1px solid var(--adm-border2)',
            background: 'var(--adm-surface)',
            color: 'var(--adm-text)',
            fontSize: '14px',
            outline: 'none',
            fontFamily: 'var(--adm-font)',
            boxSizing: 'border-box',
          }}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setOpen(false) }}
            style={{
              position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--adm-muted)', fontSize: '14px', lineHeight: 1, padding: '6px',
            }}
          >✕</button>
        )}
      </div>

      {/* Inline scrollable dropdown — shows all products with high-contrast touch items */}
      {open && filtered.length > 0 && (
        <div
          style={{
            marginTop: '6px',
            background: 'var(--adm-surface)',
            border: '1.5px solid var(--adm-gold-border, var(--adm-border2))',
            borderRadius: '10px',
            maxHeight: '260px',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          }}
        >
          {filtered.map(p => {
            const qty = p.stockQuantity ?? (p.inStock ? 50 : 0)
            const isOutOfStock = !p.inStock || qty <= 0
            return (
              <button
                key={p.id}
                type="button"
                onMouseDown={e => handlePick(e, p)}
                onTouchStart={e => handlePick(e, p)}
                onClick={e => handlePick(e, p)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '10px 14px',
                  minHeight: '46px',
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid var(--adm-border)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'var(--adm-font)',
                  gap: '10px',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--adm-gold-dim)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--adm-text)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.name}
                  </span>
                  <span style={{ fontSize: '11px', color: isOutOfStock ? '#ef4444' : 'var(--adm-muted)' }}>
                    {p.brand} · {isOutOfStock ? '⚠️ Out of Stock (0 pcs)' : `Stock: ${qty} pcs`}
                  </span>
                </span>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--adm-gold)', flexShrink: 0 }}>
                  ₹{p.price.toLocaleString('en-IN')}
                </span>
                <span style={{
                  fontSize: '11.5px', fontWeight: 700,
                  color: isOutOfStock ? '#ef4444' : '#15803d',
                  background: isOutOfStock ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                  border: isOutOfStock ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(34,197,94,0.25)',
                  borderRadius: '6px', padding: '3px 8px', flexShrink: 0,
                }}>
                  + Add
                </span>
              </button>
            )
          })}
        </div>
      )}
      {open && query.trim() && filtered.length === 0 && (
        <div style={{ marginTop: '6px', padding: '12px 14px', background: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '8px', fontSize: '13px', color: 'var(--adm-muted)', textAlign: 'center' }}>
          No matching products found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  )
}

// ── Product Row (Desktop Table) ────────────────────────
const ProductRow = memo(function ProductRow({
  product, index, isUpdating, isInlineEditing, inlinePrice, inlineMRP, inlineQty, savingInline,
  onStartInline, onCancelInline, onSaveInline, setInlinePrice, setInlineMRP, setInlineQty,
  onToggleStock, onEditProduct, onDelete,
}: {
  product: Product
  index: number
  isUpdating: boolean
  isInlineEditing: boolean
  inlinePrice: string
  inlineMRP: string
  inlineQty: string
  savingInline: boolean
  onStartInline: () => void
  onCancelInline: () => void
  onSaveInline: () => void
  setInlinePrice: (val: string) => void
  setInlineMRP: (val: string) => void
  setInlineQty: (val: string) => void
  onToggleStock: () => void
  onEditProduct: () => void
  onDelete: () => void
}) {
  const qty = product.stockQuantity !== undefined ? product.stockQuantity : (product.inStock ? 50 : 0)

  return (
    <tr className={`${styles.tableRow} ${!product.inStock ? styles.rowOutOfStock : ''}`}>
      <td className={styles.textMuted}>{index}</td>
      <td>
        <div className={styles.thumbWrap} onClick={onEditProduct} style={{ cursor: 'pointer' }} title="Click to edit">
          <Image
            src={product.image} alt={product.name} width={46} height={46}
            className={styles.thumb}
            onError={e => { (e.target as HTMLImageElement).src = '/logo-62.png' }}
          />
        </div>
      </td>
      <td>
        <div className={styles.prodName} onClick={onEditProduct} style={{ cursor: 'pointer' }}>{product.name}</div>
        <div className={styles.prodBrand}>{product.brand}</div>
      </td>
      <td className={styles.categoryCell}>{product.category}</td>

      {/* Price Column: Readonly or Inline Input */}
      <td>
        {isInlineEditing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <span style={{ fontSize: '12px', color: 'var(--adm-gold)', fontWeight: 700 }}>₹</span>
            <input
              type="number"
              value={inlinePrice}
              onChange={e => setInlinePrice(e.target.value)}
              className={styles.inlineInput}
              autoFocus
            />
          </div>
        ) : (
          <span className={styles.priceVal} onClick={onStartInline} style={{ cursor: 'pointer' }} title="Click to quick-edit price">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
        )}
      </td>

      {/* MRP Column: Readonly or Inline Input */}
      <td>
        {isInlineEditing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <span style={{ fontSize: '12px', color: 'var(--adm-muted)' }}>₹</span>
            <input
              type="number"
              value={inlineMRP}
              onChange={e => setInlineMRP(e.target.value)}
              className={styles.inlineInput}
            />
          </div>
        ) : (
          <span className={styles.textMuted} onClick={onStartInline} style={{ cursor: 'pointer' }} title="Click to quick-edit MRP">
            ₹{product.originalPrice.toLocaleString('en-IN')}
          </span>
        )}
      </td>

      {/* Stock Quantity Column: Readonly badge or Inline Input */}
      <td>
        {isInlineEditing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="number"
              value={inlineQty}
              onChange={e => setInlineQty(e.target.value)}
              className={styles.inlineInput}
              style={{ width: '60px' }}
            />
            <span style={{ fontSize: '11px', color: 'var(--adm-muted)' }}>pcs</span>
          </div>
        ) : (
          <span
            onClick={onStartInline}
            style={{ cursor: 'pointer' }}
            title="Click to quick-edit quantity"
            className={`${styles.stockQtyBadge} ${!product.inStock || qty === 0 ? styles.qtyLow : qty <= 10 ? styles.qtyWarning : styles.qtyGood}`}
          >
            {qty <= 10 && qty > 0 ? '⚠️ ' : ''}{qty} pcs
          </span>
        )}
      </td>

      {/* Status Toggle Button */}
      <td>
        <button
          onClick={onToggleStock} disabled={isUpdating}
          className={`${styles.statusToggleBtn} ${product.inStock ? styles.btnInStock : styles.btnOutStock}`}
        >
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </button>
      </td>

      {/* Actions: Save / Cancel during inline edit, or Edit / Quick-Edit / Delete */}
      <td>
        {isInlineEditing ? (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <button
              onClick={onSaveInline}
              disabled={savingInline}
              style={{
                background: 'var(--adm-gold)',
                color: '#111',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              title="Save inline changes"
            >
              {savingInline ? '...' : '✓ Save'}
            </button>
            <button
              onClick={onCancelInline}
              style={{
                background: 'transparent',
                border: '1px solid var(--adm-border2)',
                color: 'var(--adm-muted)',
                borderRadius: '6px',
                padding: '6px 8px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
              title="Cancel"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className={styles.actionGroup}>
            <button onClick={onEditProduct} className={styles.btnEditFull} title="Edit product details">
              <IconEdit /> Edit
            </button>
            <button onClick={onStartInline} className={styles.btnQuickSquare} title="Quick inline price & stock edit">
              ⚡
            </button>
            <button onClick={onDelete} className={styles.btnDelete} title="Delete product">
              <IconTrash />
            </button>
          </div>
        )}
      </td>
    </tr>
  )
})

// ── Order Card Component (Memoized for 0ms Tab Switching & List Performance) ──
const OrderCard = memo(function OrderCard({
  order,
  isDownloaded,
  isExpanded,
  onSelectOrder,
  onStatusChange,
  onToggleExpand,
  onMarkNew,
  onPrintReceipt,
  lang,
}: {
  order: Order
  isDownloaded: boolean
  isExpanded: boolean
  onSelectOrder: (order: Order) => void
  onStatusChange: (orderId: string, newStatus: string) => void
  onToggleExpand: (orderId: string, e: React.MouseEvent) => void
  onMarkNew: (orderId: string) => void
  onPrintReceipt: (order: Order) => void
  lang: 'en' | 'hi'
}) {
  const cleanPhone = (order.customerPhone || '').replace(/[^0-9]/g, '')
  const waStatusMsg = encodeURIComponent(
    `Namaste ${order.customerName || 'Customer'}! 🎆\n` +
    `Update on your 62 Patakha Shop Order *#${order.orderId}*:\n` +
    `• Status: *${order.status.toUpperCase()}*\n` +
    `• Items: ${order.totalCount} products\n` +
    `• Total Bill: *₹${order.subtotal.toLocaleString('en-IN')}*\n\n` +
    `Showroom: 62, Hawa Mahal Bazar, Jaipur.\n` +
    `Thank you for celebrating with us!`
  )

  return (
    <div
      className={styles.orderCard}
      onClick={() => onSelectOrder(order)}
      title="Click to view & edit full order details"
    >
      <div className={styles.orderHead}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onSelectOrder(order)
              }}
              className={styles.orderIdBadge}
              style={{
                cursor: 'pointer',
                border: 'none',
                fontFamily: 'inherit',
                transition: 'transform 0.15s ease, background 0.15s ease',
              }}
              title="Click to view full order details"
            >
              {order.orderId} ↗
            </button>
            {isDownloaded ? (
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#22c55e',
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.25)',
                padding: '2px 7px',
                borderRadius: '5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px'
              }}>
                ✓ Downloaded
              </span>
            ) : (
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#eab308',
                background: 'rgba(234, 179, 8, 0.15)',
                border: '1px solid rgba(234, 179, 8, 0.35)',
                padding: '2px 7px',
                borderRadius: '5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px'
              }}>
                ★ New / Unprinted
              </span>
            )}
          </div>
          <span className={styles.orderTime}>{new Date(order.createdAt).toLocaleString('en-IN')}</span>
        </div>
        <StatusSelect
          status={order.status}
          onSelect={(newSt) => onStatusChange(order.orderId, newSt)}
          lang={lang}
        />
      </div>

      <div className={styles.orderQuickActions} onClick={(e) => e.stopPropagation()}>
        <div className={styles.quickActionsFlex}>
          {order.status === 'pending' && (
            <button type="button" onClick={() => onStatusChange(order.orderId, 'confirmed')} className={styles.btnQuickConfirm}>
              <IconCheck /> Confirm &amp; Paid
            </button>
          )}
          {order.status === 'confirmed' && (
            <button type="button" onClick={() => onStatusChange(order.orderId, 'delivered')} className={styles.btnQuickDeliver}>
              <IconTruck /> Mark Delivered
            </button>
          )}
          {order.status !== 'cancelled' && (
            <button type="button" onClick={() => onStatusChange(order.orderId, 'cancelled')} className={styles.btnQuickCancel}>
              <IconX /> Cancel
            </button>
          )}
        </div>
      </div>

      <div className={styles.customerBox}>
        <p><strong>Customer:</strong> {order.customerName}</p>
        <p>
          <strong>Phone:</strong>{' '}
          <a
            href={`tel:${order.customerPhone}`}
            className={styles.phoneLink}
            onClick={(e) => e.stopPropagation()}
            title="Click to direct dial customer"
          >
            📞 {order.customerPhone}
          </a>
          {cleanPhone && (
            <a
              href={`https://wa.me/${cleanPhone}?text=${waStatusMsg}`}
              target="_blank" rel="noreferrer"
              className={styles.waChatLink}
              onClick={(e) => e.stopPropagation()}
              title="Send pre-filled WhatsApp status update to customer"
            >
              <IconWhatsApp /> WhatsApp Dispatch
            </a>
          )}
        </p>
        {order.orderNote && <p className={styles.orderNote}><strong>Note:</strong> &ldquo;{order.orderNote}&rdquo;</p>}
      </div>

      <div className={styles.orderItemsList} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.itemsToggleBtn}
          onClick={(e) => onToggleExpand(order.orderId, e)}
        >
          <span className={styles.itemsTitle}>
            Items Ordered ({order.totalCount})
          </span>
          <span className={styles.toggleArrow}>
            {isExpanded ? '▲ Hide items' : '▼ Show items'}
          </span>
        </button>

        {isExpanded && (
          <div className={styles.itemsExpandList}>
            {order.items.map((it, i) => (
              <div key={i} className={styles.orderItemRow}>
                <span>{it.name} <small>({it.brand})</small></span>
                <span>{it.quantity} &times; &#x20B9;{it.price} = <strong>&#x20B9;{it.quantity * it.price}</strong></span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.orderFooter}>
        <div>
          <span className={styles.orderTotal}>Total: &#x20B9;{order.subtotal.toLocaleString('en-IN')}</span>
          {order.totalSavings > 0 && (
            <span className={styles.orderSavings}> (Saved &#x20B9;{order.totalSavings})</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
          {isDownloaded && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onMarkNew(order.orderId)
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--adm-muted)',
                fontSize: '11.5px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              title="Mark this receipt as unprinted / new again"
            >
              Mark as New
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onPrintReceipt(order)
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              background: isDownloaded ? 'var(--adm-surface2)' : 'var(--adm-gold-dim)',
              border: '1px solid',
              borderColor: isDownloaded ? 'var(--adm-border2)' : 'var(--adm-gold)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12.5px',
              fontWeight: 700,
              color: isDownloaded ? 'var(--adm-text)' : 'var(--adm-gold)',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
            }}
            title="Download / Print customer receipt on the same page with item breakdown and prices"
          >
            <IconPrint /> {isDownloaded ? 'Re-print Receipt' : 'Download / Print Receipt'}
          </button>
        </div>
      </div>
    </div>
  )
})
