import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const PINATA_API_KEY = Deno.env.get("PINATA_API_KEY");
const PINATA_SECRET_KEY = Deno.env.get("PINATA_SECRET_KEY");
const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const filename = formData.get('filename') || 'upload.dat';

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Upload to Pinata
    const pinataFormData = new FormData();
    pinataFormData.append('file', file, filename);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PINATA_API_KEY}`,
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY
      },
      body: pinataFormData
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Pinata upload failed: ${error}`);
    }

    const data = await response.json();

    return Response.json({
      success: true,
      hash: data.IpfsHash,
      url: `${PINATA_GATEWAY}${data.IpfsHash}`,
      size: data.PinSize,
      timestamp: data.Timestamp
    });

  } catch (error) {
    console.error('IPFS upload error:', error);
    return Response.json({ 
      error: error.message || 'Failed to upload to IPFS' 
    }, { status: 500 });
  }
});