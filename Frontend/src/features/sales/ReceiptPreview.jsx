import { useState, useEffect }             from 'react'
import { formatCurrency, formatDateTime }  from '../../utils/formatters'
import { Printer, Store, CheckCircle }     from 'lucide-react'
import Button                              from '../../components/ui/Button'
import shopService                         from '../../services/shopService'

export default function ReceiptPreview({ sale }) {
  const [shopName, setShopName]     = useState(sale?.shop_name || null)
  const [isPrinting, setIsPrinting] = useState(false)

  // Fetch shop name from API if missing
  useEffect(() => {
    if (!sale || sale.shop_name) {
      if (sale?.shop_name) setShopName(sale.shop_name)
      return
    }
    if (!sale.shop_id) return

    shopService.getById(sale.shop_id)
      .then((res) => {
        const name = res?.data?.data?.shop_name
                  || res?.data?.shop_name
                  || res?.data?.name
                  || null
        if (name) setShopName(name)
      })
      .catch(() => {})
  }, [sale])

  if (!sale) return null

  const displayShopName = shopName || 'ShopNest POS'
  const itemCount       = sale.items?.reduce((s, i) => s + Number(i.quantity || 0), 0) ?? 0
  const totalAmount     = Number(sale.total_amount    || 0)
  const tenderedAmount  = Number(sale.tendered_amount || 0)
  const change          = tenderedAmount - totalAmount

  // --- Silent Iframe Printing (No Popups) ---
  const handlePrint = () => {
    setIsPrinting(true)

    // Create a hidden iframe
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    document.body.appendChild(iframe)

    // Increased sizes for a "bigger" physical print
    const receiptHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt_${sale.sale_id ?? 'POS'}</title>
          <style>
            @page { margin: 0; size: auto; }
            body {
              margin: 0; 
              padding: 20px; 
              font-family: 'Courier New', Courier, monospace;
              background: #fff; 
              color: #000;
              font-size: 16px; /* BUMPED FONT SIZE FOR BIGGER PRINT */
              line-height: 1.5;
            }
            .container {
              max-width: 450px; /* WIDER CONTAINER */
              margin: 0 auto;
            }
            .center  { text-align: center; }
            .bold    { font-weight: bold; }
            .title   { font-size: 26px; font-weight: 900; letter-spacing: 1px; margin-bottom: 4px; }
            .sub     { font-size: 18px; margin-bottom: 8px; }
            .small   { font-size: 14px; }
            .divider { border-top: 2px dashed #000; margin: 16px 0; }
            .row {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              gap: 12px; margin: 6px 0;
            }
            .item-name  { flex: 1; word-break: break-word; }
            .item-price { white-space: nowrap; text-align: right; min-width: 80px; }
            .total      { font-size: 22px; font-weight: bold; margin: 12px 0; }
            .footer     { margin-top: 30px; text-align: center; font-size: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="center">
              <div class="title">${displayShopName}</div>
              <div class="sub">Official Receipt</div>
            </div>

            <div class="divider"></div>

            <div class="small">
              <div class="row">
                <span>Date:</span>
                <span>${formatDateTime(sale.sale_date)}</span>
              </div>
              <div class="row">
                <span>Receipt #:</span>
                <span class="bold">${String(sale.sale_id ?? '').padStart(8, '0')}</span>
              </div>
              ${sale.cashier_name ? `<div class="row"><span>Cashier:</span><span>${sale.cashier_name}</span></div>` : ''}
            </div>

            <div class="divider"></div>

            <div class="row bold">
              <span class="item-name">ITEM</span>
              <span class="item-price">AMOUNT</span>
            </div>

            <div class="divider"></div>

            ${sale.items?.map((item) => {
              const qty       = Number(item.quantity  || 0)
              const unitPrice = Number(item.unit_price || 0)
              const lineTotal = qty * unitPrice
              return `
                <div style="margin-bottom:10px;">
                  <div class="row bold">
                    <span class="item-name">${item.product_name ?? 'Item'}</span>
                    <span class="item-price">${formatCurrency(lineTotal)}</span>
                  </div>
                  <div class="small" style="padding-left:8px;">
                    ${qty} x ${formatCurrency(unitPrice)}
                  </div>
                </div>`
            }).join('') ?? ''}

            <div class="divider"></div>

            <div class="row">
              <span>Total Items:</span>
              <span class="bold">${itemCount}</span>
            </div>

            <div class="row total">
              <span>TOTAL</span>
              <span>${formatCurrency(totalAmount)}</span>
            </div>

            ${tenderedAmount > 0 ? `
              <div class="row">
                <span>Tendered:</span>
                <span>${formatCurrency(tenderedAmount)}</span>
              </div>
              <div class="row bold" style="font-size: 18px;">
                <span>CHANGE:</span>
                <span>${formatCurrency(Math.max(0, change))}</span>
              </div>` : ''}

            <div class="divider"></div>

            <div class="footer">
              <div class="bold">*** Thank You! ***</div>
              <div>Please keep this receipt for your records.</div>
              <div style="margin-top:12px; font-size:12px;">Powered by ShopNest POS</div>
            </div>
          </div>
        </body>
      </html>
    `

    const doc = iframe.contentWindow.document
    doc.open()
    doc.write(receiptHtml)
    doc.close()

    // Wait a fraction of a second to ensure styles/layout apply, then print
    setTimeout(() => {
      iframe.contentWindow.focus()
      iframe.contentWindow.print()
      
      // Cleanup after print dialog closes
      setTimeout(() => {
        document.body.removeChild(iframe)
        setIsPrinting(false)
      }, 1000)
    }, 500)
  }

  return (
    <div className="flex flex-col h-full bg-[#085558]/10 rounded-2xl animate-fade-in">
      
      {/* --- Digital Receipt Ticket --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-2 mb-4">
        <div className="bg-[#06363D] border border-[#84BABF]/20 rounded-xl p-5 sm:p-6 shadow-xl relative font-mono text-sm">
          
          {/* Top Zig-Zag or shadow decoration */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-xl" />

          {/* Header */}
          <div className="text-center pb-5 border-b border-dashed border-[#84BABF]/30 space-y-1.5">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-[#006F73]/20 rounded-full border border-[#006F73]/40">
                <Store size={24} className="text-[#84BABF]" />
              </div>
            </div>
            <h2 className="text-xl font-black text-[#E0EDE9] tracking-widest uppercase">
              {displayShopName}
            </h2>
            <p className="text-xs text-[#84BABF] uppercase tracking-wider font-bold">Official Receipt</p>
            
            <div className="pt-2 text-xs text-slate-400 space-y-0.5">
              <p>{sale.sale_date ? formatDateTime(sale.sale_date) : '—'}</p>
              <p>Receipt #{String(sale.sale_id ?? '').padStart(8, '0')}</p>
              {sale.cashier_name && <p>Cashier: {sale.cashier_name}</p>}
            </div>
          </div>

          {/* Items */}
          <div className="py-4 space-y-3 border-b border-dashed border-[#84BABF]/30">
            {sale.items?.map((item, i) => {
              const qty       = Number(item.quantity || 0)
              const unitPrice = Number(item.unit_price || 0)
              const lineTotal = qty * unitPrice
              
              return (
                <div key={i} className="flex flex-col gap-0.5 text-xs text-[#E0EDE9]">
                  <div className="flex justify-between font-bold">
                    <span className="flex-1 pr-2 truncate">{item.product_name}</span>
                    <span>{formatCurrency(lineTotal)}</span>
                  </div>
                  <span className="text-slate-400">
                    {qty} x {formatCurrency(unitPrice)}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Totals */}
          <div className="pt-4 space-y-2">
            <div className="flex justify-between text-lg font-black text-[#E0EDE9]">
              <span>TOTAL</span>
              <span className="text-emerald-400">{formatCurrency(totalAmount)}</span>
            </div>
            
            {tenderedAmount > 0 && (
              <div className="pt-2 space-y-1">
                <div className="flex justify-between text-xs text-slate-400 font-bold">
                  <span>Tendered</span>
                  <span>{formatCurrency(tenderedAmount)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#84BABF]">
                  <span>Change</span>
                  <span>{formatCurrency(Math.max(0, change))}</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer message */}
          <div className="mt-8 text-center text-xs text-slate-500">
            <CheckCircle size={16} className="mx-auto mb-2 text-emerald-500/50" />
            <p>Thank you for your purchase!</p>
          </div>
        </div>
      </div>

      {/* --- Action Button --- */}
      <div className="px-2 shrink-0">
        <Button
          fullWidth
          size="lg"
          icon={isPrinting ? null : <Printer size={18} />}
          onClick={handlePrint}
          disabled={isPrinting}
          className="bg-[#006F73] hover:bg-[#085558] text-[#E0EDE9] font-bold text-base py-3 rounded-xl shadow-lg border border-[#006F73]/50 transition-all"
        >
          {isPrinting ? 'Preparing Print...' : 'Print Receipt'}
        </Button>
      </div>

    </div>
  )
}