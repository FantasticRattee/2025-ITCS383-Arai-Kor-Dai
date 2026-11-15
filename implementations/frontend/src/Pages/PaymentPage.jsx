import { useState, useEffect, useRef } from "react";
import {
  CreditCard, QrCode, Landmark, Store, Wallet, HandCoins, User, CalendarDays, Lock, Tag,
  ShieldCheck, Clock3, Check, CircleCheck, Download, Plus, History, Package, Smartphone,
} from "lucide-react";
import AppShell from "../components/AppShell";
import { Field, Control, PanelHead } from "../components/ui";
import "./PaymentPage.css";

const API_URL = process.env.REACT_APP_API_URL || "https://two025-itcs383-arai-kor-dai-cyio.onrender.com/api";

const METHOD_NAMES = {
  card: "Credit/Debit Card", promptpay: "PromptPay",
  transfer: "Bank Transfer",  cash: "Pay at Counter",
  wallet: "e-Wallet",         cod: "Cash on Delivery",
};

const METHODS = [
  { id:"card",      icon:CreditCard, name:"Credit / Debit",  desc:"Visa, Mastercard, JCB"    },
  { id:"promptpay", icon:QrCode,     name:"PromptPay",        desc:"Scan QR to pay instantly" },
  { id:"transfer",  icon:Landmark,   name:"Bank Transfer",    desc:"Direct bank transfer"     },
  { id:"cash",      icon:Store,      name:"Pay at Counter",   desc:"Pay at any post office"   },
  { id:"wallet",    icon:Wallet,     name:"e-Wallet",         desc:"TrueMoney, Rabbit LINE"   },
  { id:"cod",       icon:HandCoins,  name:"COD",              desc:"Cash on delivery (+฿30)"  },
];

// ── Formatters ──
function fmtCardNum(v) {
  return v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
}
function fmtExpiry(v) {
  let d = v.replace(/\D/g,"").slice(0,4);
  if (d.length >= 3) d = d.slice(0,2)+"/"+d.slice(2);
  return d;
}
function cardDisplay(raw) {
  const d = raw.replace(/\s/g,"").padEnd(16,"•");
  return d.replace(/(.{4})/g,"$1 ").trim();
}

// ════════════════════════════════════════════════
//  CARD PREVIEW
// ════════════════════════════════════════════════
function CardPreview({ num, name, expiry }) {
  return (
    <div className="pay-card-preview" aria-hidden="true">
      <div className="pay-card-top">
        <div className="pay-card-chip" />
        <CreditCard className="pay-card-brand" />
      </div>
      <div className="pay-card-num mono">{cardDisplay(num)}</div>
      <div className="pay-card-bottom">
        <div>
          <div className="pay-card-label">Card Holder</div>
          <div className="pay-card-value">{name.toUpperCase() || "YOUR NAME"}</div>
        </div>
        <div>
          <div className="pay-card-label">Expires</div>
          <div className="pay-card-value mono">{expiry || "MM/YY"}</div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  PROMPTPAY QR PANEL
// ════════════════════════════════════════════════
function PromptPayPanel({ amount, trackId, active }) {
  const qrRef = useRef(null);
  const [timer, setTimer] = useState(600);
  const [expired, setExpired] = useState(false);
  const [refNum, setRefNum]   = useState("—");
  const timerRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    // Generate QR via QRCode lib (loaded via CDN in index.html)
    if (qrRef.current && window.QRCode) {
      qrRef.current.innerHTML = "";
      const promptPayId = "0021489001234";
      const amtStr = String(amount) + ".00";
      const payload = buildPromptPayPayload(promptPayId, amtStr);
      new window.QRCode(qrRef.current, {
        text: payload, width: 180, height: 180,
        colorDark: "#1a1a2e", colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel.M,
      });
    }
    const ref = "PP" + trackId.replace("PO-","") + Math.floor(Math.random()*100).toString().padStart(2,"0");
    setRefNum(ref);
    setTimer(600); setExpired(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(s => {
        if (s <= 1) { clearInterval(timerRef.current); setExpired(true); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [active, amount, trackId]);

  const m = Math.floor(timer/60).toString().padStart(2,"0");
  const s = (timer%60).toString().padStart(2,"0");

  return (
    <div className="pp">
      <div className="pp-head">
        <span className="tag"><QrCode aria-hidden="true" />PromptPay</span>
        <span className="pp-amount num">฿{amount}</span>
      </div>
      <div className="pp-qr-frame">
        <div ref={qrRef} className={`pp-qr${expired ? " is-expired" : ""}`} aria-label="PromptPay QR code" role="img">
          {!window.QRCode && <QrCode className="pp-qr-fallback" aria-hidden="true" />}
        </div>
      </div>
      <div className="pp-ref">
        <div className="eyebrow">Reference</div>
        <div className="mono">{refNum}</div>
      </div>
      <div className={`pp-timer${expired || timer <= 60 ? " is-urgent" : ""}`} aria-live="polite">
        <Clock3 aria-hidden="true" />
        <span>QR expires in <strong className="num">{expired ? "Expired" : `${m}:${s}`}</strong></span>
      </div>
      <div className="pp-howto">
        <div className="pp-howto-title">How to pay</div>
        <ol>
          <li>Open your bank or wallet app</li>
          <li>Tap <strong>"Scan QR"</strong> or <strong>"Pay via QR"</strong></li>
          <li>Scan the code above</li>
          <li>Confirm the amount and tap <strong>Pay</strong></li>
        </ol>
      </div>
      <p className="pp-banks">Supports: KBank · SCB · KTB · BBL · BAY · TTB · GSB</p>
    </div>
  );
}

// ── PromptPay helpers ──
function buildPromptPayPayload(promptPayId, amount) {
  function tlv(tag, value) { return tag + value.length.toString().padStart(2,"0") + value; }
  const merchantAcct = tlv("00","A000000677010111") + tlv("01",promptPayId);
  let payload = "000201" + tlv("29",merchantAcct) + "5303764" + tlv("54",amount) + "5802TH6304";
  return payload + crc16(payload);
}
function crc16(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) crc = (crc & 0x8000) ? (crc<<1)^0x1021 : crc<<1;
  }
  return ((crc&0xFFFF).toString(16).toUpperCase()).padStart(4,"0");
}

// ════════════════════════════════════════════════
//  SUCCESS OVERLAY
// ════════════════════════════════════════════════
function SuccessOverlay({ data, onDownload }) {
  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="pay-success-title">
        <div className="modal-center">
          <div className="modal-icon modal-icon--success"><CircleCheck aria-hidden="true" /></div>
          <h2 id="pay-success-title">Payment Successful!</h2>
          <p>Your shipment is confirmed and will be processed shortly. Check your history for updates.</p>
        </div>
        <div className="modal-body" style={{ paddingTop: 0 }}>
          <div className="kv pay-receipt">
            {[["Tracking ID",data.trackId,"mono"],["Amount Paid",`฿${data.amount}`,"num"],
              ["Method",data.method,""],["Date",data.date,"num"]].map(([k,v,cls])=>(
              <div className="kv-row" key={k}>
                <span className="kv-key">{k}</span>
                <span className={`kv-val${cls?" "+cls:""}`}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-foot pay-success-actions">
          <button type="button" className="btn btn-primary btn-block" onClick={onDownload}>
            <Download aria-hidden="true" />
            Download Shipping Label (PDF)
          </button>
          <a href="/create-shipment" className="btn btn-secondary">
            <Plus aria-hidden="true" />
            New Shipment
          </a>
          <a href="/history" className="btn btn-secondary">
            <History aria-hidden="true" />
            Shipment History
          </a>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════
export default function PaymentPage() {
  // ── Read URL params ──
  const params     = new URLSearchParams(window.location.search);
  const trackId    = params.get("trackId")   || "PO-20240325001";
  const totalRaw   = params.get("total")     || "฿85";
  const pkg        = params.get("pkg")       || "Parcel";
  const svc        = params.get("svc")       || "Standard";
  const from       = params.get("sprov")     || params.get("from") || "—";
  const to         = params.get("rprov")     || params.get("to")   || "—";
  const weight     = params.get("weight")    || "—";
  const sname      = params.get("sname")     || "—";
  const sphone     = params.get("sphone")    || "—";
  const saddr      = params.get("saddr")     || "—";
  const sprov      = params.get("sprov")     || "—";
  const szip       = params.get("szip")      || "—";
  const rname      = params.get("rname")     || "—";
  const rphone     = params.get("rphone")    || "—";
  const raddr      = params.get("raddr")     || "—";
  const rprov      = params.get("rprov")     || "—";
  const rzip       = params.get("rzip")      || "—";
  const contents   = params.get("contents")  || "—";
  const declval    = params.get("declval")   || "—";
  const insurance  = params.get("insurance") || "No";
  const handling   = params.get("handling")  || "None";
  const dims       = params.get("dims")      || "";
  const baseAmount = parseInt(totalRaw.replace(/[^0-9]/g,"")) || 85;

  // ── State ──
  const [method,   setMethod]   = useState("card");
  const [card,     setCard]     = useState({ num:"", name:"", expiry:"", cvv:"" });
  const [errors,   setErrors]   = useState({});
  const [coupon,   setCoupon]   = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg,setCouponMsg]= useState({ text:"", ok:true });
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(null);

  const codExtra = method === "cod" ? 30 : 0;
  const total    = baseAmount - discount + codExtra;

  // ── Card input helpers ──
  function setCardField(k) {
    return (e) => {
      let v = e.target.value;
      if (k==="num")    v = fmtCardNum(v);
      if (k==="expiry") v = fmtExpiry(v);
      if (k==="name")   v = v.toUpperCase();
      setCard(p=>({...p,[k]:v}));
      setErrors(p=>({...p,[k]:""}));
    };
  }

  // ── Coupon ──
  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    if (code === "POST10") {
      setDiscount(Math.round(baseAmount * 0.1));
      setCouponMsg({ text:"Promo code applied! 10% discount added.", ok:true });
    } else {
      setDiscount(0);
      setCouponMsg({ text:"Invalid promo code.", ok:false });
    }
  }

  // ── Card validation ──
  function validateCard() {
    const errs = {};
    if (card.num.replace(/\s/g,"").length !== 16) errs.num    = "Please enter a valid card number.";
    if (card.name.trim().length < 2)              errs.name   = "Card holder name required.";
    if (!/^\d{2}\/\d{2}$/.test(card.expiry))      errs.expiry = "Invalid expiry date.";
    if (card.cvv.length < 3)                       errs.cvv    = "CVV required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Process payment ──
  async function processPayment() {
    if (method === "card" && !validateCard()) return;
    setLoading(true);
    const payload = {
      userId: 1, trackId, total, pkg, svc,
      sname, sphone, saddr, sprov, szip,
      rname, rphone, raddr, rprov, rzip,
      weight, dims, contents, declval, insurance, handling,
      paymentMethod: METHOD_NAMES[method] || method,
      paymentRef: trackId + "-" + Date.now(),
    };
    try {
      const res  = await fetch(`${API_URL}/shipments`, {
        method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Server error");
      setSuccess({
        trackId, amount: total,
        method: METHOD_NAMES[method] || method,
        date: new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }),
      });
    } catch (err) {
      alert(`Payment could not be saved: ${err.message}\n\nPlease try again or contact support.`);
    } finally {
      setLoading(false);
    }
  }

  // ── Download PDF label ──
  function downloadShippingLabel() {
    if (!window.jspdf) { alert("PDF library not loaded. Add jsPDF to index.html."); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit:"mm", format:"a5", orientation:"portrait" });
    const W=148, H=210;
    const finalTotal = success?.amount || total;
    const finalMethod = success?.method || METHOD_NAMES[method];
    const finalDate   = success?.date   || new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
    const issuedTime  = new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});

    const box=(x,y,w,h,r,fill)=>{ doc.setFillColor(...fill); r?doc.roundedRect(x,y,w,h,r,r,"F"):doc.rect(x,y,w,h,"F"); };
    const txt=(text,x,y,opts={})=>doc.text(String(text||"—"),x,y,opts);

    // Header
    box(0,0,W,26,0,[192,57,43]); box(0,0,W,13,0,[210,80,60]);
    doc.setFont("helvetica","bold"); doc.setFontSize(16); doc.setTextColor(255,255,255);
    txt("THAILAND POST",8,11);
    doc.setFont("helvetica","normal"); doc.setFontSize(7); doc.setTextColor(255,210,210);
    txt("Official Shipping Label  -  Thailand Post Co., Ltd.",8,17);
    box(W-42,4,38,18,3,[255,255,255,0.15]);
    doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(255,255,255);
    txt(svc.toUpperCase(),W-40,11);
    doc.setFontSize(6); doc.setTextColor(255,200,200); txt(pkg.toUpperCase(),W-40,17);

    // Tracking ID
    box(6,29,W-12,22,3,[255,245,245]);
    doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(180,60,60);
    txt("TRACKING NUMBER",W/2,35,{align:"center"});
    doc.setFontSize(17); doc.setTextColor(192,57,43);
    txt(trackId,W/2,46,{align:"center"});

    // Barcode visual
    const barX=14,barY=53,barH=9,barW=W-28,bars=70,bw=barW/bars;
    const seed=trackId.split("").reduce((a,c)=>a+c.charCodeAt(0),0);
    for(let i=0;i<bars;i++){
      const thick=((seed*(i+7))%5)<2;
      const w=thick?bw*1.6:bw*0.75;
      if(i%2===0){doc.setFillColor(20,20,40);doc.rect(barX+i*bw,barY,w,barH,"F");}
    }
    doc.setFont("helvetica","normal"); doc.setFontSize(6); doc.setTextColor(120,80,80);
    txt(trackId.replace("PO-","").split("").join("  "),W/2,barY+barH+3.5,{align:"center"});

    // FROM/TO
    const addrY=70,colW=(W-18)/2,colH=46;
    box(6,addrY,colW,colH,3,[253,245,245]);
    doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(192,57,43);
    txt("FROM",9,addrY+6);
    doc.setFontSize(8.5); doc.setTextColor(20,20,40);
    txt(sname.slice(0,22),9,addrY+12);
    doc.setFont("helvetica","normal"); doc.setFontSize(7.2); doc.setTextColor(80,50,50);
    txt(sphone,9,addrY+18);
    doc.setFontSize(7); txt(saddr.slice(0,28),9,addrY+23);
    doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(192,57,43);
    txt(`${sprov}  ${szip}`,9,addrY+32);

    const toX=6+colW+6;
    box(toX,addrY,colW,colH,3,[192,57,43]);
    doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(255,210,210);
    txt("TO",toX+3,addrY+6);
    doc.setFontSize(8.5); doc.setTextColor(255,255,255);
    txt(rname.slice(0,22),toX+3,addrY+12);
    doc.setFont("helvetica","normal"); doc.setFontSize(7.2); doc.setTextColor(255,220,220);
    txt(rphone,toX+3,addrY+18);
    doc.setFontSize(7); txt(raddr.slice(0,28),toX+3,addrY+23);
    doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(255,240,150);
    txt(`${rprov}  ${rzip}`,toX+3,addrY+32);

    // Parcel table
    const tableY=addrY+colH+6;
    box(6,tableY,W-12,7,0,[192,57,43]);
    doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(255,255,255);
    txt("PARCEL DETAILS",9,tableY+4.8);
    const rows=[["Package Type",pkg],["Service Level",svc],["Weight",weight],
      ["Contents",contents],["Declared Value",declval&&declval!=="—"?`THB ${declval}`:"—"],
      ["Insurance",insurance],["Special Handling",handling||"None"],
      ["Amount Paid",`THB ${finalTotal}`],["Payment Method",finalMethod]];
    let ry=tableY+7;
    rows.forEach(([k,v],i)=>{
      box(6,ry,W-12,7.5,0,i%2===0?[252,244,244]:[255,250,250]);
      doc.setFont("helvetica","normal"); doc.setFontSize(7); doc.setTextColor(140,80,80);
      txt(k,10,ry+5);
      doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(20,20,40);
      txt(String(v||"—").slice(0,30),W-10,ry+5,{align:"right"});
      ry+=7.5;
    });
    doc.setDrawColor(220,180,180); doc.setLineWidth(0.3);
    doc.rect(6,tableY,W-12,7+rows.length*7.5);

    // Footer
    const footY=ry+4;
    box(6,footY,W-12,10,2,[255,245,245]);
    doc.setFont("helvetica","normal"); doc.setFontSize(6.5); doc.setTextColor(140,100,100);
    txt(`Issued: ${finalDate}  ${issuedTime}`,10,footY+4);
    txt(`Ref: ${trackId}`,10,footY+8);
    doc.setFont("helvetica","bold"); doc.setFontSize(6.5); doc.setTextColor(192,57,43);
    txt("Keep this label attached until delivered.",W-10,footY+4,{align:"right"});
    txt(`Thailand Post © ${new Date().getFullYear()}`,W-10,footY+8,{align:"right"});
    box(0,H-10,W,10,0,[192,57,43]);
    doc.setFont("helvetica","bold"); doc.setFontSize(6.5); doc.setTextColor(255,255,255);
    txt("thailandpost.th  |  Call Center 1545  |  postoffice@post.th",W/2,H-4,{align:"center"});

    doc.save(`ShippingLabel_${trackId}.pdf`);
  }

  return (
    <AppShell
      active="payments"
      title="Payment"
      subtitle="Complete your shipment payment securely"
      back={{ href: "/create-shipment", label: "Edit Shipment" }}
    >
      {/* Steps */}
      <ol className="pay-steps" aria-label="Checkout progress">
        {[{n:"1",l:"Shipment",cls:"done"},{n:"2",l:"Payment",cls:"active"},{n:"3",l:"Confirmation",cls:""}].map(({n,l,cls})=>(
          <li className={`pay-step${cls?" is-"+cls:""}`} key={l} aria-current={cls==="active" ? "step" : undefined}>
            <span className="pay-step-num">{cls==="done" ? <Check aria-hidden="true" strokeWidth={3} /> : n}</span>
            <span className="pay-step-label">{l}</span>
          </li>
        ))}
      </ol>

      {/* Main grid */}
      <div className="pay-grid">

        {/* LEFT */}
        <div className="stack">

          {/* Shipment recap */}
          <section className="panel">
            <PanelHead icon={Package} title="Shipment Details" subtitle="Review before paying">
              <span className="tag tag--outline"><span className="muted">Tracking</span><span className="mono" style={{ color: "var(--ink)" }}>{trackId}</span></span>
            </PanelHead>
            <dl className="pay-recap">
              {[["From",from],["To",to],["Package",pkg],
                ["Service",svc],["Weight",weight],["Amount",totalRaw]].map(([label,val])=>(
                <div className="pay-recap-cell" key={label}>
                  <dt>{label}</dt>
                  <dd className="num">{val}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Payment method */}
          <section className="panel">
            <PanelHead icon={CreditCard} title="Payment Method" subtitle="Choose how you'd like to pay" />
            <div className="panel-body">

              <div className="choice-grid pay-methods" role="radiogroup" aria-label="Payment method">
                {METHODS.map(m=>(
                  <label key={m.id} className={`choice${method===m.id?" is-selected":""}`}>
                    <input type="radio" name="pay-method" checked={method===m.id} onChange={()=>setMethod(m.id)} />
                    <span className="choice-check" aria-hidden="true">{method===m.id && <Check strokeWidth={3} />}</span>
                    <m.icon className="choice-icon" aria-hidden="true" />
                    <span className="choice-title">{m.name}</span>
                    <span className="choice-sub">{m.desc}</span>
                  </label>
                ))}
              </div>

              {/* Card panel */}
              {method==="card" && (
                <div className="pay-panel fade-up">
                  <CardPreview num={card.num} name={card.name} expiry={card.expiry} />
                  <div className="subhead">Card Details</div>
                  <div className="form-grid">
                    <Field id="card-num" label="Card Number" required className="span-2" error={errors.num}>
                      <Control icon={CreditCard}>
                        <input id="card-num" type="text" inputMode="numeric" autoComplete="cc-number" className="input mono" placeholder="1234 5678 9012 3456" maxLength={19} value={card.num} onChange={setCardField("num")} aria-invalid={errors.num ? true : undefined} aria-describedby={errors.num ? "card-num-error" : undefined} />
                      </Control>
                    </Field>
                    <Field id="card-name" label="Card Holder Name" required className="span-2" error={errors.name}>
                      <Control icon={User}>
                        <input id="card-name" type="text" autoComplete="cc-name" className="input" placeholder="SOMCHAI JAIDEE" value={card.name} onChange={setCardField("name")} style={{ textTransform:"uppercase" }} aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? "card-name-error" : undefined} />
                      </Control>
                    </Field>
                    <Field id="card-exp" label="Expiry Date" required error={errors.expiry}>
                      <Control icon={CalendarDays}>
                        <input id="card-exp" type="text" inputMode="numeric" autoComplete="cc-exp" className="input mono" placeholder="MM/YY" maxLength={5} value={card.expiry} onChange={setCardField("expiry")} aria-invalid={errors.expiry ? true : undefined} aria-describedby={errors.expiry ? "card-exp-error" : undefined} />
                      </Control>
                    </Field>
                    <Field id="card-cvv" label="CVV / CVC" required error={errors.cvv}>
                      <Control icon={Lock}>
                        <input id="card-cvv" type="password" inputMode="numeric" autoComplete="cc-csc" className="input mono" placeholder="•••" maxLength={4} value={card.cvv} onChange={setCardField("cvv")} aria-invalid={errors.cvv ? true : undefined} aria-describedby={errors.cvv ? "card-cvv-error" : undefined} />
                      </Control>
                    </Field>
                  </div>
                </div>
              )}

              {/* PromptPay panel */}
              {method==="promptpay" && (
                <div className="pay-panel fade-up">
                  <PromptPayPanel amount={total} trackId={trackId} active={method==="promptpay"} />
                </div>
              )}

              {/* Bank Transfer panel */}
              {method==="transfer" && (
                <div className="pay-panel fade-up">
                  <ul className="pay-banks">
                    {[{name:"Krungthai Bank (KTB)",acc:"123-4-56789-0"},
                      {name:"Kasikorn Bank (KBANK)",acc:"098-7-65432-1"},
                      {name:"SCB (Siam Commercial)",acc:"555-6-78901-2"}].map(b=>(
                      <li className="pay-bank" key={b.name}>
                        <span className="list-icon"><Landmark aria-hidden="true" /></span>
                        <div>
                          <strong>{b.name}</strong>
                          <span>Account: <span className="mono">{b.acc}</span> · Thai Post Office Co., Ltd.</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="pay-note">
                    After transfer, please keep your slip and reference Tracking ID <strong className="mono">{trackId}</strong> in the remarks.
                  </p>
                </div>
              )}

              {/* Cash panel */}
              {method==="cash" && (
                <div className="pay-panel fade-up">
                  <div className="alert alert--warning pay-info">
                    <Store aria-hidden="true" />
                    <div>
                      <strong>Pay at any Post Office Counter</strong>
                      <p>Bring this tracking ID to any Thailand Post branch and pay at the counter. Your shipment will be processed after payment is confirmed.</p>
                      <p>Amount due: <strong className="num">฿{total}</strong></p>
                    </div>
                  </div>
                </div>
              )}

              {/* e-Wallet panel */}
              {method==="wallet" && (
                <div className="pay-panel fade-up">
                  <div className="choice-grid pay-wallets">
                    {[{icon:Wallet,name:"TrueMoney",desc:"Scan or enter number"},
                      {icon:Smartphone,name:"Rabbit LINE Pay",desc:"Scan with LINE app"},
                      {icon:Store,name:"ShopeePay",desc:"Pay via Shopee app"}].map(w=>(
                      <div className="choice" style={{ cursor:"default" }} key={w.name}>
                        <w.icon className="choice-icon" aria-hidden="true" />
                        <span className="choice-title">{w.name}</span>
                        <span className="choice-sub">{w.desc}</span>
                      </div>
                    ))}
                  </div>
                  <p className="pay-note">Select your preferred wallet and follow the on-screen instructions to complete payment.</p>
                </div>
              )}

              {/* COD panel */}
              {method==="cod" && (
                <div className="pay-panel fade-up">
                  <div className="alert alert--info pay-info">
                    <HandCoins aria-hidden="true" />
                    <div>
                      <strong>Cash on Delivery (COD)</strong>
                      <p>The receiver pays upon delivery. A COD surcharge of <strong>฿30</strong> has been added to the total. Ensure the receiver is aware of the amount to be collected.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Coupon */}
              <div className="subhead" style={{ marginTop: 28 }}>Coupon / Promo Code</div>
              <Field
                id="coupon"
                label={<span className="sr-only">Promo code</span>}
                error={couponMsg.text && !couponMsg.ok ? couponMsg.text : undefined}
                ok={couponMsg.text && couponMsg.ok ? couponMsg.text : undefined}
              >
                <div className="pay-coupon">
                  <Control icon={Tag}>
                    <input id="coupon" type="text" className="input" placeholder="Enter promo code (try POST10)" value={coupon} onChange={e=>setCoupon(e.target.value)} onKeyDown={e=>e.key==="Enter"&&applyCoupon()} />
                  </Control>
                  <button type="button" className="btn btn-secondary" onClick={applyCoupon}>Apply</button>
                </div>
              </Field>

            </div>
          </section>
        </div>

        {/* RIGHT — order summary */}
        <aside className="pay-summary-wrap" aria-label="Order summary">
          <div className="panel">
            <PanelHead title="Order Summary" subtitle="Payment breakdown" />
            <div className="panel-body">
              <div className="kv kv--compact">
                {[["Tracking ID",trackId,"mono"],["Package Type",pkg,""],["Service Level",svc,""],
                  ["Route",`${from} → ${to}`,""],["Shipping Fee",totalRaw,"num"]].map(([k,v,cls])=>(
                  <div className="kv-row" key={k}>
                    <span className="kv-key">{k}</span>
                    <span className={`kv-val${cls?" "+cls:""}`}>{v}</span>
                  </div>
                ))}
                {discount > 0 && (
                  <div className="kv-row">
                    <span className="kv-key">Discount (10%)</span>
                    <span className="kv-val num" style={{ color:"var(--success)" }}>-฿{discount}</span>
                  </div>
                )}
                {method==="cod" && (
                  <div className="kv-row">
                    <span className="kv-key">COD Surcharge</span>
                    <span className="kv-val num">฿30</span>
                  </div>
                )}
              </div>
              <div className="pay-total">
                <span>Total Due</span>
                <span className="pay-total-amt num">฿{total}</span>
              </div>

              <button type="button" className={`btn btn-primary btn-lg btn-block${loading?" is-loading":""}`} onClick={processPayment} disabled={loading} aria-busy={loading}>
                {loading ? (
                  <><span className="spinner" aria-hidden="true" /><span className="sr-only">Processing payment</span></>
                ) : (
                  <><Lock aria-hidden="true" /><span>Pay ฿{total}</span></>
                )}
              </button>

              <div className="pay-secure">
                <ShieldCheck aria-hidden="true" />
                <span>256-bit SSL encrypted · Secure payment</span>
              </div>

              <div className="pay-logos" aria-label="Accepted payment types">
                {["VISA","MC","JCB","QR","COD"].map(l=><span key={l} className="tag tag--outline">{l}</span>)}
              </div>
            </div>
          </div>
        </aside>

      </div>

      {success && <SuccessOverlay data={success} onDownload={downloadShippingLabel} />}
    </AppShell>
  );
}
