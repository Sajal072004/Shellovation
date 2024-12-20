module.exports = function generateOrderEmail(user, orderId, trackingId, date, time, address, price, productsOrdered) {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f7fc;
          }
          .container {
            width: 100%;
            max-width: 700px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            padding: 25px;
            box-sizing: border-box;
            overflow: hidden;
          }
          h1 {
            font-size: 24px;
            color: #2c6b3d;
            margin-bottom: 15px;
            text-align: center;
          }
          p {
            font-size: 14px;
            color: #555;
            line-height: 1.6;
          }
          .order-summary, .shipping-details, .order-items {
            margin-top: 20px;
            padding: 15px;
            background-color: #f8f8f8;
            border-radius: 8px;
            box-sizing: border-box;
          }
          .order-summary h3, .shipping-details h3, .order-items h3 {
            font-size: 18px;
            color: #333;
            border-bottom: 2px solid #2c6b3d;
            padding-bottom: 8px;
            margin-bottom: 12px;
          }
          .order-summary table, .shipping-details table, .order-items table {
            width: 100%;
            border-collapse: collapse;
          }
          .order-summary th, .shipping-details th, .order-items th {
            text-align: left;
            background-color: #2c6b3d;
            color: white;
            padding: 10px;
            font-weight: bold;
          }
          .order-summary td, .shipping-details td, .order-items td {
            padding: 10px;
            border-top: 1px solid #ddd;
            color: #333;
            font-size: 14px;
            word-wrap: break-word;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #888;
          }
          .footer a {
            color: #007bff;
            text-decoration: none;
          }
          .btn {
            background-color: #2c6b3d;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            text-decoration: none;
            display: inline-block;
            margin-top: 20px;
            text-align: center;
          }
          .btn:hover {
            background-color: #1e4d2b;
          }
          .header {
            background-color: #2c6b3d;
            padding: 10px 0;
            text-align: center;
            color: white;
            font-size: 18px;
            font-weight: bold;
            border-radius: 8px 8px 0 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            Order Confirmation
          </div>

          <h1>Thank You for Your Order, ${user.name}!</h1>
          <p>We have received your order and are processing it. Below are the details:</p>
          
          <div class="order-summary">
            <h3>Order Summary</h3>
            <table>
              <tr>
                <th>Order ID</th>
                <td>${orderId}</td>
              </tr>
              <tr>
                <th>Tracking ID</th>
                <td>${trackingId}</td>
              </tr>
              <tr>
                <th>Order Date</th>
                <td>${date}</td>
              </tr>
              <tr>
                <th>Order Time</th>
                <td>${time}</td>
              </tr>
              <tr>
                <th>Total Price</th>
                <td>$${price}</td>
              </tr>
            </table>
          </div>

          <div class="shipping-details">
            <h3>Shipping Details</h3>
            <table>
              <tr>
                <th>Shipping Address</th>
                <td>${address}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>${user.email}</td>
              </tr>
            </table>
          </div>

          <div class="order-items">
            <h3>Products Ordered</h3>
            <table>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                ${productsOrdered
                  .map(
                    (item) => `
                      <tr>
                        <td>${item.productId}</td>
                        <td>${item.productName}</td>
                        <td>${item.quantity}</td>
                      </tr>
                    `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>

          <p>If you have any questions about your order, feel free to <a href="mailto:support@yourstore.com">contact us</a>.</p>

          <a href="#" class="btn">Track Your Order</a>

          <div class="footer">
            <p>Thank you for shopping with us!</p>
            <p><a href="#">Unsubscribe</a> | <a href="#">Privacy Policy</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
};
