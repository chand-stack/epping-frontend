// Email Service for Order Notifications
// This service handles sending order confirmation emails

export interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: 'delivery' | 'pickup';
  paymentMethod: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  deliveryAddress?: {
    street: string;
    city: string;
    postcode: string;
  };
  specialInstructions?: string;
  estimatedTime?: string;
}

class EmailService {
  private restaurantEmail = 'eppingfoodcourt@gmail.com';
  private restaurantName = 'Epping Food Court';

  // Send order confirmation email to customer
  async sendOrderConfirmationEmail(orderData: OrderEmailData): Promise<boolean> {
    try {
      const emailContent = this.generateOrderConfirmationEmail(orderData);
      
      // For now, we'll use a simple email service
      // In production, you would integrate with services like:
      // - SendGrid, Mailgun, AWS SES, or Nodemailer
      
      console.log('📧 Order Confirmation Email:', {
        to: orderData.customerEmail,
        subject: `Order Confirmation #${orderData.orderId} - ${this.restaurantName}`,
        content: emailContent
      });

      // Simulate email sending (replace with actual email service)
      await this.simulateEmailSending(orderData.customerEmail, emailContent);
      
      return true;
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      return false;
    }
  }

  // Send order notification email to restaurant
  async sendRestaurantNotificationEmail(orderData: OrderEmailData): Promise<boolean> {
    try {
      const emailContent = this.generateRestaurantNotificationEmail(orderData);
      
      console.log('📧 Restaurant Notification Email:', {
        to: this.restaurantEmail,
        subject: `New Order #${orderData.orderId} - ${orderData.orderType.toUpperCase()}`,
        content: emailContent
      });

      // Simulate email sending (replace with actual email service)
      await this.simulateEmailSending(this.restaurantEmail, emailContent);
      
      return true;
    } catch (error) {
      console.error('Failed to send restaurant notification email:', error);
      return false;
    }
  }

  // Generate customer order confirmation email
  private generateOrderConfirmationEmail(orderData: OrderEmailData): string {
    const orderTypeText = orderData.orderType === 'delivery' ? 'Delivery' : 'Pickup';
    const paymentText = this.getPaymentMethodText(orderData.paymentMethod);
    
    return `
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
            <h3>Thank you for your order, ${orderData.customerName}!</h3>
            <p>Your order has been received and is being prepared.</p>
            
            <div class="order-details">
                <h4>Order Details</h4>
                <p><strong>Order ID:</strong> #${orderData.orderId}</p>
                <p><strong>Order Type:</strong> ${orderTypeText}</p>
                <p><strong>Payment Method:</strong> ${paymentText}</p>
                <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
                
                ${orderData.orderType === 'delivery' && orderData.deliveryAddress ? `
                <p><strong>Delivery Address:</strong><br>
                ${orderData.deliveryAddress.street}<br>
                ${orderData.deliveryAddress.city} ${orderData.deliveryAddress.postcode}</p>
                ` : ''}
                
                ${orderData.estimatedTime ? `<p><strong>Estimated Time:</strong> ${orderData.estimatedTime}</p>` : ''}
                
                ${orderData.specialInstructions ? `<p><strong>Special Instructions:</strong> ${orderData.specialInstructions}</p>` : ''}
            </div>
            
            <div class="order-details">
                <h4>Your Order</h4>
                ${orderData.items.map(item => `
                <div class="item">
                    <span>${item.quantity}x ${item.name}</span>
                    <span>£${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                `).join('')}
                <div class="item total">
                    <span>Total</span>
                    <span>£${orderData.total.toFixed(2)}</span>
                </div>
            </div>
            
            <p>We'll contact you when your order is ready for ${orderData.orderType === 'delivery' ? 'delivery' : 'pickup'}.</p>
            
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
    `;
  }

  // Generate restaurant notification email
  private generateRestaurantNotificationEmail(orderData: OrderEmailData): string {
    const orderTypeText = orderData.orderType === 'delivery' ? 'DELIVERY' : 'PICKUP';
    const paymentText = this.getPaymentMethodText(orderData.paymentMethod);
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Order #${orderData.orderId} - ${this.restaurantName}</title>
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
            <h2>Order #${orderData.orderId} - ${orderTypeText}</h2>
        </div>
        
        <div class="content">
            <div class="urgent">
                <h3>⚠️ Action Required</h3>
                <p>A new order has been placed and requires your attention.</p>
            </div>
            
            <div class="order-details">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> ${orderData.customerName}</p>
                <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
                <p><strong>Email:</strong> ${orderData.customerEmail}</p>
                <p><strong>Order Type:</strong> ${orderTypeText}</p>
                <p><strong>Payment Method:</strong> ${paymentText}</p>
                
                ${orderData.orderType === 'delivery' && orderData.deliveryAddress ? `
                <p><strong>Delivery Address:</strong><br>
                ${orderData.deliveryAddress.street}<br>
                ${orderData.deliveryAddress.city} ${orderData.deliveryAddress.postcode}</p>
                ` : ''}
                
                ${orderData.estimatedTime ? `<p><strong>Estimated Time:</strong> ${orderData.estimatedTime}</p>` : ''}
                
                ${orderData.specialInstructions ? `<p><strong>Special Instructions:</strong> ${orderData.specialInstructions}</p>` : ''}
            </div>
            
            <div class="order-details">
                <h4>Order Items</h4>
                ${orderData.items.map(item => `
                <div class="item">
                    <span>${item.quantity}x ${item.name}</span>
                    <span>£${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                `).join('')}
                <div class="item total">
                    <span>Total</span>
                    <span>£${orderData.total.toFixed(2)}</span>
                </div>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Confirm the order with the customer</li>
                <li>Begin food preparation</li>
                <li>Update order status in the admin dashboard</li>
                <li>Contact customer when ready for ${orderData.orderType === 'delivery' ? 'delivery' : 'pickup'}</li>
            </ul>
        </div>
    </div>
</body>
</html>
    `;
  }

  // Get human-readable payment method text
  private getPaymentMethodText(paymentMethod: string): string {
    switch (paymentMethod) {
      case 'cash_on_delivery': return '💰 Cash on Delivery';
      case 'pay_at_pickup': return '💵 Pay at Pickup';
      case 'card': return '💳 Card (Online)';
      case 'online': return '🌐 Online Payment';
      default: return paymentMethod;
    }
  }

  // Simulate email sending (replace with actual email service)
  private async simulateEmailSending(to: string, content: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, you would:
    // 1. Use SendGrid, Mailgun, AWS SES, or similar service
    // 2. Send the actual email
    // 3. Handle errors and retries
    
    console.log(`✅ Email sent to: ${to}`);
  }
}

export const emailService = new EmailService();

// Integration instructions for real email service:
/*
To integrate with a real email service, replace the simulateEmailSending method with:

1. SendGrid:
   npm install @sendgrid/mail
   
   import sgMail from '@sendgrid/mail';
   sgMail.setApiKey(import.meta.env.VITE_SENDGRID_API_KEY);
   
   await sgMail.send({
     to: to,
     from: 'eppingfoodcourt@gmail.com',
     subject: subject,
     html: content
   });

2. Mailgun:
   npm install mailgun-js
   
   import mailgun from 'mailgun-js';
   const mg = mailgun({
    apiKey: import.meta.env.VITE_MAILGUN_API_KEY,
    domain: import.meta.env.VITE_MAILGUN_DOMAIN
   });
   
   await mg.messages().send({
     from: 'Epping Food Court <eppingfoodcourt@gmail.com>',
     to: to,
     subject: subject,
     html: content
   });

3. AWS SES:
   npm install aws-sdk
   
   import AWS from 'aws-sdk';
   const ses = new AWS.SES({ region: 'us-east-1' });
   
   await ses.sendEmail({
     Source: 'eppingfoodcourt@gmail.com',
     Destination: { ToAddresses: [to] },
     Message: {
       Subject: { Data: subject },
       Body: { Html: { Data: content } }
     }
   }).promise();
*/


