import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { xrpAddress } = await req.json();
    
    if (!xrpAddress || !xrpAddress.startsWith('r')) {
      return Response.json({ error: 'Invalid XRP address' }, { status: 400 });
    }

    // Fetch balance from XRPL mainnet
    const response = await fetch('https://s1.ripple.com:51234/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'account_info',
        params: {
          account: xrpAddress,
          ledger_index: 'validated'
        }
      })
    });

    const data = await response.json();

    if (data.result.status === 'success') {
      const xrpBalance = (parseInt(data.result.account_data.Balance) / 1000000).toFixed(6);
      const accountCreated = data.result.account_data.Account;
      const sequence = data.result.account_data.Sequence;

      return Response.json({
        address: xrpAddress,
        balance: xrpBalance,
        balanceDrops: data.result.account_data.Balance,
        sequence,
        ledgerIndex: data.result.ledger_index,
        validated: data.result.validated,
        accountExists: true
      });
    } else {
      return Response.json({
        address: xrpAddress,
        balance: '0',
        accountExists: false,
        error: 'Account not found on XRPL'
      });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});