# Payment / Refund / Commitment Recovery v0.2

PaymentAttempt, PaymentCommitment, PostedTender and Sale remain
distinct.

A successful external/manual component before Sale posting creates a
durable PaymentCommitment. Split tender retains earlier confirmed money
when a later component fails. Credit tender is represented explicitly on
CheckoutPayment and is revalidated against CreditAccount during Sale
posting.

A Sale containing confirmed commitment cannot use ordinary abandon/hold
semantics to strand money. The client must either complete the Sale or
invoke `payment-commitments/{id}:reverse` and follow the returned
recovery resource until REVERSED/REFUNDED or a controlled unresolved
state.

PostedTender is created only in final Sale posting. Provider calls never
occur inside the Sale Posting Envelope.

Sales Return posting owns RefundObligation. Payments owns
RefundExecution. Refund settlement never reposts stock.
