import { NextRequest, NextResponse } from 'next/server';

const WC_API_URL = process.env.WP_SITE_URL + '/wp-json/wc/v3';
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

export async function POST(request: NextRequest) {
    try {
        const orderData = await request.json();

        if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
            return NextResponse.json(
                { error: 'WooCommerce credentials not configured' },
                { status: 500 }
            );
        }

        // Create order in WooCommerce
        const response = await fetch(`${WC_API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64'),
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('WooCommerce API error:', errorData);
            return NextResponse.json(
                { error: 'Failed to create order', details: errorData },
                { status: response.status }
            );
        }

        const order = await response.json();

        return NextResponse.json({
            id: order.id,
            number: order.number,
            status: order.status,
            total: order.total,
            date_created: order.date_created,
            billing: order.billing,
            shipping: order.shipping,
            payment_method_title: order.payment_method_title,
        });
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('id');
        const email = searchParams.get('email');

        if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
            return NextResponse.json(
                { error: 'WooCommerce credentials not configured' },
                { status: 500 }
            );
        }

        // Get single order by ID
        if (orderId) {
            const response = await fetch(`${WC_API_URL}/orders/${orderId}`, {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64'),
                },
                next: { revalidate: 0 }, // No cache for order status
            });

            if (!response.ok) {
                return NextResponse.json(
                    { error: 'Order not found' },
                    { status: 404 }
                );
            }

            const order = await response.json();
            return NextResponse.json(order);
        }

        // Get orders by email
        if (email) {
            const response = await fetch(`${WC_API_URL}/orders?search=${email}`, {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64'),
                },
                next: { revalidate: 0 },
            });

            if (!response.ok) {
                return NextResponse.json(
                    { error: 'Failed to fetch orders' },
                    { status: response.status }
                );
            }

            const orders = await response.json();
            return NextResponse.json(orders);
        }

        return NextResponse.json(
            { error: 'Order ID or email required' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Order fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
