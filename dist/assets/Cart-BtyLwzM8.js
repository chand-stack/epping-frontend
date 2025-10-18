import{j as e,r as j}from"./ui-DvNP05M7.js";import{c as S,g as k,C as b,a as N,B as o,X as I,h as P,i as A,t as v,f as q,L as f}from"./index-VxDcpnsG.js";import{M,P as _}from"./plus-Bw_GmxtA.js";import{o as z,T as R}from"./orderManagement-DsclU38I.js";import{A as E}from"./arrow-left-DDu8PoyW.js";import"./vendor-gH-7aFTg.js";/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]],W=S("credit-card",B);/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],Y=S("loader-circle",L),U=({item:t})=>{const{updateQuantity:s,removeItem:r}=k(),l=i=>{s(t.id,i)},a=()=>{r(t.id)},h=i=>{switch(i){case"OhSmash":return"text-ohsmash";case"Wonder Wings":return"text-wonder-wings";case"Okra Green":return"text-okra-green";default:return"text-primary"}};return e.jsx(b,{className:"hover:shadow-md transition-shadow",children:e.jsx(N,{className:"p-4",children:e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx("div",{className:"w-16 h-16 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0",children:e.jsx("span",{className:"text-2xl",children:t.brand==="OhSmash"?"🍔":t.brand==="Wonder Wings"?"🍗":"🍛"})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"flex-1",children:[e.jsx("h3",{className:"font-semibold text-lg truncate",children:t.name}),e.jsx("p",{className:"text-sm text-muted-foreground truncate",children:t.description}),e.jsxs("div",{className:"flex items-center space-x-2 mt-1",children:[e.jsx("span",{className:`text-sm font-medium ${h(t.brand)}`,children:t.brand}),t.options?.sauce&&e.jsx("span",{className:"text-xs bg-secondary px-2 py-1 rounded",children:t.options.sauce}),t.options?.size&&e.jsx("span",{className:"text-xs bg-secondary px-2 py-1 rounded",children:t.options.size})]})]}),e.jsx(o,{variant:"ghost",size:"sm",onClick:a,className:"text-muted-foreground hover:text-destructive",children:e.jsx(I,{className:"w-4 h-4"})})]}),e.jsxs("div",{className:"flex items-center justify-between mt-3",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(o,{variant:"outline",size:"sm",onClick:()=>l(t.quantity-1),disabled:t.quantity<=1,className:"w-8 h-8 p-0",children:e.jsx(M,{className:"w-3 h-3"})}),e.jsx("span",{className:"w-8 text-center font-medium",children:t.quantity}),e.jsx(o,{variant:"outline",size:"sm",onClick:()=>l(t.quantity+1),className:"w-8 h-8 p-0",children:e.jsx(_,{className:"w-3 h-3"})})]}),e.jsxs("div",{className:"text-right",children:[e.jsxs("div",{className:"font-semibold",children:["£",(t.price*t.quantity).toFixed(2)]}),t.quantity>1&&e.jsxs("div",{className:"text-xs text-muted-foreground",children:["£",t.price.toFixed(2)," each"]})]})]})]})]})})})};class H{restaurantEmail="eppingfoodcourt@gmail.com";restaurantName="Epping Food Court";async sendOrderConfirmationEmail(s){try{const r=this.generateOrderConfirmationEmail(s);return console.log("📧 Order Confirmation Email:",{to:s.customerEmail,subject:`Order Confirmation #${s.orderId} - ${this.restaurantName}`,content:r}),await this.simulateEmailSending(s.customerEmail,r),!0}catch(r){return console.error("Failed to send order confirmation email:",r),!1}}async sendRestaurantNotificationEmail(s){try{const r=this.generateRestaurantNotificationEmail(s);return console.log("📧 Restaurant Notification Email:",{to:this.restaurantEmail,subject:`New Order #${s.orderId} - ${s.orderType.toUpperCase()}`,content:r}),await this.simulateEmailSending(this.restaurantEmail,r),!0}catch(r){return console.error("Failed to send restaurant notification email:",r),!1}}generateOrderConfirmationEmail(s){const r=s.orderType==="delivery"?"Delivery":"Pickup",l=this.getPaymentMethodText(s.paymentMethod);return`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Confirmation - ${this.restaurantName}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .total { font-weight: bold; font-size: 18px; color: #000; }
        .footer { text-align: center; padding: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍔 ${this.restaurantName}</h1>
            <h2>Order Confirmation</h2>
        </div>
        
        <div class="content">
            <h3>Thank you for your order, ${s.customerName}!</h3>
            <p>Your order has been received and is being prepared.</p>
            
            <div class="order-details">
                <h4>Order Details</h4>
                <p><strong>Order ID:</strong> #${s.orderId}</p>
                <p><strong>Order Type:</strong> ${r}</p>
                <p><strong>Payment Method:</strong> ${l}</p>
                <p><strong>Phone:</strong> ${s.customerPhone}</p>
                
                ${s.orderType==="delivery"&&s.deliveryAddress?`
                <p><strong>Delivery Address:</strong><br>
                ${s.deliveryAddress.street}<br>
                ${s.deliveryAddress.city} ${s.deliveryAddress.postcode}</p>
                `:""}
                
                ${s.estimatedTime?`<p><strong>Estimated Time:</strong> ${s.estimatedTime}</p>`:""}
                
                ${s.specialInstructions?`<p><strong>Special Instructions:</strong> ${s.specialInstructions}</p>`:""}
            </div>
            
            <div class="order-details">
                <h4>Your Order</h4>
                ${s.items.map(a=>`
                <div class="item">
                    <span>${a.quantity}x ${a.name}</span>
                    <span>£${(a.price*a.quantity).toFixed(2)}</span>
                </div>
                `).join("")}
                <div class="item total">
                    <span>Total</span>
                    <span>£${s.total.toFixed(2)}</span>
                </div>
            </div>
            
            <p>We'll contact you when your order is ready for ${s.orderType==="delivery"?"delivery":"pickup"}.</p>
            
            <p>If you have any questions, please call us at <strong>01992279414</strong>.</p>
        </div>
        
        <div class="footer">
            <p>${this.restaurantName}<br>
            53 High St, Epping CM16 4BA, UK<br>
            Phone: 01992279414</p>
        </div>
    </div>
</body>
</html>
    `}generateRestaurantNotificationEmail(s){const r=s.orderType==="delivery"?"DELIVERY":"PICKUP",l=this.getPaymentMethodText(s.paymentMethod);return`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Order #${s.orderId} - ${this.restaurantName}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #dc2626; }
        .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .total { font-weight: bold; font-size: 18px; color: #dc2626; }
        .urgent { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚨 NEW ORDER ALERT</h1>
            <h2>Order #${s.orderId} - ${r}</h2>
        </div>
        
        <div class="content">
            <div class="urgent">
                <h3>⚠️ Action Required</h3>
                <p>A new order has been placed and requires your attention.</p>
            </div>
            
            <div class="order-details">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> ${s.customerName}</p>
                <p><strong>Phone:</strong> ${s.customerPhone}</p>
                <p><strong>Email:</strong> ${s.customerEmail}</p>
                <p><strong>Order Type:</strong> ${r}</p>
                <p><strong>Payment Method:</strong> ${l}</p>
                
                ${s.orderType==="delivery"&&s.deliveryAddress?`
                <p><strong>Delivery Address:</strong><br>
                ${s.deliveryAddress.street}<br>
                ${s.deliveryAddress.city} ${s.deliveryAddress.postcode}</p>
                `:""}
                
                ${s.estimatedTime?`<p><strong>Estimated Time:</strong> ${s.estimatedTime}</p>`:""}
                
                ${s.specialInstructions?`<p><strong>Special Instructions:</strong> ${s.specialInstructions}</p>`:""}
            </div>
            
            <div class="order-details">
                <h4>Order Items</h4>
                ${s.items.map(a=>`
                <div class="item">
                    <span>${a.quantity}x ${a.name}</span>
                    <span>£${(a.price*a.quantity).toFixed(2)}</span>
                </div>
                `).join("")}
                <div class="item total">
                    <span>Total</span>
                    <span>£${s.total.toFixed(2)}</span>
                </div>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Confirm the order with the customer</li>
                <li>Begin food preparation</li>
                <li>Update order status in the admin dashboard</li>
                <li>Contact customer when ready for ${s.orderType==="delivery"?"delivery":"pickup"}</li>
            </ul>
        </div>
    </div>
</body>
</html>
    `}getPaymentMethodText(s){switch(s){case"cash_on_delivery":return"💰 Cash on Delivery";case"pay_at_pickup":return"💵 Pay at Pickup";case"card":return"💳 Card (Online)";case"online":return"🌐 Online Payment";default:return s}}async simulateEmailSending(s,r){await new Promise(l=>setTimeout(l,1e3)),console.log(`✅ Email sent to: ${s}`)}}const F=new H,G=()=>{const{state:t,clearCart:s}=k(),[r,l]=j.useState(!1),[a,h]=j.useState("delivery"),[i,u]=j.useState({name:"",phone:"",email:"",address:{street:"",city:"Epping",postcode:"CM16 4BA"},paymentMethod:"pay_at_pickup"}),c=(n,d)=>{if(n.includes(".")){const[m,x]=n.split(".");u(p=>({...p,[m]:{...p[m],[x]:d}}))}else u(m=>({...m,[n]:d}))},w=async(n,d,m,x,p)=>{try{const g={orderId:n,customerName:d.name,customerEmail:d.email,customerPhone:d.phone,orderType:p,items:m.map(C=>({name:C.name,quantity:C.quantity,price:C.price})),total:x,deliveryAddress:p==="delivery"?d.address:void 0,paymentMethod:p==="delivery"?"cash_on_delivery":"pay_at_pickup",specialInstructions:d.specialInstructions};await F.sendOrderConfirmationEmail(g),await F.sendRestaurantNotificationEmail(g),console.log("Order emails sent successfully")}catch(g){console.error("Failed to send order emails:",g)}},y=async n=>{if(n.preventDefault(),!i.name||!i.phone||!i.email){v.error("Please fill in all required fields");return}if(a==="delivery"&&!i.address.street){v.error("Please provide delivery address");return}l(!0);try{const d=Math.random().toString(36).substr(2,9),m={id:d,status:"pending",customerInfo:{name:i.name,phone:i.phone,email:i.email},items:t.items.map(x=>({name:x.name,quantity:x.quantity,price:x.price})),total:t.total,orderType:a,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};z.storeOrder(m),await w(d,i,t.items,t.total,a),v.success(`Order submitted successfully! Order ID: ${d}`),s()}catch(d){console.error("Order submission error:",d),v.error("Failed to submit order. Please try again.")}finally{l(!1)}},$=a==="delivery"?2.5:0,O=1.5,T=t.total+$+O;return e.jsx("div",{className:"max-w-4xl mx-auto",children:e.jsxs(b,{children:[e.jsx(P,{children:e.jsx(A,{className:"text-2xl font-bold",children:"Checkout"})}),e.jsxs(N,{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Order Type"}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsx(o,{type:"button",variant:a==="delivery"?"default":"outline",onClick:()=>h("delivery"),className:"h-12",children:"🚚 Delivery"}),e.jsx(o,{type:"button",variant:a==="pickup"?"default":"outline",onClick:()=>h("pickup"),className:"h-12",children:"🏪 Pickup"})]})]}),e.jsxs("form",{onSubmit:y,className:"space-y-6",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Customer Information"}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"name",className:"block text-sm font-medium mb-1",children:"Full Name *"}),e.jsx("input",{type:"text",id:"name",value:i.name,onChange:n=>c("name",n.target.value),className:"w-full p-3 border rounded-lg",required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"phone",className:"block text-sm font-medium mb-1",children:"Phone Number *"}),e.jsx("input",{type:"tel",id:"phone",value:i.phone,onChange:n=>c("phone",n.target.value),className:"w-full p-3 border rounded-lg",required:!0})]})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"email",className:"block text-sm font-medium mb-1",children:"Email Address *"}),e.jsx("input",{type:"email",id:"email",value:i.email,onChange:n=>c("email",n.target.value),className:"w-full p-3 border rounded-lg",required:!0})]})]}),a==="delivery"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Delivery Address"}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"street",className:"block text-sm font-medium mb-1",children:"Street Address *"}),e.jsx("input",{type:"text",id:"street",value:i.address.street,onChange:n=>c("address.street",n.target.value),className:"w-full p-3 border rounded-lg",placeholder:"123 Main Street",required:!0})]}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"city",className:"block text-sm font-medium mb-1",children:"City"}),e.jsx("input",{type:"text",id:"city",value:i.address.city,onChange:n=>c("address.city",n.target.value),className:"w-full p-3 border rounded-lg",readOnly:!0})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"postcode",className:"block text-sm font-medium mb-1",children:"Postcode"}),e.jsx("input",{type:"text",id:"postcode",value:i.address.postcode,onChange:n=>c("address.postcode",n.target.value),className:"w-full p-3 border rounded-lg",readOnly:!0})]})]})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Special Instructions"}),e.jsx("textarea",{value:i.specialInstructions||"",onChange:n=>c("specialInstructions",n.target.value),className:"w-full p-3 border rounded-lg",rows:3,placeholder:"Any special requests or dietary requirements..."})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Order Summary"}),e.jsxs("div",{className:"bg-gray-50 p-4 rounded-lg space-y-2",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsxs("span",{children:["Subtotal (",t.itemCount," items)"]}),e.jsxs("span",{children:["£",t.total.toFixed(2)]})]}),a==="delivery"&&e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"Delivery Fee"}),e.jsxs("span",{children:["£",$.toFixed(2)]})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"Service Fee"}),e.jsxs("span",{children:["£",O.toFixed(2)]})]}),e.jsx("div",{className:"border-t pt-2",children:e.jsxs("div",{className:"flex justify-between font-semibold text-lg",children:[e.jsx("span",{children:"Total"}),e.jsxs("span",{children:["£",T.toFixed(2)]})]})})]})]}),e.jsx(o,{type:"submit",className:"w-full h-12 text-lg",disabled:r,children:r?e.jsxs(e.Fragment,{children:[e.jsx(Y,{className:"w-5 h-5 mr-2 animate-spin"}),"Processing Order..."]}):`Place ${a==="delivery"?"Delivery":"Pickup"} Order - £${T.toFixed(2)}`})]})]})]})})},D=()=>{const{state:t,clearCart:s}=k(),{items:r,total:l,itemCount:a}=t,[h,i]=j.useState(!1),u=l>0?2.5:0,c=l>0?1.5:0,w=l+u+c;return r.length===0?e.jsx("div",{className:"min-h-screen bg-background",children:e.jsx("div",{className:"container mx-auto section-padding px-4 sm:px-6",children:e.jsxs("div",{className:"max-w-2xl mx-auto text-center",children:[e.jsx("div",{className:"w-20 h-20 sm:w-24 sm:h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6",children:e.jsx(q,{className:"w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground"})}),e.jsx("h1",{className:"text-2xl sm:text-3xl lg:text-4xl font-heading font-bold mb-3 sm:mb-4",children:"Your Cart is Empty"}),e.jsx("p",{className:"text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-4",children:"Looks like you haven't added any delicious items yet. Explore our amazing food options and add something to your cart!"}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center",children:[e.jsx(o,{asChild:!0,className:"btn-hero min-h-[44px] w-full sm:w-auto",children:e.jsx(f,{to:"/ohsmash",children:"Try OhSmash Burgers"})}),e.jsx(o,{asChild:!0,variant:"outline",className:"min-h-[44px] w-full sm:w-auto",children:e.jsx(f,{to:"/wonder-wings",children:"Try Wonder Wings"})}),e.jsx(o,{asChild:!0,variant:"outline",className:"min-h-[44px] w-full sm:w-auto",children:e.jsx(f,{to:"/okra-green",children:"Try Okra Green"})})]})]})})}):h?e.jsx("div",{className:"min-h-screen bg-background",children:e.jsxs("div",{className:"container mx-auto section-padding px-4 sm:px-6",children:[e.jsx("div",{className:"mb-4 sm:mb-6",children:e.jsxs(o,{variant:"ghost",onClick:()=>i(!1),className:"flex items-center space-x-2 min-h-[44px]",children:[e.jsx(E,{className:"w-4 h-4"}),e.jsx("span",{children:"Back to Cart"})]})}),e.jsx(G,{})]})}):e.jsx("div",{className:"min-h-screen bg-background",children:e.jsx("div",{className:"container mx-auto section-padding px-4 sm:px-6",children:e.jsxs("div",{className:"max-w-4xl mx-auto",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4",children:[e.jsxs("div",{className:"flex items-center space-x-3 sm:space-x-4",children:[e.jsx(o,{asChild:!0,variant:"ghost",size:"sm",className:"min-h-[44px]",children:e.jsxs(f,{to:"/",className:"flex items-center space-x-2",children:[e.jsx(E,{className:"w-4 h-4"}),e.jsx("span",{className:"hidden sm:inline",children:"Continue Shopping"}),e.jsx("span",{className:"sm:hidden",children:"Back"})]})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl sm:text-3xl font-heading font-bold",children:"Your Cart"}),e.jsxs("p",{className:"text-sm sm:text-base text-muted-foreground",children:[a," item",a!==1?"s":""]})]})]}),e.jsxs(o,{variant:"outline",size:"sm",onClick:s,className:"text-destructive hover:text-destructive min-h-[44px] w-full sm:w-auto",children:[e.jsx(R,{className:"w-4 h-4 mr-2"}),"Clear Cart"]})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8",children:[e.jsx("div",{className:"lg:col-span-2 space-y-3 sm:space-y-4",children:r.map(y=>e.jsx(U,{item:y},y.id))}),e.jsxs("div",{className:"lg:col-span-1",children:[e.jsx(b,{className:"sticky top-4",children:e.jsxs(N,{className:"p-4 sm:p-6",children:[e.jsx("h2",{className:"text-lg sm:text-xl font-heading font-bold mb-4 sm:mb-6",children:"Order Summary"}),e.jsxs("div",{className:"space-y-3 sm:space-y-4",children:[e.jsxs("div",{className:"flex justify-between text-sm sm:text-base",children:[e.jsxs("span",{children:["Subtotal (",a," items)"]}),e.jsxs("span",{children:["£",l.toFixed(2)]})]}),e.jsxs("div",{className:"flex justify-between text-sm sm:text-base",children:[e.jsx("span",{children:"Delivery Fee"}),e.jsxs("span",{children:["£",u.toFixed(2)]})]}),e.jsxs("div",{className:"flex justify-between text-sm sm:text-base",children:[e.jsx("span",{children:"Service Fee"}),e.jsxs("span",{children:["£",c.toFixed(2)]})]}),e.jsx("div",{className:"border-t pt-3 sm:pt-4",children:e.jsxs("div",{className:"flex justify-between text-base sm:text-lg font-semibold",children:[e.jsx("span",{children:"Total"}),e.jsxs("span",{children:["£",w.toFixed(2)]})]})})]}),e.jsxs(o,{className:"w-full btn-hero mt-4 sm:mt-6 min-h-[44px]",size:"lg",onClick:()=>i(!0),children:[e.jsx(W,{className:"w-4 h-4 sm:w-5 sm:h-5 mr-2"}),"Proceed to Checkout"]}),e.jsx("p",{className:"text-xs text-muted-foreground text-center mt-3 sm:mt-4",children:"Complete your order with FoodHub integration"})]})}),e.jsx(b,{className:"mt-3 sm:mt-4",children:e.jsxs(N,{className:"p-3 sm:p-4",children:[e.jsx("h3",{className:"font-semibold mb-2 text-sm sm:text-base",children:"Delivery Information"}),e.jsxs("div",{className:"text-xs sm:text-sm text-muted-foreground space-y-1",children:[e.jsx("p",{children:"• Free delivery on orders over £25"}),e.jsx("p",{children:"• Estimated delivery: 30-45 minutes"}),e.jsx("p",{children:"• We'll call you when your order is ready"})]})]})})]})]})]})})})};export{D as default};
