import json
import os
import ssl
import urllib.request

import certifi
from html import escape

RESEND_URL = "https://api.resend.com/emails"


def send_order_email(order) -> None:
    """Email the shop owner about a new order via Resend's HTTP API.

    Never raises: a mail failure must not affect the customer's order.
    """
    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        print("⚠️  RESEND_API_KEY not set – order email skipped")
        return

    to_addr = os.environ.get("ORDER_NOTIFY_EMAIL", "colectionskidsunique@gmail.com")
    sender = os.environ.get("MAIL_FROM", "Collections World <onboarding@resend.dev>")

    rows = "".join(
        f"<tr><td>{escape(i.product.name if i.product else str(i.product_id))}</td>"
        f"<td align='center'>{i.quantity}</td>"
        f"<td align='right'>₹{i.unit_price * i.quantity:.2f}</td></tr>"
        for i in order.items
    )
    html = f"""
    <h2>New order {escape(order.order_number)}</h2>
    <p><b>Name:</b> {escape(order.customer_name)}<br>
       <b>Phone:</b> {escape(order.customer_phone)}<br>
       <b>Email:</b> {escape(order.customer_email)}<br>
       <b>Address:</b> {escape(order.shipping_address)}<br>
       <b>Payment:</b> {escape(order.payment_method.upper())}<br>
       <b>Notes:</b> {escape(order.notes or '-')}</p>
    <table border="1" cellpadding="6" cellspacing="0">
      <tr><th>Item</th><th>Qty</th><th>Amount</th></tr>{rows}
    </table>
    <p>Discount: ₹{order.discount_amount:.2f}<br>
       <b>Total: ₹{order.total_amount:.2f}</b></p>
    """
    payload = json.dumps({
        "from": sender,
        "to": [to_addr],
        "reply_to": order.customer_email,
        "subject": f"New order {order.order_number} – ₹{order.total_amount:.2f}",
        "html": html,
    }).encode()
    req = urllib.request.Request(
        RESEND_URL, data=payload, method="POST",
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json",
                 "User-Agent": "collections-world/1.0"},
    )
    try:
        with urllib.request.urlopen(req, timeout=15, context=ssl.create_default_context(cafile=certifi.where())) as resp:
            print(f"✉️  Order email sent for {order.order_number} ({resp.status})")
    except Exception as exc:  # noqa: BLE001
        print(f"❌ Order email failed for {order.order_number}: {exc}")
